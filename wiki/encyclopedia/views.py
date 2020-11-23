from django.shortcuts import render, redirect
import secrets
from markdown2 import Markdown
from encyclopedia.util import list_entries, save_entry, get_entry
from . import util
from django.http import HttpResponse
from django.contrib import messages


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def error(request):
    return render(request, "error/error.html", {

    })

def search(request):
    if request.method == "POST":
        data = request.POST.copy();
        search_term = data["search_term"]
        search_data= [word for word in list_entries() if search_term in word]
        context = {
            "search_term": search_term,
            "search_data": search_data
        }
        return render(request, "search/search.html", context)

def random(request):
    arr = util.list_entries()
    arr = secrets.choice(arr)
    return render(request, "info/info.html", {
        "title": arr.capitalize(),
        "info": Markdown().convert(get_entry(arr))
    })

def create(request):
    if request.method == "GET":
        return render(request, "create/create.html")
    else:
        data = request.POST.copy()
        title = data["title"]
        if title in list_entries():
            messages.error(request, "Could Not Create Page, Page Exists!")
            return render(request, "error/error.html")
        content = data["markdown"]
        save_entry(title, content)
        return redirect("wiki_title", title)


