/**
 * @author Weston
 */




$(document).ready(function () {

   Crafty.init(600,600,stage);
   //create crafty object

   Crafty.canvas.init();
   //create crafty canvas
   
 
   Crafty.scene("snake");
   //call scene function
});


Crafty.scene("snake", function(){
   var ctx = Crafty.canvas.context;
    var w = 600;
   var h = 600;
   var count = 0;
   var cw = 10;
   console.log(ctx);
    var d;
    var food;
    var poison1;
    var poison2;
    var poison3;
    var poison4;
    var score;
    
    

    var snake_array;

    console.log("scene");
    
    function init() {
        d = "right"; 
        create_snake();
        create_food(); 
        create_poison1();
        create_poison2();
        create_poison3();
        create_poison4();

        score = 0;


        if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 60);
    }
    init();



    function create_snake() {
        var length = 5; 
        snake_array = []; 
        for (var i = length - 1; i >= 0; i--) {
            snake_array.push({
                x: i,
                y: 0
            });
        }
    }

    //Lets create the food now
    function create_food() {
        food = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
        };

    }
    function create_poison1() {
        poison1 = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
            
            
        };
    }
    function create_poison2() {
        poison2 = {
            
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
            
            
        };
    }
    function create_poison3() {
        poison3 = {
            
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
           
            
        };
    }
    function create_poison4() {
        poison4 = {
            
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
            
        };
    }

 
    function paint() {

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);


        var nx = snake_array[0].x;
        var ny = snake_array[0].y;

        if (d == "right") nx++;
        else if (d == "left") nx--;
        else if (d == "up") ny--;
        else if (d == "down") ny++;
        count++;
  
        if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {
 
            init();
            

            return;
        }

 
        if (nx == food.x && ny == food.y) {
            var tail = {
                x: nx,
                y: ny
            };
            score++;
    
            create_food();
        } else {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx;
            tail.y = ny;
        }
  
        if(nx==poison1.x && ny==poison1.y){
            score--;
            create_poison1();
        }  
        else if(nx==poison2.x && ny==poison2.y){
            score--;
            create_poison2();
        } 
        else if(nx==poison3.x && ny==poison3.y){
            score--;
            create_poison3();
        } 
        else if(nx==poison4.x && ny==poison4.y){
            score--;
            create_poison4();
        } 
        else snake_array.unshift(tail);
        for (var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];

            paint_cell_interesting(c.x, c.y,count);
        }

 
        paint_cell(food.x, food.y);
        paint_cell_poison(poison1.x,poison1.y);
        paint_cell_poison(poison2.x,poison2.y);
        paint_cell_poison(poison3.x,poison3.y);
        paint_cell_poison(poison4.x,poison4.y);

        var score_text = "Score: " + score;
        ctx.fillText(score_text, 5, h - 5);
    }

 
    function paint_cell(x, y) {
        ctx.fillStyle = "blue";
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }
    function paint_cell_poison(x,y){
        ctx.fillStyle = "red";
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "green";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }
    function paint_cell_interesting(x, y,i) {
        if(i%3==0){
            ctx.fillStyle = "blue";
            ctx.fillRect(x * cw, y * cw, cw, cw);
            colorChange=1;
        }
        else if(i%3==1){
            ctx.fillStyle = "green";
            ctx.fillRect(x * cw, y * cw, cw, cw);
            colorChange=2;
        }
        else if(i%3==2){
            ctx.fillStyle = "red";
            ctx.fillRect(x * cw, y * cw, cw, cw);
            colorChange=0;
        }
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }

    function check_collision(x, y, array) {
 
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y) return true;
        }
        return false;
    }


    $(document).keydown(function (e) {
        var key = e.which;

        if (key == "37" && d != "right") d = "left";
        else if (key == "38" && d != "down") d = "up";
        else if (key == "39" && d != "left") d = "right";
        else if (key == "40" && d != "up") d = "down";
 
    });




});
