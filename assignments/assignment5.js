/// <reference path="../libraries/p5.global-mode.d.ts" />

let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0);
  for (let p of points) {
    fill(255);
    noStroke();
    circle(p.x, p.y, 8);
  }

  for (let i = 0; i < points.length - 1; i++) {
    stroke(255);
    line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  }
  if (points.length > 2) {
    line(
      points[0].x,
      points[0].y,
      points[points.length - 1].x,
      points[points.length - 1].y
    );
  }
}

function mousePressed() {
  points.push(createVector(mouseX, mouseY));
  if (points.length > 5) {
    points.shift();
  }
  if (points.length > 1) {
    for (let i = 0; i < points.length - 1; i++) {
      stroke(255);
      line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }
  }
}
