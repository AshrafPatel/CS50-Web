from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("menu", views.menu, name="menu"),
    path("create-order", views.create_order, name="create_order"),
    path("ajax/create-form", views.create_form, name="create_form")
]
