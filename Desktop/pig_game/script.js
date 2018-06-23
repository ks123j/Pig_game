var scores, roundScore, activePlayer, gameplaying, previousRoll, scoreLimit;


init();

function init(){
	scores = [0,0];

	roundScore = 0;

	activePlayer = 0;

	gameplaying = true;

	

	document.querySelector('#dice-1').style.display = 'none';
	document.querySelector('#dice-2').style.display = 'none';

	document.getElementById('score-0').textContent = '0';
	document.getElementById('score-1').textContent = '0';
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';

	document.getElementById('name-0').textContent = 'Player1'
	document.getElementById('name-1').textContent = 'Player2'

	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');
	document.querySelector('.player-0-panel').classList.add('active');
}


//document.querySelector('#current-' + activePlayer).textContent = dice;

//var x = document.querySelector('#score-0').textContent;

		

document.querySelector('.btn-roll').addEventListener('click', function(){
	if (gameplaying) {

		var dice1 = Math.floor(Math.random() * 6) + 1;
		var dice2 = Math.floor(Math.random() * 6) + 1;

		var dice1DOM = document.querySelector('#dice-1');
		dice1DOM.style.display = 'block';
		dice1DOM.src = 'dice-' + dice1 + '.png';

		var dice2DOM = document.querySelector('#dice-2');
		dice2DOM.style.display = 'block';
		dice2DOM.src = 'dice-' + dice2 + '.png';


		//if (previousRoll === 6 && dice1 === 6){
			//document.querySelector('#current-' + activePlayer).textContent = '0';
			//document.querySelector('#score-' + activePlayer).textContent = '0';
			//nextPlayer();
		//}


		if (dice1 !== 1 && dice2 !== 1){
			//previousRoll = dice;
			roundScore = dice1 + dice2 + roundScore;
			document.querySelector('#current-' + activePlayer).textContent = roundScore;
		}else {
			nextPlayer();
		}
		//previousRoll = dice;
	}
	
});

document.querySelector('.btn-hold').addEventListener('click', function(){
	if (gameplaying) {
		scores[activePlayer] += roundScore;
		document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];


		scoreLimit = document.querySelector('.final-score').value;
		var winnerScore;

		if(scoreLimit){
			winnerScore = scoreLimit;
		}else{
			winnerScore = 100;
		}
		

		if (scores[activePlayer] >= winnerScore) {
			document.querySelector('#name-' + activePlayer).textContent = 'Winner!'

			document.querySelector('.player-'+ activePlayer +'-panel').classList.add('winner');
			document.querySelector('.player-'+ activePlayer +'-panel').classList.remove('active');
			document.querySelector('#dice-1').style.display = 'none';
			document.querySelector('#dice-2').style.display = 'none';
			gameplaying = false;
		} else {
			nextPlayer();
		}
	}
	
});


function nextPlayer(){

	activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
	roundScore = 0;

	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';

	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	document.querySelector('#dice-1').style.display = 'none';
	document.querySelector('#dice-2').style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click', init);






















