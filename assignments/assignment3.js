let centerX = 0;
let centerY = 0;

function preload() {
  atmaFont = loadFont("Atma-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  centerX = width / 2;
  centerY = height / 2;
  textFont(atmaFont);
}

function draw() {
  background(0);
  translate(centerX, centerY);
  drawRays();
  drawSun();
}

function drawSun() {
  fill(0);
  strokeWeight(8);
  stroke('orange');
  circle(0, 0, 80);
  for (i = 0; i < 4; i++) {
    push();
    translate(40, 0);
    line(0, 0, 40, 0);
    pop();
    rotate(HALF_PI);
  }
}

function drawRays(rays = 24, layers = 8) {
  fill(255);
  strokeWeight(1);
  stroke("yellow");
  textSize(22);
  for (j = 0; j < layers; j++) {
    for (i = 0; i < rays; i++) {
      push();
      let x = Cubic.easeOut(frameCount % 500, 500)
      translate(((frameCount + 100 * j) % 800) * x, 0);
      text("light", 0, 0);
      pop();
      rotate((2 * PI / rays));
    }
  }
}

// Set the center coordinates when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
