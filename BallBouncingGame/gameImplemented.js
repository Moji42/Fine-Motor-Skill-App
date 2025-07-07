let xCord = 200;
let yCord = 50;
let ySpeed = 4;
let xSpeed = 3;
let ballRadius = 15;
let colorOfBall;

let rectWidth = 50;
let rectLength = 10;
let rectCordX = 25;
let rectCordY = 450;

let arrowSpeed = 20;
let numOfHits = 0;
let currLvl = 1;
let ySpeedBarrier = ySpeed;

let startButton = false;
let gameOver = false;
let gameWin = false;
let barrier = 5;

let ballHit, gameOverSound, gameWinSound;
let overSoundPlayed = false;
let winSoundPlayed = false;

function preload() {
  ballHit = loadSound("Sounds/beepnegative.mp3");
  gameOverSound = loadSound("Sounds/Lost Sound.mp3");
  gameWinSound = loadSound("Sounds/Win sound.wav");
}

function setup() {
  createCanvas(500, 500);
  colorOfBall = color(0, 255, 0);
}

function draw() {
  background(220);

  if (gameOver) {
    endScreen();
    pressedKey();
  } else if (gameWin) {
    winScreen();
  } else if (startButton) {
    gameStart();
    pressedKey();
  } else {
    startScreen();
  }
}

function gameStart() {
  fill(colorOfBall);
  ellipse(xCord, yCord, ballRadius * 2);

  xCord += xSpeed;
  yCord += ySpeed;

  // Border collisions
  if (xCord + ballRadius > width - 15 || xCord - ballRadius < 15) {
    xSpeed *= -1;
    colorOfBall = color(random(255), random(255), random(255));
    ballHit.play();
  }

  if (yCord - ballRadius < 15) {
    ySpeed *= -1;
    colorOfBall = color(random(255), random(255), random(255));
    ballHit.play();
  }

  if (yCord + ballRadius > height - 15) {
    ySpeed *= -1;
    gameOver = true;
    gameOverSound.play();
  }

  // Paddle controls
  if (keyIsDown(LEFT_ARROW)) rectCordX -= arrowSpeed;
  if (keyIsDown(RIGHT_ARROW)) rectCordX += arrowSpeed;

  rectCordX = constrain(rectCordX, 15, width - rectWidth - 15);
  rect(rectCordX, rectCordY, rectWidth, rectLength);

  // Ball-paddle collision
  if (
    yCord + ballRadius >= rectCordY &&
    yCord - ballRadius <= rectCordY + rectLength &&
    xCord >= rectCordX &&
    xCord <= rectCordX + rectWidth &&
    ySpeed > 0
  ) {
    ySpeed *= -1.01;
    numOfHits++;
    colorOfBall = color(random(255), random(255), random(255));
    ballHit.play();
  }

  // Win check
  if (numOfHits >= barrier) {
    gameWin = true;
    gameWinSound.play();
  }

  // Walls
  fill(100);
  rect(5, 5, width - 10, 15); // Top
  rect(5, 5, 15, height - 10); // Left
  rect(width - 20, 5, 15, height - 10); // Right

  // Score display
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Hits: " + numOfHits, width / 2, 30);
}

function startScreen() {
  textSize(28);
  textAlign(CENTER, CENTER);
  text("Press 'A' to Start", width / 2, height / 2 - 20);
  textSize(16);
  text("Use arrow keys to move paddle | 'X' to reset", width / 2, height / 2 + 20);

  if (keyIsDown(65)) {
    startButton = true;
  }
}

function endScreen() {
  textSize(22);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 2 - 20);
  text("Hits: " + numOfHits, width / 2, height / 2 + 10);
  text("Press 'X' to Reset", width / 2, height / 2 + 40);

  if (!overSoundPlayed) {
    gameOverSound.play();
    overSoundPlayed = true;
  }

  if (keyIsDown(88)) {
    gameReset();
  }
}

function winScreen() {
  textSize(22);
  textAlign(CENTER, CENTER);
  text("You Win Level " + currLvl + "!", width / 2, height / 2 - 20);
  text("Press 'Q' to Continue or 'X' to Reset", width / 2, height / 2 + 20);

  if (!winSoundPlayed) {
    gameWinSound.play();
    winSoundPlayed = true;
  }

  if (keyIsDown(81)) {
    barrier += 5;
    currLvl++;
    ySpeedBarrier = ySpeed;
    gameReset();
  }

  if (keyIsDown(88)) {
    gameReset();
  }
}

function pressedKey() {
  if (keyIsDown(88)) gameReset();
  if (keyIsDown(81) && gameWin) {
    ySpeedBarrier = ySpeed;
    numOfHits = 0;
    gameWin = false;
    gameStart();
  }
}

function gameReset() {
  xCord = 200;
  yCord = 50;
  xSpeed = 3;
  ySpeed = ySpeedBarrier;
  numOfHits = 0;
  startButton = false;
  gameOver = false;
  gameWin = false;
  overSoundPlayed = false;
  winSoundPlayed = false;
}
