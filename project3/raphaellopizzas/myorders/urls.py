from django.urls import path, include
from . import views

urlpatterns = [
    path("checkout", views.checkout, name="checkout"),
    path("success/<str:args>/", views.success, name="success"),
    path("error", views.error, name="error"),
    path("orders", views.orders, name="orders"),
    path("orders/<str:args>/", views.view_order, name="view_order")
]
