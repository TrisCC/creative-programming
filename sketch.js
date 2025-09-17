let size;
let randomVal;
let round;
let step = 0.05;
let gridSize = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  // rectMode(CENTER);
  randomVal = random(100);
  size = min(width / gridSize, height / gridSize);
  
  //Calculates the integer closest to the n parameter. For example, round(133.8) returns the value 134. Maps to Math.round().
  round = random(size / 2);
}

function draw() {
  background(0);
  randomVal += 0.01 ;
  fill(255);
  for (let x = size; x < windowWidth - size; x += size) {
    for (let y = size; y < windowHeight - size; y += size) {
      stroke(255,0,0);
      if(noise(randomVal, x, y) < 0.5){
        line(x,y,x+size,y+size);
      } else {
        line(x+size,y,x,y+size);
      }
    }
  }
}

function mouseReleased() {
  randomVal = random(1000);
  step = random(100) / 1000;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  size = min(width / gridSize, height / gridSize);
}
