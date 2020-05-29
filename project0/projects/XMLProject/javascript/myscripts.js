var xhttp = new XMLHttpRequest();
var boolEditable = false;
var length;
let url = "./xml/showroom.xml";
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myFunction(this);
    }   
};
xhttp.open("GET", url, true);
xhttp.setRequestHeader('Content-Type', 'text/xml')
xhttp.send();

function searchMe() {
    var searchQuery, tr, i;
    searchQuery = document.getElementById("newSearch").value.toUpperCase();
    tr = document.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        searchMake = tr[i].getElementsByTagName("td")[0];
        searchModel = tr[i].getElementsByTagName("td")[1];
        searchYear = tr[i].getElementsByTagName("td")[2];
        searchKmH = tr[i].getElementsByTagName("td")[3];
        searchPrice = tr[i].getElementsByTagName("td")[4];
        if (searchMake || searchModel || searchYear || searchKmH || searchPrice) {
            if (searchMake.innerHTML.toUpperCase().indexOf(searchQuery) > -1 || searchModel.innerHTML.toUpperCase().indexOf(searchQuery) > -1 ||
                searchYear.innerHTML.toUpperCase().indexOf(searchQuery) > -1 ||
                searchKmH.innerHTML.toUpperCase().indexOf(searchQuery) > -1 ||
                searchPrice.innerHTML.toUpperCase().indexOf(searchQuery) > -1) {
                tr[i].style.display = "";
            }
            else {
                tr[i].style.display = "none";
            }
        }
    }
}

function deleteMe(i) {
    var xmlDoc = xhttp.responseXML;
    car = xmlDoc.getElementsByTagName("car")
    make = xmlDoc.getElementsByTagName("make");          
    model = xmlDoc.getElementsByTagName("model");
    year = xmlDoc.getElementsByTagName("year");
    kmh = xmlDoc.getElementsByTagName("km");
    price = xmlDoc.getElementsByTagName("price");
    removeThis = xmlDoc.getElementsByTagName("car")[i];
    removeThis.parentNode.removeChild(removeThis);
    myFunction();
}

function editMe(i) {
    var xmlDoc = xhttp.responseXML;
    editButtons = document.querySelectorAll('.editButton');
    editMake = document.getElementsByTagName("tr")[i+1].children.item(0);
    editModel = document.getElementsByTagName("tr")[i+1].children.item(1);
    editYear = document.getElementsByTagName("tr")[i+1].children.item(2);
    editKmH = document.getElementsByTagName("tr")[i+1].children.item(3);
    editPrice = document.getElementsByTagName("tr")[i+1].children.item(4);
    if (boolEditable == true) {
        xmlDoc.getElementsByTagName("make")[i].childNodes[0].nodeValue = editMake.innerText;
        xmlDoc.getElementsByTagName("model")[i].childNodes[0].nodeValue = editModel.innerText;
        xmlDoc.getElementsByTagName("year")[i].childNodes[0].nodeValue = editYear.innerText;
        xmlDoc.getElementsByTagName("km")[i].childNodes[0].nodeValue = editKmH.innerText;
        xmlDoc.getElementsByTagName("price")[i].childNodes[0].nodeValue = editPrice.innerText;
        console.log(xmlDoc.getElementsByTagName("make")[i].childNodes[0].nodeValue);
        editButtons[i].innerText = "Edit";
        editMake.contentEditable = false;
        editModel.contentEditable = false;
        editYear.contentEditable = false;
        editKmH.contentEditable = false;
        editPrice.contentEditable = false;
        boolEditable = false;
        myFunction();
        return;
    }
    boolEditable = true;
    editMake.contentEditable = true;
    editModel.contentEditable = true;
    editYear.contentEditable = true;
    editKmH.contentEditable = true;
    editPrice.contentEditable = true;
    editMake.focus();
    editButtons[i].innerText = "Save";
}

function addMe() {
    var xmlDoc = xhttp.responseXML;
    newMake = document.getElementById("newMake").value;
    newModel = document.getElementById("newModel").value;
    newYear = document.getElementById("newYear").value;
    newKmH = document.getElementById("newKmH").value;
    newPrice = document.getElementById("newPrice").value;

    oldNode = xmlDoc.getElementsByTagName('car')[0];
    newNode = oldNode.cloneNode(true);
    xmlDoc.documentElement.appendChild(newNode);

    xmlDoc.getElementsByTagName("make")[length].childNodes[0].nodeValue = newMake;
    xmlDoc.getElementsByTagName("model")[length].childNodes[0].nodeValue = newModel;
    xmlDoc.getElementsByTagName("year")[length].childNodes[0].nodeValue = newYear;
    xmlDoc.getElementsByTagName("km")[length].childNodes[0].nodeValue = newKmH;
    xmlDoc.getElementsByTagName("price")[length].childNodes[0].nodeValue = newPrice;

    myFunction();
}

function myFunction() {
    var xmlDoc = xhttp.responseXML;
    var txt, make, model, year, kmh, price;
    txt = "<table border='1' class='carTable'>";
    txt +=  "<tr>";
    txt +=      "<th>Make</th>";
    txt +=      "<th>Model</th>";
    txt +=      "<th>Year</th>";
    txt +=      "<th>Km/h</th>";
    txt +=      "<th>Price</th>";
    txt +=      "<th>Edit/Delete</th>";
    txt +=  "</tr>";

    make = xmlDoc.getElementsByTagName("make");          
    model = xmlDoc.getElementsByTagName("model");
    year = xmlDoc.getElementsByTagName("year");
    kmh = xmlDoc.getElementsByTagName("km");
    price = xmlDoc.getElementsByTagName("price");

    for (i = 0; i < make.length; i++) {
        txt += "<tr>";
        txt +=      "<td>" + make[i].childNodes[0].nodeValue + "</td>";
        txt +=      "<td>" + model[i].childNodes[0].nodeValue + "</td>";
        txt +=      "<td>" + year[i].childNodes[0].nodeValue + "</td>";
        txt +=      "<td>" + kmh[i].childNodes[0].nodeValue + "</td>";
        txt +=      "<td>" + price[i].childNodes[0].nodeValue + "</td>";
        txt +=      "<td>";
        txt +=          "<button onclick='javascript:editMe(" + i + ");' class='editButton buttons ed'>Edit</button>";
        txt +=          "<button onclick='javascript:deleteMe(" + i + ");' class='deleteButton buttons ed'>Delete</button>";
        txt +=      "</td>";
        txt += "</tr>";
    }
    txt += "</table>";
    document.getElementsByTagName("p")[0].innerHTML = txt;
    document.getElementsByTagName("p")[1].innerHTML = "The total  number of results are " + make.length;
    getRidOfIt = document.getElementsByTagName("p")[0];
    length = make.length;
}