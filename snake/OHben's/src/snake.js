window.onload = function() {
	
	Crafty.e("sceneListener").bind('SceneDestroy', function(e){
		console.log(e.newScene);0
	}).bind('SceneChange', function(e){
		console.log(e.oldScene, e.newScene);
	});

	initialize_snake();
}

function initialize_snake(){
	Crafty.init(500,500);
	Crafty.background("AliceBlue");
	Crafty.scene("snake_game");
}

Crafty.scene("snake_game", function(){
	var direction;
	var score;
	var head;
	var tail;
	var dirChange = false;

	function init(){
		direction = "right";
		score = 0;

		var curr;
		var last = undefined;
		for(var l = 0; l < 5; l++){
			curr = Crafty.e("2D, DOM, Color, snake")
			.color("red")
			.attr({x:l*(10), y:50, h:10, w:10, z:10});
			curr.d = direction; //each square has a single direction
			if(last != undefined){
				last.ahead = curr;
				curr.behind = last;
			}
			else tail = curr;
			last = curr; 
		}
		head = curr;
		
		var scoreboard = Crafty.e("2D, DOM, Text")
		.text(score)
		.attr({x: 250, y: 250, z: 9})
		.textFont({size: '20px', weight: 'bold'});

		var manager = Crafty.e("Delay, manager");
		manager.bind('KeyDown', function(e){
			if(e.key == Crafty.keys['UP_ARROW']){ 
				if(direction != 'down' && dirChange == false) {
					direction = 'up';
					dirChange = true;
				}
			}
			else if(e.key == Crafty.keys['DOWN_ARROW']){ 
				if(direction != 'up' && dirChange == false) {
					direction = 'down';
					dirChange = true;
				} 
			}
			else if(e.key == Crafty.keys['LEFT_ARROW']){ 
				if(direction != 'right' && dirChange == false) {
					direction = 'left';
					dirChange = true;
				} 
			}
			else if(e.key == Crafty.keys['RIGHT_ARROW']){ 
				if(direction != 'left' && dirChange == false) {
					direction = 'right';
					dirChange = true;
				} 
			}
			else if(e.key == Crafty.keys['SPACE']){
				Crafty.pause();
			}
		});
		manager.delay(move, 50,-1);
		placeFood();

	}
	init();

	function move(){
		dirChange = false;
		var food = Crafty("food");
		var curr = tail;
		tail = tail.ahead;
		curr.destroy();

		var xPos = head._x;
		var yPos = head._y;

		if(yPos > 490 || yPos < 0 || xPos > 490 || xPos < 0) {death();}

		if(direction == "right"){
			var newHead = Crafty.e("2D, DOM, Color, snake")
			.color("red")
			.attr({x: xPos+10, y: yPos, h: 10, w: 10, z: 10});
			head.ahead = newHead;
			newHead.behind = head;
			newHead.d = direction;
			head = newHead;
		}
		else if (direction == "left"){
			var newHead = Crafty.e("2D, DOM, Color, snake")
			.color("red")
			.attr({x: xPos-10, y: yPos, h: 10, w: 10, z: 10});
			head.ahead = newHead;
			newHead.behind = head;
			newHead.d = direction;
			head = newHead;
		}
		else if (direction == "down"){
			var newHead = Crafty.e("2D, DOM, Color, snake")
			.color("red")
			.attr({x: xPos, y: yPos+10, h: 10, w: 10, z: 10});
			head.ahead = newHead;
			newHead.behind = head;
			newHead.d = direction;			
			head = newHead;
		}
		else if (direction == "up"){
			var newHead = Crafty.e("2D, DOM, Color, snake")
			.color("red")
			.attr({x: xPos, y: yPos-10, h: 10, w: 10, z: 10});
			head.ahead = newHead;
			newHead.behind = head;
			newHead.d = direction;
			head = newHead;
		}

		checkSnakeCollision();
		if(food._x == head._x && food._y == head._y) foodCollision();
	}

	function foodCollision(){
		Crafty("food").destroy();
		placeFood();
		score++;
		console.log(score);
		Crafty("Text").text(score);
		var newTail = Crafty.e("2D, DOM, Color, snake")
		.color("red");
		newTail.ahead = tail;
		tail.behind = newTail;
		tail = newTail;
		if(tail.d == "up"){	tail.attr({x: xPos, y: yPos-10, h: 10, w: 10, z: 10}); }
		else if(tail.d == "down"){ tail.attr({x: xPos, y: yPos+10, h: 10, w: 10, z: 10}); }
		else if(tail.d == "left"){ tail.attr({x: xPos+10, y: yPos, h: 10, w: 10, z: 10}); }
		else if(tail.d == "right"){ tail.attr({x: xPos-10, y: yPos, h: 10, w: 10, z: 10}); }
	}

	function checkSnakeCollision(){
		var snake = Crafty("snake");
		for(var i = 0; i < snake.length; i++){
			var curr = Crafty(snake[i]);
			if(curr != head && curr._x == head._x && curr._y == head._y) death();
		}
	}
	
	function placeFood(){
		var xPos = Crafty.math.randomInt(0,49)*10;
		var yPos = Crafty.math.randomInt(0,49)*10;
		Crafty.e("2D, DOM, Color, food")
		.color("red")
		.attr({x: xPos, y: yPos, w: 10, h: 10, z: 10});
	}

	function death(){
		var snake = Crafty("snake");
		var head = undefined;
		var tail = undefined;
		Crafty("manager").destroy();
		Crafty("food").destroy();
		Crafty("Text").destroy();
		for(var i = 0; i < snake.length; i++){
			Crafty(snake[i]).destroy();
		}
		setTimeout(init, 1000);
	}
	
}); 