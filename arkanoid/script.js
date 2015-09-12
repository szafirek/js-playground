window.requestAnimationFrame = (function(){
	return window.requestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   window.oRequestAnimationFrame ||
		   window.msRequestAnimationFrame ||
		   function(callback){
		   	window.setTimeout(callback,1000/60);
		   };
})();

var canvas = document.getElementById('canvas');
var width = 800, height = 600, background = "#D6F7DC";

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');

var blocks = [], speedx = 0, speedy = 140, speedup = false, new_game = false;

/* block */

function Block(x,y){
	this.x = x,
	this.y = y,
	this.width = width/10,
	this.height = 40,
	this.color = this.getColor()
};

Block.prototype.getColor = function(){
	var colors = ["255,162,183","255,63,117","249,92,136","255,112,152","255,112,145","46,191,248","87,55,166"];
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
};

Block.prototype.draw = function(){
	ctx.fillStyle = "rgba("+this.color+",0.6)";
	ctx.fillRect(this.x,this.y,this.width,this.height);
	ctx.fillStyle = "rgba("+this.color+",0.4)";
	ctx.fillRect(this.x,this.y,this.width,5);
	ctx.fillStyle = "rgba("+this.color+",0.4)";
	ctx.fillRect(this.x,this.y,5,this.height);
	ctx.fillStyle = "rgba("+this.color+",0.9)";
	ctx.fillRect(this.x,this.y+this.height-5,this.width,5);
	ctx.fillStyle = "rgba("+this.color+",0.9)";
	ctx.fillRect(this.x+this.width-5,this.y,5,this.height);
};

Block.prototype.clear = function(){
	ctx.fillStyle = background;
	ctx.fillRect(this.x,this.y,this.width,this.height);
};

/* padd */

var padd = {
	width: 70,
	height: 20,
	color: "255,80,121"
};

padd.x = width/2 - padd.width/2;
padd.y = height - padd.height;

padd.draw = function(){
	ctx.fillStyle = "rgba("+this.color+",1)";
	ctx.fillRect(this.x,this.y,this.width,this.height);
};

padd.clear = function(){
	ctx.fillStyle = background;
	ctx.fillRect(this.x-1,this.y-1,this.width+2,this.height+1);
};

padd.move = function(x){
	this.clear();
	this.x = x;
	if(x < 0){
		this.x = 0;
	}
	if(x > width-this.width){
		this.x = width-this.width;
	}
	this.draw();
};

/* ball */

var ball = {
	x: width/2,
	y: height/2,
	radius: 10,
	speedx: speedx,
	speedy: speedy,
	color: "#E61111"
};

ball.draw = function(){
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
	ctx.fillStyle = this.color;
	ctx.fill();
};

ball.clear = function(){
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.radius+1,0,2*Math.PI,false);
	ctx.fillStyle = background;
	ctx.fill();
};

ball.update = function(){
	this.x += this.speedx * 0.05;
	this.y += this.speedy * 0.05;
};

/* game */

canvas.addEventListener('mousemove',function(evt){
	var rect = canvas.getBoundingClientRect();
	var posX = evt.clientX - rect.left - 20 - padd.width/2;
	padd.move(posX);
},false);

var draw_background = function(){
	ctx.fillStyle = background;
	ctx.fillRect(0,0,width,height);
};

var draw_blocks = function(){
	for(var i = 0;i < blocks.length;i++){
		blocks[i].draw();
	}
};

var fill_blocks = function(){
	blocks = [];
	var x = 0, y = 0;
	for(var i = 0;i < 60;i++){
		blocks.push(new Block(x,y));
		x += width/10;
		if(x >= width){
			x = 0;
			y += 40;
		}
	}
};

var reset_game = function(){
	ball.x = width/2;
	ball.y = height/2;
	ball.speedx = speedx;
	ball.speedy = speedy;
	fill_blocks();
	new_game = true;
	startButton.innerHTML = 'new game';
	startButton.style.display = 'block';
};

var remove_ball = function(i){
	blocks.splice(i,1);
};

var end_game = function(){
	return blocks.length === 0;
};

