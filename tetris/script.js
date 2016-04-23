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

var width = 800, height = 600;
var canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");

var mainElement, gameBottom, next;

var elements = [{src:'assets/1.png',patterns: ['1000100010001000','1111000000000000']},
				{src:'assets/2.png',patterns: ['1110010000000000','1000110010000000','0100111000000000','0100110001000000']},
				{src:'assets/3.png',patterns: ['1100110000000000']},
				{src:'assets/4.png',patterns: ['1000100011000000','0010111000000000','1100010001000000','1110100000000000']},
				{src:'assets/5.png',patterns: ['0100010011000000','1110001000000000','1100100010000000','1000111000000000']},
				{src:'assets/6.png',patterns: ['0110110000000000','1000110001000000']},
				{src:'assets/7.png',patterns: ['1100011000000000','0100110010000000']}];

var endGame = false;

// 														ELEMENT
function Element(obj){
	this.patterns = obj.patterns;
	this.pattern = this.generatePattern();
	this.width = this.getWidth();
	this.height = this.getHeight();
	this.x = this.getX();
	this.y = -50;
	this.img = new Image();
	this.img.src = obj.src;
	this.check = [];
};

Element.prototype.generatePattern = function(){
	var random = getRandom(0,this.patterns.length);
	this.changePatternsQueue(random);
	return this.patterns[0];
};

Element.prototype.changePatternsQueue = function(r){
	for(var k = 0; k < r; k++){
		var temp = this.patterns[0];
		this.patterns.shift();
		this.patterns.push(temp);
	}
};

Element.prototype.getWidth = function(){
	var w = 0, temp = [false,false,false,false];
	for(var i = 0; i < 16; i++){
		if(this.pattern[i] === '1'){
			temp[i%4] = true;
		}
	}
	_.each(temp,function(e){if(e){w+=25;}});
	return w;
};

Element.prototype.getHeight = function(){
	var h = 0, levels = [3,7,11,16];
	for(var l = 0; l < 16; l++){
		if(this.pattern[l] === '1'){
			h += 25;
			l = levels.shift();
		}
	}
	return h;
};

Element.prototype.getX = function(){
	if(this.width === 50 || this.width === 25){
		return 300;
	}else if(this.width === 75 || this.width === 100){
		return 275;
	}
};

Element.prototype.draw = function(){
	this.check = [];
	var x = this.x, y = this.y;
	for(var i = 0; i < 16; i++){
		if(i % 4 === 0){
			y += 25;
			x = this.x;
		}
		if(this.pattern[i] === '1'){
			ctx.drawImage(this.img,x,y);
			if(y >= 50){
				this.check.push([x,y]);
			}
		}
		x += 25;
	}
	ctx.fillStyle = "#555555";
	ctx.fillRect(199,0,451,49);
	ctx.beginPath();
	ctx.moveTo(199,49);
	ctx.lineTo(451,49);
	ctx.strokeStyle = "#FFFFFF";
	ctx.stroke();
};

Element.prototype.changePattern = function(){
	if(this.width === 50 && this.x > 375){
		this.x -= 25;
	}
	if(this.width === 25){
		if(this.x === 425){
			this.x -= 75;
		}else if(this.x === 400){
			this.x -= 50;
		}else if(this.x === 375){
			this.x -= 25;
		}
	}
	this.pattern = this.patterns[1];
	this.changePatternsQueue(1);
	this.width = this.getWidth();
	this.height = this.getHeight();
}

Element.prototype.drawNext = function(){
	var x = 580, y = 200;
	for(var i = 0; i < 16; i++){
		if(i % 4 === 0){
			y += 25;
			x = 580;
		}
		if(this.pattern[i] === '1'){
			ctx.drawImage(this.img,x,y);
		}
		x += 25;
	}
};

// 														BOTTOM
function Bottom(){
	this.element;
	this.bricks = [];
	this.board = new Array(20);
	for(var k = 0;k < 20;k++){
		this.board[k] = [];
		for(var l = 0;l < 10;l++){
			this.board[k].push(false);
		}
	}
};

Bottom.prototype.addElement = function(el){
	this.element = el;
	this.changeIntoBricks();
};
Bottom.prototype.draw = function(){
	_.each(this.bricks,function(e){e.draw();});
};

Bottom.prototype.check_element = function(e){
	var c = e.check;
	var b = this.board;
	var counter = 0;
	if((e.y + e.height) < 525){
		_.each(c,function(el){
			var x = el[0], y = el[1];
			if(b[(y-50)/25 + 1][(x-200)/25]){
				counter += 1;
			}
		});
	}
	if(counter > 0){
		return false;
	}else{
		return (e.y + e.height) < 525;
	}
};

Bottom.prototype.changeIntoBricks = function(){
	var elem = this.element;
	var x = elem.x, y = elem.y;
	for(var i = 0; i < 16; i++){
		if(i % 4 === 0){
			y += 25;
			x = elem.x;
		}
		if(elem.pattern[i] === '1'){
			this.bricks.push(new Brick(x,y,elem.img.src));
			if(y >= 50){
				this.board[(y-50)/25][(x-200)/25] = true;
			}
		}
		x += 25;
	}
};

