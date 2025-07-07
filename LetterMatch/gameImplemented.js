let lowercaseLetters = [];
let uppercaseTargets = [];
let dragging = null;
let offsetX = 0, offsetY = 0;
let matched = 0;
let ding;

function preload() {
  ding = loadSound('sounds/ding.wav');
}

function setup() {
  createCanvas(800, 600);
  textSize(32);
  resetGame();
}

function resetGame() {
  matched = 0;
  lowercaseLetters = [];
  uppercaseTargets = [];

  let allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let selected = shuffle(allLetters).slice(0, 7);

  // Uppercase Targets (fixed row at top)
  for (let i = 0; i < selected.length; i++) {
    uppercaseTargets.push({
      letter: selected[i].toUpperCase(),
      x: 100 + i * 90,
      y: 100,
      matched: false
    });
  }

  // Lowercase Draggables (random X positions, fixed Y)
  let xPositions = shuffle([100, 190, 280, 370, 460, 550, 640]);
  for (let i = 0; i < selected.length; i++) {
    lowercaseLetters.push({
      letter: selected[i],
      x: xPositions[i],
      y: 400,
      matched: false,
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function draw() {
  background(230, 245, 255);

  // Draw uppercase targets
  for (let t of uppercaseTargets) {
    fill(t.matched ? 'lightgreen' : '#fff');
    stroke(50);
    rect(t.x, t.y, 50, 50, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(t.letter, t.x + 25, t.y + 25);
  }

  // Draw lowercase draggables
  for (let l of lowercaseLetters) {
    if (!l.matched || l === dragging) {
      fill(l.color);
      stroke(255);
      rect(l.x, l.y, 50, 50, 8);
      fill(0);
      textAlign(CENTER, CENTER);
      text(l.letter, l.x + 25, l.y + 25);
    }
  }

  // Success Message
  if (matched === 7) {
    fill('green');
    textSize(40);
    text("Great job! All matched!", width / 2, height / 2);
    textSize(32);
  }
}

function mousePressed() {
  for (let l of lowercaseLetters) {
    if (!l.matched && mouseX > l.x && mouseX < l.x + 50 && mouseY > l.y && mouseY < l.y + 50) {
      dragging = l;
      offsetX = mouseX - l.x;
      offsetY = mouseY - l.y;
      break;
    }
  }
}

function mouseDragged() {
  if (dragging) {
    dragging.x = mouseX - offsetX;
    dragging.y = mouseY - offsetY;
  }
}

function mouseReleased() {
  if (dragging) {
    for (let t of uppercaseTargets) {
      if (!t.matched && dist(dragging.x + 25, dragging.y + 25, t.x + 25, t.y + 25) < 40) {
        if (dragging.letter.toUpperCase() === t.letter) {
          dragging.x = t.x;
          dragging.y = t.y;
          dragging.matched = true;
          t.matched = true;
          matched++;
          ding.play();
        }
        break;
      }
    }
  }
  dragging = null;
}
