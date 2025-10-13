/// <reference path="../libraries/p5.global-mode.d.ts" />

let canvas;
let drawings = [];
let currentPath = [];
let isDrawing = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);
  canvas.mousePressed(startPath);
  canvas.mouseReleased(function () {
    endPath();
  });
}

function startPath() {
  px = mouseX;
  py = mouseY;

  isDrawing = true;
  currentPath = [];
  drawings.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
  if (isDrawing) {
    let point = {
      x1: px,
      y1: py,
      x2: mouseX,
      y2: mouseY
    }
    currentPath.push(point);
    px = mouseX;
    py = mouseY;
  }

  //Shows the current drawing if there any data in drawing array
  for (let i = 0; i < drawings.length; i++) {
    let path = drawings[i];
    if (drawings[i].length != 0) {
      // beginShape();
      for (let j = 0; j < path.length; j++) {
        strokeWeight(2);
        stroke(200);
        line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
        // vertex(path[j].x2, path[j].y2);
      }
      // endShape();
    }
  }
}