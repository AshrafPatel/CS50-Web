choice = document.querySelector("#id_choice").value;
url = document.querySelector("#url-create-form").value;
toppings_array = document.querySelector(`#id_${choice.value}_toppings`);

function checkQuantity() {
    $(id_quantity).change(function() {
        if (this.value < 1) {
            this.value = 1;
        } else if (this.value > 999) {
            this.value = 999;
        }
    });
}

function disableToppings() {
    try {
        pizza_type = document.querySelector("#id_pizza_type");
        toppings_array = document.querySelector("#id_pizza_toppings");
        if (pizza_type.value == "Cheese" || pizza_type.value == "Special") {
            toppings_array.disabled = true;
            $("#id_pizza_toppings").val([]);
        } else {
            toppings_array.disabled = false;
        }
    } catch(err) {
        console.log("Not Pizza")
    }
    try {
        sub_type = document.querySelector("#id_sub_type");
        toppings_array = document.querySelector("#id_sub_toppings");
        if (sub_type.value == "Steak + Cheese") {
            toppings_array.disabled = false;
        } else {
            toppings_array = document.querySelector("#id_sub_toppings");
            toppings_array.disabled = true;
            $("#id_sub_toppings").val([]);
        }
    } catch(err) {
        console.log("Not Sub")
    }
}


function getToppingsNumber() {
    number = 3;
    try {
        pizza_type = document.querySelector("#id_pizza_type").value;
        if (pizza_type == "1 Topping") {
            number = 1;
        } else if (pizza_type == "2 Toppings") {
            number = 2;
        }
    } catch(err) {
        return number;
    }
    return number;
}

function checkToppings() {
    $('option').mousedown(function (e) {
        e.preventDefault();
        var originalScrollTop = $(this).parent().scrollTop();
        number = getToppingsNumber();
        choice = document.querySelector("#id_choice").value;
        if (choice == "pizza") {
            if ($(this).parent()[0].selectedOptions.length < number && pizza_type.includes("Topping")) {
                $(this).prop('selected', $(this).prop('selected') ? false : true);
                $(this).parent().focus();
            } else if ($(this).parent()[0].selectedOptions.length >= number && pizza_type.includes("Topping")) {
                $(this).prop('selected', $(this).prop('selected') ? false : false);
            }
        } else if (choice == "sub") {
            sub_type = document.querySelector("#id_sub_type").value;
            if (sub_type == "Steak + Cheese") {
                $(this).prop('selected', $(this).prop('selected') ? false : true);
                $(this).parent().focus();
            }
        }
        var self = this;
        setTimeout(function () {
            $(self).parent().scrollTop(originalScrollTop);
        }, 0);
        return false;
    });
}

function main() {
    if (choice == "pizza") {
        toppings_array = document.querySelector("#id_pizza_toppings");
        toppings_array.disabled = true;
        pizza_type = document.querySelector("#id_pizza_type");
        pizza_type.addEventListener("change", function() {
            disableToppings();
        })
    } else if (choice == "sub") {
        toppings_array = document.querySelector("#id_sub_toppings");
        toppings_array.innerHTML = `
            <option value="3">Mushrooms</option>
            <option value="4">Onions</option>
            <option value="10">Green Peppers</option>
        `;
        toppings_array.disabled = true;
        sub_type = document.querySelector("#id_sub_type");
        sub_type.addEventListener("change", function() {
            disableToppings();
        })
    }
    checkToppings();
    checkQuantity();
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


$("#id_choice").change(function() {
    choice_form = document.querySelector("#choice_form");
    choice = document.querySelector("#id_choice").value;
    
    form_order = document.querySelector("#form-make-order");

    $.ajax({
        type: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        url: url,
        data: JSON.stringify({
            'choice': choice
        }),
        dataType: 'json',
        success: function (res, status) {
            form_order.innerHTML = "";
            form_order.innerHTML += `<h2>${choice}</h2>`;
            form_order.innerHTML += `<input type="hidden" name="menu-option" value=${choice}>`;
            form_order.innerHTML += res;
            form_order.innerHTML += "<button id='btn-submit'>Add To Cart</button>";
            main();
        },
        error: function (res) {
            alert(res.status);
        }
    });
});

main();