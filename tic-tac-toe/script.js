var AppCtrl = function($scope){
	var is_empty = function(id){
		return $scope.board[id] === '';
	};

	var is_winner_here = function(){
		var board = $scope.board;
		var combinations = [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
		for(var i = 0;i < 8;i++){
			if((board[combinations[i][0]] != '') && (board[combinations[i][0]] === board[combinations[i][1]]) && (board[combinations[i][1]] === board[combinations[i][2]])){
				return true;
			}
		}
		return false;
	};

	var check_winner = function(user){
		if(is_winner_here()){
			if(user === 'player'){
				$scope.notice = 'Congratulations! You won!'
			}else{
				$scope.notice = 'Computer wins! You lose!'
			}
			return true;
		}
		return false;
	};

	var check_draw = function(){
		if(!_.any($scope.board,function(e){return e === '';})){
			$scope.notice = "It's a draw!";
			return true;
		}
		return false;
	};

	var is_end_game = function(user){
		if(check_winner(user) || check_draw()){
			$scope.play = function(id){};
			return true;
		}
		return false;
	};

	var try_win = function(check){
		var board = $scope.board;
		var combinations = [[0,[[1,2],[3,6],[4,8]]],
							[1,[[0,2],[4,7]]],
							[2,[[0,1],[4,6],[5,8]]],
							[3,[[0,6],[4,5]]],
							[4,[[0,8],[1,7],[2,6],[3,5]]],
							[5,[[2,8],[3,4]]],
							[6,[[0,3],[2,4],[7,8]]],
							[7,[[1,4],[6,8]]],
							[8,[[0,4],[2,5],[6,7]]]];
		for(var i = 0;i < 9;i++){
			var main = combinations[i][0];
			if(board[main] === ''){
				var pairs = combinations[i][1];
			
				for(var j=0;j < pairs.length;j++){
					if(board[pairs[j][0]] === check && board[pairs[j][1]] === check){
						$scope.board[main] = 'o';
						return true
					}
				}
			}
		}
		return false;
	};

	var get_random_int = function(min, max){
  		return Math.floor(Math.random() * (max - min)) + min;
	};

	var make_random = function(){
		var random = get_random_int(0,8);
		while($scope.board[random] != ''){
			random = get_random_int(0,8);
		}
		$scope.board[random] = 'o';
	};

	var make_move = function(){
		if(!try_win('o') && !try_win('x')){
			make_random();
		}
		is_end_game('computer');
	};

	$scope.board = ['','','','','','','','',''];

	$scope.notice = '';

	var play = $scope.play = function(id){
		if(is_empty(id)){
			$scope.board[id]='x';
			if(!is_end_game('player')){
				make_move();
			}
		}
	};

	$scope.newGame = function(){
		$scope.board = ['','','','','','','','',''];
		$scope.notice = '';
		$scope.play = play;
	};
};
