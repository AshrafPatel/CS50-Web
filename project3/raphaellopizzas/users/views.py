from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from users.forms import RegistrationForm
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm

# Create your views here.
def register_view(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('index'))
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = User.objects.create_user(username=username, password=password)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, 'registration/register.html', {'form': form})
    else:
        form = RegistrationForm()
        return render(request, 'registration/register.html', {'form': form})


def login_post(request, *args):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('index'))

    username = request.POST['username']
    password = request.POST['password1']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        form = AuthenticationForm(request.POST)
        return render(request, 'registration/register.html', {'form': form})


def logout_post(request):
    logout(request)
    return render(request, "users/login.html", {"message": "Logged out."})
