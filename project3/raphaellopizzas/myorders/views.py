from django.shortcuts import render, HttpResponseRedirect, redirect
from myorders.models import Order
from orders.models import Pizza, Pasta, Platter, Salad, Sub
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from myorders.forms import OrderForm
import datetime
import time
import stripe
import os


def getPrice(con):
    price = 0
    for x in con["pizzas"]:
        price += x.price_num

    for x in con["subs"]:
        price += x.price_num

    for x in con["pastas"]:
        price += x.price_num

    for x in con["salads"]:
        price += x.price_num

    for x in con["platters"]:
        price += x.price_num
    
    return price

def getOrderSummary(con):
    title = ""
    for x in con["pizzas"]:
        title += x.title + "  /  "

    for x in con["subs"]:
        title += x.title + "  /  "

    for x in con["pastas"]:
        title += x.title + "  /  "

    for x in con["salads"]:
        title += x.title + "  /  "

    for x in con["platters"]:
        title += x.title + "  /  "

    return title

def getAllOrders(orders):
    summarylist = []
    for order in orders:
        context = {
            "pizzas": Pizza.objects.filter(orders=order),
            "subs": Sub.objects.filter(orders=order),
            "pastas": Pasta.objects.filter(orders=order),
            "salads": Salad.objects.filter(orders=order),
            "platters": Platter.objects.filter(orders=order)
        }
        summarylist.append(
            {
                "summary": getOrderSummary(context)[0:200], 
                "id": order.id,
                "date": order.date_time
            }
        )
    return summarylist


# Create your views here.
def getCurrentOrder(request):
    user_order = Order.objects.filter(
        user=request.user, order_status="created").first()
    if user_order is None:
        user_order = Order(order_status="created", user=request.user)
        user_order.save()
    return user_order


@login_required
def checkout(request):
    if request.method == "GET":
        order = getCurrentOrder(request)
        #get the query sets for each
        form = OrderForm(request.POST)
        form = form.__str__()
        context = {
            "pizzas": Pizza.objects.filter(orders=order),
            "subs": Sub.objects.filter(orders=order),
            "pastas": Pasta.objects.filter(orders=order),
            "salads": Salad.objects.filter(orders=order),
            "platters": Platter.objects.filter(orders=order),
            "form": form
        }
        price = getPrice(context)
        context["price"] = '${:.2f}'.format(price)
        return render(request, "myorders/cart.html", context)
    elif request.method == "POST":
        order = getCurrentOrder(request)

        context = {
            "pizzas": Pizza.objects.filter(orders=order),
            "subs": Sub.objects.filter(orders=order),
            "pastas": Pasta.objects.filter(orders=order),
            "salads": Salad.objects.filter(orders=order),
            "platters": Platter.objects.filter(orders=order)
        }
        price = int(getPrice(context)*100)

        stripe.api_key = os.environ["STRIPE_API_KEY"]

        try:
            customer = stripe.Customer.create(
                name=request.user.username,
                source=request.POST["stripeToken"]
            )
        except Exception as e:
            customer = stripe.Customer.retrieve(request.POST["stripeToken"])

        try:
            charge = stripe.Charge.create(
                amount=price,
                currency="cad",
                customer=customer,
                description=getOrderSummary(context)
            )
        except stripe.error.CardError as e:
            # Problem with the card
            print(e)
            pass
        except stripe.error.RateLimitError as e:
            print(e)
            # Too many requests made to the API too quickly
            pass
        except stripe.error.InvalidRequestError as e:
            print(e)
            # Invalid parameters were supplied to Stripe API
            pass
        except stripe.error.AuthenticationError as e:
            print(e)
            # Authentication Error: Authentication with Stripe API failed (maybe you changed API keys recently)
            pass
        except stripe.error.APIConnectionError as e:
            print(e)
            # Network communication with Stripe failed
            pass
        except stripe.error.StripeError as e:
            print(e)
            # Stripe Error
            pass
        else:
            #success
            get_order = Order.objects.filter(user=request.user, order_status="created").first()
            get_order.order_status = "ordered"
            get_order.datetime = datetime.date.fromtimestamp(time.time())
            get_order.address = request.POST["address"]
            get_order.save()

            price = '${:.2f}'.format(price/100)
            url = reverse(('success'), args=[price])
            return redirect(url)
        return HttpResponseRedirect(reverse("error"))


@login_required
def success(request, args):
    return render(request, "myorders/success.html", {"price":args})


@login_required
def error(request):
    return render(request, "myorders/error.html")

@login_required
def orders(request):
    orders = Order.objects.filter(user=request.user, order_status="ordered").all()

    context = {
        "orders":getAllOrders(orders)
    }

    return render(request, "myorders/history.html", context)

@login_required
def view_order(request, args):
    order = Order.objects.filter(id=args).first()

    context = {
        "pizzas": Pizza.objects.filter(orders=order),
        "subs": Sub.objects.filter(orders=order),
        "pastas": Pasta.objects.filter(orders=order),
        "salads": Salad.objects.filter(orders=order),
        "platters": Platter.objects.filter(orders=order),
        "order": order
    }

    price = getPrice(context)

    context["price"] = price
    return render(request, "myorders/the-order.html", context)
