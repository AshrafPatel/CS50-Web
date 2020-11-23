from django.shortcuts import render, redirect
from django.http import HttpResponse
from encyclopedia.util import list_entries, save_entry, get_entry
from markdown2 import Markdown
from encyclopedia import templates
from django.contrib import messages


def title(request, title):
    if (get_entry(title) == None):
        messages.error(request, "Page Could Not Be Found")
        return redirect("error")
    else:
        return render(request, "info/info.html", {
            "title": title.capitalize(),
            "info": Markdown().convert(get_entry(title))
        })

#Do Edit Function
def edit(request, title):
    if request.method == "GET":
        title.replace("%20", " ")
        return render(request, "create/create.html", {
            "title": title,
            "markdown": get_entry(title)
        })
    else:
        data = request.POST.copy()
        title = data["title"]
        content = data["markdown"]
        save_entry(title, content)
        return redirect("wiki_title", title)
        
