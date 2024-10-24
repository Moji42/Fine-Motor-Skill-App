/*Vars Used to manipulate ball's position
 */

//X cooridnate of the Ball

let xCord = 200;

//Y cooridnate of the Ball
let yCord = 40;

//Vertical and Horizontal speed of the ball

let ySpeed = 9;
let xSpeed = 3;

let ballRadius = 15;
let colorOfBall;

/*Vars Used in rectangle*/
let rectWidth = 50;
let rectLength = 10;

let rectCordX = 25;
let rectCordY = 300;

//Arrow Input speed

let arrowSpeed = 20;

let numOfHits = 0;

//Game Screen Vars:

let startButton = false;
let gameOver = false;

function setup() {
  createCanvas(400, 400);

  colorOfBall = color(0, 255, 0);
}

function draw() {
  background(220);

  if (gameOver) {
    endScreen();

    pressedReset();
  } else if (startButton) {
    gameStart();
    pressedReset();
  } else if (!startButton) {
    startScreen();
    pressedStart();
  }
}

function gameStart() {
  //Creates The Ball
  fill(colorOfBall);
  ellipse(xCord, yCord, 30);

  //Creates Rectangles

  /*Increments X/Y Cords by their respective speed to simulate movement*/
  xCord += xSpeed;
  yCord += ySpeed;

  //If detection is found reverse their speeds

  if (xCord > width || xCord < 0) {
    xSpeed *= -1;
  }

  if (yCord > height || yCord < 0) {
    ySpeed *= -1;
  }

  //Arrow Keys

  if (keyIsDown(LEFT_ARROW)) {
    rectCordX -= arrowSpeed;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    rectCordX += arrowSpeed;
  }

  //Creates and Keeps Paddle in Box
  rectCordX = constrain(rectCordX, 20, width - rectWidth - 20);
  rectCordY = constrain(rectCordY, 0, height - rectLength);

  rect(rectCordX, rectCordY, rectWidth, rectLength);

  //Finds if the ball collides with the rectangle

  if (yCord + 15 >= rectCordY && yCord - 15 <= rectCordY + rectLength) {
    if (xCord >= rectCordX && xCord <= rectCordX + rectWidth) {
      if (ySpeed > 0) {
        ySpeed *= -1.1;
        numOfHits++;
        //Changes the color of the ball on impact
        colorOfBall = color(random(255), random(255), random(255));
      }
    }
  }

  //Rectangles to trap the ball

  rect(5, 5, 380, 15);
  rect(5, 5, 15, 350);
  rect(380, 5, 15, 350);

  //Top and Bottom Bound checks

  if (yCord - ballRadius <= 15) {
    ySpeed *= -1;
  }

  if (yCord + ballRadius >= 385) {
    ySpeed *= -1;
  }

  //Left and Right Bound Checks
  if (xCord - ballRadius <= 15) {
    xSpeed *= -1;
  }

  if (xCord + ballRadius >= 385) {
    xSpeed *= -1;
  }

  textSize(32);
  text(numOfHits, width / 2, height / 2);

  if (yCord + ballRadius >= 385) {
    gameOver = true;
  }
}

function startScreen() {
  textSize(32);
  text("'A' Button to start game!", width / 2, height / 2);
  textAlign(CENTER, CENTER);

  textSize(10);
  text(
    "Bounce the ball on the paddle by using the left and right arrow keys, press 'X' to reset",
    width / 2,
    height / 1.5
  );
  textAlign(CENTER, CENTER);
}

function pressedStart() {
  if (key == "A" || key == "a") {
    startButton = true;
  }
}

function endScreen() {
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Game Over,Thanks for playing!", width / 2, height / 2);
  text("Total Hits " + numOfHits, width / 4, height / 4);

  text("Press 'X' to Reset", width / 3, height / 3);

  textAlign(CENTER, CENTER);
}

function gameSet() {
  //Resets Ball
  xCord = 200;
  yCord = 40;
  xSpeed = 3;
  ySpeed = 3;
  numOfHits = 0;

  //Clear Past States
  startButton = false;
  gameOver = false;
}

//Calls reset method via R

function pressedReset() {
  if (key == "X" || key == "x") {
    gameSet();
  }
}