var update = function(){
	ball.update();

	if(ball.y <= 0 && ball.speedy < 0){
		ball.y = ball.radius;
		ball.speedy *= -1;
	}

	if((ball.y - ball.radius) <= 240){
		for(var i = 0; i < blocks.length; i++){
			if(ball.speedy < 0 && (ball.y - ball.radius) <= (blocks[i].y + blocks[i].height) && ball.x >= blocks[i].x && ball.x <= (blocks[i].x + blocks[i].width)){
				ball.y = blocks[i].y + blocks[i].height + ball.radius;
				ball.speedy *= -1;
				if(speedup){
					ball.speedy += 10;
				}
				speedup = true;
				remove_ball(i);
				break;
			}else if(ball.speedy > 0 && (ball.y + ball.radius) <= blocks[i].y && ball.x >= blocks[i].x && ball.x <= (blocks[i].x + blocks[i].width)){
				ball.y = blocks[i].y - ball.radius;
				ball.speedy *= -1;
				if(speedup){
					ball.speedy += 10;
				}
				speedup = true;
				remove_ball(i);
				break;
			}else if((ball.x - ball.radius) <= (blocks[i].x + blocks[i].width) && (ball.x - ball.radius) >= (blocks[i].x + blocks[i].width - 15) && ball.y >= blocks[i].y && ball.y <= (blocks[i].y + blocks[i].height)){
				ball.x = blocks[i].x + blocks[i].width + ball.radius;
				ball.speedx *= -1;
				if(speedup){
					ball.speedy += 10;
				}
				speedup = true;
				remove_ball(i);
				break;
			}else if((ball.x + ball.radius) >= blocks[i].x && (ball.x + ball.radius) <= (blocks[i].x + 15) && ball.y >= blocks[i].y && ball.y <= (blocks[i].y + blocks[i].height)){
				ball.x = blocks[i].x - ball.radius;
				ball.speedx *= -1;
				if(speedup){
					ball.speedy += 10;
				}
				speedup = true;
				remove_ball(i);
				break;
			}
		}
	}

	if((ball.x - ball.radius) <= 0 && ball.speedx < 0){
		ball.x = ball.radius;
		ball.speedx *= -1;
	}
	if((ball.x + ball.radius) >= width && ball.speedx > 0){
		ball.x = width - ball.radius;
		ball.speedx *= -1;
	}

	if(ball.x >= padd.x && ball.x <= (padd.x + padd.width) && (ball.y - ball.radius) >= padd.y && ball.speedy > 0){
		speedup = false;
		ball.y = padd.y - ball.radius;
		var diff = ball.x - padd.x;
		if(diff < padd.width/2){
			ball.speedx = (padd.width/2 - diff) * 2;
			ball.speedx *= -1;
		}else if(diff > padd.width/2){
			ball.speedx = (diff - padd.width/2) * 2;
		}else{
			ball.speedx = 0;	  
		}
		ball.speedy *= -1;
	}else if((ball.x - ball.radius) <= (padd.x + padd.width) && (ball.x - ball.radius) >= (padd.x + padd.width - 15) && ball.y >= padd.y){
		ball.x = padd.x + padd.width + ball.radius;
		ball.speedx *= -1;
	}else if((ball.x + ball.radius) >= padd.x && (ball.x + ball.radius) <= (padd.x + 15) && ball.y >= padd.y){
		ball.x = padd.x - ball.radius;
		ball.speedx *= -1;
	}

	if((ball.y >= height && ball.speedy > 0) || end_game()){
		reset_game();
	}
};

var draw = function(){
	draw_background();
	padd.draw();
	draw_blocks();
	ball.draw();
};

var play = function(){
	if(!new_game){
		update();
		draw();
		requestAnimationFrame(play);
	}
};

var init = function(){
	fill_blocks();
	draw_background();
	padd.draw();
	draw_blocks();
	ball.draw();
};

init();

var startButton = document.getElementById("start");

startButton.addEventListener('click', function() {
	startButton.style.display = 'none';
	new_game = false;
    play();
}, false);