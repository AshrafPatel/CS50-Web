# Generated by Django 3.0.4 on 2020-05-02 03:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myorders', '0002_auto_20200501_2325'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='address',
            field=models.CharField(blank=True, max_length=120),
        ),
    ]
