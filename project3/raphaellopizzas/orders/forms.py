from orders.models import Pizza, Sub, Pasta, Salad, Platter
from django.forms import ModelForm, Form, ChoiceField

class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = ['pizza_class', 'pizza_type', 'size', 'pizza_toppings', 'quantity']

class SubForm(ModelForm):
    class Meta:
        model = Sub
        fields = ['sub_type', 'size', 'sub_toppings', 'extra_cheese', 'quantity']

class PastaForm(ModelForm):
    class Meta:
        model = Pasta
        fields = ['pasta_type', 'quantity']

class SaladForm(ModelForm):
    class Meta:
        model = Salad
        fields = ['salad_type', 'quantity']

class PlatterForm(ModelForm):
    class Meta:
        model = Platter
        fields = ['platter_type', 'size', 'quantity']

class ChoiceForm(Form):
    CHOICE_LIST = [
        ('pizza', 'Pizza'),
        ('sub', 'Sub'),
        ('pasta', 'Pasta'),
        ('salad', 'Salad'),
        ('platter', 'Platter')
    ]
    choice = ChoiceField(choices=CHOICE_LIST, required=True)
