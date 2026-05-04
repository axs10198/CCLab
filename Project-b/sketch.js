// variables
let frames = [];
let filmX = 0;
let targetFilmX = 0;
let speedX = 0;
let images = [];
let songs = [];
let currentSong = -1;

// memory
let memories = [
  "Going to the Cairo Tower with high school friends after walking across the Nile, only to find out that teenagers under 18 need a parent or adult with them to get in.",
  "Walking there at night eating shawarma with friends after high school prom while being anxious because I had to leave for Shanghai the next morning and had not told them yet. Probably the best night out in downtown Cairo.",
  "That restaurant and its rude customer service always amazed me. Every time I went they had new hires, but the service was still bad. I will always remember going there with my family as a kid. It was the stop I looked forward to every time we had to visit Cairo.",
  "Best gelato in downtown but the line was always crazy."
];

let numFrames = 4;
let frameSpacing = 360;

function preload() {
  // load images and songs into the arrays
  for (let i = 0; i < numFrames; i++) {
    images[i] = loadImage('assets/image' + (i + 1) + '.png');
    songs[i] = loadSound('assets/song' + (i + 1) + '.mp3');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  // picture frames and push them to the array
  for (let i = 0; i < numFrames; i++) {
    // space out the frames
    frames.push(new Frame(i * frameSpacing, i));
  }

  //  centered on the first frame
  targetFilmX = width / 2 - frames[0].baseX;
  filmX = targetFilmX;
}

function mouseDragged() {
  // drag  from the previous mouse position
  let dx = mouseX - pmouseX;
  targetFilmX += dx;
  speedX = dx;
}

function draw() {
  background(30);

  // film strip
  fill(70);
  noStroke();
  rect(width / 2, height / 2, width, 320);

  // inertia from the last drag speed
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

  // mark the centered one and draw all frames
  for (let i = 0; i < frames.length; i++) {
    frames[i].isCentered = (i == closestIndex && closestDist < 100);
    frames[i].display();
  }

  // play the song of the centered frame, stop the others
  if (closestDist < 100) {
    if (closestIndex != currentSong) {
      // stop the previous song
      if (currentSong >= 0) {
        let prevId = frames[currentSong].id;
        if (songs[prevId].isPlaying()) {
          songs[prevId].stop();
        }
      }
      currentSong = closestIndex;
      let id = frames[currentSong].id;
      if (!songs[id].isPlaying()) {
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
    this.frameW = 300;
    this.frameH = 220;

    // size of each pixel
    this.s = 8;
    this.cols = floor(this.frameW / this.s);
    this.rows = floor(this.frameH / this.s);
    this.total = this.cols * this.rows;

    //  order for pixel reveal and dissolve
    this.order = [];
    for (let n = 0; n < this.total; n++) {
      this.order.push(n);
    }

    this.pixelsLoaded = false;
    this.isCentered = false;

    // loading bar
    this.loadProgress = 0;

    // dissolve 
    this.dissolving = false;
    this.dissolveProgress = 0;
    this.dissolved = false;
  }

  move(offsetX) {
    // upd position based on film pos
    this.x = this.baseX + offsetX;

    // film loops 
    let totalSpan = numFrames * frameSpacing;
    let center = width / 2;
    if (this.x > center + totalSpan / 2) {
      this.x -= totalSpan;
    }
    if (this.x < center - totalSpan / 2) {
      this.x += totalSpan;
    }
  }

  display() {
    push();
    translate(this.x, height / 2);

    // loading bar only fills when centered 
    if (this.isCentered && !this.dissolving && !this.dissolved) {
      this.loadProgress += 0.001; // fills in about 16s at 60fps
      this.loadProgress = constrain(this.loadProgress, 0, 1);
    }

    // start dissolve 
    if (this.loadProgress >= 1 && !this.dissolving && !this.dissolved) {
      this.dissolving = true;
    }

    // dissolve progress 
    if (this.dissolving) {
      this.dissolveProgress += 0.008;
      this.dissolveProgress = constrain(this.dissolveProgress, 0, 1);
      if (this.dissolveProgress >= 1) {
        this.dissolving = false;
        this.dissolved = true;
      }
    }

    // pic holder background
    noStroke();
    fill(50);
    rect(0, 0, this.frameW, this.frameH);

    // draw content based on state
    if (this.dissolved) {
      //  text after the image has dissolved
      rectMode(CORNER);
      fill(210, 190, 155);
      textFont("Times New Roman");
      textSize(13);
      textAlign(LEFT, TOP);
      let mp = 14;
      text(
        memories[this.id],
        -this.frameW / 2 + mp,
        -this.frameH / 2 + mp,
        this.frameW - mp * 2,
        this.frameH - mp * 2
      );
      rectMode(CENTER);
    } else if (images[this.id]) {
      // pixel reveal 
      this.drawPixels(images[this.id]);
    }

    // border around the centered frame
    if (this.isCentered) {
      noFill();
      strokeWeight(3);
      stroke(255, 200, 50);
      rect(0, 0, this.frameW + 10, this.frameH + 10);
    }

    // film holes as loading bar
    let holeSpacing = 40;
    let holeStartX = -(this.frameW / 2 - 20);
    let holeEndX = this.frameW / 2 - 20;
    let holeY = this.frameH / 2 + 18; // distance from center to hole center
    let holeW = 26;
    let holeH = 13;

    // count total holes (top + bottom)
    let holeCount = 0;
    for (let hx = holeStartX; hx <= holeEndX; hx += holeSpacing) {
      holeCount += 2; // one top, one bottom
    }

    // how many holes are filled based on loadProgress
    let filledCount = floor(this.loadProgress * holeCount);
    let drawnHoles = 0;

    noStroke();
    for (let hx = holeStartX; hx <= holeEndX; hx += holeSpacing) {
      // top hole
      if (drawnHoles < filledCount) {
        fill(255, 200, 50); // filled yellow
      } else {
        fill(237, 226, 225); // unfilled default
      }
      rect(hx, -holeY, holeW, holeH);
      drawnHoles++;

      // bottom hole
      if (drawnHoles < filledCount) {
        fill(255, 200, 50);
      } else {
        fill(237, 226, 225);
      }
      rect(hx, holeY, holeW, holeH);
      drawnHoles++;
    }

    pop();
  }

  drawPixels(img) {
    // load pixels once per frame 
    if (!this.pixelsLoaded) {
      img.loadPixels();
      if (img.pixels.length > 0) {
        this.pixelsLoaded = true;
      }
    }
    if (!this.pixelsLoaded) return;

    // distance of this frame from the center of the canvas
    let d = abs(this.x - width / 2);

    // map distance to a reveal amount 0 none n 1 full 
    let reveal = map(d, 300, 60, 0, 1);
    reveal = constrain(reveal, 0, 1);

    // remove pixels from full image downward
    let visibleCount;
    if (this.dissolving) {
      visibleCount = floor(this.total * (1 - this.dissolveProgress));
    } else if (reveal >= 1) {
      // fully revealed and not dissolving: draw crisp full image
      image(img, -this.frameW / 2, -this.frameH / 2, this.frameW, this.frameH);
      return;
    } else {
      visibleCount = floor(this.total * reveal);
    }

    noStroke();
    for (let n = 0; n < visibleCount; n++) {
      let idx = this.order[n];
      let col = idx % this.cols;
      let row = floor(idx / this.cols);

      // map block n  image coords
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
