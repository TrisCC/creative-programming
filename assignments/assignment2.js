let centerX = 0;
let centerY = 0;
let layersTotal = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  centerX = width / 2;
  centerY = height / 2;

  translate(centerX, centerY);
  push();
}

function draw() {
  background(0);
  translate(centerX, centerY);
  drawCircles(layersTotal, color(60, 125, 40), color(150, 100, 25));
  drawCircles(layersTotal, color(150, 100, 25), color(60, 125, 40));
  noLoop();
}

function drawCircles(layer, c1, c2) {
  // Exit condition
  if (layer < 0) {
    return;
  }

  // Set color
  strokeWeight(2);
  let strokeColor = lerpColor(c1, c2, layer / layersTotal);
  fill(0, 0, 0, 0);

  stroke(strokeColor);

  ellipse(random(-12, 12), random(-5, 5), layer * 15, layer * 15);

  drawCircles(layer - random(2, 6), c1, c2);
}

// Set the center coordinates when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}

// Generate new pattern on mouse press
function mousePressed() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
