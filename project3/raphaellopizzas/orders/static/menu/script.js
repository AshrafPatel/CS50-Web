pizza = document.querySelector("#pizza-link");
subs = document.querySelector("#sub-link");
pasta = document.querySelector("#pasta-link");
salad = document.querySelector("#salad-link");
platter = document.querySelector("#platter-link");
menu = document.querySelector(".menu-container");

pizza.addEventListener("click", function() {
    menu.innerHTML = `
        <h2>Pizza</h2>
        <h3>Regular</h3>
        <hr/>
        <table>
            <tr>
                <th></th>
                <th>Small</th>
                <th>Large</th>
            </tr>
            <tr>
                <td class="menu-item">Cheese</td>
                <td>$12.70</td>
                <td>$17.95</td>
            </tr>
            <tr>
                <td class="menu-item">Special</td>
                <td>$17.75</td>
                <td>$25.95</td>
            </tr>
            <tr>
                <td class="menu-item">Topping</td>
                <td>$13.70</td>
                <td>$19.95</td>
            </tr>
            <tr>
                <td class="menu-item">2 Toppings</td>
                <td>$15.20</td>
                <td>$21.95</td>
            </tr>
            <tr>
                <td class="menu-item">3 Toppings</td>
                <td>$16.20</td>
                <td>$23.95</td>
            </tr>
        </table>

        <h3>Sicilian</h3>
        <hr/>
        <table>
            <tr>
                <th></th>
                <th>Small</th>
                <th>Large</th>
            </tr>
            <tr>
                <td class="menu-item">Cheese</td>
                <td>$12.70</td>
                <td>$17.95</td>
            </tr>
            <tr>
                <td class="menu-item">Special</td>
                <td>$17.75</td>
                <td>$25.95</td>
            </tr>
            <tr>
                <td class="menu-item">Topping</td>
                <td>$13.70</td>
                <td>$19.95</td>
            </tr>
            <tr>
                <td class="menu-item">2 Toppings</td>
                <td>$15.20</td>
                <td>$21.95</td>
            </tr>
            <tr>
                <td class="menu-item">3 Toppings</td>
                <td>$16.20</td>
                <td>$23.95</td>
            </tr>
        </table>
        <p class="note">
            Toppings include: Pepperoni, Sausage, Mushrooms, Onions, Ham, Canadian Bacon, Pineapple, Eggplant, Tomato &
            Basil, Green Peppers, Hamburger, Spinach, Artichoke, Buffalo Chicken, Barbecue Chicken, Anchovies, Black
            Olives, Fresh Garlic and Zucchini.
        </p>
    `;
});

