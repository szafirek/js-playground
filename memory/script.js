function Block(img){
	this.img = img;
	this.inactive = false;
	this.selected = false;
};

function Game(){
	this.board = [];
	this.imgs = ['lilo','lilo','stich','stich','nani','nani','kobra','kobra',
				   'jamba','jamba','pleakley','pleakley','gantu','gantu','625','625'];
};

Game.prototype.drawBoard = function(){
	this.shuffle();
	for(var i = 0; i < this.imgs.length; i++){
		this.board.push(new Block(this.imgs[i]));
	}
};

Game.prototype.getBoard = function(){
	this.drawBoard();
	return this.board;
};

Game.prototype.shuffle = function(){
	for(var i = this.imgs.length - 1; i >= 0; i--){
		var j = this.getRandomInt(0,i+1);
		var temp = this.imgs[i];
		this.imgs[i] = this.imgs[j];
		this.imgs[j] = temp;
	}
};

Game.prototype.getRandomInt = function(min,max){
	return Math.floor(Math.random() * (max - min)) + min;
};

angular.module('memoryApp',[])
	.controller('memoryCtrl',['$scope','$timeout',function($scope,$timeout){
		var game = new Game();
		var blocks = $scope.blocks = game.getBoard();
		var previous = null;
		var next = null;
		var promise = null;

		$scope.$watch('blocks',function(){
			if(_.all(blocks,function(elem){return elem.inactive;})){
				$scope.endGame = true;
			}else{
				$scope.endGame = false;
			}
		},true);

		$scope.play = function(block){
			if(!previous){
				block.selected = true;
				previous = block;
			}else if(!next && blocks.indexOf(previous) != blocks.indexOf(block)){
				block.selected = true;
				next = block;
				if(previous.img === next.img){
					promise = $timeout(removeBlocks,2000);
				}else{
					promise = $timeout(backToFront,2000);
				}
			}else if(promise){
				$timeout.cancel(promise);
				if(previous.img === next.img){
					removeBlocks();
				}else{
					backToFront();
				}
				block.selected = true;
				previous = block;
			}
		};

		var removeBlocks = function(){
			previous.inactive = true;
			next.inactive = true;
			previous = null;
			next = null;
		};

		var backToFront = function(){
			previous.selected = false;
			next.selected = false;
			previous = null;
			next = null;
		};

		$scope.newGame = function(){
			for(var i = 0;i < blocks.length;i++){
				blocks[i].selected = false;
			}
			$timeout(function(){
				game = new Game();
				blocks = $scope.blocks = game.getBoard();
			},1000);
		};
	}]);