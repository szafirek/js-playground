(function(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var width = 700;
  var height = 500;
  canvas.width = width;
  canvas.height = height;

  var snake = undefined;
  var food = undefined;
  var board = undefined;
  var game = undefined;

  function Snake(){
    this.length = 5;
    this.body = [];
    this.colors = ['#735868', '#AE81AA', '#FD4B70', '#FE8A6F', '#F9B747'];
    this.direction = 'RIGHT';

    for(var i = 0; i < this.length; i++){
      var color = this.colors.shift();
      this.body.push(new Element(i, 0, color));
      this.colors.push(color);
    }

    this.body.reverse();
  };

  Snake.prototype.draw = function(){
    for(var i = 0; i < this.body.length; i++){
      this.body[i].draw();
    }
  };

  Snake.prototype.head = function(){
    return this.body[0];
  };

  Snake.prototype.go = function(){
    var counter = this.body.length;
    var x = undefined;
    var y = undefined;
    var direction = undefined;
    var old_x = undefined;
    var old_y = undefined;
    var old_direction = undefined;

    for(var i = 0; i < this.body.length; i++){
      old_x = this.body[i].x;
      old_y = this.body[i].y;
      old_direction = this.body[i].direction;

      if(i === 0){
        this.change = false;
        this.body[i].direction = this.direction;
        this.body[i].go();
      }else{
        this.body[i].x = x;
        this.body[i].y = y;
        this.body[i].direction = direction;
      }

      x = old_x;
      y = old_y;
      direction = old_direction;
    }

    this.draw();
  };

  Snake.prototype.add_tail = function(){
    var color = food.colors.shift();
    var last = this.body[this.length - 1];
    this.body.push(new Element(last.x, last.y, color));
    food.colors.push(color);
    this.length += 1;
  };

  function Element(x, y, color){
    this.size = 10;
    this.x = x;
    this.y = y;
    this.direction = 'RIGHT';
    this.color = color;
  };

  Element.prototype.draw = function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  };

  Element.prototype.go = function(x, y){
    switch(this.direction){
      case 'LEFT':
        this.x -= 1;
        break;
      case 'RIGHT':
        this.x += 1;
        break;
      case 'UP':
        this.y -= 1;
        break;
      default:
        this.y += 1;
        break;
    }
  };

  function Food(){
    this.x = Math.floor(Math.random() * (width - 10) / 10);
    this.y = Math.floor(Math.random() * (height - 10) / 10);
    this.size = 10;
    this.colors = ['#735868', '#AE81AA', '#FD4B70',
                   '#FE8A6F', '#F9B747', '#F9B747',
                   '#FE8A6F', '#FD4B70', '#AE81AA',
                   '#735868'];
    this.color = this.colors[0];
  };

  Food.prototype.random = function(){
    this.x = Math.floor(Math.random() * (width - 10) / 10);
    this.y = Math.floor(Math.random() * (height - 10) / 10);
    this.color = this.colors[1];
  };

  Food.prototype.draw = function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  };

  var start = function(){
    snake = new Snake();
    food = new Food();
    board = new Board();
    board.clear();
    snake.draw();
    game = setInterval(play, 120);
    food.draw();
  };

  var play = function(){
    board.clear();
    snake.go();
    food.draw();
    check_food();
    check_end();
  };

  var check_end = function(){
    if(snake.head().x === -1 || snake.head().x === width / 10 || snake.head().y === -1 || snake.head().y === height / 10){
      end();
    }

    for(var i = 1; i < snake.length; i++){
      if(snake.head().x === snake.body[i].x && snake.head().y === snake.body[i].y){
        end();
      }
    }
  };

  var check_food = function(){
    if(snake.head().x === food.x && snake.head().y === food.y){
      food.random();
      snake.add_tail();
    }
  };

  var end = function(){
    clearInterval(game);
    game = undefined;
    $('#btn').show();
  };

  function Board(){
    this.background_color = 'white';
    this.border_color = '#CCFFFF'
  };

  Board.prototype.clear = function(){
    ctx.fillStyle = this.background_color;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = this.border_color;
    ctx.strokeRect(0, 0, width, height);
  };

  $(document).keydown(function(e){
    var key = e.which;
    if(key == "37" && snake.direction != "RIGHT") snake.direction = "LEFT";
    else if(key == "38" && snake.direction != "DOWN") snake.direction = "UP";
    else if(key == "39" && snake.direction != "LEFT") snake.direction = "RIGHT";
    else if(key == "40" && snake.direction != "UP") snake.direction = "DOWN";
  });

  $('#btn').click(function(){
    $('#btn').hide();
    start();
  });

  start();
})();