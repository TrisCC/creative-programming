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

  drawTree(0, 0, height / 4, layersTotal);
}

function draw() {
  // background(0);
}

function drawTree(x, y, len, layers) {
  // Exit condition
  if (layers == 0 || len < 2) {
    return;
  }

  // Set color
  strokeWeight(2);
  fill(0);
  let strokeColor = lerpColor(
    color(45, 110, 25),
    color(135, 85, 10),
    layers / layersTotal
  );
  stroke(strokeColor);

  // Determine if trunk or branches need to be drawn
  if (layers > layersTotal * 0.6) {
    let angle = random(-10, 10);

    // Draw the tree
    rotate(radians(angle));
    translate(0, -2);
    push();
    ellipse(x, y, 20 * (layers / layersTotal), 10);

    // recursive call
    drawTree(x, y - 2, 50, layers - 1);
  } else {
    let angle = random(-5, 5);

    // Draw the tree
    rotate(radians(angle));
    translate(0, -2);
    push();
    ellipse(x, y, 20 * (layers / layersTotal), 10);

    // recursive call
    drawTree(x, y - 2, 50, layers - 1);
  }

  pop();
}

// Set the center coordinates when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
