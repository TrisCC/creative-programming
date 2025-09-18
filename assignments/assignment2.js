let timeVal = 0;
let centerX = 0;
let centerY = 0;
let recursionDepth = 4;
let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  centerX = width / 2;
  centerY = height / 2;
  rings.push(new Ring(centerX, centerY, 0));
  rings.push(new Ring(centerX, centerY, 600));
}

function draw() {
  background(0);
  rings.forEach((ring) => {
    ring.update();
    ring.draw();
  });
}

// Set the center coordinates when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;

  // Update ring positions
  rings.forEach((ring) => {
    ring.x = centerX;
    ring.y = centerY;
  });
}

class Ring {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  update() {
    this.radius += 1;
    if (this.radius > 1200) {
      this.radius = 0;
    }
  }

  draw() {
    stroke(255);
    strokeWeight(4);
    noFill();
    circle(this.x, this.y, this.radius);
  }
}
