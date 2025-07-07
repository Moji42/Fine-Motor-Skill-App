let balloons = [];
let score = 0;
const targetScore = 10;
let gameOver = false;
let gameWon = false;
let missedBalloons = 0;

let replayButton;

// Balloon colors
const colors = [
    { name: "purple", value: [128, 0, 128] },
    { name: "green", value: [0, 255, 0] },
    { name: "yellow", value: [255, 255, 0] },
    { name: "red", value: [255, 0, 0] }
];

function setup() {
    createCanvas(800, 600);
    frameRate(30);
    setInterval(addBalloon, 1000);
    replayButton = createButton("Play Again");
    replayButton.position(width / 2 - 50, height / 2 + 50);
    replayButton.mousePressed(resetGame);
    replayButton.hide(); // Hide until game ends
}

function draw() {
    background(135, 206, 235);

    if (gameOver) {
        drawGameOverScreen();
        return;
    }

    drawGame();
}

function drawGame() {
    textAlign(LEFT, TOP); // Reset alignment for normal score display

    for (let i = balloons.length - 1; i >= 0; i--) {
        let balloon = balloons[i];
        balloon.update();
        balloon.display();

        if (balloon.alive && balloon.y + balloon.radius < 0) {
            missedBalloons++;
            balloon.alive = false;
            if (missedBalloons >= 3) {
                gameOver = true;
                gameWon = false;
                replayButton.show();
            }
        }

        if (!balloon.alive) {
            balloons.splice(i, 1);
        }
    }

    fill(0);
    textSize(20);
    text("Score: " + score, 10, 10);
    text("Missed: " + missedBalloons, 10, 35);
}



function drawGameOverScreen() {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);

    if (gameWon) {
        text("🎉 You Win! 🎉", width / 2, height / 2 - 30);
    } else {
        text("💀 Game Over 💀", width / 2, height / 2 - 30);
    }

    textSize(20);
    text("Final Score: " + score, width / 2, height / 2);
    replayButton.show();
}

function resetGame() {
    score = 0;
    missedBalloons = 0;
    gameOver = false;
    gameWon = false;
    balloons = [];
    replayButton.hide();
    replayButton.position(width / 2 - 50, height / 2 + 50); // Reset position
}


// Balloon class
class Balloon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.alive = true;
        this.color = this.randomColor();
    }

    randomColor() {
        const randomIndex = floor(random(colors.length));
        return color(colors[randomIndex].value);
    }

    update() {
        if (this.alive) {
            this.y -= 2;
        }
    }

    display() {
        if (this.alive) {
            fill(this.color);
            ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        }
    }

    pop() {
        this.alive = false;
        score += 1;
        if (score >= targetScore) {
            gameOver = true;
            gameWon = true;
            replayButton.show();
        }
    }
}

function addBalloon() {
    if (!gameOver) {
        let x = random(20, width - 20);
        balloons.push(new Balloon(x, height));
    }
}

function mousePressed() {
    if (gameOver) return;

    for (let i = 0; i < balloons.length; i++) {
        let balloon = balloons[i];
        let d = dist(mouseX, mouseY, balloon.x, balloon.y);
        if (d < balloon.radius && balloon.alive) {
            balloon.pop();
        }
    }
}
