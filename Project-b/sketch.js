// variables
    let frames = [];
    let filmX = 0;
    let targetFilmX = 0;
    let speedX= 0;
    let images = [];

    function preload() {
      // load images into the array
      for (let i = 1; i < 2; i++) {
        images[i] = loadImage('assets/image' + i+'.png');
      }
    }

    function setup() {
      createCanvas(windowWidth, windowHeight);
      rectMode(CENTER);

      // picture frames and push them to the array
      for (let i = 0; i < 15; i++) {
        // Space out the frames
        frames.push(new Frame(i * 220, i));
      }
    }

    function mouseDragged() {
        if (mouseX > width / 2) {
          targetFilmX += 10; // move right
          speedX = (mouseX - width/2 )*-0.05 ; // set speed for inertia
        } else {
          targetFilmX -= 10; // move left
          speedX = (mouseX - width/2 )*-0.05 ; // set speed for inertia

        }
      }

    function draw() {
      background(30);

      // film 
      fill(70);
      noStroke();
      rect(width / 2, height / 2, width, 200);


      

       // movement 
      // if (mouseIsPressed) {
      //   // move speed 
      //   speedX = (mouseX - width / 2) * -0.05;
      //   targetFilmX += speedX;
      // }
     

      //upd position 
      filmX = lerp(filmX, targetFilmX, 0.1);

      // draw fromt the array 
      for (let i = 0; i < frames.length; i++) {
        frames[i].move(filmX);
        frames[i].display();
      }

      
    }

    class Frame {
      constructor(startX, id) {
        this.baseX = startX;
        this.x = startX;
        this.id = id;
      }

      move(offsetX) {
        // upd position based on film pos
        this.x = this.baseX + offsetX;
      }

      display() {
        push();
        translate(this.x, height / 2);

        // pic holders 
        stroke(50);
        fill(50);
        rect(0, 0, 180, 140);

        // txt 
        fill(255);
        noStroke();
        textSize(20);
        textAlign(CENTER);
        text("Pic " + this.id, 0, 5);
        images[this.id] && image(images[this.id], -90, -70, 180, 140);

        // film holes 
        fill(237, 226, 225);
        for (let s = -70; s <= 70; s += 30) {
          rect(s+10, -85, 25, 10); // top hole
          rect(s+10, 85, 25, 10);  // bottom hole
        }

        pop();
      }
      
    }
// add a mouse whele and scirloing with moduling to the scene and then make the speed go increase when the mouse s being scrolled to a specific direction ]

    function windowResized() {
      createCanvas(windowWidth, windowHeight);
    }