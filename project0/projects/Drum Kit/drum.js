let numberOfDrums = document.querySelectorAll(".drum").length;

for (let i = 0; i < numberOfDrums; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function() {
        makeSound(this.innerHTML);
        createAnimation(this.innerHTML);
    });
}

document.addEventListener("keydown", function() {
    makeSound(event.key);
    createAnimation(event.key);
});


function makeSound(key) {
    var newKey = key.toLowerCase();
    switch(newKey) {
        case "w":
            let crash = new Audio("./sounds/crash.mp3");
            crash.play();
            break;
        case "a":
            let kickbass = new Audio("./sounds/kick-bass.mp3");
            kickbass.play();
            break;
        case "s":
            let snare = new Audio("./sounds/snare.mp3");
            snare.play();
            break;
        case "d":
            let tom1 = new Audio("./sounds/tom-1.mp3");
            tom1.play();
            break;
        case "j":
            let tom2 = new Audio("./sounds/tom-2.mp3");
            tom2.play();
            break;
        case "k":
            let tom3 = new Audio("./sounds/tom-3.mp3");
            tom3.play();
            break;
        case "l":
            let tom4 = new Audio("./sounds/tom-4.mp3");
            tom4.play();
            break;
        default:
            console.log(key);
            break;
    }
}

function createAnimation(currentKey) {
    var newKey = currentKey.toLowerCase();
    var activeObject = document.querySelector("." + newKey);
    activeObject.classList.add("pressed");
    setTimeout(function () {  
        activeObject.classList.remove("pressed");
    }, 500);
}

var date = new Date();
document.querySelector("footer").innerHTML = "© " + date.getFullYear() +  " Made by Ashraf Patel"