subs.addEventListener("click", function() {
    menu.innerHTML = `
        <h2>Subs</h2>
        <hr style="width: 35%;"/>
        <br/>
        <table>
            <tr>
                <th></th>
                <th>Small</th>
                <th>Large</th>
            </tr>
            <tr>
                <td class="menu-item">Cheese</td>
                <td>$6.50</td>
                <td>$7.95</td>
            </tr>
            <tr>
                <td class="menu-item">Italian</td>
                <td>$6.50</td>
                <td>$7.95</td>
            </tr>
            <tr>
                <td class="menu-item">Ham + Cheese</td>
                <td>$6.50</td>
                <td>$7.95</td>
            </tr>
            <tr>
                <td class="menu-item">Meatball</td>
                <td>$6.50</td>
                <td>$7.95</td>
            </tr>
            <tr>
                <td class="menu-item">Tuna</td>
                <td>$6.50</td>
                <td>$7.95</td>
            </tr>
            <tr>
                <td class="menu-item">Turkey</td>
                <td>$7.50</td>
                <td>$8.50</td>
            </tr>
            <tr>
                <td class="menu-item">Chicken Parmigiana</td>
                <td>$7.50</td>
                <td>$8.50</td>
            </tr>
            <tr>
                <td class="menu-item">Eggplant Parmigiana</td>
                <td>$6.50</td>
                <td>$7.95</td>
            </tr>
            <tr>
                <td class="menu-item">Steak</td>
                <td>$6.50</td>
                <td>$7.95</td>
            </tr>
            <tr>
                <td class="menu-item">Steak + Cheese</td>
                <td>$6.95</td>
                <td>$8.50</td>
            </tr>
            <tr>
                <td class="menu-item">&emsp;+ Mushrooms</td>
                <td>+ $0.50</td>
                <td>+ $0.50</td>
            </tr>
            <tr>
                <td class="menu-item">&emsp;+ Green Peppers</td>
                <td>+ $0.50</td>
                <td>+ $0.50</td>
            </tr>
            <tr>
                <td class="menu-item">&emsp;+ Onions</td>
                <td>+ $0.50</td>
                <td>+ $0.50</td>
            </tr>
            <tr>
                <td class="menu-item">Sausage, Peppers & Onions</td>
                <td></td>
                <td>$8.50</td>
            </tr>
            <tr>
                <td class="menu-item">Hamburger</td>
                <td>$4.60</td>
                <td>$6.95</td>
            </tr>
            <tr>
                <td class="menu-item">Cheeseburger</td>
                <td>$5.10</td>
                <td>$7.45</td>
            </tr>
            <tr>
                <td class="menu-item">Fried Chicken</td>
                <td>$6.95</td>
                <td>$8.50</td>
            </tr>
            <tr>
                <td class="menu-item">Veggie</td>
                <td>$6.95</td>
                <td>$8.50</td>
            </tr>
        </table>

        <p class="note">
            Extra cheese is for an additional $0.50
        </p>
    `;
});

pasta.addEventListener("click", function () {
    menu.innerHTML = `
        <h2>Pasta</h2>
        <hr style="width: 35%;"/>
        <br/>
        <table>
            <tr>
                <th></th>
                <th>Price</th>
            </tr>
            <tr>
                <td class="menu-item">Baked Ziti w/Mozzarella</td>
                <td>$6.50</td>
            </tr>
            <tr>
                <td class="menu-item">Baked Ziti w/Meatballs</td>
                <td>$8.75</td>
            </tr>
            <tr>
                <td class="menu-item">Baked Ziti w/Chicken</td>
                <td>$9.75</td>
            </tr>
        </table>
    `;
});

salad.addEventListener("click", function () {
    menu.innerHTML = `
        <h2>Salads</h2>
        <hr style="width: 35%;"/>
        <br/>
        <table>
            <tr>
                <th></th>
                <th>Price</th>
            </tr>
            <tr>
                <td class="menu-item">Garden Salad</td>
                <td>$6.25</td>
            </tr>
            <tr>
                <td class="menu-item">Greek Salad</td>
                <td>$8.25</td>
            </tr>
            <tr>
                <td class="menu-item">Antipasto</td>
                <td>$8.25</td>
            </tr>
            <tr>
                <td class="menu-item">Salad w/Tuna</td>
                <td>$8.25</td>
            </tr>
        </table>
    `;
});

platter.addEventListener("click", function () {
    menu.innerHTML = `
        <h2>Platter</h2>
        <hr style="width: 35%;"/>
        <br/>
        <table>
            <tr>
                <th></th>
                <th>Small</th>
                <th>Large</th>
            </tr>
            <tr>
                <td class="menu-item">Garden Salad</td>
                <td>$40.00</td>
                <td>$65.00</td>
            </tr>
            <tr>
                <td class="menu-item">Greek Salad</td>
                <td>$50.00</td>
                <td>$75.00</td>
            </tr>
            <tr>
                <td class="menu-item">Antipasto</td>
                <td>$50.00</td>
                <td>$75.00</td>
            </tr>
            <tr>
                <td class="menu-item">Baked Ziti</td>
                <td>$40.00</td>
                <td>$65.00</td>
            </tr>
            <tr>
                <td class="menu-item">Meatball Parm</td>
                <td>$50.00</td>
                <td>$75.00</td>
            </tr>
            <tr>
                <td class="menu-item">Chicken Parm</td>
                <td>$55.00</td>
                <td>$85.00</td>
            </tr>
        </table>
    `;
});