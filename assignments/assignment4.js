/// <reference path="../libraries/p5.global-mode.d.ts" />

let system;
let emitters = [];
let planets = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  emitters.push(new Emitter(width / 2 - 200, height / 2));
  emitters.push(new Emitter(width / 2 + 200, height / 2));
  planets.push(new Planet(width / 2 - 50, height / 2 - 100, 30));
  planets.push(new Planet(width / 2 + 50, height / 2 + 100, 30));
}

function draw() {
  background(0);

  for (let emitter of emitters) {
    if (frameCount % 20 === 0) {
      emitter.addParticle();
    }
    emitter.run();
    emitter.show();
  }

  for (let planet of planets) {
    planet.show();
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

  show() {
    fill(255, 255, 0);
    noStroke();
    circle(this.origin.x, this.origin.y, 8);
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
    this.velocity = createVector(random(-3, 3), random(-3, 3));
    this.lifespan = 800;
  }

  run() {
    this.update();
    this.show();
  }

  update() {
    this.applyForce(); // Gravity
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

  applyForce() {
    let force = createVector(0, 0);
    for (let planet of planets) {
      let planetForce = planet.attract(this);
      force.add(planetForce);
    }
    this.acceleration.add(force);
  }
}

class Planet {
  constructor(x, y, mass) {
    this.position = createVector(x, y);
    this.mass = mass;
    this.radius = mass; // Simplified radius based on mass
  }

  attract(particle) {
    let force = p5.Vector.sub(this.position, particle.position);
    let distance = constrain(force.mag(), 5, 25);
    force.normalize();
    let strength = (0.4 * this.mass * 3) / (distance * distance); // Assuming particle mass is 1
    force.mult(strength);
    return force;
  }

  show() {
    fill(100, 150, 250);
    noStroke();
    circle(this.position.x, this.position.y, this.radius * 2);
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
