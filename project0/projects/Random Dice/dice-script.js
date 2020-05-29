let random = 1 + Math.floor(Math.random() * 6);
let random2 = 1 + Math.floor(Math.random() * 6);

function changeDice() { 
    let randice = "./images/dice" + random + ".png"
    let randice2 = "./images/dice" + random2 + ".png" 
    document.querySelector("img").setAttribute("src", randice);
    document.querySelectorAll("img")[1].setAttribute("src", randice2);
}

function checkWin() {
    if (random == random2) {
        document.querySelector("h1").innerHTML = "It's a Draw!"
    }
    else if (random > random2) {
        document.querySelector("h1").innerHTML = "🏁Player 1 Wins"
    } 
    else if (random < random2) {
        document.querySelector("h1").innerHTML = "Player 2 Wins🏁"
    } 
}

changeDice();
checkWin();
console.log("dice1", random);
console.log("dice2", random2);