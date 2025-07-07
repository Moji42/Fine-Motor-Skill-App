let shapes = [];
let holes = [];
let draggedShape = null;
let startTime, elapsedTime;
let gameCompleted = false;

let ding;
let wrong;

function setup() {
  createCanvas(500, 500);
  resetGame();
}

function preload() {
  ding = loadSound('ding.wav'); // Ensure the correct path to the sound file
  wrong = loadSound('wrong.wav'); // Ensure the correct path to the sound file
}

function draw() {
  background(155, 216, 255);
  displayTimer();

  // Draw the holes
  for (let hole of holes) {
    noStroke();
    fill(hole.color);

    if (hole.shape === 'circle') {
      ellipse(hole.x, hole.y, 60);
    } else if (hole.shape === 'square') {
      rect(hole.x - 30, hole.y - 30, 60, 60);
    } else if (hole.shape === 'triangle') {
      triangle(hole.x, hole.y, hole.x + 30, hole.y - 50, hole.x + 60, hole.y);
    } else if (hole.shape === 'rect') {
      rect(hole.x - 30, hole.y - 15, 60, 30);
    } else if (hole.shape === 'pentagon') {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 5) {
        let sx = hole.x + cos(a) * 30;
        let sy = hole.y + sin(a) * 30;
        vertex(sx, sy);
      }
      endShape(CLOSE);
    } else if (hole.shape === 'hexagon') {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
        let sx = hole.x + cos(a) * 30;
        let sy = hole.y + sin(a) * 30;
        vertex(sx, sy);
      }
      endShape(CLOSE);
    } else if (hole.shape === 'star') {
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 5) {
        let r = (a % (PI / 2.5) === 0) ? 30 : 15;
        let sx = hole.x + cos(a) * r;
        let sy = hole.y + sin(a) * r;
        vertex(sx, sy);
      }
      endShape(CLOSE);
    } else if (hole.shape === 'oval') {
      ellipse(hole.x, hole.y, 60, 30);
    }
  }

  // Draw the shapes (blocks)
  for (let shape of shapes) {
    fill(shape.color);
    stroke(255);

    if (shape.shape === 'circle') {
      ellipse(shape.x, shape.y, 50);
    } else if (shape.shape === 'square') {
      rect(shape.x - 25, shape.y - 25, 50, 50);
    } else if (shape.shape === 'triangle') {
      triangle(shape.x, shape.y, shape.x + 30, shape.y - 50, shape.x + 60, shape.y);
    } else if (shape.shape === 'rect') {
      rect(shape.x - 30, shape.y - 15, 60, 30);
    } else if (shape.shape === 'pentagon') {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 5) {
        let sx = shape.x + cos(a) * 25;
        let sy = shape.y + sin(a) * 25;
        vertex(sx, sy);
      }
      endShape(CLOSE);
    } else if (shape.shape === 'hexagon') {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
        let sx = shape.x + cos(a) * 25;
        let sy = shape.y + sin(a) * 25;
        vertex(sx, sy);
      }
      endShape(CLOSE);
    } else if (shape.shape === 'star') {
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 5) {
        let r = (a % (PI / 2.5) === 0) ? 25 : 12;
        let sx = shape.x + cos(a) * r;
        let sy = shape.y + sin(a) * r;
        vertex(sx, sy);
      }
      endShape(CLOSE);
    } else if (shape.shape === 'oval') {
      ellipse(shape.x, shape.y, 50, 25);
    }
  }

  checkCompletion();
}

function displayTimer() {
  if (!gameCompleted) {
    elapsedTime = millis() - startTime;
    fill(0);
    textSize(16);
    text("Time: " + (elapsedTime / 1000).toFixed(2) + "s", 10, 20);
  }
}

function mousePressed() {
  for (let shape of shapes) {
    let d = dist(mouseX, mouseY, shape.x, shape.y);
    if (d < 30) {
      shape.dragging = true;
      shape.offsetX = mouseX - shape.x;
      shape.offsetY = mouseY - shape.y;
      draggedShape = shape;
      break;
    }
  }
}

function mouseDragged() {
  if (draggedShape) {
    draggedShape.x = mouseX - draggedShape.offsetX;
    draggedShape.y = mouseY - draggedShape.offsetY;
  }
}

function mouseReleased() {
  if (draggedShape) {
    let correctHole = holes.find(
      hole => hole.shape === draggedShape.shape && dist(hole.x, hole.y, draggedShape.x, draggedShape.y) < 30
    );

    if (correctHole) {
      // If the dragged shape is correctly placed
      draggedShape.x = correctHole.x;
      draggedShape.y = correctHole.y;
      ding.play(); // Play correct placement sound
    } else {
      // If the dragged shape is not correctly placed
      draggedShape.x = shapes[shapes.indexOf(draggedShape)].initialX;
      draggedShape.y = shapes[shapes.indexOf(draggedShape)].initialY;
      wrong.play(); // Play incorrect placement sound
    }

    draggedShape.dragging = false;
    draggedShape = null;
  }
}

function checkCompletion() {
  gameCompleted = shapes.every(shape => {
    let hole = holes.find(h => h.shape === shape.shape);
    return dist(shape.x, shape.y, hole.x, hole.y) < 5;
  });

  if (gameCompleted) {
    noLoop(); // Stop the draw loop
    console.log("Game completed in " + (elapsedTime / 1000).toFixed(2) + " seconds!");
  }
}

function resetGame() {
  shapes = [
    { x: random(50, 150), y: random(50, 150), color: [255, 0, 0], shape: 'circle', dragging: false, offsetX: 0, offsetY: 0 },
    { x: random(50, 150), y: random(150, 250), color: [0, 255, 0], shape: 'square', dragging: false, offsetX: 0, offsetY: 0 },
    { x: random(50, 150), y: random(250, 350), color: [0, 0, 255], shape: 'triangle', dragging: false, offsetX: 0, offsetY: 0 },
    { x: random(50, 150), y: random(350, 450), color: [255, 255, 0], shape: 'rect', dragging: false, offsetX: 0, offsetY: 0 },
    { x: random(150, 250), y: random(50, 150), color: [255, 0, 255], shape: 'pentagon', dragging: false, offsetX: 0, offsetY: 0 },
    { x: random(150, 250), y: random(150, 250), color: [0, 255, 255], shape: 'hexagon', dragging: false, offsetX: 0, offsetY: 0 },
    { x: random(150, 250), y: random(250, 350), color: [255, 165, 0], shape: 'star', dragging: false, offsetX: 0, offsetY: 0 },
    { x: random(150, 250), y: random(350, 450), color: [128, 0, 128], shape: 'oval', dragging: false, offsetX: 0, offsetY: 0 }
  ];

  holes = [
    { x: random(300, 400), y: random(50, 150), color: [0, 0, 0], shape: 'circle' },
    { x: random(300, 400), y: random(150, 250), color: [0, 0, 0], shape: 'square' },
    { x: random(300, 400), y: random(250, 350), color: [0, 0, 0], shape: 'triangle' },
    { x: random(300, 400), y: random(350, 450), color: [0, 0, 0], shape: 'rect' },
    { x: random(400, 500), y: random(50, 150), color: [0, 0, 0], shape: 'pentagon' },
    { x: random(400, 500), y: random(150, 250), color: [0, 0, 0], shape: 'hexagon' },
    { x: random(400, 500), y: random(250, 350), color: [0, 0, 0], shape: 'star' },
    { x: random(400, 500), y: random(350, 450), color: [0, 0, 0], shape: 'oval' }
  ];

  startTime = millis();
  loop(); // Restart the draw loop
}
