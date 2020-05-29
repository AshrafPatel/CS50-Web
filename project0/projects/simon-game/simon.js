//Get current year
$("#year").text(new Date().getFullYear());


//Game Variables
let buttonColours = ["red", "blue", "green", "yellow"];
var audioObj = new Audio();
let gamePattern = [];
let gameHasStarted = false;
let counter = 0;
let level = 0;



function nextSequence() {
	counter = 0;
	level++;
	$("h1").text("Level " +  level)
	let randomChosenColour = whatColor(Math.floor(Math.random() * 4));
	gamePattern.push(randomChosenColour);
	animateColor(randomChosenColour); 
	playSound(randomChosenColour);
}

function whatColor(num) {
	switch(num) {
		case 0:
			return "red";
			break;
		case 1:
			return "yellow";
			break;
		case 2:
			return "green";
			break;
		case 3:
			return "blue";
			break;
		default:
			break;
	}
}

function playSound(color) {
	audioObj.src = "./sounds/" + color  + ".mp3";
	audioObj.play();
}

function animateUserInput(color) {
	$("#" + color).toggleClass("pressed")
	setTimeout(() => {
		$("#" + color).toggleClass("pressed");
	}, 100);
}

function animateColor(color) {
	$("#" + color).fadeOut(250).fadeIn(250);
}


function checkGame(color) {
	if (color === gamePattern[counter]) {
		playSound(color);
		animateUserInput(color);
		letPatternlength = gamePattern.length;
		counter++;
		console.log(counter + " " + letPatternlength)
		if (counter == letPatternlength) {
			setTimeout(function () {
				nextSequence();
			}, 1000);
		}
	} else {
		gameOver();
	}
}

$(".buttons").click(function(e)  {
	if (gameHasStarted) {
		let userClickedColor = e.target.id;
		checkGame(userClickedColor);
	}
});

function gameStart() {
	$("h1").text("Use Q, W, A, S or mouse");
	setTimeout(() => {
		nextSequence();
		gameHasStarted = true;
	}, 1000);
}

function gameOver() {
	level = 0;
	counter = 0;
	gamePattern = [];
	$("body").toggleClass("gameover")
	setTimeout(()=> {
		$("body").toggleClass("gameover");
	}, 300)
	audioObj.src = "./sounds/wrong.mp3"
	audioObj.play();
	gameHasStarted = false;
	$("h1").text("Game Over, Press a key to start again");
}

$(document).keypress((e) => {
	if (!gameHasStarted) {
		gameStart();
	} else {
		let lowerCaseKey = e.key.toLowerCase();
		switch(lowerCaseKey) {
			case "q":
				checkGame("red");
				break;
			case "w":
				checkGame("yellow");
				break;
			case "a":
				checkGame("green");
				break;
			case "s":
				checkGame("blue");
				break;
			default:
				gameOver();
		}
	}
});

$("h1").click(() => {
	if (!gameHasStarted) {
		gameStart();
	}
})