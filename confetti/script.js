(function(){
  var count = 350;
  var colors = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];

  var canvas = document.getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext("2d");

  var width = window.innerWidth;
  var height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  var resizeWindow = function(){
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener('resize', resizeWindow, false);

  var randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var xPos = 0.5;

  document.onmousemove = function(e){
    xPos = e.pageX / width;
  };

  function Confetti(){
    this.color = colors[randomInt(0, 4)].join(',');
    this.radius = randomInt(2, 6)
    this.randPosCounter = 2 * this.radius;
    this.recreate();
  };

  Confetti.prototype.recreate = function(){
    this.opacity = 0;
    this.opacityCounter = 0.03 * randomInt(1, 4);
    this.x = randomInt(-this.randPosCounter, width - this.randPosCounter);
    this.y = randomInt(-20, height - this.randPosCounter);
    this.maxX = width - this.radius;
    this.maxY = height - this.radius;
    this.speedX = randomInt(0, 2) + 8 * xPos - 5;
    this.speedY = 0.7 * this.radius + randomInt(-1, 1);
  };

  Confetti.prototype.draw = function(){
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity += this.opacityCounter;

    if(this.opacity > 1){
      this.opacity = 1;
      this.opacityCounter *= -1;
    }
    if(this.opacity < 0 || this.y > this.maxY) this.recreate();
    if(!(this.x > 0 || this.x < this.maxX)) this.x = (this.x + this.maxX) % this.maxX;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'rgba(' + this.color + ', ' + this.opacity + ')';
    ctx.fill();
  };

  var confetti = [];

  for(var i = 0; i < count; i++){
    confetti.push(new Confetti());
  }

  var play = function(){
    ctx.clearRect(0, 0, width, height);
    for(var i = 0; i < count; i++){
      confetti[i].draw();
    }
  };

  setInterval(play, 1000/60);
})();
