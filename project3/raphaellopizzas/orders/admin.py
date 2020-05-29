from django.contrib import admin
from .models import Topping, Pizza, Sub, Pasta, Salad, Platter

# Register your models here.

admin.site.register(Topping)
admin.site.register(Pizza)
admin.site.register(Pasta)
admin.site.register(Sub)
admin.site.register(Salad)
admin.site.register(Platter)
