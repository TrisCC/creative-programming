let font;
let particles = [];
let msg = "KINETIC";
let fontSize = 200;

// Tweakpane variables
let pane;
let params = {
  message: msg,
};

function preload() {
  font = loadFont("./assets/BebasNeue-regular.ttf");
}

function setup() {
  // Setup Tweakpane
  const PaneCtor = globalThis?.Tweakpane?.Pane ?? globalThis?.Pane ?? null;
  if (PaneCtor) {
    // Initialize pane
    pane = new PaneCtor();

    // Add message input
    pane.addInput(params, "message").on("change", (ev) => {
      msg = ev.value;
      regenerateParticles();
    });

    // Fix top-left placement
    const el = pane.element ?? pane.view?.element ?? null;
    if (el) {
      el.style.position = "fixed";
      el.style.left = "8px";
      el.style.top = "8px";
    }
  } else {
    console.warn("Tweakpane is not available.");
    return;
  }

  createCanvas(windowWidth, windowHeight);
  regenerateParticles();
}

function regenerateParticles() {
  particles = []; // Clear existing particles

  // 1. Compute the bounding box to center the text
  let bounds = font.textBounds(msg, 0, 0, fontSize);

  const padding = 80; // Space between text repetitions

  // Loop to create a grid of text particles
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      const isCenter = x === 0 && y === 0;
      const particleColor = isCenter ? color(100, 200, 255) : color(128); // Grey for repeated text

      const xOffset = x * (bounds.w + padding);
      const yOffset = y * (bounds.h + padding);

      let xStart = width / 2 - bounds.w / 2 + xOffset;
      let yStart = height / 2 + bounds.h / 2 + yOffset;

      // 2. Use Opentype pathfinding (via P5 wrapper) to get points
      // sampleFactor: lower number = fewer points, higher = more points
      let points = font.textToPoints(msg, xStart, yStart, fontSize, {
        sampleFactor: 0.1,
        simplifyThreshold: 0,
      });

      // 3. Convert points into Particle objects
      for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let particle = new Particle(p.x, p.y, particleColor);
        particles.push(particle);
      }
    }
  }
}

function draw() {
  background(20); // Dark background for contrast

  // Update and draw every particle
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.behaviors();
    p.update();
    p.show();
  }
}

// --- The Particle Class ---
class Particle {
  constructor(x, y, col) {
    // Target is where the particle "wants" to be (the text path)
    this.target = createVector(x, y);

    // Position is where the particle currently is (random start)
    this.pos = createVector(random(width), random(height));

    this.vel = p5.Vector.random2D();
    this.acc = createVector();

    // Physics configuration
    this.maxSpeed = 10;
    this.maxForce = 1;
    this.r = 6; // Particle radius
    this.color = col || color(100, 200, 255);
  }

  // Appling Reynolds' Steering Behaviors
  behaviors() {
    let arrive = this.arrive(this.target);
    let flee = this.flee(createVector(mouseX, mouseY));

    // Multipliers: How strong is each force?
    arrive.mult(1);
    flee.mult(5); // Flee force is 5x stronger than arrive force

    this.applyForce(arrive);
    this.applyForce(flee);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0); // Reset acceleration each frame
  }

  show() {
    stroke(this.color);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
  }

  // Behavior 1: Arrive (Seek target, but slow down when close)
  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;

    // If within 100 pixels, map speed to slow down (easing)
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Behavior 2: Flee (Run away from mouse)
  flee(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();

    // Only flee if the mouse is within 50 pixels
    if (d < 50) {
      desired.setMag(this.maxSpeed);
      desired.mult(-1); // Reverse direction to flee

      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
}
