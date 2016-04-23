window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   window.oRequestAnimationFrame ||
		   window.msRequestAnimationFrame ||
		   function(callback){
		   	window.setTimeout(callback,1000/60);
		   };
})();

var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext("2d"),
	width = window.innerWidth,
	height = window.innerHeight;

canvas.width = width;
canvas.height = height;

var colors = ["#9E7D6E","#FFB0D5","#FAC3AE","#EAD890","#E4ECBD"];
var particles = [];

function Particle(){
	this.x = Math.random()*width;
	this.y = Math.random()*height/1.5;
	this.vy = Math.random()*2;
	this.vx = -1 + Math.random()*2;
	this.color = colors[Math.floor(Math.random()*5)];
	this.radius = 2.75;
	this.hits = 0;
};

Particle.prototype.draw = function(){
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
	ctx.closePath();
	ctx.fill();
};

var clear = function(){
	ctx.clearRect(0,0,width,height);
};

var draw = function(){
	var bounce = -.4;
	clear();
	_.each(particles,function(el,i){
		el.draw();
		particles[i].x += particles[i].vx;
		particles[i].y += particles[i].vy;
		particles[i].vy += 0.2;

		if(el.y > height){
			particles[i].y = height - el.radius;
			particles[i].vy *= bounce;
			particles[i].hits++;
		}

		if(el.x > width){
			particles[i].x = width - el.radius;
			particles[i].vx *= bounce;
		}else if(el.x < 0){
			particles[i].x = 0 + el.radius;
			particles[i].vx *= bounce;
		}

		if(el.hits > 4){
			particles[i] = new Particle();
		}
	});
};

var init = function(){
	for(var i = 0;i < 1000;i++){
		particles.push(new Particle());
	}
};

var animate = function(){
	draw();
	requestAnimFrame(animate);
}

init();
animate();
