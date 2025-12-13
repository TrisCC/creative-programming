let font;
let particles = [];

// Tweakpane variables
let pane;
let params = {
  message: "KINETIC",
  disruptors: 15,
  disruptorSpeed: 4,
  textColor: { r: 255, g: 160, b: 58 },
  sideTextColor: { r: 77, g: 77, b: 77 },
  movingColor: { r: 0, g: 255, b: 230 },
  enableMovingColor: true,
  enableGlow: true,
  repeatText: true,
  calmCenter: true,
  movementDampening: 0.8,
  fontSize: 300,
  skewX: 0,
  skewY: 0,
  sampleFactor: 0.08,
};

function preload() {
  font = loadFont("./assets/BebasNeue-Regular.ttf");
}

function setup() {
  // Setup Tweakpane
  const PaneCtor = globalThis?.Tweakpane?.Pane ?? globalThis?.Pane ?? null;
  if (PaneCtor) {
    // Initialize pane
    pane = new PaneCtor();

    // --- Text Customization Folder ---
    const textFolder = pane.addFolder({ title: "Text Customization" });
    textFolder.addInput(params, "message").on("change", (ev) => {
      msg = ev.value;
      regenerateParticles();
    });
    textFolder.addInput(params, "repeatText").on("change", regenerateParticles);
    textFolder.addInput(params, "textColor").on("change", (ev) => {
      const newColor = color(ev.value.r, ev.value.g, ev.value.b);
      for (let p of particles) {
        if (p.isCenterParticle) {
          p.originalColor = newColor;
        }
      }
    });
    textFolder.addInput(params, "sideTextColor").on("change", (ev) => {
      const newColor = color(ev.value.r, ev.value.g, ev.value.b);
      for (let p of particles) {
        if (!p.isCenterParticle) {
          p.originalColor = newColor;
        }
      }
    });
    textFolder.addInput(params, "enableGlow");
    textFolder
      .addInput(params, "fontSize", { min: 50, max: 400, step: 1 })
      .on("change", (ev) => {
        fontSize = ev.value;
        regenerateParticles();
      });
    textFolder
      .addInput(params, "skewX", { min: -1, max: 1, step: 0.01 })
      .on("change", regenerateParticles);
    textFolder
      .addInput(params, "skewY", { min: -1, max: 1, step: 0.01 })
      .on("change", regenerateParticles);
    textFolder
      .addInput(params, "sampleFactor", {
        label: "Particle Density",
        min: 0.05,
        max: 0.125,
        step: 0.001,
      })
      .on("change", regenerateParticles);
    textFolder.addInput(params, "enableMovingColor");
    textFolder.addInput(params, "movingColor");

    // --- Physics Folder ---
    const physicsFolder = pane.addFolder({ title: "Physics" });
    physicsFolder
      .addInput(params, "disruptors", { min: 0, max: 40, step: 1 })
      .on("change", (ev) => {
        regenerateDisruptors();
      });
    physicsFolder
      .addInput(params, "disruptorSpeed", { min: 1, max: 100, step: 0.1 })
      .on("change", (ev) => {
        for (let d of disruptors) {
          d.maxSpeed = ev.value;
        }
      });
    physicsFolder.addInput(params, "calmCenter");
    physicsFolder.addInput(params, "movementDampening", {
      min: 0,
      max: 2,
      step: 0.05,
    });

    // --- Screenshot Button ---
    pane.addButton({ title: "Save Screenshot" }).on("click", () => {
      saveCanvas(`kinetic-type-${msg}-${Date.now()}`, "png");
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
  regenerateDisruptors();
}

function regenerateDisruptors() {
  disruptors = [];
  for (let i = 0; i < params.disruptors; i++) {
    disruptors.push(new Disruptor());
  }
}

function regenerateParticles() {
  particles = []; // Clear existing particles

  // 1. Compute the bounding box to center the text
  let bounds = font.textBounds(params.message, 0, 0, params.fontSize);

  const padding = 40; // Space between text repetitions

  // Dynamically calculate how many repetitions fit on the canvas
  const textWidthWithPadding = bounds.w + padding;
  const textHeightWithPadding = bounds.h + padding;
  const numX = params.repeatText
    ? Math.ceil(width / 2 / textWidthWithPadding)
    : 0;
  const numY = params.repeatText
    ? Math.ceil(height / 2 / textHeightWithPadding)
    : 0;

  // Loop to create a grid of text particles
  for (let y = -numY; y <= numY; y++) {
    for (let x = -numX; x <= numX; x++) {
      const isCenter = x === 0 && y === 0;
      const particleColor = isCenter
        ? color(params.textColor.r, params.textColor.g, params.textColor.b)
        : color(
            params.sideTextColor.r,
            params.sideTextColor.g,
            params.sideTextColor.b
          );

      const xOffset = x * (bounds.w + padding);
      const yOffset = y * (bounds.h + padding);

      let xStart = width / 2 - bounds.w / 2 + xOffset;
      let yStart = height / 2 + bounds.h / 2 + yOffset;

      // 2. Use Opentype pathfinding (via P5 wrapper) to get points
      // sampleFactor: lower number = fewer points, higher = more points
      let points = font.textToPoints(
        params.message,
        xStart,
        yStart,
        params.fontSize,
        {
          sampleFactor: params.sampleFactor,
          simplifyThreshold: 0,
        }
      );

      // 3. Convert points into Particle objects
      for (let i = 0; i < points.length; i++) {
        let p = points[i];

        // --- Apply Skew ---
        const textCenterX = xStart + bounds.w / 2;
        const textCenterY = yStart - bounds.h / 2;

        // Translate point to be relative to the text's center
        const relX = p.x - textCenterX;
        const relY = p.y - textCenterY;

        // Apply skew transformation
        const skewedX = relX + relY * params.skewX;
        const skewedY = relY + relX * params.skewY;

        // Translate back to original position
        const finalX = skewedX + textCenterX;
        const finalY = skewedY + textCenterY;

        let particle = new Particle(finalX, finalY, particleColor, isCenter);
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
    p.behaviors(disruptors);
    p.update();
    p.show();
  }

  // Update disruptors
  for (let i = 0; i < disruptors.length; i++) {
    disruptors[i].update();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  regenerateParticles();
}

// --- The Particle Class ---
class Particle {
  constructor(x, y, col, isCenter = false) {
    // Target is where the particle "wants" to be (the text path)
    this.target = createVector(x, y);

    // Position is where the particle currently is (its resting spot)
    this.pos = createVector(x, y);

    this.vel = p5.Vector.random2D();
    this.acc = createVector();

    // Physics configuration
    this.maxSpeed = 10;
    this.maxForce = 1;
    this.r = 6; // Particle radius
    this.originalColor = col;
    this.isCenterParticle = isCenter;
  }

  // Appling Reynolds' Steering Behaviors
  behaviors(disruptors) {
    let arrive = this.arrive(this.target);
    let flee = this.flee(createVector(mouseX, mouseY));
    let disrupt = this.fleeFromGroup(disruptors, 75); // Flee from disruptors within 75px

    // Multipliers: How strong is each force?
    arrive.mult(1);
    flee.mult(5); // Flee force is 5x stronger than arrive force
    disrupt.mult(3);

    // Apply global movement dampening
    // arrive.mult(params.movementDampening);
    flee.mult(params.movementDampening);
    disrupt.mult(params.movementDampening);

    // If this is a center particle and calm mode is on, reduce the forces
    if (this.isCenterParticle && params.calmCenter) {
      const calmFactor = 0.1;
      flee.mult(calmFactor);
      disrupt.mult(calmFactor);
    }

    this.applyForce(arrive);
    this.applyForce(flee);
    this.applyForce(disrupt);
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
    let currentColor = this.originalColor;
    const speed = this.vel.mag();
    const isMoving = speed > 0.5; // Threshold to detect movement

    if (params.enableMovingColor && !this.isCenterParticle && isMoving) {
      const targetColor = color(
        params.movingColor.r,
        params.movingColor.g,
        params.movingColor.b
      );

      // Map the speed to a 0-1 range for color interpolation
      // The faster it moves, the closer it gets to the target color
      const amount = map(speed, 0.5, this.maxSpeed, 0, 1, true);
      currentColor = lerpColor(this.originalColor, targetColor, amount);
    }

    if (params.enableGlow) {
      // --- Fuzzy Ring Effect ---
      // 1. Create a glow color with low alpha
      let glowColor = color(
        red(currentColor),
        green(currentColor),
        blue(currentColor)
      );
      glowColor.setAlpha(50); // Low alpha for a faded look

      // 2. Draw the outer, faded point (the fuzz)
      stroke(glowColor);
      strokeWeight(this.r * 1.75); // Make it larger than the core particle
      point(this.pos.x, this.pos.y);
    }

    // 3. Draw the main, solid particle on top
    stroke(currentColor);
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

  // Behavior 3: Flee from a group of agents
  fleeFromGroup(group, perceptionRadius) {
    let steer = createVector(0, 0);
    let total = 0;
    for (let i = 0; i < group.length; i++) {
      let other = group[i];
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (d > 0 && d < perceptionRadius) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steer.div(total);
      steer.setMag(this.maxSpeed);
      let steerForce = p5.Vector.sub(steer, this.vel);
      steerForce.limit(this.maxForce);
      return steerForce;
    } else {
      return createVector(0, 0);
    }
  }
}

// --- The Disruptor Class (Invisible) ---
class Disruptor {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(params.disruptorSpeed / 2, params.disruptorSpeed));
    this.acc = createVector();
    this.maxSpeed = params.disruptorSpeed;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);
    this.edges();
  }

  // Bounce off edges
  edges() {
    if (this.pos.x > width || this.pos.x < 0) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      this.vel.y *= -1;
    }
  }
}
