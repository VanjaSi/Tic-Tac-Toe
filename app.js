const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

const CLASS_X = 'x';
const CLASS_O = 'circle';
let playerOneName = 'Player one';
let playerTwoName = 'Player two';
let player1;
let player2;
let xTurn = true;
let game = Array(9).fill(null);

//when page is reloaded
(() => {
	$('.start-page').classList.add('show');
	$('#start-btn').addEventListener('click', startGame);
})();

function startGame() {
	//overwrittes all box classes with 'box'
	$$('.box').forEach((box) => {
		box.className = 'box';
	});
	//remove start and show game page
	$('.start-page').classList.toggle('show');
	$('.board-game').classList.toggle('show');
	$('.restart-page').classList.remove('show');

	//collect the input values and sets the names for players
	player1 = $$('input')[0].value;
	player2 = $$('input')[1].value;
	playerOneName = player1 || playerOneName;
	playerTwoName = player2 || playerTwoName;

	//classes for the hover effect
	$('.board').classList.add(CLASS_X);
	$('.board').classList.remove(CLASS_O);

	//update Heading based on whose turn it is
	updateHeadingUI();

	//add event on boxes
	$$('.box').forEach((box) =>
		box.addEventListener('click', playGame, { once: true }),
	);
}

function playGame(e) {
	//place x or o on the board
	const boxEl = e.target;
	const boxClass = xTurn ? CLASS_X : CLASS_O;
	boxEl.classList.add(boxClass);

	//switch the player
	xTurn = !xTurn;

	//update heading - player's turn
	updateHeadingUI();

	//update board class for hover
	const boardClass = xTurn ? CLASS_X : CLASS_O;
	$('.board').className = boardClass + ' board';

	//false if there is no win or winner combination if true
	let win = checkForWin(boxEl);

	//no win check for draw
	!win && checkForDraw();

	//if win restart game
	win && getWinner(win);
	// win && startGame();

	//to display win combinations on board
	win && displayWinner0nBoard(win);
}
function updateHeadingUI() {
	const heading = $('.heading');
	if (xTurn) {
		heading.innerHTML = `<h2>Turn : <strong>${playerOneName}</strong></h2>`;
	} else {
		heading.innerHTML = `<h2>Turn : <strong>${playerTwoName}</strong></h2>`;
	}
}

function getWinner(win) {
	const winner = win[0] === 'x' ? playerOneName : playerTwoName;
	displayPageModal(winner);
}

function resetGameData() {
	xTurn = true;
	$$('input')[0].value = '';
	$$('input')[1].value = '';
	playerOneName = 'Player one';
	playerTwoName = 'Player two';
	game = Array(9).fill(null);
}
//reset the box

function displayWinner0nBoard(win) {
	//index of winner combinations
	let winnerBoxes = win.slice(1);

	//add class color to the boxes
	$$('.box').forEach((box, index) => {
		if (winnerBoxes.indexOf(index) > -1) {
			box.classList.add('winner');
		}
	});
}
function checkForWin(boxElClicked) {
	//get selected index

	const boxIndexPosition = boxElClicked.getAttribute('data-order');

	let currentPlayer = xTurn ? 'o' : 'x';

	game[boxIndexPosition] = currentPlayer;

	if (game[0] === currentPlayer) {
		if (game[1] === currentPlayer && game[2] === currentPlayer) {
			return [currentPlayer, 0, 1, 2];
		}
		if (game[3] === currentPlayer && game[6] === currentPlayer) {
			return [currentPlayer, 0, 3, 6];
		}
		if (game[4] === currentPlayer && game[8] === currentPlayer) {
			return [currentPlayer, 0, 4, 8];
		}
	}
	if (game[8] === currentPlayer) {
		if (game[2] === currentPlayer && game[5] === currentPlayer) {
			return [currentPlayer, 2, 5, 8];
		}
		if (game[6] === currentPlayer && game[7] === currentPlayer) {
			return [currentPlayer, 6, 7, 8];
		}
	}
	if (game[4] === currentPlayer) {
		if (game[1] === currentPlayer && game[7] === currentPlayer) {
			return [currentPlayer, 1, 4, 7];
		}
		if (game[3] === currentPlayer && game[5] === currentPlayer) {
			return [currentPlayer, 3, 4, 5];
		}
		if (game[2] === currentPlayer && game[6] === currentPlayer) {
			return [currentPlayer, 2, 4, 6];
		}
	}
	return false;
}
function checkForDraw() {
	const draw = game.some((sign) => sign === null);

	if (draw) return;

	displayPageModal();
}

function displayPageModal(win) {
	const winner = win;
	$('.heading').innerHTML = '';
	$('.restart-page').classList.add('show');
	$('#restart-btn').addEventListener('click', startGame);
	resetGameData();

	if (!win) {
		$('.message').innerHTML = `<h2>Try again : <strong>Draw</strong></h2>`;
	} else {
		$(
			'.message',
		).innerHTML = `<h2>Congratulations <strong>${winner}</strong> you Won!</h2>`;
	}
}
