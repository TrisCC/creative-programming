/// <reference path="../libraries/p5.global-mode.d.ts" />

let system;
let emitters = [];
let leftPlanet, rightPlanet;
let collisionSound;

// Tweakpane variables
let pane;
let params = {
    strokeWidth: 4,
    volume: 0.5, // collision sound volume (0.0 - 1.0)
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);

    // Initialize basic objects
    emitters.push(new Emitter(width / 2 - 300, height / 2));
    emitters.push(new Emitter(width / 2 + 300, height / 2));
    leftPlanet = new Planet(width / 2 - 50, height / 2 - 100, 30);
    rightPlanet = new Planet(width / 2 + 50, height / 2 + 100, 30);

    // Setup Tweakpane
    const PaneCtor = globalThis?.Tweakpane?.Pane ?? globalThis?.Pane ?? null;

    if (PaneCtor) {
        try {
            pane = new PaneCtor();

            // Fix top-left placement
            const el = pane.element ?? pane.view?.element ?? null;
            if (el) {
                el.style.position = 'fixed';
                el.style.left = '8px';
                el.style.top = '8px';
            }

            // Drawing options
            const drawingOptions = pane.addFolder({ title: 'Drawing' });
            const widthCtrl = drawingOptions.addInput(params, 'strokeWidth', { min: 50, max: 500, step: 1, label: 'Planet Distance' });
            widthCtrl.on('change', (ev) => {
                params.strokeWidth = ev.value;
                leftPlanet = new Planet((width / 2) - ev.value, height / 2 - 100, 30);
                rightPlanet = new Planet((width / 2) + ev.value, height / 2 + 100, 30);
            });

            // Sound options
            try {
                const soundFolder = pane.addFolder({ title: 'Sound' });
                const volCtrl = soundFolder.addInput(params, 'volume', { min: 0, max: 1, step: 0.01, label: 'Collision Volume' });
                volCtrl.on('change', (ev) => {
                    // Update global param and apply to loaded sound
                    params.volume = ev.value;
                    if (collisionSound && typeof collisionSound.setVolume === 'function') {
                        try { collisionSound.setVolume(params.volume); } catch (e) { /* ignore */ }
                    }
                });
                // If sound already loaded, set initial volume
                if (collisionSound && typeof collisionSound.setVolume === 'function') {
                    try { collisionSound.setVolume(params.volume); } catch (e) { /* ignore */ }
                }
            } catch (e) {
                // ignore if adding sound folder fails
            }

            // Keyboard shortcuts information
            try {
                const infoHtml = `
          <div style="font-size:12px;line-height:1.3;padding:10px;color:#999;">
            <strong style="color:#bbb;">Keyboard shortcuts</strong><br>
            Hold <kbd>1</kbd> — rotate gradient start hue<br>
            Hold <kbd>2</kbd> — rotate gradient end hue<br>
            Hold <kbd>3</kbd> — rotate both hues<br>
          </div>`;
                const infoDiv = document.createElement('div');
                infoDiv.innerHTML = infoHtml;
                const paneEl = pane.element ?? pane.view?.element ?? null;
                if (paneEl) paneEl.appendChild(infoDiv);
            } catch (e) {
                // ignore if DOM insertion fails
            }
        } catch (e) {
            console.warn('Error creating Tweakpane UI:', e);
        }
    } else {
        console.warn('Tweakpane not found');
    }
}

function preload() {
    // Load a collision sound from the samples folder (relative to the assignments/ HTML)
    // Adjust filename if you prefer a different sample (00.wav .. 10.wav exist in samples/)
    try {
        collisionSound = loadSound('samples/that2.wav');
    } catch (e) {
        // If loading fails (for instance running locally without server), warn but continue
        console.warn('Could not load collision sound:', e);
        collisionSound = null;
    }
}

function draw() {
    background(0);

    // Emitter loop
    for (let emitter of emitters) {
        if (frameCount % 60 === 0) {
            emitter.addParticle();
        }
        emitter.run();
    }

    // Planet loop
    leftPlanet.run();
    rightPlanet.run();
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
        fill(255, 255, 0, 255);
        noStroke();
        circle(this.origin.x, this.origin.y, 4);
        fill(255, 255, 0, 128);
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
        // Prevent rapid retriggering of collision sounds for the same particle
        this._lastCollisionTime = 0;
    }

    run() {
        this.show();
        this.update();
    }

    show() {
        // RS: Draw a fuzzier particle
        // stroke(0, this.lifespan);
        // strokeWeight(2);
        noStroke();
        fill(255, this.lifespan / 8);
        circle(this.position.x, this.position.y, 18);
        fill(255, this.lifespan / 4);
        circle(this.position.x, this.position.y, 12);
        fill(255, this.lifespan);
        circle(this.position.x, this.position.y, 6);
    }

    update() {
        this.applyForce();

        this.velocity.add(this.acceleration);
        // Check for collisions with left planets
        if (this.checkCollision(leftPlanet)) {
            // Calculate reflection vector
            let normal = p5.Vector.sub(this.position, leftPlanet.position).normalize();
            let dot = this.velocity.dot(normal);
            let reflection = p5.Vector.sub(this.velocity, p5.Vector.mult(normal, 2 * dot));
            this.velocity = reflection;
            // Play collision sound (with small per-particle cooldown to avoid spam)
            const now = millis();
            if (collisionSound && (now - this._lastCollisionTime) > 100) {
                collisionSound.pan(-0.6);
                try {
                    collisionSound.setVolume(params.volume * (this.lifespan / 800));
                    collisionSound.play();
                } catch (e) { /* ignore play errors */ }
                this._lastCollisionTime = now;
            }
        }
        if (this.checkCollision(rightPlanet)) {
            // Calculate reflection vector
            let normal = p5.Vector.sub(this.position, rightPlanet.position).normalize();
            let dot = this.velocity.dot(normal);
            let reflection = p5.Vector.sub(this.velocity, p5.Vector.mult(normal, 2 * dot));
            this.velocity = reflection;
            // Play collision sound (with small per-particle cooldown to avoid spam)
            const now2 = millis();
            if (collisionSound && (now2 - this._lastCollisionTime) > 100) {
                collisionSound.pan(0.6);
                try {
                    collisionSound.setVolume(params.volume * (this.lifespan / 800));
                    collisionSound.play();
                } catch (e) { /* ignore play errors */ }
                this._lastCollisionTime = now2;
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

        let leftPlanetForce = leftPlanet.attract(this);
        force.add(leftPlanetForce);

        let rightPlanetForce = rightPlanet.attract(this);
        force.add(rightPlanetForce);

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
