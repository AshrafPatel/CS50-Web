from django.db import models
from myorders.models import Order
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db.models import Avg, Max, Min, Sum
#from django.apps import apps

# Order = apps.get_model('myorders', 'Order')

# Create your models here.
class Topping(models.Model):
    TOPPINGS = [
        'Pepperoni',
        'Sausage',
        'Mushrooms',
        'Onions',
        'Ham',
        'Canadian Bacon',
        'Pineapple',
        'Eggplant',
        'Tomato & Basil',
        'Green Peppers',
        'Hamburger',
        'Spinach',
        'Artichoke',
        'Buffalo Chicken',
        'Barbecue Chicken',
        'Anchovies',
        'Black Olives',
        'Fresh Garlic',
        'Zucchini'
    ]
    toppings = models.CharField(max_length=25)

    def __str__(self):
        return f"{self.toppings}"


class Pizza(models.Model):
    PIZZA_PRICE = {
        'Regular': {
            'Cheese': {
                'Small': 12.70,
                'Large': 17.95
            },
            '1 Topping': {
                'Small': 13.70,
                'Large': 19.95
            },
            '2 Toppings': {
                'Small': 15.20,
                'Large': 21.95
            },
            '3 Toppings': {
                'Small': 16.20,
                'Large': 23.95
            },
            'Special': {
                'Small': 17.75,
                'Large': 25.95
            }
        },
        'Sicilian': {
            'Cheese': {
                'Small': 24.45,
                'Large': 38.70
            },
            '1 Topping': {
                'Small': 26.45,
                'Large': 40.70
            },
            '2 Toppings': {
                'Small': 28.45,
                'Large': 42.70
            },
            '3 Toppings': {
                'Small': 29.45,
                'Large': 44.70
            },
            'Special': {
                'Small': 30.45,
                'Large': 45.70
            }
        }
    }
    PIZZA_CLASS = (
        ('Regular', 'Regular'),
        ('Sicilian', 'Sicilian')
    )
    pizza_class = models.CharField(max_length=10, choices=PIZZA_CLASS, default='Regular')
    PIZZA_TYPE = (
        ('Cheese', 'Cheese'),
        ('Special', 'Special'),
        ('1 Topping', '1 Topping'),
        ('2 Toppings', '2 Toppings'),
        ('3 Toppings', '3 Toppings')
    )
    pizza_type = models.CharField(max_length=10, choices=PIZZA_TYPE, default='Cheese')
    PIZZA_SIZE = (
        ('Small', 'Small'),
        ('Large', 'Large')
    )
    size = models.CharField(max_length=7, choices=PIZZA_SIZE, default='Small')
    pizza_toppings = models.ManyToManyField(Topping, blank=True)
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    orders = models.ForeignKey(to="myorders.Order", on_delete=models.CASCADE)

    @property
    def price(self):
        pizza_price = Pizza.PIZZA_PRICE[self.pizza_class][self.pizza_type][self.size] * self.quantity
        return '${:.2f}'.format(pizza_price)

    @property
    def price_num(self):
        return Pizza.PIZZA_PRICE[self.pizza_class][self.pizza_type][self.size] * self.quantity

    @property
    def get_toppings(self):
        toppings = ""
        for ind, t in enumerate(self.pizza_toppings.all()):
            toppings += f"{str(t)}, "
            if ind == self.pizza_toppings.all().count()-2:
                toppings = toppings[0:-2]
                toppings += " and "
        toppings = toppings[0:-2]
        return toppings

    @property
    def title(self):
        if len(self.pizza_toppings.all()) > 0:
            toppings = self.get_toppings
            return f"{self.quantity} {self.size} {self.pizza_class} {self.pizza_type} Pizza with: {toppings}"
        return f"{self.quantity} {self.size} {self.pizza_class} {self.pizza_type} Pizza"

    def __str__(self):
        listToStr = ' '.join(map(str, self.pizza_toppings.all()))
        return f"{self.pizza_class} - {self.pizza_type} - {self.size} - {listToStr} - {self.price}"


