(function(){
  var width = window.innerWidth;
  var height = window.innerHeight;

  var canvas = document.getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var particles = [];

  var randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  function Particle(){
    this.x = width / 2;
    this.y = height / 2;
    this.speedX = randomInt(-3, 3);
    this.speedY = randomInt(-3, 3);
    this.radius = 10;
  };

  Particle.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  };

  var play = function(){
    if(particles.length > 500){
      particles.shift();
    }

    particles.push(new Particle());

    ctx.clearRect(0, 0, width, height);

    for(var i = 0; i < particles.length; i++){
      particles[i].color = "hsla(" + i + ", 80%, 50%, 0.5)";

      particles[i].draw();

      particles[i].x = particles[i].x + particles[i].speedX;
      particles[i].y = particles[i].y + particles[i].speedY;
    }
  };

  setInterval(play, 1000/60);
})();
