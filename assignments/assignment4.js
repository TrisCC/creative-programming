/// <reference path="../libraries/p5.global-mode.d.ts" />

let system;
let emitters = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  emitters.push(new Emitter(width / 2, height / 2));
}

function draw() {
  background(255);

  for (let emitter of emitters) {
    let gravity = createVector(0, 0.1);
    emitter.applyForce(gravity);
    if (frameCount % 5 === 0) {
      emitter.addParticle();
    }
    emitter.run();
  }
}

class Emitter {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.particles = [];
  }

  addParticle() {
    this.particles.push(new Particle(this.origin.x, this.origin.y));
  }

  applyForce(force) {
    for (let particle of this.particles) {
      particle.applyForce(force);
    }
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i];
      particle.run();
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.acceleration = createVector();
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.lifespan = 255;
  }

  run() {
    this.update();
    this.show();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 2;
  }

  show() {
    stroke(0, this.lifespan);
    strokeWeight(2);
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

function mousePressed() {
  emitters.push(new Emitter(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
