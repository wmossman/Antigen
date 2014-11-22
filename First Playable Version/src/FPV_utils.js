

//input: what color to make the pattern
//returns: an array with the pattern data
//This method currently selects between one of four possible patterns
//The array is a bounding box - is has as few empty spaces
// (denoted by 0's) as is possible while still containing the entire pattern
function getPattern(tileType) {
    var patterns = ["J", "L", "O", "T"];
    var patternType = Crafty.math.randomElementOfArray(patterns);
    var pattern;
    if (patternType == "J") {
        pattern = [[0, tileType],            //- *
                   [0, tileType],            //- *
                   [tileType, tileType]];    //* *
        pattern.first = 1; 
        pattern.t_type = tileType;
    }
    else if (patternType == "L") {           //* -
        pattern = [[tileType, 0],            //* -
                   [tileType, 0],            //* *
                   [tileType, tileType]];
        pattern.first = 0;  
        pattern.t_type = tileType;
    }
    else if (patternType == "O") {
        pattern = [[tileType, tileType],     //* *
                   [tileType, tileType]];    //* *
        pattern.first = 0;
        pattern.t_type = tileType;       
    }
    else if (patternType == "T") {
        pattern = [[tileType, tileType, tileType],
                   [0, tileType, 0],         //* * *
                   [0, tileType, 0]];        //- * -
        pattern.first = 0;                   //- * -
        pattern.t_type = tileType;  
    }
    return pattern;
}

//input: none
//returns: a randomly selected pattern
//This is basically just a wrapper for getPattern();
// The only other function is selecting a random color.
function getRandomPattern() {
    tileTypes =  ["red", "green", "blue", "yellow", "purple"]; 
	tileType = Crafty.math.randomElementOfArray(tileTypes);
	return getPattern(tileType); 
}


// Checks the entire grid to see if the pattern exists anywhere.
//If the first element to be found is not at [0,0] in the pattern array,
// Then we can't start checking at [0,0] in the puzzle grid

//Returns: The coordinates of the first matched color in the puzzle if the
//  pattern is found, or [-1, -1] if it is not found

function checkGrid(grid, pattern, SIZE) {
	var first = pattern.first;
    var found = false;
    for(var a = 0; a < (SIZE-pattern.length); a++){
        for(var b = first; b < (SIZE-pattern[0].length); b++){
            var curr = grid[a][b];
            if(curr._color == pattern.t_type){
                //passes in the upper left hand corner coordinates of the bounding box
                //NOT the coordinates of the matched tile
                found = boundingBox(grid, pattern, a, b-first);
                if (found){ 

                    return [a,b];
                }
            }
        }
    }
    return [-1, -1];
}


//PRIVATE
function boundingBox(grid, pattern, x, y){
    for(var a = x; a < x+pattern.length;a++){
        for(var b = y; b < y+pattern[0].length; b++){
            if(pattern[a-x][b-y] == grid[a][b]._color) continue;
            else if(pattern[a-x][b-y] == 0) continue;
            else {
                return false;
            }
        }
    }
    return true;
}

