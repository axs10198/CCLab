
let frames = [];
let filmX = 0;
let targetFilmX = 0;
let speedX = 0;
let images = [];
let songs = [];
let currentSong = -1;

// number of pictures 
let numFrames = 4;
let frameSpacing = 220;

function preload() {
  // load images and songs into the arrays
  for (let i = 1; i <= numFrames; i++) {
    images[i] = loadImage('assets/image' + i + '.png');
    songs[i] = loadSound('assets/song' + i + '.mp3');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  // picture frames and push them to the array
  for (let i = 0; i < numFrames; i++) {
    // space out the frames
    frames.push(new Frame(i * frameSpacing, i + 1));
  }

  // start centered on the first frame
  targetFilmX = width / 2 - frames[0].baseX;
  filmX = targetFilmX;
}

function mouseDragged() {
  // drag from the previous mouse position
  let dx = mouseX - pmouseX;
  targetFilmX += dx;
  speedX = dx;
}

function draw() {
  background(30);

  // film
  fill(70);
  noStroke();
  rect(width / 2, height / 2, width, 200);

  // adding from the last drag speed
  targetFilmX += speedX;
  speedX = speedX * 0.92;

  // upd position
  filmX = lerp(filmX, targetFilmX, 0.1);

  // move and find the centered frame
  let closestIndex = -1;
  let closestDist = 100000;
  for (let i = 0; i < frames.length; i++) {
    frames[i].move(filmX);
    let d = abs(frames[i].x - width / 2);
    if (d < closestDist) {
      closestDist = d;
      closestIndex = i;
    }
  }

  // mark the centered one 
  for (let i = 0; i < frames.length; i++) {
    frames[i].isCentered = (i == closestIndex && closestDist < 100);
    frames[i].display();
  }

  // play the song of the centered frame
  if (closestDist < 100) {
    if (closestIndex != currentSong) {
      // stop the previous song
      if (currentSong >= 0) {
        let prevId = frames[currentSong].id;
        if (songs[prevId] && songs[prevId].isPlaying()) {
          songs[prevId].stop();
        }
      }
      currentSong = closestIndex;
      let id = frames[currentSong].id;
      if (songs[id] && !songs[id].isPlaying()) {
        songs[id].play();
      }
    }
  }
}

class Frame {
  constructor(startX, id) {
    this.baseX = startX;
    this.x = startX;
    this.id = id;

    // size of picture 
    this.frameW = 180;
    this.frameH = 140;

    // size of each pixel 
    this.s = 5;
    this.cols = floor(this.frameW / this.s);
    this.rows = floor(this.frameH / this.s);
    this.total = this.cols * this.rows;

    // shuffled order 
    this.order = [];
    for (let n = 0; n < this.total; n++) {
      this.order.push(n);
    }
    //  shuffle
    for (let n = this.total - 1; n > 0; n--) {
      let r = floor(random(n + 1));
      let temp = this.order[n];
      this.order[n] = this.order[r];
      this.order[r] = temp;
    }

    this.pixelsLoaded = false;
    this.isCentered = false;
  }

  move(offsetX) {
    // upd position based on film pos
    this.x = this.baseX + offsetX;
  }

  display() {
    push();
    translate(this.x, height / 2);

    // pic holder background
    noStroke();
    fill(50);
    rect(0, 0, this.frameW, this.frameH);

    
    if (images[this.id]) {
      this.drawPixels(images[this.id]);
    }

    // border
    if (this.isCentered) {
      noFill();
      strokeWeight(3);
      stroke(255, 200, 50);
      rect(0, 0, this.frameW + 10, this.frameH + 10);
    }

    // film holes
    noStroke();
    fill(237, 226, 225);
    for (let s = -70; s <= 70; s += 30) {
      rect(s + 10, -85, 25, 10); // top hole
      rect(s + 10, 85, 25, 10);  // bottom hole
    }

    pop();
  }

  drawPixels(img) {
    // load pixels once per frame object
    if (!this.pixelsLoaded) {
      img.loadPixels();
      if (img.pixels.length > 0) {
        this.pixelsLoaded = true;
      }
    }
    if (!this.pixelsLoaded) return;

    // distance of this frame from the center of the canvas
    let d = abs(this.x - width / 2);

    // map distance to a reveal amount 
    let reveal = map(d, 300, 60, 0, 1);
    reveal = constrain(reveal, 0, 1);

    if (reveal >= 1) {
      image(img, -this.frameW / 2, -this.frameH / 2, this.frameW, this.frameH);
      return;
    }

    let revealCount = floor(this.total * reveal);

    noStroke();
    for (let n = 0; n < revealCount; n++) {
      let idx = this.order[n];
      let col = idx % this.cols;
      let row = floor(idx / this.cols);

      // map block coords into image coords
      let px = floor(map(col, 0, this.cols, 0, img.width));
      let py = floor(map(row, 0, this.rows, 0, img.height));

      // to find pixel index: index = (x + y * img.width) * 4
      let index = (px + py * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      fill(r, g, b);
      let drawX = -this.frameW / 2 + col * this.s + this.s / 2;
      let drawY = -this.frameH / 2 + row * this.s + this.s / 2;
      rect(drawX, drawY, this.s, this.s);
    }
  }
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
}
