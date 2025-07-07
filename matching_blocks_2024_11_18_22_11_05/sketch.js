let shapes = [];
let holes = [];
let draggedShape = null;
let startTime;
let gameCompleted = false;
let ding, wrong;
let newGameButton;

function preload() {
  ding = loadSound('ding.wav');
  wrong = loadSound('wrong.wav');
}

function setup() {
  createCanvas(700, 700);
  newGameButton = createButton("🔁 New Game");
  newGameButton.position(640, height - 400); // Move closer to bottom edge of canvas
  newGameButton.mousePressed(resetGame);
  // newGameButton.hide();
  resetGame();
}


function draw() {
  background(200, 240, 255);
  displayTimer();

  for (let hole of holes) drawHole(hole);
  for (let shape of shapes) drawShape(shape);

  checkCompletion();
}

function drawHole(hole) {
  noStroke();
  fill(50);
  drawShapeByType(hole.x, hole.y, hole.shape, 30, true);
}

function drawShape(shape) {
  fill(shape.color);
  stroke(255);
  drawShapeByType(shape.x, shape.y, shape.shape, 25, false);
}

function drawShapeByType(x, y, type, size, isHole) {
  switch (type) {
    case 'circle':
      ellipse(x, y, size * 2);
      break;
    case 'square':
      rect(x - size, y - size, size * 2, size * 2);
      break;
    case 'triangle':
      triangle(x - size, y + size, x, y - size, x + size, y + size);
      break;
    case 'rect':
      rect(x - size, y - size / 2, size * 2, size);
      break;
    case 'pentagon':
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angle = TWO_PI / 5 * i - PI / 2;
        vertex(x + cos(angle) * size, y + sin(angle) * size);
      }
      endShape(CLOSE);
      break;
    case 'hexagon':
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i - PI / 2;
        vertex(x + cos(angle) * size, y + sin(angle) * size);
      }
      endShape(CLOSE);
      break;
    case 'star':
      beginShape();
      for (let i = 0; i < 10; i++) {
        let angle = PI / 5 * i;
        let r = i % 2 === 0 ? size : size / 2;
        vertex(x + cos(angle) * r, y + sin(angle) * r);
      }
      endShape(CLOSE);
      break;
    case 'oval':
      ellipse(x, y, size * 2, size);
      break;
  }
}

function isMouseOverShape(shape) {
  switch (shape.shape) {
    case 'triangle':
      return collidePointTriangle(mouseX, mouseY,
        shape.x - 25, shape.y + 25,
        shape.x, shape.y - 25,
        shape.x + 25, shape.y + 25);
    case 'square':
    case 'rect':
      return (mouseX >= shape.x - 30 && mouseX <= shape.x + 30 &&
              mouseY >= shape.y - 30 && mouseY <= shape.y + 30);
    default:
      return dist(mouseX, mouseY, shape.x, shape.y) < 30;
  }
}

function mousePressed() {
  for (let shape of shapes) {
    if (isMouseOverShape(shape)) {
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
    let match = holes.find(hole =>
      hole.shape === draggedShape.shape &&
      dist(hole.x, hole.y, draggedShape.x, draggedShape.y) < 35
    );

    if (match) {
      draggedShape.x = match.x;
      draggedShape.y = match.y;
      ding.play();
    } else {
      draggedShape.x = draggedShape.initialX;
      draggedShape.y = draggedShape.initialY;
      wrong.play();
    }

    draggedShape.dragging = false;
    draggedShape = null;
  }
}

function displayTimer() {
  if (!gameCompleted) {
    let elapsed = (millis() - startTime) / 1000;
    fill(0);
    textSize(16);
    text(`Time: ${elapsed.toFixed(2)}s`, 10, 20);
  } else {
    textSize(32);
    fill(0, 150, 0);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2);
  }
}

function checkCompletion() {
  gameCompleted = shapes.every(shape => {
    let hole = holes.find(h => h.shape === shape.shape);
    return dist(shape.x, shape.y, hole.x, hole.y) < 5;
  });

  if (gameCompleted) {
    noLoop();
    newGameButton.show(); // Show button after winning
  }
}

function resetGame() {
  let usedPositions = [];

  const getRandomPosition = () => {
    let x, y, tooClose;
    do {
      x = random(100, width - 100);
      y = random(100, height - 100);
      tooClose = usedPositions.some(pos => dist(pos.x, pos.y, x, y) < 80);
    } while (tooClose);
    usedPositions.push({ x, y });
    return { x, y };
  };

  const shapeList = [
    { shape: 'circle', color: [255, 0, 0] },
    { shape: 'square', color: [0, 255, 0] },
    { shape: 'triangle', color: [0, 0, 255] },
    { shape: 'rect', color: [255, 255, 0] },
    { shape: 'pentagon', color: [255, 0, 255] },
    { shape: 'hexagon', color: [0, 255, 255] },
    { shape: 'star', color: [255, 165, 0] },
    { shape: 'oval', color: [128, 0, 128] }
  ];

  shapes = [];
  holes = [];

  for (let s of shapeList) {
    let shapePos = getRandomPosition();
    let holePos = getRandomPosition();

    shapes.push(makeShape(shapePos.x, shapePos.y, s.shape, s.color));
    holes.push(makeHole(holePos.x, holePos.y, s.shape));
  }

  startTime = millis();
  gameCompleted = false;
  // newGameButton.hide(); // Hide button on restart
  loop();
}

function makeShape(x, y, shape, color) {
  return { x, y, initialX: x, initialY: y, shape, color, dragging: false, offsetX: 0, offsetY: 0 };
}

function makeHole(x, y, shape) {
  return { x, y, shape };
}

function collidePointTriangle(px, py, x1, y1, x2, y2, x3, y3) {
  let areaOrig = abs((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1));
  let area1 = abs((x1 - px)*(y2 - py) - (x2 - px)*(y1 - py));
  let area2 = abs((x2 - px)*(y3 - py) - (x3 - px)*(y2 - py));
  let area3 = abs((x3 - px)*(y1 - py) - (x1 - px)*(y3 - py));
  return (area1 + area2 + area3) === areaOrig;
}
