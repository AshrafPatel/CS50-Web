var cssCode = document.getElementById("cssCode");
var color = document.getElementsByName("color");
var body = document.getElementsByTagName("body")[0];
var colorContainer = document.getElementById("colorContainer");
let backgroundText;

color[0].value = "#" + Math.floor(Math.random() * 16777215).toString(16);
color[1].value = "#" + Math.floor(Math.random() * 16777215).toString(16);

getBackground = () => {
    backgroundText = "linear-gradient(to right, ";
    for (let i = 0; i < color.length; i++) {
        if (i == color.length-1) {
            backgroundText += color[i].value;
            continue;
        }
        backgroundText += color[i].value + ",";
    }
    backgroundText += ")";
    console.log(backgroundText);
    body.style.background = backgroundText;
    cssCode.innerText = backgroundText;
}

addMoreColors = () => {
    var newColor = document.createElement("input"); 
    newColor.setAttribute('name', "color");
    newColor.setAttribute('type', "color");
    newColor.setAttribute("oninput", "getBackground()");
    colorContainer.appendChild(newColor);
}

getBackground();