Bottom.prototype.checkLeft = function(e){
	var c = e.check;
	var b = this.board;
	var counter = 0;
	_.each(c,function(el){
		var x = el[0], y = el[1];
		if(b[(y-50)/25][(x-200)/25 - 1]){
			counter += 1;
		}
	});
	if(counter > 0){
		return false;
	}else{
		return true;
	}
};

Bottom.prototype.checkRight = function(e){
	var c = e.check;
	var b = this.board;
	var counter = 0;
	_.each(c,function(el){
		var x = el[0], y = el[1];
		if(b[(y-50)/25][(x-200)/25 + 1]){
			counter += 1;
		}
	});
	if(counter > 0){
		return false;
	}else{
		return true;
	}
};

Bottom.prototype.checkBricksLevel = function(){
	var level = 0;
	_.each(this.board,function(e){
		var counter = 0;
		_.each(e,function(el){
			if(el){
				counter += 1;
			}
		});
		if(counter === 10){
			gameBottom.removeBricks(level);
			gameBottom.removeBoardLevel(level);
		}
		level += 1;
	});
};

Bottom.prototype.removeBoardLevel = function(lvl){
	this.board.splice(lvl,1);
	var new_level = new Array(10);
	for(var k = 0;k < 10;k++){
		new_level[k] = false;
	}
	this.board.unshift(new_level);
};

Bottom.prototype.removeBricks = function(lvl){
	var c = lvl * 25 + 50;
	var new_bricks = [];
	for(var k = 0;k < this.bricks.length;k++){
		if(this.bricks[k].y < c){
			this.bricks[k].y += 25;
			new_bricks.push(this.bricks[k]);
		}else if(this.bricks[k].y > c){
			new_bricks.push(this.bricks[k]);
		}
	}
	this.bricks = new_bricks;
};

// 														BRICK
function Brick(x,y,src){
	this.x = x;
	this.y = y;
	this.img = new Image();
	this.img.src = src;
};

Brick.prototype.draw = function(){
	ctx.drawImage(this.img,this.x,this.y);
};

// 														GAME
var getRandomElement = function(){return new Element(elements[Math.floor(Math.random()*7)]);};
var getRandom = function(min,max){return Math.floor(Math.random() * (max - min + 1)) + min;};

var addBackground = function(){
	ctx.fillStyle = "#555555";
	ctx.fillRect(0,0,width,height);
};

var addBoard = function(){
	ctx.beginPath();
	ctx.moveTo(199,49);
	ctx.lineTo(199,551);
	ctx.lineTo(451,551);
	ctx.lineTo(451,49);
	ctx.lineTo(199,49);
	ctx.strokeStyle = "#FFFFFF";
	ctx.stroke();

	ctx.beginPath();
	for(var i = 25;i < 250;i+=25){
		ctx.moveTo(200+i,50);
		ctx.lineTo(200+i,550);
	}
	for(i = 25;i < 500;i+=25){
		ctx.moveTo(200,50+i);
		ctx.lineTo(450,50+i);
	}
	ctx.strokeStyle = "#666666"
	ctx.stroke();
}

var redrawBoard = function(){
	ctx.fillStyle = "#555555";
	ctx.fillRect(199,49,651,551);
	addBoard();
	gameBottom.draw();
};

var add = function(){
	if(!gameBottom.check_element(mainElement)){
		gameBottom.addElement(mainElement);
		mainElement = next;
		next = getRandomElement();
		next.drawNext();
	}
	mainElement.y += 25;
};

var checkTop = function(){
	_.each(gameBottom.board[0],function(e){
		if(e){
			endGame = true;
			window.clearInterval(add);
		}
	});
};

var init = function(){
	mainElement = getRandomElement();
	next = getRandomElement();
	gameBottom = new Bottom();
	addBackground();
	addBoard();
	mainElement.draw();
	next.drawNext();
	setInterval(add,1000);
};

var play = function(){
	checkTop();
	if(!endGame){
		redrawBoard();
		mainElement.draw();
        next.drawNext();
		gameBottom.checkBricksLevel();
		requestAnimationFrame(play);
	}else{
		document.getElementById("finish").style.display = 'block';
		ctx.fillStyle = "#555555";
		ctx.fillRect(580,200,400,400);
	}
};

document.onkeydown = function(e){
	var k = e.which;
	switch(k){
		case 37:
			if(mainElement.x != 200 && gameBottom.checkLeft(mainElement)){
				mainElement.x -= 25;
			}
			break;
		case 39:
			if((mainElement.x + mainElement.width) != 450 && gameBottom.checkRight(mainElement)){
				mainElement.x += 25;
			}
			break;
		case 40:
			if(gameBottom.check_element(mainElement)){
				mainElement.y += 25;	
			}
			break;
		case 32:
			if(mainElement.patterns.length != 1){
				mainElement.changePattern();
			}
			break;
	}
};

addBackground();
addBoard();

var startButton = document.getElementById("start");

startButton.addEventListener('click', function() {
	startButton.style.display = 'none';
	init();
    play();
}, false);
