const grid = document.querySelector('.grid');
const miniGrid = document.querySelector('.mini-grid');
const gameEnd = document.querySelector('.game-over');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('btn-start');
const width = 10;
let nextRandom = 0;
let timerID = null;
let score = 0;

const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const tetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentPosition = 3;
let currentRotation = 0;

let random = Math.floor(Math.random() * tetrominos.length);
let current = tetrominos[random][currentRotation];

function makeGrid(rows, cols, element, className) {
  for (let c = 0; c < rows * cols; c++) {
    let cell = document.createElement('div');

    element.appendChild(cell).className = className;
  }
}

makeGrid(10, 20, grid, 'grid-item');
makeGrid(1, 10, grid, 'taken');
makeGrid(4, 4, miniGrid, 'miniGrid-item');

let squares = Array.from(document.querySelectorAll('.grid div'));

//draw tetromino
function draw() {
  current.forEach((index) =>
    squares[currentPosition + index].classList.add('tetromino')
  );
}

//undraw tetromino
function undraw() {
  current.forEach((index) =>
    squares[currentPosition + index].classList.remove('tetromino')
  );
}

//assign functions to keyCodes
function control(e) {
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}

document.addEventListener('keyup', control);

function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains('taken')
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add('taken')
    );
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * tetrominos.length);
    current = tetrominos[random][currentRotation];
    currentPosition = 3;
    draw();
    displayShape();
    addScore();
    gameOver();
  }
}

//move the tetromino to left, unless is at the edge or there is a blockage
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );

  if (!isAtLeftEdge) currentPosition -= 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains('taken')
    )
  ) {
    currentPosition += 1;
  }

  draw();
}

//move the tetromino to right, unless is at the edge or there is a blockage
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );

  if (!isAtRightEdge) currentPosition += 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains('taken')
    )
  ) {
    currentPosition -= 1;
  }

  draw();
}

//rotate tetromino
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) currentRotation = 0;
  current = tetrominos[random][currentRotation];
  draw();
}

//dispalay Next tetromino in mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

const nextTetromino = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
  [0, 1, displayWidth, displayWidth + 1], //oTetromino
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
];

function displayShape() {
  displaySquares.forEach((square) => square.classList.remove('tetromino'));
  nextTetromino[nextRandom].forEach((index) =>
    displaySquares[displayIndex + index].classList.add('tetromino')
  );
}

//add start button funcionality
startBtn.addEventListener('click', () => {
  if (timerID) {
    clearInterval(timerID);
    timerID = null;
  } else {
    draw();
    timerID = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * tetrominos.length);
    displayShape();
  }
});

//add score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains('taken'))) {
      score += 10;
      scoreDisplay.innerText = score;
      row.forEach((index) => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('tetromino');
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
}

//game over
function gameOver() {
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains('taken')
    )
  ) {
    gameEnd.innerHTML = `<h1>Game Over</h1> <button onClick="window.location.reload();">Reload</button>`;
    clearInterval(timerID);
  }
}
