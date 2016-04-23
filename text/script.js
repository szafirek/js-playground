var App = (function(){
  var width = window.innerWidth;
  var height = window.innerHeight;

  var canvas = document.getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  var mouse = {
    x: -100,
    y: -100,
    onScreen: false
  };

  var mousemove = function(e){
    if(e.layerX || e.layerX === 0){
      mouse.onScreen = true;
      mouse.x = e.layerX - canvas.offsetLeft;
      mouse.y = e.layerY - canvas.offsetTop;
    }
  };

  var mouseout = function(e){
    mouseOnScreen = false;
    mouse = {x: -100, y: -100};
  };

  canvas.addEventListener('mousemove', mousemove, false);
  canvas.addEventListener('mouseout', mouseout, false);

  function Circle(x, y, startX, startY, velocity){
    this.color = '#' + (Math.random() * 0x949494 + 0xAAAAAA | 0).toString(16);
    this.x = x;
    this.y = y;
    this.startX = startX;
    this.startY = startY;
    this.free = true;
    this.velocity = velocity;
  }

  Circle.prototype.draw = function(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.startX, this.startY, 4, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  };

  function Banner(text){
    this.text = text;
    this.distance = 10;
    this.circles = [];
    this.iterCounter = 0;
    this.iterTotal = 40;
    this.getCircles();
  };

  Banner.prototype.getCircles = function(){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#000000';
    ctx.font = '300px impact';
    ctx.fillText(this.text, 85, 275);

    var imageData = ctx.getImageData(0, 0, width, height);

    for(var h = 0; h < height; h += this.distance){
      for(var w = 0; w < width; w += this.distance){
        var pixel = imageData.data[((w + (h * width)) * 4) - 1];

        if(pixel === 255){
          this.createCircle(w, h);
        }
      }
    }
  };

  Banner.prototype.createCircle = function(x, y){
    var startX = (Math.random() * width);
    var startY = (Math.random() * height);

    var velocityX = (x - startX) / this.iterTotal;
    var velocityY = (y - startY) / this.iterTotal;

    this.circles.push(new Circle(x, y, startX, startY, {x: velocityX, y: velocityY}));
  };

  Banner.prototype.update = function(){
    this.iterCounter += 1;
    canvas.width = canvas.width;
    for(var i = 0; i < this.circles.length; i++){
      if(this.circles[i].free){
        this.circles[i].startX += this.circles[i].velocity.x;
        this.circles[i].startY += this.circles[i].velocity.y;
      }

      if(this.iterCounter === this.iterTotal){
        this.circles[i].velocity = {x: (Math.random() * 6) * 2 - 6, y: (Math.random() * 6) * 2 - 6};
        this.circles[i].free = false;
      }

      var distance = Math.sqrt((this.circles[i].x - mouse.x) * (this.circles[i].x - mouse.x) + (this.circles[i].y - mouse.y) * (this.circles[i].y - mouse.y));

      if(distance < 20){
        this.circles[i].free = true;
      }

      this.circles[i].draw();      
    }
  };

  Banner.prototype.clear = function(){
    canvas.width = canvas.width;
  };

  var interval = undefined;

  var start = function(text){
    clearInterval(interval);
    var banner = new Banner(text);
    interval = setInterval(function(){banner.update()}, 40);
  };

  return {
    start: start
  };
})();

App.start('szafirek');

var btn = document.getElementById('banner-btn');
var input = document.getElementById('banner-text');

var change = function(){
  var text = input.value.trim();
  if(text.length > 0){
    App.start(text);
  }
  input.value = '';
};

var enter = function(e){
  var e = e || window.event;
  if (e.keyCode == 13){
    btn.click();
    return false;
  }
  return true;
}

btn.addEventListener('click', change, false);
input.addEventListener('keyup', enter, false);
