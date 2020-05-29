from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

class RegistrationForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = ["username"]


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs["placeholder"] = "Username"
        self.fields["password1"].widget.attrs["placeholder"] = "Password"
        self.fields["password2"].widget.attrs["placeholder"] = "Confirm Password"

    def save(self, commit=True):
        user = super(RegistrationForm, self).save(commit=False)
        user.email = self.cleaned_data["username"]
        user.password = self.cleaned_data["password"]
        if commit:
            user.save()
        return user
