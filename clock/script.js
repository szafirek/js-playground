(function(){
	var setTime = function(){
		var date = new Date();
		var hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
		var minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
		var second = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
		var color = ['#',hour,minute,second].join('');
		$('.clock').text(color);
		$('body').css('background-color',color);
	};

	setTime();
	setInterval(setTime,1000);
})();
