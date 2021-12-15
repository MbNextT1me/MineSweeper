//Сторона поля, кол-во бомб и т.д.
const FIELD = 12;
let bombs = 25;
let flags = 0;
let counter = 0;
let isGameOver = false;
let blocks = [];

//Отображение кол-ва флагов и бомб для пользователя
let flagText = document.getElementsByClassName('FlagsAmount');
flagText[0].innerText = 'Флагов осталось: ' + (parseInt(bombs) - parseInt(flags));
let bombText = document.getElementsByClassName('BombsAmount');
bombText[0].innerText = 'Количество бомб: ' + bombs;


function createField() {
	//Массив с рандомными бомбами
	const bombsArray = Array(bombs).fill('bomb');
	const emptyArray = Array(FIELD * FIELD - bombs).fill('valid');
	const gameArray = emptyArray.concat(bombsArray);
	const shuffledARray = gameArray.sort(() => Math.random() - 0.5);

	//Создание сетки блоков
	const insideExistDiv = document.getElementsByClassName('field')[0];

	for (let i = 0; i < FIELD; i++) {

		const row = document.createElement('div');
		row.className = 'field__row';
		insideExistDiv.appendChild(row);

		const insideExistRow = document.getElementsByClassName('field__row')[i];
		for (let j = 0; j < FIELD; j++) {
			const block = document.createElement('div');
			block.setAttribute('id', counter);
			block.className = 'field__block';
			block.classList.add(shuffledARray[counter]);
			block.tabIndex = 0;
			insideExistRow.appendChild(block);
			blocks.push(block);
			counter++;

			// Передвижение с помощью клавиш
			block.addEventListener('keydown', keyboardMoving);

			//обыное нажатие левой кнопкой мыши
			block.addEventListener('click', function (e) {
				addFlag(block);
			})

			//обыное нажатие на space, enter
			block.addEventListener('keypress', function (event) {
				if (event.keyCode == 32 || event.keyCode == 13) {
					addFlag(block);
				}
			})

			//Флаг при нажатии ctrl+space, ctrl+enter
			block.addEventListener('keydown', function (event) {
				if ((event.code == "Enter" && event.ctrlKey) || (event.code == "Space" && event.ctrlKey)) {
					event.preventDefault();
					click(block);
				}
			})
			//Флаг при клике правой кнопкой мыши
			block.addEventListener('contextmenu', function (e) {
				e.preventDefault();
				click(block);
			})
		}
	}
	//Добавляем числа
	for (let i = 0; i < blocks.length; i++) {
		let total = 0;

		//Узнаем о том, стоит ли блок на границе
		const isLeftEdge = (i % FIELD === 0);
		const isRightEdge = (i % FIELD === FIELD - 1);


		if (blocks[i].classList.contains('valid')) {
			if (i > 0 && !isLeftEdge && blocks[i - 1].classList.contains('bomb')) total++
			if (i > 11 && !isRightEdge && blocks[i + 1 - FIELD].classList.contains('bomb')) total++
			if (i > 12 && blocks[i - FIELD].classList.contains('bomb')) total++
			if (i > 13 && !isLeftEdge && blocks[i - 1 - FIELD].classList.contains('bomb')) total++
			if (i < 142 && !isRightEdge && blocks[i + 1].classList.contains('bomb')) total++
			if (i < 132 && !isLeftEdge && blocks[i - 1 + FIELD].classList.contains('bomb')) total++
			if (i < 130 && !isRightEdge && blocks[i + 1 + FIELD].classList.contains('bomb')) total++
			if (i < 131 && blocks[i + FIELD].classList.contains('bomb')) total++
			blocks[i].setAttribute('data', total)
		}
	}
	blocks[0].focus();
}

createField();

function addFlag(block) {
	if (isGameOver) return
	if (!block.classList.contains('checked') && (flags < bombs)) {
		if (!block.classList.contains('flag')) {
			block.classList.add('flag');
			flags++;
			flagText[0].innerText = 'Флагов осталось: ' + (parseInt(bombs) - parseInt(flags));
			//console.log(flags)
			checkForWin();
		} else {
			block.classList.remove('flag')
			flags--;
			flagText[0].innerText = 'Флагов осталось: ' + (parseInt(bombs) - parseInt(flags));
		}
	} else
		if (!block.classList.contains('checked') && (flags - bombs == 0)) {
			if (!block.classList.contains('flag')) {
				alert('У вас закончились флаги, комрад. Чтобы продолжить, придётся снять парочку других.')
			} else {
				block.classList.remove('flag')
				flags--;
				flagText[0].innerText = 'Флагов осталось: ' + (parseInt(bombs) - parseInt(flags));
			}
		}
}