class Sub(models.Model):
    SUB_PRICE = {
        'Cheese': {
            'Small': 6.50,
            'Large': 7.95
        },
        'Italian': {
            'Small': 6.50,
            'Large': 7.95
        },
        'Ham + Cheese': {
            'Small': 6.50,
            'Large': 7.95
        },
        'Meatball': {
            'Small': 6.50,
            'Large': 7.95
        },
        'Tuna': {
            'Small': 6.50,
            'Large': 7.95
        },
        'Turkey': {
            'Small': 7.50,
            'Large': 8.50
        },
        'Chicken Parmigiana': {
            'Small': 7.50,
            'Large': 8.50
        },
        'Eggplant Parmigiana': {
            'Small': 6.50,
            'Large': 7.95
        },
        'Steak': {
            'Small': 6.50,
            'Large': 7.95
        },
        'Steak + Cheese': {
            'Small': 6.95,
            'Large': 8.50
        },
        'Sausage, Peppers & Onions': {
            'Small': 8.50,
            'Large': 8.50
        },
        'Hamburger': {
            'Small': 4.60,
            'Large': 6.95
        },
        'Cheeseburger': {
            'Small': 5.10,
            'Large': 7.45
        },
        'Fried Chicken': {
            'Small': 6.95,
            'Large': 8.50
        },
        'Veggie': {
            'Small': 6.95,
            'Large': 8.50
        }
    }

    SUB_TYPE = (
        ('Cheese', 'Cheese'),
        ('Italian', 'Italian'),
        ('Ham + Cheese', 'Ham + Cheese'),
        ('Meatball', 'Meatball'),
        ('Tuna', 'Tuna'),
        ('Turkey', 'Turkey'),
        ('Chicken Parmigiana', 'Chicken Parmigiana'),
        ('Eggplant Parmigiana', 'Eggplant Parmigiana'),
        ('Steak', 'Steak'),
        ('Steak + Cheese', 'Steak + Cheese'),
        ('Sausage, Peppers & Onions', 'Sausage, Peppers & Onions'),
        ('Hamburger', 'Hamburger'),
        ('Cheeseburger', 'Cheeseburger'),
        ('Fried Chicken', 'Fried Chicken'),
        ('Veggie', 'Veggie')
    )
    sub_type = models.CharField(max_length=30, choices=SUB_TYPE, default='Cheese')
    SUB_SIZE = (
        ('Small', 'Small'),
        ('Large', 'Large')
    )
    size = models.CharField(max_length=7, choices=SUB_SIZE, default='Small')
    sub_toppings = models.ManyToManyField(Topping, blank=True)
    extra_cheese = models.BooleanField()
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    orders = models.ForeignKey(to="myorders.Order", on_delete=models.CASCADE)
    
    @property
    def price(self):
        sub_price = Sub.SUB_PRICE[self.sub_type][self.size]
        sub_price += len(self.sub_toppings.all())*0.50
        if self.extra_cheese:
            sub_price += 0.50
        sub_price *= self.quantity
        return '${:.2f}'.format(sub_price)

    @property
    def price_num(self):
        sub_price = Sub.SUB_PRICE[self.sub_type][self.size]
        sub_price += len(self.sub_toppings.all())*0.50
        if self.extra_cheese:
            sub_price += 0.50
        sub_price *= self.quantity
        return sub_price

    @property
    def get_toppings(self):
        toppings = ""
        for ind, t in enumerate(self.sub_toppings.all()):
            toppings += f"{str(t)}, "
            if ind == self.sub_toppings.all().count()-2:
                toppings = toppings[0:-2]
                toppings += " and "
        toppings = toppings[0:-2]
        return toppings

    @property
    def title(self):
        title = ""
        if len(self.sub_toppings.all()) > 0:
            toppings = self.get_toppings
            title += f"{self.quantity} {self.size} {self.sub_type} with: \n{toppings}"
        else:
            title += f"{self.quantity} {self.size} {self.sub_type}"
        if self.extra_cheese:
            title += " and extra cheese"
        return title

    def __str__(self):
        listToStr = ' '.join(map(str, self.sub_toppings.all()))
        return f"{self.sub_type} - {self.size} - {self.extra_cheese} - {listToStr} - {self.price}"


