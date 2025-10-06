/// <reference path="../libraries/p5.global-mode.d.ts" />

let centerX = 0;
let centerY = 0;

let system;
let particles = [];

function preload() {

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

}

function draw() {
  background(0);
  translate(centerX, centerY);

  particles.push(new Particle(width / 2, height / 2));

  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.run();

    if (particle.isDead()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.acceleration = createVector();
    this.velocity = createVector(random(-1, 1), random(-2, 0));
    this.lifespan = 255;
  }

  run() {
    this.update();
    this.show();

    let gravity = createVector(0, 0.1);
    this.applyForce(gravity);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 2;
  }

  show() {
    stroke(0, this.lifespan);
    fill(255, this.lifespan);
    circle(this.position.x, this.position.y, 8);
  }

  isDead() {
    return this.lifespan < 0;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }
}


// Set the center coordinates when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
