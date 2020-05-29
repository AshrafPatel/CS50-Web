from django.db import models
from django.contrib.auth.models import User
from django.apps import apps


# Create your models here.
class Order(models.Model):
    pizzas = models.ManyToManyField(to="orders.Pizza", blank=True)
    subs = models.ManyToManyField(to="orders.Sub", blank=True)
    pastas = models.ManyToManyField(to="orders.Pasta", blank=True)
    salads = models.ManyToManyField(to="orders.Salad", blank=True)
    platters = models.ManyToManyField(to="orders.Platter", blank=True)

    address = models.CharField(max_length=120, blank=True)
    date_time = models.DateField(null=False, blank=False, auto_now_add=True)
    order_status = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