//Проверка на клик по блоку
function click(block) {
	let currentId = block.id;
	if (isGameOver) return
	if (block.classList.contains('checked') || block.classList.contains('flag')) return
	if (block.classList.contains('bomb')) {
		gameOver(block);
	}
	else {
		let total = block.getAttribute('data')
		if (total != 0) {
			block.classList.add('checked');
			block.innerHTML = total;
			return
		}
		checkBlock(block, currentId);
	}
	block.classList.add('checked');
}

//Проверка соседей при клике
function checkBlock(block, currentId) {
	const isLeftEdge = (currentId % FIELD === 0);
	const isRightEdge = (currentId % FIELD === FIELD - 1);

	setTimeout(() => {
		if (currentId > 0 && !isLeftEdge) {
			const newId = blocks[parseInt(currentId) - 1].id;
			const newBlock = document.getElementById(newId);
			click(newBlock);
		}
		if (currentId > 11 && !isRightEdge) {
			const newId = blocks[parseInt(currentId) + 1 - FIELD].id;
			const newBlock = document.getElementById(newId);
			click(newBlock);
		}
		if (currentId > 12) {
			const newId = blocks[parseInt(currentId) - FIELD].id;
			const newBlock = document.getElementById(newId);
			click(newBlock);
		}
		if (currentId > 13 && !isLeftEdge) {
			const newId = blocks[parseInt(currentId) - 1 - FIELD].id;
			const newBlock = document.getElementById(newId);
			click(newBlock);
		}
		if (currentId < 142 && !isRightEdge) {
			const newId = blocks[parseInt(currentId) + 1].id;
			const newBlock = document.getElementById(newId);
			click(newBlock);
		}
		if (currentId < 132 && !isLeftEdge) {
			const newId = blocks[parseInt(currentId) - 1 + FIELD].id;
			const newBlock = document.getElementById(newId);
			click(newBlock);
		}
		if (currentId < 130 && !isRightEdge) {
			const newId = blocks[parseInt(currentId) + 1 + FIELD].id;
			const newBlock = document.getElementById(newId);
			click(newBlock);
		}
		if (currentId < 131) {
			const newId = blocks[parseInt(currentId) + FIELD].id;
			const newBlock = document.getElementById(newId);
			click(newBlock);
		}
	}, 10)
}

// Конец игры
function gameOver(block) {
	isGameOver = true;
	alert("БУМ! Кажись это был не тот провод...");

	// Покажем игроку остальные бомбы
	blocks.forEach(block => {
		if (block.classList.contains('bomb')) {
			block.classList.add('bomb-visible');
		}
	})
}

//Проверка на победу
function checkForWin() {
	let matches = 0;

	for (let i = 0; i < blocks.length; i++) {
		if (blocks[i].classList.contains('flag') && blocks[i].classList.contains('bomb')) {
			matches++
		}
	}
	if (matches === bombs) {
		alert('Победа! Хорошая работа, камрад.')
		isGameOver = true
	}
}


//Реализация для игры с помощью кнопок

function keyboardMoving(e) {
	let active = document.activeElement;
	let current_active = active.id;

	const isLeftEdge = (current_active % FIELD === 0);
	const isRightEdge = (current_active % FIELD === FIELD - 1);


	if (e.keyCode == 38) {
		if (current_active < 12) {
			blocks[FIELD * FIELD - (FIELD - parseInt(current_active))].focus();
		}
		if (current_active > 11) {
			blocks[parseInt(current_active) - FIELD].focus();
		}
	}
	else if (e.keyCode == 40) {
		if (current_active > 131 && current_active != 143) {
			blocks[(parseInt(current_active) + 1) % FIELD - 1].focus();
		}
		if (current_active < 132) {
			blocks[parseInt(current_active) + FIELD].focus();
		}
		if (current_active == 143) {
			blocks[parseInt(current_active) % FIELD].focus();
		}
	}
	else if (e.keyCode == 37) {
		if (!isLeftEdge) {
			blocks[parseInt(current_active) - 1].focus();
		}
		else {
			blocks[parseInt(current_active) + (FIELD - 1)].focus();
		}
	}
	else if (e.keyCode == 39) {
		if (!isRightEdge) {
			blocks[parseInt(current_active) + 1].focus();
		}
		else {
			blocks[parseInt(current_active) - (FIELD - 1)].focus();
		}
	}
}