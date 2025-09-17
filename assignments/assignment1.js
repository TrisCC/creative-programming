let lineSize;
let randomVal;
let frameRateVal = 15;
let gridSize = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  randomVal = random(100);
  lineSize = min(width / gridSize, height / gridSize);
  frameRate(frameRateVal);
}

function drawUI() {
  fill(255); 
  stroke(0,0,0);
  textSize(12);
  textStyle(BOLD);
  text('Grid Size:', 10, 30);
  text('Frame Rate:', 150, 30);

  gridSizeInput = createInput(gridSize.toString(), 'number');
  gridSizeInput.position(80, 15);
  gridSizeInput.size(50);
  gridSizeInput.input(() => {
    let val = parseInt(gridSizeInput.value());
    if (!isNaN(val) && val > 0) {
      gridSize = val;
      lineSize = min(width / gridSize, height / gridSize);
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
  for (let x = lineSize; x < windowWidth - lineSize; x += lineSize) {
    for (let y = lineSize; y < windowHeight - lineSize; y += lineSize) {
      stroke(255,0,0);
      let noiseVal = noise(randomVal, x, y);
      if(noiseVal < 0.5){
        stroke(255,noiseVal*255,noiseVal*255)
        line(x-(0.5*lineSize),y-(0.5*lineSize),x+(0.5*lineSize),y+(0.5*lineSize));
      } else {
        stroke(255,noiseVal*255,noiseVal*255)
        line(x+(0.5*lineSize),y-(0.5*lineSize),x-(0.5*lineSize),y+(0.5*lineSize));
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  lineSize = min(width / gridSize, height / gridSize);
}
