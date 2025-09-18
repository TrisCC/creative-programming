let timeVal = 0;
let centerX = 0;
let centerY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  centerX = width / 2;
  centerY = height / 2;
}

function draw() {
  background(0);
  // fill(255);
  stroke(255);
  noFill();
  let circleRadius = timeVal % (max(width, height) + 500);
  ellipse(centerX, centerY, circleRadius, circleRadius);
  timeVal += 10;
}

// Set the center coordinates when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
