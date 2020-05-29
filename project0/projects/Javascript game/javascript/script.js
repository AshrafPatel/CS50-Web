window.addEventListener('load', function() {

	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext("2d");
	var gameOn = true;
	var CANVAS_WIDTH = canvas.width;
	var CANVAS_HEIGHT = canvas.height;
	var level = 1;

	var enemies = [
	{
		x: 100,
		y: 100,
		speedY: 1,
        w: 40,
        h: 40
	},
	{
		x: 260,
		y: 100,
		speedY: 2,
        w: 40,
        h: 40
	},
	{
		x: 380,
		y: 100,
		speedY: 3,
        w: 40,
        h: 40
	},
	{
		x: 450,
		y: 100,
		speedY: 7,
        w: 40,
        h: 40
	}
	];

	var player = {
		x: 10,
		y: 160,
		speedX: 2,
		isMoving: false,
        w: 40,
        h: 40
	};

	var goal = {
		x: CANVAS_WIDTH - 50,
		y: 160,
		w: 50,
		h: 36
	}

	var sprites = {};

	var movePlayer = function() {
		player.isMoving = true;
	};

	var stopPlayer = function() {
		player.isMoving = false;
	};

	canvas.addEventListener('mousedown', movePlayer);
	canvas.addEventListener('mouseup', stopPlayer);
	canvas.addEventListener('touchstart', movePlayer);
	canvas.addEventListener('touchend', stopPlayer);

	var load = function() {
		sprites.player = new Image();
		sprites.player.src = 'Images/hero.png';

		sprites.enemies = new Image();
		sprites.enemies.src = 'Images/enemy.png';

		sprites.goal = new Image();
		sprites.goal.src = 'Images/chest.png';

		sprites.floor = new Image();
		sprites.floor.src = 'Images/floor.png';
	}

	var update = function() {
		var i = 0;
		var n = enemies.length;

		enemies.forEach(function(element, index) {
			element.y += element.speedY;
			if (element.y <= 10) {
				element.speedY *= -1;
			}
			else if(element.y >= CANVAS_HEIGHT - 40) {
				element.y = CANVAS_HEIGHT - 40;
				element.speedY *= -1;
			}
			if (checkCollision(player, element)) {
				gameOn = false;
				alert("Game Over");
				window.location = "";
			}
		});

		if (checkCollision(player, goal)) {
			level++;
			enemies.forEach(function(element, index) {
				if (element.speedY < 0) {
					element.speedY--;
				} else {
					element.speedY++;
				}
			});
			player.x = 10;
			player.y = 160;
			//alert("Level " + level + " completed");
		}
		
		if (player.isMoving) {
			player.x += player.speedX;
		}
	};

	var draw = function() {
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		ctx.drawImage(sprites.floor, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		ctx.drawImage(sprites.player, player.x, player.y);
		enemies.forEach(function(element, index) {
			ctx.drawImage(sprites.enemies, element.x, element.y);
		});
		ctx.drawImage(sprites.goal, goal.x, goal.y);
	};

	var step = function() {
		update();
		draw();
		if (gameOn) {
			window.requestAnimationFrame(step);
		}
	};

	var checkCollision = function(rect1, rect2) {
		var closeOnWidth = Math.abs(rect1.x - rect2. x) <= Math.max(rect1.w, rect2.w);
		var closeOnHeight = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);

		return closeOnWidth && closeOnHeight;
	}

	load();
	step();
});