function validateForm() {
  let fname = document.getElementById("firstname").value; //variable for first name box
  let lname = document.getElementById("lastname").value; //variable for last name field box
  let email = document.getElementById("email").value; //variable for email field box
  let regEmail = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/; //used regexlib to find code to verify email also variable is set to this code
  let phone = document.getElementById("phone").value; //variaable for phone field box
  let regPhone = /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/; //used regexlib to find code to verify phonenumber dashes required also variable is set to this code
  let textform = document.getElementById("question").value; //variable for question field box

  if (fname == "" || fname == null) {
    //if first name is "" or no data is entered
    alert("Error: On First Name field \nPlease try again"); //send alert
    return false; //return false means action does not happen
  }

  if (lname == "" || lname == null) {
    //if last name is "" or no data is entered
    alert("Error: On Last Name field \nPlease try again"); //send alert
    return false; //return false means action does not happen
  }

  if (email == "" || email == null) {
    //if email is "" or no data is entered
    alert("Error: On Email field \nPlease try again"); //send alert
    return false; //return false means action does not happen
  } else if (!regEmail.test(email)) {
    //if email variable does not match regex code variable
    alert("A valid email was not provided"); //send alert
    return false; //return false means action does not happen
  }

  if (phone == "" || phone == null) {
    //if phone variable is "" or no data is entered
    alert("Error: On Phone field \nPlease try again"); //send alert
    return false; //return false means action does not happen
  } else if (!regPhone.test(phone)) {
    //if phone variable does not match regex code variable
    alert("A valid phone number was not provided"); //send alert
    return false; //return false means action does not happen
  }

  if (textform == "" || textform == null) {
    alert("No words were entered in text field"); //send alert
    return false; //return false means action does not happen
  }
}
