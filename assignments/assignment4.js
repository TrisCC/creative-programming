/// <reference path="../libraries/p5.global-mode.d.ts" />

let system;
let emitters = [];
let planets = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // Initialize basic objects
  emitters.push(new Emitter(width / 2 - 300, height / 2));
  emitters.push(new Emitter(width / 2 + 300, height / 2));
  planets.push(new Planet(width / 2 - 50, height / 2 - 100, 30));
  planets.push(new Planet(width / 2 + 50, height / 2 + 100, 30));
}

function draw() {
  background(0);

  // Emitter loop
  for (let emitter of emitters) {
    if (frameCount % 20 === 0) {
      emitter.addParticle();
    }
    emitter.run();
  }

  // Planet loop
  for (let planet of planets) {
    planet.run();
  }
}

class Emitter {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.particles = [];
  }

  run() {
    this.show();
    this.update();
  }

  addParticle() {
    this.particles.push(new Particle(this.origin.x, this.origin.y));
  }

  show() {
    fill(255, 255, 0);
    noStroke();
    circle(this.origin.x, this.origin.y, 8);
  }

  update() {
    // Update and remove dead particles
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
    this.show();
    this.update();
  }

  show() {
    stroke(0, this.lifespan);
    strokeWeight(2);
    fill(255, this.lifespan);
    circle(this.position.x, this.position.y, 12);
  }

  update() {
    this.applyForce();

    this.velocity.add(this.acceleration);
    // Check for collisions with planets
    for (let planet of planets) {
      if (this.checkCollision(planet)) {
        // Calculate reflection vector
        let normal = p5.Vector.sub(this.position, planet.position).normalize();
        let dot = this.velocity.dot(normal);
        let reflection = p5.Vector.sub(this.velocity, p5.Vector.mult(normal, 2 * dot));
        this.velocity = reflection;
      }
    }
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 2;
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

  checkCollision(planet) {
    let distance = p5.Vector.dist(planet.position, this.position);
    return distance < planet.radius;
  }
}

class Planet {
  constructor(x, y, mass) {
    this.position = createVector(x, y);
    this.mass = mass;
    this.radius = mass; // Simplified radius based on mass
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    // Set initial velocity
    if (this.position.y <= height / 2 - 100) {
      this.applyForce(createVector(0, 0.3));
    } else if (this.position.y >= height / 2 + 100) {
      this.applyForce(createVector(0, -0.3));
    }
  }

  attract(particle) {
    let force = p5.Vector.sub(this.position, particle.position);
    let distance = constrain(force.mag(), 5, 25);
    force.normalize();
    // Gravitational constant is 0.4 and mass is 3 (for no particular reason)
    let strength = (0.4 * this.mass * 3) / (distance * distance);
    force.mult(strength);
    return force;
  }

  run() {
    this.show();
    this.update();
  }

  show() {
    fill(51, 204, 51);
    noStroke();
    circle(this.position.x, this.position.y, this.radius * 2);
  }

  update() {
    // Move planets up and down
    if (this.position.y <= height / 2 - 100) {
      this.applyForce(createVector(0, 0.3));
    } else if (this.position.y >= height / 2 + 100) {
      this.applyForce(createVector(0, -0.3));
    } else {
      if (this.velocity.mag() > 2) {
        this.velocity.mult(1);
      } else {
        this.velocity.mult(1.05);
      }
    }

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }
}

function mousePressed() {
  // Add a new emitter at mouse position
  emitters.push(new Emitter(mouseX, mouseY));
}
