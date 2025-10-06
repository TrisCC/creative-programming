/// <reference path="../libraries/p5.global-mode.d.ts" />

let centerX = 0;
let centerY = 0;

let system;
let particle;

function preload() {

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  particle = new Particle(width / 2, 20);
}

function draw() {
  background(0);
  translate(centerX, centerY);

  particle.update();
  particle.show();

  let gravity = createVector(0, 0.1);
  particle.applyForce(gravity);

  if (particle.isDead()) {
    particle = new Particle(width / 2, 50);
    console.log("Particle dead!");
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.acceleration = createVector();
    this.velocity = createVector(random(-1, 1), random(-2, 0));
    this.lifespan = 255;
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
