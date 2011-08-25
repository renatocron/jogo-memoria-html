var $game = {
	qtde: {"hard":10, "complex":20, "easy":4, "normal":8}
};

$('#game_options button').click(function(){
	$game.level = $(this).val();

	game_engine.stop();
	if ($game.level != 'stop')
		game_engine.start();

	return false;
});

var game_engine = function(){
	var
	start_time = 'st',
	$images = $('#images'),

	_timeout = 0,
	$timeout = $('#time_elapsed'),
	_start = function(){
		$game[start_time] = new Date();
		var html = '<li><img class="a"/><img class="b h"/></li>',
		qtde = $game.qtde[$game.level], qtde_orig=qtde*2,
		arElements = Array();
		$game.level_int = qtde;

		while (qtde--){
			var $elm = $(html);
			$elm.find('img.a').css('background-color', 'rgb(' + (parseInt(Math.random() * 250)) + ', '+(parseInt(Math.random() * 250))+', '+(parseInt(Math.random() * 250))+')');
			$elm.attr('data-num', qtde);

			arElements.push($elm);
			arElements.push($elm.clone());
		}
		__shuffle(arElements);
		while(qtde_orig--){
			$images.append(arElements[qtde_orig]);
		}

		// dica: colocar o timers sempre no final das subs
		// trick a cada meio segundo
		_timeout = window.setInterval(_trick, 500);

		window.setTimeout(function(){
			$images.find('img.b').removeClass('h');
		}, 25 * arElements.length );


	},
	_toggle_image = function(){
		if ($game.can_click == false) return false;
		
		var $self = $(this), val = $self.attr('data-num');
		if ($self.hasClass('solved')) return false;
		if ($self.hasClass('selected')) return false;

		if ($game.last_click == val){

			$images.find('li[data-num='+val+']').addClass('solved').find('img.b').removeAttr('css');
			$self.removeClass('selected');

			$game.last_item.removeClass('selected');
			$self.removeClass('selected');

			$game.last_click = -1;

			$game.correct++;

			if ($game.level_int == $game.correct){

				$game.win_on = new Date();
				$game.winner = true;
				
				window.clearTimeout(_timeout);
				_trick();
			}

		}else if ($game.last_click > -1 && $game.last_click != val){

			$game.can_click = false;
			$self.find('img.b').addClass('h');

			window.setTimeout(function(){
				$game.can_click = true;
				$game.erros++;
				$game.last_click = -1;
				
				$game.last_item.removeClass('selected');
				$self.removeClass('selected');
				$images.find('img.b').removeClass('h');
			}, 120);

		}else{

			$self.addClass('selected');
			$self.find('img.b').addClass('h');

			$game.last_item = $self;
			$game.last_click = val;

		}

		return true;
	},
	_trick = function (){

		_display_time();


	},
	_display_time = function(){

		if ($game.winner)
		{
			$timeout.text( 'venceu em ' + parseInt(($game['win_on'] - $game[start_time]) / 1000) + 's');
		}else{
			$timeout.text( parseInt((new Date() - $game[start_time]) / 1000) + 's');
		}


	},
	__shuffle = function (list) {
		var i, j, t, l = list.length;
		for (i = 1; i < l; i++) {
			j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
			if (j != i) {
				t = list[i];                        // swap list[i] and list[j]
				list[i] = list[j];
				list[j] = t;
			}
		}
	},
	_stop = function (){

		window.clearTimeout(_timeout);

		// matando os filhos "com estilo"
		$images.html('');

		// reseta o tempo
		$timeout.text('0');

		$game.last_click = -1;
		$game.erors = 0;
		$game.correct = 0;
		$game.level_int = 0;
		$game.winner = false;
		$game.can_click = true;
	},
	_load_compleate = function(){
		$images.find('li').live('click', _toggle_image);
	};

	return {start: _start, stop: _stop, wload: _load_compleate};
}(window);

$(game_engine.wload);
  