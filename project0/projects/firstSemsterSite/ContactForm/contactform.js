function validateForm() {
    var fname = document.getElementById("firstname").value;//variable for first name box
    var lname = document.getElementById("lastname").value;//variable for last name field box
    var email = document.getElementById("email").value;//variable for email field box
    var regEmail = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;//used regexlib to find code to verify email also variable is set to this code
    var male = document.getElementById("radMale").checked;//variable for checked male box
    var female = document.getElementById("radFemale").checked;//variable for check female box
    var radGenderList = document.getElementsByName("radGender");//variables of both radio boxes
    var phone = document.getElementById("phone").value;//variaable for phone field box
    var mobile = document.getElementById("mobile").value;//variable for mobile field box
    var regPhone = /^[2-9]\d{2}-\d{3}-\d{4}$/;//used regexlib to find code to verify phonenumber dashes required also variable is set to this code
    var textform = document.getElementById("question").value;//variable for question field box

    if (fname=="" || fname==null) {//if first name is "" or no data is entered
        alert("First Name field was not entered correctly please try again");//send alert
        return false;//return false means action does not happen
    }

    if (lname == "" || lname == null) {//if last name is "" or no data is entered
        alert("Last Name field was not entered correctly please try again");//send alert
        return false;//return false means action does not happen
    }

    if (email=="" || email==null) {//if email is "" or no data is entered
        alert("Email field was not entered correctly please try again");//send alert
        return false;//return false means action does not happen
    }
    else if (!regEmail.test(email)){//if email variable does not match regex code variable
        alert("A valid email was not provided");//send alert
        return false;//return false means action does not happen
    }

    if (phone=="" || phone==null) {//if phone variable is "" or no data is entered
        alert("Phone field was not entered correctly please try again");//send alert
        return false;//return false means action does not happen
    }

    else if (!regPhone.test(phone)) {//if phone variable does not match regex code variable
        alert("A valid phone number was not provided");//send alert
        return false;//return false means action does not happen
    }

    if (mobile=="" || mobile==null) {//if phone variable is "" or no data is entered
        alert("Mobile field was not entered correctly please try again");//send alert
        return false;//return false means action does not happen
    }

    else if (!regPhone.test(mobile)) {//if mobile variable does not match regex code variable
        alert("A valid mobile number was not provided");//send alert
        return false;//return false means action does not happen
    }

    if (!male && !female) {
        alert("Please enter gender");//send alert
        return false;//return false means action does not happen
    }

    if (textform=="" || textform==null) {
        alert("No words were entered in text field");//send alert
        return false;//return false means action does not happen
    }
}
