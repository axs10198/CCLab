/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/


function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new CircleDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.




class CircleDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;

    // body + motion values
    this.baseRadius = 50;
    this.bodyRadius = this.baseRadius;
    this.motion = 0;
    this.motionDir = 1;

    // limb angles and lengths
    this.armLength = 30;
    this.legLength = 36;
    this.armBaseLength = 24;
    this.armExtraLength = 30;
    this.legBaseLength = 30;
    this.legExtraLength = 34;

    // x-only movement
    this.homeX = startX;
    this.moveRange = 50;
    this.moveStep = 1.6;
    this.moveDir = 1;
  }
  update() {
   

    // limbs expand while body shrinks
    this.motion += 0.03 * this.motionDir;
    if (this.motion > 1) {
      this.motion = 1;
      this.motionDir *= -1;
    }
    if (this.motion < 0) {
      this.motion = 0;
      this.motionDir *= -1;
    }

    this.armLength = this.armBaseLength + this.armExtraLength * this.motion;
    this.legLength = this.legBaseLength + this.legExtraLength * this.motion;
    this.bodyRadius = this.baseRadius - 8 * this.motion;

    // move only in x direction: +/- 50 from starting x
    this.x += this.moveStep * this.moveDir;
    if (this.x > this.homeX + this.moveRange) {
      this.x = this.homeX + this.moveRange;
      this.moveDir = -1;
    }
    if (this.x < this.homeX - this.moveRange) {
      this.x = this.homeX - this.moveRange;
      this.moveDir = 1;
    }
  }
  display() {
    
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    // Body
    fill(100, 200, 255);
    noStroke();
    ellipse(0, 0, this.bodyRadius * 2, this.bodyRadius * 2);

    // ellipse(0, -60, 60, 60);

    // Eyes
    fill(255);
    ellipse(-this.bodyRadius * 0.4, -this.bodyRadius * 0.2, 20, 20); // left eye
    ellipse(this.bodyRadius * 0.4, -this.bodyRadius * 0.2, 20, 20);  // right eye
    fill(0);
    ellipse(-this.bodyRadius * 0.4, -this.bodyRadius * 0.2, 8, 8);   // left pupil
    ellipse(this.bodyRadius * 0.4, -this.bodyRadius * 0.2, 8, 8);    // right pupil

    // Smile
    noFill();
    stroke(0);
    strokeWeight(3);
    arc(0, this.bodyRadius * 0.35, 40, 20, 0, PI); // smile

    // Arms + legs
    stroke(80, 180, 255);
    strokeWeight(10);

    // Left arm
    push();
    rotate(PI + 0.35);
    translate(this.bodyRadius, 0);
    line(0, 0, this.armLength, 0);
    pop();

    // Right arm
    push();
    rotate(-0.35);
    translate(this.bodyRadius, 0);
    line(0, 0, this.armLength, 0);
    pop();

    // Left leg
    push();
    rotate(PI / 2 + 0.55);
    translate(this.bodyRadius, 0);
    line(0, 0, this.legLength, 0);
    pop();

    // Right leg
    push();
    rotate(PI / 2 - 0.55);
    translate(this.bodyRadius, 0);
    line(0, 0, this.legLength, 0);
    pop();



    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    // this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/
