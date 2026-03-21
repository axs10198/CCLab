let images = [];
let shanghai = [];
let currentframe = 0;
let startFrame = 0;
let animX = 0;
let animY = 0;

function preload() {
  for (let i = 1; i <= 22; i++) {
    images.push(loadImage('img/2026-03-20 (' + i + ').png'));
  }
  for (let i = 11; i <= 22; i++) {
    shanghai.push(loadImage('img/2026-03-20 (' + i + ').png'));
  }
}

function setup() {
  createCanvas(400, 400);
  animX = 0;
  animY = 0;
}

function mainanimation() {
  currentframe = floor((frameCount - startFrame) / 25) % images.length;
  image(images[currentframe], animX, animY, width, height);
}

function draw() {
  mainanimation();
}

function mousePressed() {
  startFrame = frameCount;
  animX = mouseX - width / 2;
  animY = mouseY - height / 2;

}