class Pasta(models.Model):
    PASTA_PRICE = {
        "Baked Ziti w/Mozzarella": 6.50,
        "Baked Ziti w/Meatballs": 8.75,
        "Baked Ziti w/Chicken": 9.75
    }

    PASTA_TYPE = (
        ('Baked Ziti w/Mozzarella', 'Baked Ziti w/Mozzarella'),
        ('Baked Ziti w/Meatballs', 'Baked Ziti w/Meatballs'),
        ('Baked Ziti w/Chicken', 'Baked Ziti w/Chicken')
    )
    pasta_type = models.CharField(max_length=25, choices=PASTA_TYPE, default='Baked Ziti w/Mozzarella')
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    orders = models.ForeignKey(to="myorders.Order", on_delete=models.CASCADE)
    
    @property
    def price(self):
        pasta_price = Pasta.PASTA_PRICE[self.pasta_type] * self.quantity
        return '${:.2f}'.format(pasta_price)

    @property
    def price_num(self):
        return Pasta.PASTA_PRICE[self.pasta_type] * self.quantity

    @property
    def title(self):
        return f"{self.quantity} {self.pasta_type} pasta" 

    def __str__(self):
        return f"{self.pasta_type} - {self.price}"


class Salad(models.Model):
    SALAD_PRICE = {
        'Garden Salad': 6.25,
        'Greek Salad': 8.25,
        'Antipasto': 8.25,
        'Salad w/Tuna': 8.25
    }

    SALAD_TYPE = (
        ('Garden Salad', 'Garden Salad'),
        ('Greek Salad', 'Greek Salad'),
        ('Antipasto', 'Antipasto'),
        ('Salad w/Tuna', 'Salad w/Tuna')
    )
    salad_type = models.CharField(max_length=12, choices=SALAD_TYPE, default='Garden Salad')
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    orders = models.ForeignKey(to="myorders.Order", on_delete=models.CASCADE)

    @property
    def price(self):
        salad_price = Salad.SALAD_PRICE[self.salad_type] * self.quantity
        return '${:.2f}'.format(salad_price)

    @property
    def price_num(self):
        return Salad.SALAD_PRICE[self.salad_type] * self.quantity

    @property
    def title(self):
        return f"{self.quantity} {self.salad_type}"
    
    def __str__(self):
        return f"{self.salad_type} - {self.price}"


class Platter(models.Model):
    PLATTER_PRICE = {
        'Garden Salad': {
            'Small': 40.00,
            'Large': 65.00
        },
        'Greek Salad': {
            'Small': 50.00,
            'Large': 75.00
        },
        'Antipasto': {
            'Small': 50.00,
            'Large': 75.00
        },
        'Baked Ziti': {
            'Small': 40.00,
            'Large': 65.00
        },
        'Meatball Parm': {
            'Small': 50.00,
            'Large': 75.00
        },
        'Chicken Parm': {
            'Small': 55.00,
            'Large': 85.00
        }
    }

    PLATTER_TYPE = (
        ('Garden Salad', 'Garden Salad'),
        ('Greek Salad', 'Greek Salad'),
        ('Antipasto', 'Antipasto'),
        ('Baked Ziti', 'Baked Ziti'),
        ('Meatball Parm', 'Meatball Parm'),
        ('Chicken Parm', 'Chicken Parm')
    )
    platter_type = models.CharField(max_length=20, choices=PLATTER_TYPE, default='Garden Salad')
    PLATTER_SIZE = (
        ('Small', 'Small'),
        ('Large', 'Large')
    )
    size = models.CharField(max_length=6, choices=PLATTER_SIZE, default='Small')
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    orders = models.ForeignKey(to="myorders.Order", on_delete=models.CASCADE)

    @property
    def price(self):
        platter_price = Platter.PLATTER_PRICE[self.platter_type][self.size] * self.quantity
        return '${:.2f}'.format(platter_price)

    @property
    def price_num(self):
        return Platter.PLATTER_PRICE[self.platter_type][self.size] * self.quantity

    @property
    def title(self):
        return f"{self.quantity} {self.size} {self.platter_type}"

    def __str__(self):
        return f"{self.platter_type} - {self.size} - {self.price}"



