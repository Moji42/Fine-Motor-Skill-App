let balloons = [];
let score = 0;
const targetScore = 10; // Target score to win
let gameOver = false;
let missedBalloons = 0; // Count of missed balloons

// Define an array of colors
const colors = [
    { name: "purple", value: [128, 0, 128] },
    { name: "green", value: [0, 255, 0] },
    { name: "yellow", value: [255, 255, 0] },
    { name: "red", value: [255, 0, 0] }
];

function setup() {
    createCanvas(800, 600);
    frameRate(30);
    setInterval(addBalloon, 1000); // Add a balloon every second
}

function draw() {
    background(135, 206, 235); // Sky blue background

    if (gameOver) {
        fill(0);
        textSize(32);
        text("Game Over!", width / 2 - 80, height / 2);
        textSize(20);
        text("Final Score: " + score, width / 2 - 60, height / 2 + 30);
        return;
    }

    // Update and display balloons
    for (let i = balloons.length - 1; i >= 0; i--) {
        let balloon = balloons[i];
        balloon.update();
        balloon.display();

        // Check if balloon has missed (if it goes below the canvas)
        if (balloon.alive && balloon.y - balloon.radius > height) {
            missedBalloons++;
            balloon.alive = false; // Mark balloon as not alive after missing
            if (missedBalloons >= 3) {
                gameOver = true; // End game if 3 balloons are missed
            }
        }

        // Remove popped balloons
        if (!balloon.alive) {
            balloons.splice(i, 1);
        }
    }

    // Display score and missed balloons
    fill(0);
    textSize(20);
    text("Score: " + score, 10, 30);
    text("Missed: " + missedBalloons, 10, 50); // Display missed balloons
}

// Balloon class
class Balloon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.alive = true;
        this.color = this.randomColor(); // Assign a random color from the defined array
    }

    randomColor() {
        // Randomly select a color from the colors array
        const randomIndex = floor(random(colors.length));
        return color(colors[randomIndex].value);
    }

    update() {
        if (this.alive) {
            this.y -= 2; // Move balloon up
            // No need to set alive to false here, check in draw
        }
    }

    display() {
        if (this.alive) {
            fill(this.color); // Use the balloon's assigned color
            ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        }
    }

    pop() {
        this.alive = false; // Mark balloon as popped
        score += 1; // Increase score
        if (score >= targetScore) {
            gameOver = true; // End game when target score is reached
        }
    }
}

// Add a new balloon
function addBalloon() {
    let x = random(20, width - 20); // Random x position
    let balloon = new Balloon(x, height);
    balloons.push(balloon);
}

// Handle mouse clicks
function mousePressed() {
    for (let i = 0; i < balloons.length; i++) {
        let balloon = balloons[i];
        let d = dist(mouseX, mouseY, balloon.x, balloon.y);
        if (d < balloon.radius && balloon.alive) {
            balloon.pop(); // Pop the balloon
        }
    }
}
