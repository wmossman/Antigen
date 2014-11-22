Crafty.scene("puzzle", function(CURRENT_AREA) {	
	
    var SIZE = 10;

    //Create a 10x10 array
    //Grid keeps track of the state of the onscreen entities
    var grid = new Array(SIZE);
    for(var i = 0; i<SIZE; i++){
            grid[i] = new Array(SIZE);
    }

	//tracks the number of each color of tile
	//red, green, blue, yellow, purple
	var colors = [0,0,0,0,0];

	//Tracks which player's turn it is
	var playerTurn = 1;

	//Number of patterns to match
	var goal = 5;

	var clock;
	
	//Tracks number of patterns matched
	var score = 0;

	var scoreboard;

	var tileTypes =  ["red", "green", "blue", "yellow", "purple"]; 

	//this will hold the current pattern to be matched
	var pattern = getRandomPattern();
	displayCurrentPattern(pattern);

	//the clock!
	var time = 100;

	initGUI();
	makeGrid();

	//Now let's initialize player 1. 
	//Here we create the entity and insert it into the DOM
	var player1 = Crafty.e("2D, DOM, Color, player1")
	 .attr({x: 46, y: 50, h: 45, w:(50*SIZE)-2, z:11})
	 .css("border", "5px solid black");

	//Keeps track of where the player is
	player1.row = 1;

    //if > 0, has been shifted right
    // if < 0, has been shifted left
    var p1shifted = 0;

	//Creates the key bindings for player 1
	player1.bind('KeyDown', function(e) {
		if (e.key == Crafty.keys['UP_ARROW'] && playerTurn == 1) {
            if(p1shifted > 0){
                var distance = Crafty.math.abs(p1shifted);
                shiftRowLeft(player1.row, distance);
                p1shifted = 0;
            }
            else if(p1shifted < 0){
                var distance = Crafty.math.abs(p1shifted);
                shiftRowRight(player1.row, distance);
                p1shifted = 0;
            }

            player1.row--;
	    	player1.shift(0,-50,0,0);
	    	if(player1.y < 50) { 
	    		player1.y = 50*SIZE;
	    		player1.row = 10; 
	    	}
	    } 
	    else if (e.key == Crafty.keys['DOWN_ARROW'] && playerTurn == 1) {
            if(p1shifted > 0){
                var distance = Crafty.math.abs(p1shifted);
                shiftRowLeft(player1.row, distance);
                p1shifted = 0;
            }
            else if(p1shifted < 0){
                var distance = Crafty.math.abs(p1shifted);
                shiftRowRight(player1.row, distance);
                p1shifted = 0;
            }

            player1.row++;
	    	player1.shift(0,50,0,0);
	    	if(player1.y > 50*SIZE) { 
	    		player1.y = 50; 
	    		player1.row = 1;
	    	}
	    }
	    else if (e.key == Crafty.keys['LEFT_ARROW'] && playerTurn == 1){
	    	p1shifted--;
	    	if(p1shifted <= -SIZE) p1shifted = 0;
            shiftRowLeft(player1.row, 1);
	    }
	    else if (e.key == Crafty.keys['RIGHT_ARROW'] && playerTurn == 1){
			p1shifted++;
			if(p1shifted >= SIZE) p1shifted = 0;
            shiftRowRight(player1.row, 1);
	    }
	    else if (e.key == Crafty.keys['SPACE'] && playerTurn == 1){
	    	shiftArrayRow(player1.row-1, p1shifted); //player1.row is player 1 grid coordinate +1
	    	p1shifted = 0;
	    	var check = checkGrid(grid, pattern, SIZE);
			if(check[0] != -1 && check[1] != -1) patternMatched(check);
            setTimeout(function(){ playerTurn = 2; }, 20);
	    }
	});

	//Doing all the same stuff, but for player 2
	var player2 = Crafty.e("2D, DOM, Color, player2")
	 .attr({x: 50, y: 46, h: (50*SIZE)-2, w:45, z:11})
	 .css("border", "5px solid black");

	player2.col = 1; 

    //if p2shifted < 0, col has been shifted up
    // if p2shifted > 0, col has been shifted down
    var p2shifted = 0;

    //keybindings for player 2
	player2.bind('KeyDown', function(e) {
		if (e.key == Crafty.keys['D'] && playerTurn == 2) {
	    	if(p2shifted > 0){
                var distance = Crafty.math.abs(p2shifted);
                shiftColUp(player2.col, distance);
                p2shifted = 0;
            }
            else if(p2shifted < 0){
                var distance = Crafty.math.abs(p2shifted);
                shiftColDown(player2.col, distance);
                p2shifted = 0;
            }

            player2.col++;
	    	player2.shift(50,0,0,0);
	    	if(player2.x > 50*SIZE) { 
	    		player2.x = 50;
	    		player2.col = 1;
	    	}
	    } 
	    else if (e.key == Crafty.keys['A'] && playerTurn == 2) {
            if(p2shifted > 0){
                var distance = Crafty.math.abs(p2shifted);
                shiftColUp(player2.col, distance);
                p2shifted = 0;
            }
            else if(p2shifted < 0){
                var distance = Crafty.math.abs(p2shifted);
                shiftColDown(player2.col, distance);
                p2shifted = 0;
            }

            player2.col--;
	    	player2.shift(-50,0,0,0);
	    	if(player2.x < 50) { 
	    		player2.x = 50*SIZE; 
	    		player2.col = 10;
	    	}
		}
		else if (e.key == Crafty.keys['W'] && playerTurn == 2) {
			p2shifted--;
			if(p2shifted <= -SIZE) p2shifted = 0;
            shiftColUp(player2.col, 1);
		}
		else if (e.key == Crafty.keys['S'] && playerTurn == 2){
			p2shifted++;
			if(p2shifted >= SIZE) p2shifted = 0;
            shiftColDown(player2.col, 1);
		}
		else if (e.key == Crafty.keys['SPACE'] && playerTurn == 2){
			shiftArrayCol(player2.col-1, p2shifted); //player2.col is grid coordinate of player2+1
			setTimeout(function(){p2shifted = 0;});
			var check = checkGrid(grid, pattern, SIZE);
			if(check[0] != -1 && check[1] != -1) patternMatched(check);
            setTimeout(function(){ playerTurn = 1; }, 20);
	    }
	    else if (e.key == Crafty.keys['P']){
	    	printGrid();
	    }
	});
	 

	//Initializes the 10x10 grid and fills grid[][] with pointers to elements 
	function makeGrid(){
	    for(var a = 0; a < SIZE; a++){
			for(var b = 0; b < SIZE; b++){    
		       //select a random jewel color
		       //Done this way, instead of with Crafty.math.randomElementOfArray(), 
		       //  to enable tracking colors.
		        var randNum = Crafty.math.randomInt(0,4); 
			    var tileType = tileTypes[randNum]; 
				
				//Creates an entity with a random color
				grid[a][b] = Crafty.e("2D", "DOM", "Color", "gameTile")
				 .attr({x: (b+1)*50, y: (a+1)*50, h: 49, w: 49, z: 10})
				 .css("border", "1px solid black") 
				 .color(tileType);
				colors[randNum]++; 
			}
		}
	}

	//Initializes the GUI elements for the puzzle scene
	function initGUI(){
	    clock = Crafty.e("2D, DOM, Text, Delay")
         .attr({x:10, y:10, w:40, h:40})
         .text(function(){ return time; })
         .textFont({size: '20px'})
         .delay(function(){
            time--;
            clock.text(function(){ return time; });
            if(time == 0) endPuzzle(); 
         }, 1000, -1);

		Crafty.e("2D, DOM, Text")//Prompts the player with the next shape to match
		 .attr({x:650, y: 220, w:70, h:50})
		 .text("Match This:");

		Crafty.e("2D, DOM, Text")
    	 .attr({x:634, y:20, w:100, h:50})
    	 .text("You must match:");

    	Crafty.e("2D, DOM, Text")
		 .attr({x:660, y:40, w:50, h:50})
		 .textFont({size: '40px'})
		 .text(function(){ return goal; });

		Crafty.e("2D, DOM, Text")
		 .attr({x:650, y:100, w:100, h:50})
		 .text("Matched:");

		scoreboard = Crafty.e("2D, DOM, Text")
		 .attr({x:660, y:130, w:50, h:50})
		 .textFont({size: '40px'})
		 .text(function(){ return score; });
	}

	//Status: Works
	//input: the current pattern to display
	//output: none
	//Creates half-size divs to display the current pattern to be matched
	function displayCurrentPattern(pattern){
		for(var a = 0; a < pattern.length; a++){
			for(var b = 0; b < pattern[0].length; b++){
				if(pattern[a][b] != 0){
					Crafty.e("2D, DOM, Color, pattern")
					 .attr({x: 630+b*33, y: 250+a*33, w:32, h:32})
					 .css("border", "1px solid black")
					 .color(pattern[a][b]);
				}
			}
		}
	}

	//Status: All shift* methods function properly
	//Input: row: which row to shift
	//       distance: number of tiles to shift by (always positive please)
	//Result: pretty obvious, derp
	function shiftRowRight(row, distance){		
		var rowCoordinate = row*50; //row*50 is the actual pixel coordinate of objects
		var tiles = Crafty("gameTile"); //Get an array of every tile 
		//for each tile in tiles[], check its coordinate and shift if it is 
		// the same as rowCoordinate.
		var curr;
		for(var a = 0; a<SIZE*SIZE; a++){
			curr = Crafty(tiles[a]);
			if(curr._y == rowCoordinate) { curr.shift(50*distance, 0, 0, 0); }
			if(curr._x >= 50*(SIZE+1)) { curr.x -= 50*SIZE; }
		}
	}

	//You get the gist
	function shiftRowLeft(row, distance){		
		var rowCoordinate = row*50; 
		var tiles = Crafty("gameTile");
		var curr;	
		for(var a = 0; a<SIZE*SIZE; a++){
			curr = Crafty(tiles[a]);
			if(curr.y == rowCoordinate) { curr.shift(-50*distance, 0, 0, 0); }
			if(curr.x < 50) { curr.x += 50*SIZE; }
		}
	}

	//No point continuing to comment these
	function shiftColUp(col, distance){
		var colCoordinate = col*50;
		var tiles = Crafty("gameTile");
		var curr;
		for(var a = 0; a < SIZE*SIZE; a++){
			curr = Crafty(tiles[a]);
			if(curr.x == colCoordinate) { curr.shift(0,-50*distance, 0, 0);	}
			if(curr.y < 50) { curr.y += 50*SIZE; }
		}
	}

	//But I did anyway
	function shiftColDown(col, distance){
		var colCoordinate = col*50;
		var tiles = Crafty("gameTile");
		var curr;
		for(var a = 0; a < SIZE*SIZE; a++){
			curr = Crafty(tiles[a]);
			if(curr.x == colCoordinate) { curr.shift(0, 50*distance, 0, 0);	}
			if(curr.y >= 50*(SIZE+1)) { curr.y -= 50*SIZE; }
		}
	}


    //Adjust grid[][] to keep it in sync with what's onscreen
    //col is which column to shift
    //distance is distance to shift.
    //    negative values shift up, positive values shift down
    function shiftArrayCol(col, distance){
            //grid[curr+distance][col] = grid[curr][col]

            //don't do any computation if nothing to compute
            if(distance == 0) return;
            console.log("distance: " + distance);

            var dist = Crafty.math.abs(distance);
            var temp = new Array(dist);
            if(distance<0){
                    //save the elements at the edge so we can put them on the other edge
                    for(var a = 0; a < dist; a++)
                            temp[a] = grid[a][col];
                   
                    //shift everything over
                    for(var a = 0; a < (SIZE-dist); a++)
                            grid[a][col] = grid[a+dist][col];
                   
                    //tack the temp back onto the end
                    var init = SIZE-dist;
                    for(var a = init; a < SIZE; a++)
                            grid[a][col] = temp[a-init];
            }
            else{
                    //save the edge elements
                    for(var a = 0; a < dist; a++)
                            temp[dist-a-1] = grid[SIZE-1-a][col];
                   
                    //shift over
                    for(var a = 0; a < (SIZE-dist); a++)
                            grid[SIZE-1-a][col] = grid[SIZE-1-a-dist][col];

                    //tack the temp back on
                    for(var a = 0; a < dist; a++)
                            grid[a][col] = temp[a];
            }
		}

    //Adjust grid[][] to keep it in sync with what's onscreen
    //row is which row to shift
    //distance is distance to shift.
    //    negative values shift left, positive values shift right.,
    function shiftArrayRow(row, distance){
            // don't do any computation if nothing to compute
            if(distance == 0) return;
            console.log("distance: " + distance);

            var dist = Crafty.math.abs(distance);
            var temp = new Array(dist);
            if(distance<0){
                    //save the elements at the edge so we can put them on the other edge
                    for(var a = 0; a < dist; a++)
                            temp[a] = grid[row][a];
                   
                    //shift everything over
                    for(var a = 0; a < (SIZE-dist); a++)
                            grid[row][a] = grid[row][a+dist];
                   
                    //tack the temp back onto the end
                    var init = SIZE-dist;
                    for(var a = init; a < SIZE; a++)
                            grid[row][a] = temp[a-init];
            }
            else{
                    //save the edge elements
                    for(var a = 0; a < dist; a++)
                            temp[(dist-a)-1] = grid[row][SIZE-1-a];
                   
                    //shift over
                    for(var a = 0; a < (10-dist); a++)
                            grid[row][SIZE-1-a] = grid[row][SIZE-1-a-dist];

                    //tack the temp back on
                    for(var a = 0; a < dist; a++)
                            grid[row][a] = temp[a];
            }
    }



	//Status: Untested
	//Input: coordinates of the bounding box of the pattern
	//Result: Deletes the pattern in the grid and replaces with random elements.
	//        Increments player score, updates the scoreboard, and gets a new pattern.
	function patternMatched(coordinates){
		//Delete the pattern and replace with randoms
		for(var a = coordinates[0]; a < pattern.length; a++){
			for(var b = coordinates[1]; b < pattern[0].length; b++){
				console.log("deleting: " + a + ", " + b);
				grid[a][b].color(Crafty.math.randomElementOfArray(tileTypes));
			}
		}
		score++;
		scoreboard.text(function(){return score;});
		pattern = getRandomPattern();
	}

	function printGrid(){
		for(var a = 0; a < SIZE; a++){
			console.log(grid[a]);
		}
	}

	//Status: Empty
	//Calls whichever scene gets called when the puzzle is over
  	function endPuzzle(){      
  	}

}); 
