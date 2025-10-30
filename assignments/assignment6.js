// Creative Programming - Assignment 5
// by Tristan Cotino

// Layers
let sprites, spotlight;

// Sprite data
let allSprites = [];
let crewmate_sprite;
let crewmatesPositions = [];
let impostor_sprite;
let impostorPosition;
let impostorFound = false;

// Layout constants
const NUM_SPRITES = 150;
const SCALE_SPRITES = 0.3;


function preload() {
    // Load all amogus sprites
    amogus_red = loadImage('amogus_red.png');
    amogus_blue = loadImage('amogus_blue.png');
    amogus_green = loadImage('amogus_green.png');
    amogus_brown = loadImage('amogus_brown.png');
    amogus_purple = loadImage('amogus_purple.png');
    amogus_yellow = loadImage('amogus_white.png');

    // Put all sprites in an array to choose from later
    allSprites = [amogus_red, amogus_blue, amogus_green, amogus_brown, amogus_purple, amogus_yellow];
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Create sprite layer
    sprites = createGraphics(windowWidth, windowHeight);
    sprites.imageMode(CENTER);

    // Create spotlight layer
    spotlight = createGraphics(windowWidth, windowHeight);
    spotlight.imageMode(CENTER);

    // Initialize random positions for sprites
    for (let i = 0; i < NUM_SPRITES; i++) {
        crewmatesPositions.push({
            x: random(width),
            y: random(height),
        });
    }

    // Set impostor position
    impostorPosition = {
        x: random(width),
        y: random(height),
    };

    // Randomly assign sprites
    crewmate_sprite = allSprites.splice(random(allSprites.length), 1)[0];
    impostor_sprite = allSprites.splice(random(allSprites.length), 1)[0];
}

function draw() {
    // Clear main canvas
    background(0);

    // Clear the sprite layer (transparent)
    sprites.clear();

    // Draw impostor at its position
    // I wanted to draw the impostor somwhere between the layers of crewsmates but I couldn't figure out how to do that
    let impostorSize = impostor_sprite.width * SCALE_SPRITES;
    sprites.image(impostor_sprite, impostorPosition.x, impostorPosition.y, impostorSize, impostorSize);


    // Draw all sprites at their positions
    for (let position of crewmatesPositions) {
        // Calculate size based on scale
        let size = crewmate_sprite.width * SCALE_SPRITES;

        sprites.image(crewmate_sprite, position.x, position.y, size, size);
    }

    // Draw the sprites layer onto the main canvas
    image(sprites, 0, 0);

    // Spotlight layer
    if (!impostorFound) {
        spotlight.clear();
        spotlight.background(0, 240);
        spotlight.erase();
        spotlight.ellipse(mouseX, mouseY, 200, 200);
        spotlight.noErase();
        image(spotlight, 0, 0);

        fill(255, 255, 255);
        strokeWeight(8);
        stroke(0, 0, 0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Find the impostor", width / 2, height / 10);
    }

    if (impostorFound) {
        fill(255, 255, 255);
        strokeWeight(8);
        stroke(0, 0, 0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("You found the impostor!", width / 2, height / 2);

        fill(0, 0, 0, 0);
        strokeWeight(4);
        stroke(255, 0, 0);
        ellipse(impostorPosition.x, impostorPosition.y, impostorSize + 20, impostorSize + 20);

    }
}

function windowResized() {
    // Keep canvas and layers responsive
    resizeCanvas(windowWidth, windowHeight);
    sprites = createGraphics(windowWidth, windowHeight);
    sprites.imageMode(CENTER);
    spotlight = createGraphics(windowWidth, windowHeight);
    spotlight.imageMode(CENTER);
}

function mousePressed() {
    // Check if the mouse is over the impostor
    let impostorSize = impostor_sprite.width * SCALE_SPRITES;
    let d = dist(mouseX, mouseY, impostorPosition.x, impostorPosition.y);
    if (d < impostorSize / 2) {
        impostorFound = true;
    }
}
