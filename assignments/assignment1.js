let size;
let randomVal;
let frameRateVal = 15;
let step = 0.05;
let gridSize = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  randomVal = random(100);
  size = min(width / gridSize, height / gridSize);
  frameRate(frameRateVal);
  drawUI();
}

function drawUI() {
  // Add white text labels for inputs
  fill(255); 
  stroke(0,0,0);
  textSize(12);
  textStyle(BOLD);
  text('Grid Size:', 10, 30);
  text('Frame Rate:', 150, 30);

  // Create input elements for grid size and frame rate
  gridSizeInput = createInput(gridSize.toString(), 'number');
  gridSizeInput.position(80, 15);
  gridSizeInput.size(50);
  gridSizeInput.input(() => {
    let val = parseInt(gridSizeInput.value());
    if (!isNaN(val) && val > 0) {
      gridSize = val;
      size = min(width / gridSize, height / gridSize);
    }
  });
  
  frameRateInput = createInput(frameRateVal.toString(), 'number');
  frameRateInput.position(230, 15);
  frameRateInput.size(50);
  frameRateInput.input(() => {
    let val = parseInt(frameRateInput.value());
    if (!isNaN(val) && val > 0) {
      frameRateVal = val;
      frameRate(frameRateVal);
    }
  });
}

function drawGrid() {
  background(0);
  randomVal += 0.01 ;
  fill(255);
  for (let x = size; x < windowWidth - size; x += size) {
    for (let y = size; y < windowHeight - size; y += size) {
      stroke(255,0,0);
      if(noise(randomVal, x, y) < 0.5){
        line(x-(0.5*size),y-(0.5*size),x+(0.5*size),y+(0.5*size));
      } else {
        line(x+(0.5*size),y-(0.5*size),x-(0.5*size),y+(0.5*size));
      }
    }
  }
}

function draw() {
  drawGrid();
  drawUI();
}

function mouseReleased() {
  randomVal = random(1000);
  step = random(100) / 1000;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  size = min(width / gridSize, height / gridSize);
}
