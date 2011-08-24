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

		var $self = $(this), val = $self.attr('data-num');
		if ($self.hasClass('solved')) return false;
		
		if ($game.last_click == val){

			$images.find('li[data-num='+val+']').addClass('solved').find('img.b').attr('css','');
			$game.last_click = -1;
			console.log("acertou");
		}else if ($game.last_click > -1 && $game.last_click != val){
			$game.erros++;
			$game.last_click = -1;
			console.log("errou");
			$images.find('img.b').removeClass('h');
		}else{
			console.log("mostrar label");
			$self.find('img.b').addClass('h');
			
			$game.last_click = val;
		}
		
	},
	_trick = function (){
		
		_display_time();
		

	},
	_display_time = function(){

		$timeout.text( parseInt((new Date() - $game[start_time]) / 1000) + 's');
		
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
	},
	_load_compleate = function(){
		$images.find('li').live('click', _toggle_image);
	};

	return {start: _start, stop: _stop, wload: _load_compleate};
}(window);

$(game_engine.wload);
