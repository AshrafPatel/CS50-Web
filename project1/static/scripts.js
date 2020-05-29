function signIn() {
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value

    let regex_password = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&?])[a-zA-Z0-9!#$%&?]{8,20}$/gm;

    if (email == "" || email == null) {
        alert("Email must be entered")
        return false
    } else if (!regex_password.test(password) || password == null || password == "") {
        alert("Password must be between 8 and 20 characters\n Must contain one lowercase, one uppercase, one number and a special character in the list (!#$%&?)\nPassword is case sensitive.")
        return false
    }
    return true;
}

function register() {
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    let password2 = document.querySelector("#password2").value

    let regex_password = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&?])[a-zA-Z0-9!#$%&?]{8,20}$/gm;

    if (email == "" || email == null) {
        alert("Email must be entered")
        return false
    } else if (!regex_password.test(password) || password == null || password == "") {
        alert("Password must be between 8 and 20 characters\n Must contain one lowercase, one uppercase, one number and a special character in the list (!#$%&?)\nPassword is case sensitive.")
        return false
    } else if (password !== password2) {
        alert("Passwords do not match\nPlease try again.")
        return false
    }
}

function submitReview() {
    let checkRadio = document.querySelector('input[name="star"]:checked');
    let review = document.forms["review"]["reviewtext"].value
    if (checkRadio == null) {
        alert("Please provide a star rating")
        return false
    } else if (review == "" || review == null) {
        alert("Please provide some text")
        return false
    }
}