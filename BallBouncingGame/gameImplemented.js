/*Vars Used to manipulate ball's position
 */

//X cooridnate of the Ball

let xCord = 200;

//Y cooridnate of the Ball
let yCord = 50;

//Vertical and Horizontal speed of the ball

let ySpeed = 4;
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
let currLvl = 1;

//Stores the current Y Speed
let ySpeedBarrier = ySpeed;

//Game Screen Vars:

let startButton = false;
let gameOver = false;
let gameWin = false;
let barrier = 5;

let ballHit;
let gameOverSound;
let gameWinSound;

let overSoundPlayed = false;
let winSoundPlayed = false; 

function preload() {
  ballHit = loadSound("Sounds/beepnegative.mp3");
  gameOverSound = loadSound("Sounds/Lost Sound.mp3");
  gameWinSound = loadSound("Sounds/Win sound.wav");
  //gameWinSound = loadSound("Sounds/Black Dynamite Ahhh Suey.mp3");
 
}

function setup() {
  createCanvas(400, 400);
  colorOfBall = color(0, 255, 0);
  
}

function draw() {
  background(220);
    print("YSPEED: " +ySpeed+ "\n") ;
    print("BARRIER: " +ySpeedBarrier+ "\n") ;
    
  if (gameOver) {
    endScreen();
    pressedKey();
  }else if (gameWin){
    winScreen();
  } else if (startButton) {
    gameStart();
    pressedKey();
  } else {
    startScreen();
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

  if (xCord + ballRadius > width || xCord - ballRadius < 0) {
    xSpeed *= -1;
  }

  if(yCord + ballRadius > height || yCord - ballRadius < 0){
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
        ySpeed *= -1.01;
        numOfHits++;
        //Changes the color of the ball on impact
        colorOfBall = color(random(255), random(255), random(255));
        ballHit.play();
      }
    }
  }
  
  //Stops the game after the user hits the barrier:
  if (numOfHits >= barrier){
    gameWin = true;
  }
  
  if (yCord + ballRadius >= height){
    gameOver = true;
  }

  

  //Rectangles to trap the ball

  rect(5, 5, 380, 15);
  rect(5, 5, 15, 350);
  rect(380, 5, 15, 350);

  //Top and Bottom Bound checks

  if (yCord - ballRadius <= 15) {
    ySpeed *= -1;
     colorOfBall = color(random(255), random(255), random(255));
        ballHit.play();
  }

  if (yCord + ballRadius >= 385) {
    ySpeed *= -1;
    colorOfBall = color(random(255), random(255), random(255));
    ballHit.play();
  }

  //Left and Right Bound Checks
  if (xCord - ballRadius <= 15) {
    xSpeed *= -1;
    colorOfBall = color(random(255), random(255), random(255));
    ballHit.play();
  }

  if (xCord + ballRadius >= 385) {
    xSpeed *= -1;
    colorOfBall = color(random(255), random(255), random(255));
    ballHit.play();
  }

  textSize(32);
  text(numOfHits, width / 2, height / 2);

  if (yCord + ballRadius >= 385) {
    gameOver = true;
  }
}

function startScreen() {
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Press 'A' to start game!", width / 2, height / 2);
  

  textSize(10);
  text(
    "Use arrow keys to maniuplate the paddle, press 'X' to reset",
    width / 2,
    height / 1.5
  );
  if(key == "A" || key == "a"){
    startButton = true;
  }
}

function pressedKey() {
  
  if (key == "X" || key == "x") {
    
    gameReset();
  }
  
  if ((key == "Q" || key == "q") && gameWin) {
    ySpeedBarrier = ySpeed;
      //Resets states:
       numOfHits = 0;
      gameWin = false;
      //Starts the game again:
      gameStart();
  }
  
  
}

function endScreen() {
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Game Over. Thanks for playing!",width / 2, height / 2)
  text("Total Hits " + numOfHits, width / 2 , height / 2 + 30);
  text("Press 'X' to Reset", width / 2 , height / 2 + 60);
  
  text("Current Level: " + currLvl, width / 2 , height / 2 + 90);

  if (!overSoundPlayed){
    gameOverSound.play();
    overSoundPlayed = true;
  }

  if(key == "X" || key =="x"){
    gameReset();
  }
}


//Calls a win screen:
function winScreen(){

  
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Congrats, you passed level: " + currLvl, width / 2, height / 2);
  
  text("Press Q to Continue!", width / 2, height / 2 + 30);

  text("Press 'X' to Reset", width / 2, height / 2 + 60);
  
  if (!winSoundPlayed){
    gameWinSound.play();
    winSoundPlayed = true;
  }


  if (key == "Q" || key == "q"){
    barrier += 5;
    currLvl++;
    ySpeedBarrier = ySpeed;
    gameReset();
  }
  
   if (key == "X" || key == "x"){
    gameReset();
  }

   }
  
  function gameReset(){
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
  





