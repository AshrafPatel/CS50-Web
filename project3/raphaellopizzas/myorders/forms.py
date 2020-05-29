from myorders.models import Order
from django.forms import ModelForm, Form, ChoiceField

class OrderForm(ModelForm):
    class Meta:
        model = Order
        fields = ['address']
