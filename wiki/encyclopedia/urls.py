from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("error", views.error, name="error"),
    path("search", views.search, name="search"),
    path("random", views.random, name="random"),
    path("create", views.create, name="create")
]