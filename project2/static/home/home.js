let navBtn = document.querySelector(".nav-btn")
let btnTry = document.querySelector(".btn-try")
let btnForm = document.querySelector(".btn-form")
let form = document.querySelector("form")
let welcome = document.querySelector(".welcome")
let tryBox = document.querySelector(".try")
let image = document.querySelector(".welcome-img")
let txtForm = document.querySelector("#txt-form")
let usernamexist = document.querySelector(".usernameexist")

function showForm() {
    form.setAttribute("style", "display: block;");
    welcome.setAttribute("style", "background: rgba(0, 0, 0, 0.7);");
    image.setAttribute("style", "display: none;");
}

function hideForm() {
    form.setAttribute("style", "display: none;");
    welcome.setAttribute("style", "background: white;");
    if (window.screen.width > 830) {
        image.setAttribute("style", "display: block;");
    }
}

function confirmName() {
    if (txtForm.value.length < 5) {
        btnForm.disabled = true;
        btnForm.setAttribute("style", "background: #AAA;")
    } else {
        let xhttp = new XMLHttpRequest();
        let params = "displayname=" + txtForm.value
        xhttp.open("POST", "/createuser", true)
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.onreadystatechange = function () {//Call a function when the state changes.
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                let nameTaken = xhttp.responseText === "true" ? true : false;
                console.log(nameTaken)
                if (nameTaken) {
                    btnForm.disabled = true;
                    btnForm.setAttribute("style", "background: #AAA;")
                    txtForm.setAttribute("style", "background: #DC5151;")
                    usernamexist.innerHTML = "Username exists!"
                    usernamexist.setAttribute("style", "display: block;")
                } else {
                    btnForm.disabled = false;
                    btnForm.setAttribute("style", "background: white;")
                    txtForm.setAttribute("style", "border-color: #69BE6E;")
                    usernamexist.innerHTML = "";
                    usernamexist.setAttribute("style", "display: none;")
                }
            }
        }
        xhttp.send(params);
    }
}

function submitForm() {
    name = txtForm.value
    localStorage.setItem("chatname", name);
    console.log(name)
    redirectUser()
}

function redirectUser() {
    if (name != null || name != "") {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/')
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhr.onreadystatechange = function () { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                window.location.href = "/chatrooms";
            }
        }
        let postVar = 'displayname=' + name;
        xhr.send(postVar)
    }
}

navBtn.addEventListener("click", showForm)
btnTry.addEventListener("click", showForm)
txtForm.addEventListener("keyup", confirmName)

if (localStorage.getItem("chatname") !== null) {
    name = localStorage.getItem("chatname")
    redirectUser();
}