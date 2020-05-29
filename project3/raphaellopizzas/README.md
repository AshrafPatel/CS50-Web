# Project 3 Create A Django Application

Create a pizza application based on the menu of http://www.pinocchiospizza.net/menu.html
Your web application should support all of the available menu items for Pinnochio’s Pizza & Subs


## Getting Started
To see a demo visit https://raphaello-pizza.herokuapp.com/

## What This Application Allows
Creates a cart object, Make payments using Stripe API, Create multiple models for users, orders and objects.
App is secure uses encryption.

## What could be changed?
Models are not based on Stripe Models as Stripe implementation was the last thing I concentrated
Regretfully this meant I could not take advantage of the Stripe Model Objects and wasted too much time creating individual models and using 
Django properties to do the calculations for me

The Address is just one field in reality this should be a dictionary also no checks are done on validity of the address

Finally It is not mobile friendly

