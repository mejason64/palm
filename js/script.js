function myGame(){
	var canvas = document.getElementById("myGame");
	this.width = canvas.width;
	this.height = canvas.height;
	this.context = canvas.getContext("2d")
	this.context.fillStyle = "blue";
	this.keys = new KeyListener();

	this.ball = new Ball();
	this.ball.x = this.width/2;
	this.ball.y = this.height/2;
	this.ball.vy = Math.floor(Math.random()*20-2);
	this.ball.vx = 15 - Math.abs(this.ball.vy);

	this.display1 = new Display(this.width/4, 25); 
	this.display2 = new Display(this.width*3/4, 25); 
 


	this.player1 = new Paddle(5, 0); 	
	this.player1.y = this.height/2 - this.player1.height/2;
	
	this.player2 = new Paddle(this.width - 5 -2, 0); 	
	this.player2.y = this.height/2 - this.player2.height/2;
	
	

}

myGame.prototype.draw = function(){
	this.context.clearRect(0, 0, this.width, this.height);
	this.context.fillRect(this.width/2, 0, 4, this.height);

	this.ball.draw(this.context);

	this.player1.draw(this.context);
	this.player2.draw(this.context);

	this.display1.draw(this.context);
	this.display2.draw(this.context);
}

myGame.prototype.update = function(){
	if(this.paused)
		return;

//s=83
//w=87
//downarrow=40
//uparrow=38

	
	if(this.keys.isPressed(83)){
		this.player1.y = Math.min(this.height - this.player1.height, this.player1.y + 10);
	}else if(this.keys.isPressed(87)){
		this.player1.y = Math.max(0, this.player1.y - 10);

	}
	if(this.keys.isPressed(40)){
		this.player2.y = Math.min(this.height - this.player2.height, this.player2.y + 10);
	}else if(this.keys.isPressed(38)){
		this.player2.y = Math.max(0, this.player2.y - 10);

	}

	 this.ball.update();
	 this.display1.value = this.player1.score;
	 this.display2.value = this.player2.score;
    	//if (this.ball.x > this.width || this.ball.x + this.ball.width < 0) {
        //	this.ball.vx = -this.ball.vx;
    	//} else if (this.ball.y > this.height || this.ball.y + this.ball.height < 0) {
        //	this.ball.vy = -this.ball.vy;
    	//}
if (this.ball.vx > 0) {
        if (this.player2.x <= this.ball.x + this.ball.width &&
                this.player2.x > this.ball.x - this.ball.vx + this.ball.width) {
            var collisionDiff = this.ball.x + this.ball.width - this.player2.x;
            var k = collisionDiff/this.ball.vx;
            var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
            if (y >= this.player2.y && y + this.ball.height <= this.player2.y + this.player2.height) {
                // collides with right paddle
                this.ball.x = this.player2.x - this.ball.width;
                this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
                this.ball.vx = -this.ball.vx;
            }
        }
    } else {
        if (this.player1.x + this.player1.width >= this.ball.x) {
            var collisionDiff = this.player1.x + this.player1.width - this.ball.x;
            var k = collisionDiff/-this.ball.vx;
            var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
            if (y >= this.player1.y && y + this.ball.height <= this.player1.y + this.player1.height) {
                // collides with the left paddle
                this.ball.x = this.player1.x + this.player1.width;
                this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
                this.ball.vx = -this.ball.vx;
            }
        }
    }
 
    // Top and bottom collision
    if ((this.ball.vy < 0 && this.ball.y < 0) ||
            (this.ball.vy > 0 && this.ball.y + this.ball.height > this.height)) {
        this.ball.vy = -this.ball.vy;
    } 

    if(this.ball.x >= this.width){
    	this.score(this.player1);    	
    } else if(this.ball.x + this.ball.width <= 0){
    	this.score(this.player2)
    }
}

myGame.prototype.score = function(p){
	p.score++;
	var player = p == this.player1 ? 0 :1;

	this.ball.x = this.width/2;
	this.ball.y = p.y + p.height/2;

	this.ball.vy = Math.floor(Math.random()*20-6);
	this.ball.vx = 10 - Math.abs(this.ball.vy);
	if(player == 1){
		this.ball.vx *= -1;
	}
}

function Display(x, y){
	this.x = x;
	this.y = y;
	this.value = 0;
}

 Display.prototype.draw = function(p)
{
    p.fillText(this.value, this.x, this.y);
};


function Paddle(x , y){
	this.x = x;
	this.y = y;
	this.width = 4;
	this.height = 24;
	this.score = 0;
}

Paddle.prototype.draw = function(p){
	p.fillRect(this.x, this.y, this.width, this.height);
}

function KeyListener(){
	this.pressedKeys = [];

	this.keyup = function(e){
		this.pressedKeys[e.keyCode] = false;
	}
	this.keydown = function(e){
		this.pressedKeys[e.keyCode] = true;
	}
	document.addEventListener("keydown", this.keydown.bind(this));
	document.addEventListener("keyup", this.keyup.bind(this));
	}

KeyListener.prototype.isPressed = function(key){
	return this.pressedKeys[key] ? true : false;
};

KeyListener.prototype.addKeyPressListener = function(keyCode, callback){
	document.addEventListener("keypress", function(e){
		if(e.keyCode == keycode)
			callback(e);
	});

};

function Ball(){
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.width = 6;
	this.height = 6;
}

Ball.prototype.update = function(){
	this.x += this.vx;
	this.y += this.vy;
}

Ball.prototype.draw = function(p){
	p.fillRect(this.x, this.y, this.width, this.height);
}




var game = new myGame();

function mainLoop(){
	game.update();
	game.draw();
	setTimeout(mainLoop, 33.3333);
};

mainLoop();
