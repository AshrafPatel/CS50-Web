from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from .models import Pizza, Pasta, Sub, Salad, Platter, Topping
from django.contrib.auth.models import User
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .forms import PizzaForm, PastaForm, SubForm, SaladForm, PlatterForm, ChoiceForm
from django.core.serializers import serialize
from django.template.loader import render_to_string
import json
from myorders.models import Order

def getCurrentOrder(request):
    user_order = Order.objects.filter(user=request.user, order_status="created").first()
    if user_order is None:
        user_order = Order(order_status="created", user=request.user);
        user_order.save()
    return user_order

def createObject(data, request, user_order):
    if data["menu-option"] == "pizza":
        selected_toppings = request.POST.getlist("pizza_toppings")
        user_pizzas = Pizza.objects.filter(orders=user_order, pizza_class=data["pizza_class"],
            pizza_type=data["pizza_type"], size=data["size"])
        if "Topping" in data["pizza_type"]:
            user_pizzas = user_pizzas.filter(pizza_toppings__in=selected_toppings)
        user_pizzas = user_pizzas.first()
        if user_pizzas is None:
            p = Pizza(orders=user_order, pizza_class=data["pizza_class"],
                    pizza_type=data["pizza_type"], size=data["size"],
                    quantity=data["quantity"])
            p.save()
            if "Topping" in data["pizza_type"]:
                p.pizza_toppings.set(selected_toppings)
        else:
            quantity = int(user_pizzas.quantity) + int(data["quantity"])
            user_pizzas.quantity = quantity
            user_pizzas.save()
    
    elif data["menu-option"] == "sub":
        selected_toppings = request.POST.getlist("sub_toppings")
        print(data)
        if "extra_cheese" in data:
            cheese = True
        else: 
            cheese = False
        user_subs = Sub.objects.filter(orders=user_order, sub_type=data["sub_type"],
            size=data["size"], extra_cheese=cheese)
        if data["sub_type"] == "Steak + Cheese":
            user_subs = user_subs.filter(sub_toppings__in=selected_toppings)
        user_subs = user_subs.first()
        if user_subs is None:
            s = Sub(orders=user_order, sub_type=data["sub_type"], size=data["size"], 
                    extra_cheese=cheese, quantity=data["quantity"])
            s.save()
            if data["sub_type"] == "Steak + Cheese":
                s.sub_toppings.set(selected_toppings)
        else:
            quantity = int(user_subs.quantity) + int(data["quantity"])
            user_subs.quantity = quantity
            user_subs.save()

    elif data["menu-option"] == "pasta":
        user_pasta = Pasta.objects.filter(orders=user_order, pasta_type=data["pasta_type"]).first()
        if user_pasta is None:
            pas = Pasta(orders=user_order, pasta_type=data["pasta_type"])
            pas.save()
        else:
            quantity = int(user_pasta.quantity) + int(data["quantity"])
            user_pasta.quantity = quantity
            user_pasta.save()

    elif data["menu-option"] == "salad":
        user_salad = Salad.objects.filter(orders=user_order, salad_type=data["salad_type"]).first()
        if user_salad is None:
            sal = Salad(orders=user_order, salad_type=data["salad_type"])
            sal.save()
        else:
            quantity = int(user_salad.quantity) + int(data["quantity"])
            user_salad.quantity = quantity
            user_salad.save()

    elif data["menu-option"] == "platter":
        user_platter = Platter.objects.filter(orders=user_order, platter_type=data["platter_type"], size=data["size"]).first()
        if user_platter is None:
            plat = Platter(orders=user_order, platter_type=data["platter_type"], size=data["size"])
            plat.save()
        else:
            quantity = int(user_platter.quantity) + int(data["quantity"])
            user_platter.quantity = quantity
            user_platter.save()

    else:
        print(data, "Not recognised")


# Create your views here.
def index(request):
    context = {
        "user": request.user
    }
    return render(request, "orders/index.html", context)

def menu(request):
    return render(request, "orders/menu.html")

@login_required
def create_order(request):
    if request.method == "GET":
        form = PizzaForm()
        choice_form = ChoiceForm(request.POST)
        return render(request, "orders/create-order.html", {"choice_form": choice_form, "form":form})
    elif request.method == "POST":
        data = request.POST.copy()
        users_order = getCurrentOrder(request)
        createObject(data, request, users_order)
        return render(request, "orders/success.html")

@login_required
def create_form(request):
    if request.method == "POST":
        data = json.loads(request.body)
        choice = data["choice"]

        if choice == "pizza":
            form = PizzaForm(request.POST);
        elif choice == "sub":
            form = SubForm(request.POST)
        elif choice == "pasta":
            form = PastaForm(request.POST)
        elif choice == "salad":
            form = SaladForm(request.POST)
        elif choice == "platter":
            form = PlatterForm(request.POST)
        formStr = form.__str__()
        return JsonResponse(formStr, safe=False)
