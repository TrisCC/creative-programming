// Layers
let sprites, spotlight;
let amogus;
let allSprites = [];
let crewmate_sprite;
let crewmatesPositions = [];
let impostor_sprite;
let impostorPosition;
const NUM_SPRITES = 300; // Number of sprites to create
const SCALE_SPRITES = 0.3; // Scale for crewmates


function preload() {
    amogus_red = loadImage('amogus_red.png');
    amogus_blue = loadImage('amogus_blue.png');
    amogus_green = loadImage('amogus_green.png');
    amogus_brown = loadImage('amogus_brown.png');
    amogus_purple = loadImage('amogus_purple.png');
    amogus_yellow = loadImage('amogus_white.png');

    allSprites = [amogus_red, amogus_blue, amogus_green, amogus_brown, amogus_purple, amogus_yellow];
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Create layers
    sprites = createGraphics(windowWidth, windowHeight);
    // draw images centered on the sprite layer
    sprites.imageMode(CENTER);

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
}

function windowResized() {
    // Keep canvas and layers responsive
    resizeCanvas(windowWidth, windowHeight);
    sprites = createGraphics(windowWidth, windowHeight);
    sprites.imageMode(CENTER);
}
