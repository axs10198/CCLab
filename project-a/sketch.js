// Void Wanderer

// settings
let wanderSeconds = 10
let creatureSize = 45
let innerSize = 25
let partSize = 60
let partInnerSize = 14
let creatureEasing = 0.04
let avoidDistance = 1
let collectDistance = 35
let portalDuration = 30
let glitchDistance = 40
let canvasSize = 600
let wanderRadius = 200
let spikeMaxLen = 28

// body part 1
let p1x, p1y
let p1speedX = 0
let p1speedY = 0
let p1xDirection = 1
let p1yDirection = 1
let p1rotation = 0
let p1rotSpeed = 0.03
let p1collected = 0

// body part 2
let p2x, p2y
let p2speedX = 0
let p2speedY = 0
let p2xDirection = 1
let p2yDirection = 1
let p2rotation = 0
let p2rotSpeed = 0.04
let p2collected = 0

// body part 3
let p3x, p3y
let p3speedX = 0
let p3speedY = 0
let p3xDirection = 1
let p3yDirection = 1
let p3rotation = 0
let p3rotSpeed = 0.025
let p3collected = 0

// body part 4
let p4x, p4y
let p4speedX = 0
let p4speedY = 0
let p4xDirection = 1
let p4yDirection = 1
let p4rotation = 0
let p4rotSpeed = 0.035
let p4collected = 0

// body part 5
let p5x, p5y
let p5speedX = 0
let p5speedY = 0
let p5xDirection = 1
let p5yDirection = 1
let p5rotation = 0
let p5rotSpeed = 0.045
let p5collected = 0

// creature
let creatureX, creatureY
let targetX, targetY
let collectedParts = 0
let creatureSpeedX = 0
let creatureSpeedY = 0

// timers
let wanderTimer = 0
let wanderTime = 0
let readyToCollect = 0
let portalTimer = 0
let portalReady = 0
let goingToPortal = 0
let portalTarget = 1

// teleport
let isTeleporting = 0
let teleportTimer = 0
let teleportFromX, teleportFromY
let teleportToX, teleportToY

// glitch
let isGlitching = 0

// spike rotation (external body part)
let spikeRotation = 0


function setup() {
  let canvas = createCanvas(800, 500)
  canvas.parent("p5-canvas-container")
  wanderTime = wanderSeconds * 60

  p1x = random(80, 520)
  p1y = random(80, 520)
  p1speedX = random(0.2, 0.5)
  p1speedY = random(0.2, 0.5)

  p2x = random(80, 520)
  p2y = random(80, 520)
  p2speedX = random(0.2, 0.5)
  p2speedY = random(0.2, 0.5)

  p3x = random(80, 520)
  p3y = random(80, 520)
  p3speedX = random(0.2, 0.5)
  p3speedY = random(0.2, 0.5)

  p4x = random(80, 520)
  p4y = random(80, 520)
  p4speedX = random(0.2, 0.5)
  p4speedY = random(0.2, 0.5)

  p5x = random(80, 520)
  p5y = random(80, 520)
  p5speedX = random(0.2, 0.5)
  p5speedY = random(0.2, 0.5)

  creatureX = width / 2
  creatureY = height / 2
  targetX = creatureX
  targetY = creatureY
}


function draw() {
  background(0)
  drawCreature()
}


// main function that runs the whole creature
function drawCreature() {
  // check glitch
  let distToMouse = dist(creatureX, creatureY, mouseX, mouseY)
  isGlitching = 0
  if (mouseIsPressed) {
    if (distToMouse < glitchDistance) {
      isGlitching = 1
    }
  }

  // update spike rotation
  spikeRotation = spikeRotation + 0.015

  // move all 5 body parts (bouncing)
  p1x = p1x + p1speedX * p1xDirection
  p1y = p1y + p1speedY * p1yDirection
  if (p1x > width - 30 || p1x < 30) { p1xDirection = -p1xDirection }
  if (p1y > height - 30 || p1y < 30) { p1yDirection = -p1yDirection }
  p1rotation = p1rotation + p1rotSpeed

  p2x = p2x + p2speedX * p2xDirection
  p2y = p2y + p2speedY * p2yDirection
  if (p2x > width - 30 || p2x < 30) { p2xDirection = -p2xDirection }
  if (p2y > height - 30 || p2y < 30) { p2yDirection = -p2yDirection }
  p2rotation = p2rotation + p2rotSpeed

  p3x = p3x + p3speedX * p3xDirection
  p3y = p3y + p3speedY * p3yDirection
  if (p3x > width - 30 || p3x < 30) { p3xDirection = -p3xDirection }
  if (p3y > height - 30 || p3y < 30) { p3yDirection = -p3yDirection }
  p3rotation = p3rotation + p3rotSpeed

  p4x = p4x + p4speedX * p4xDirection
  p4y = p4y + p4speedY * p4yDirection
  if (p4x > width - 30 || p4x < 30) { p4xDirection = -p4xDirection }
  if (p4y > height - 30 || p4y < 30) { p4yDirection = -p4yDirection }
  p4rotation = p4rotation + p4rotSpeed

  p5x = p5x + p5speedX * p5xDirection
  p5y = p5y + p5speedY * p5yDirection
  if (p5x > width - 30 || p5x < 30) { p5xDirection = -p5xDirection }
  if (p5y > height - 30 || p5y < 30) { p5yDirection = -p5yDirection }
  p5rotation = p5rotation + p5rotSpeed

  // draw all 5 body parts using drawBodyPart function
  drawBodyPart(p1x, p1y, p1rotation, p1collected, 0)
  drawBodyPart(p2x, p2y, p2rotation, p2collected, 1)
  drawBodyPart(p3x, p3y, p3rotation, p3collected, 2)
  drawBodyPart(p4x, p4y, p4rotation, p4collected, 3)
  drawBodyPart(p5x, p5y, p5rotation, p5collected, 4)


  // teleport animation
  if (isTeleporting == 1) {
    teleportTimer = teleportTimer + 1
    let halfPortal = portalDuration / 2

    let shrinkSize = map(teleportTimer, 0, halfPortal, creatureSize, 0)
    if (shrinkSize > 0) {
      drawPortal(teleportFromX, teleportFromY, shrinkSize)
    }

    if (teleportTimer > halfPortal) {
      let growSize = map(teleportTimer, halfPortal, portalDuration, 0, creatureSize)
      drawPortal(teleportToX, teleportToY, growSize)
    }

    if (teleportTimer >= portalDuration) {
      isTeleporting = 0
      teleportTimer = 0
      creatureX = teleportToX
      creatureY = teleportToY
      portalTimer = 0
      portalReady = 0
      goingToPortal = 0
    }
  }


  // creature behavior
  if (isTeleporting == 0) {

    wanderTimer = wanderTimer + 1
    portalTimer = portalTimer + 1

    if (wanderTimer > wanderTime) {
      readyToCollect = 1
    }

    if (portalTimer > wanderTime) {
      portalReady = 1
    }

    // still collecting
    if (collectedParts < 5) {

      if (readyToCollect == 1) {

        let nearestDist = 10000
        let nearestPart = 0
        let tempDist

        if (p1collected == 0) {
          tempDist = dist(creatureX, creatureY, p1x, p1y)
          if (tempDist < nearestDist) {
            nearestDist = tempDist
            nearestPart = 1
          }
        }

        if (p2collected == 0) {
          tempDist = dist(creatureX, creatureY, p2x, p2y)
          if (tempDist < nearestDist) {
            nearestDist = tempDist
            nearestPart = 2
          }
        }

        if (p3collected == 0) {
          tempDist = dist(creatureX, creatureY, p3x, p3y)
          if (tempDist < nearestDist) {
            nearestDist = tempDist
            nearestPart = 3
          }
        }

        if (p4collected == 0) {
          tempDist = dist(creatureX, creatureY, p4x, p4y)
          if (tempDist < nearestDist) {
            nearestDist = tempDist
            nearestPart = 4
          }
        }

        if (p5collected == 0) {
          tempDist = dist(creatureX, creatureY, p5x, p5y)
          if (tempDist < nearestDist) {
            nearestDist = tempDist
            nearestPart = 5
          }
        }

        if (nearestPart == 1) { targetX = p1x; targetY = p1y }
        if (nearestPart == 2) { targetX = p2x; targetY = p2y }
        if (nearestPart == 3) { targetX = p3x; targetY = p3y }
        if (nearestPart == 4) { targetX = p4x; targetY = p4y }
        if (nearestPart == 5) { targetX = p5x; targetY = p5y }

        if (nearestDist < collectDistance) {
          if (nearestPart > 0) {

            if (nearestPart == 1) { p1collected = 1 }
            if (nearestPart == 2) { p2collected = 1 }
            if (nearestPart == 3) { p3collected = 1 }
            if (nearestPart == 4) { p4collected = 1 }
            if (nearestPart == 5) { p5collected = 1 }

            collectedParts = collectedParts + 1

            if (nearestPart == 1) { teleportFromX = p1x; teleportFromY = p1y }
            if (nearestPart == 2) { teleportFromX = p2x; teleportFromY = p2y }
            if (nearestPart == 3) { teleportFromX = p3x; teleportFromY = p3y }
            if (nearestPart == 4) { teleportFromX = p4x; teleportFromY = p4y }
            if (nearestPart == 5) { teleportFromX = p5x; teleportFromY = p5y }

            let exitPart = nearestPart + 1
            if (exitPart > 5) { exitPart = 1 }

            if (exitPart == 1) { teleportToX = p1x; teleportToY = p1y }
            if (exitPart == 2) { teleportToX = p2x; teleportToY = p2y }
            if (exitPart == 3) { teleportToX = p3x; teleportToY = p3y }
            if (exitPart == 4) { teleportToX = p4x; teleportToY = p4y }
            if (exitPart == 5) { teleportToX = p5x; teleportToY = p5y }

            isTeleporting = 1
            teleportTimer = 0
            wanderTimer = 0
            readyToCollect = 0
          }
        }

      } else {
        // wander using sinVal cosVal with noise offset
        let frequency = frameCount * 0.005
        let sinVal = sin(frequency)
        let cosVal = cos(frequency)
        let noiseVal = noise(frequency * 5)
        let offset = map(noiseVal, 0, 1, -80, 80)
        targetX = map(sinVal, -1, 1, width / 2 - wanderRadius, width / 2 + wanderRadius) + offset
        targetY = map(cosVal, -1, 1, height / 2 - wanderRadius, height / 2 + wanderRadius) + offset
      }

    } else {
      // all collected, wander and portal on timer

      if (portalReady == 1) {
        if (goingToPortal == 0) {
          portalTarget = portalTarget + 1
          if (portalTarget > 5) { portalTarget = 1 }
          goingToPortal = 1
        }
      }

      if (goingToPortal == 1) {

        if (portalTarget == 1) { targetX = p1x; targetY = p1y }
        if (portalTarget == 2) { targetX = p2x; targetY = p2y }
        if (portalTarget == 3) { targetX = p3x; targetY = p3y }
        if (portalTarget == 4) { targetX = p4x; targetY = p4y }
        if (portalTarget == 5) { targetX = p5x; targetY = p5y }

        let dToTarget = dist(creatureX, creatureY, targetX, targetY)

        if (dToTarget < 30) {
          teleportFromX = targetX
          teleportFromY = targetY

          let exitPart = portalTarget + 2
          if (exitPart > 5) { exitPart = exitPart - 5 }

          if (exitPart == 1) { teleportToX = p1x; teleportToY = p1y }
          if (exitPart == 2) { teleportToX = p2x; teleportToY = p2y }
          if (exitPart == 3) { teleportToX = p3x; teleportToY = p3y }
          if (exitPart == 4) { teleportToX = p4x; teleportToY = p4y }
          if (exitPart == 5) { teleportToX = p5x; teleportToY = p5y }

          isTeleporting = 1
          teleportTimer = 0
        }

      } else {
        // wander using sinVal cosVal with noise offset
        let frequency = frameCount * 0.005 + 200
        let sinVal = sin(frequency)
        let cosVal = cos(frequency)
        let noiseVal = noise(frequency * 5)
        let offset = map(noiseVal, 0, 1, -80, 80)
        targetX = map(sinVal, -1, 1, width / 2 - wanderRadius, width / 2 + wanderRadius) + offset
        targetY = map(cosVal, -1, 1, height / 2 - wanderRadius, height / 2 + wanderRadius) + offset
      }
    }

    // avoid mouse
    let distance = dist(creatureX, creatureY, mouseX, mouseY)
    if (distance < 80) {
      let awayX = creatureX - mouseX
      let awayY = creatureY - mouseY
      let strength = map(distance, 0, 80, 5, 1)
      targetX = creatureX + awayX * strength
      targetY = creatureY + awayY * strength
    }

    // move creature (pos = pos + speed)
    creatureSpeedX = (targetX - creatureX) * creatureEasing
    creatureSpeedY = (targetY - creatureY) * creatureEasing
    creatureX = creatureX + creatureSpeedX
    creatureY = creatureY + creatureSpeedY

    if (creatureX < 20) { creatureX = 20 }
    if (creatureX > width - 20) { creatureX = width - 20 }
    if (creatureY < 20) { creatureY = 20 }
    if (creatureY > height - 20) { creatureY = height - 20 }

    // draw external spikes (grows with each collected part)
    drawSpikes(creatureX, creatureY, collectedParts)

    // draw the creature body
    drawBody(creatureX, creatureY, creatureSize)

    // draw glitch or inner eye
    if (isGlitching == 1) {
      drawGlitch(creatureX, creatureY)
    } else {
      drawEye(creatureX, creatureY, innerSize)
    }

    // draw inner collected dots
    drawCollectedDots(creatureX, creatureY, collectedParts)
  }

  
  
}


// draws white creature body with pulsing size
function drawBody(x, y, size) {
  push()
  translate(x, y)

  let pulse = map(sin(frameCount * 0.04), -1, 1, -3, 3)

  noStroke()
  fill(255)
  circle(0, 0, size + pulse)
  pop()
}


// draws the inner dark eye with a drifting white glint
function drawEye(x, y, size) {
  push()
  translate(x, y)

  fill(0)
  noStroke()
  circle(0, 0, size)

  // small white glint that drifts with sin
  fill(255)
  let drift = map(sin(frameCount * 0.025), -1, 1, -3, 3)
  circle(drift, -2, 4)
  pop()
}


// draws one body part (portal orb) with rotating sun rays
function drawBodyPart(bx, by, rotation, collected, sinOffset) {
  push()
  translate(bx, by)

  noStroke()
  if (collected == 1) {
    fill(180)
  } else {
    fill(255)
  }
  circle(0, 0, partSize)

  // rotating rays using nested push/pop and rotate
  push()
  rotate(rotation)
  stroke(0)
  strokeWeight(2)
  for (let j = 0; j < 8; j++) {
    let angle = j * 0.785
    let lineLen = map(sin(frameCount * 0.02 + j + sinOffset), -1, 1, 12, 25)
    line(0, 0, cos(angle) * lineLen, sin(angle) * lineLen)
  }
  pop()

  // inner dot
  fill(0)
  noStroke()
  circle(0, 0, partInnerSize)

  pop()
}


// draws portal shrink/grow animation circle
function drawPortal(px, py, size) {
  push()
  translate(px, py)

  fill(255)
  noStroke()
  circle(0, 0, size)

  fill(0)
  circle(0, 0, size * 0.5)
  pop()
}


// draws noise-based glitch effect when clicked
function drawGlitch(gx, gy) {
  push()
  translate(gx, gy)

  let frequency = frameCount * 0.05

  // pulsing outer circle
  let bassSize = map(sin(frameCount * 0.1), -1, 1, creatureSize + 5, creatureSize + 20)
  fill(100, 80)
  noStroke()
  circle(0, 0, bassSize)

  // noise offset circles
  let o1x = map(noise(frequency), 0, 1, -20, 20)
  let o1y = map(noise(frequency + 10), 0, 1, -20, 20)
  fill(60, 180)
  circle(o1x, o1y, 30)

  let o2x = map(noise(frequency + 20), 0, 1, -18, 18)
  let o2y = map(noise(frequency + 30), 0, 1, -18, 18)
  fill(40, 160)
  circle(o2x, o2y, 25)

  let o3x = map(noise(frequency + 40), 0, 1, -15, 15)
  let o3y = map(noise(frequency + 50), 0, 1, -15, 15)
  fill(80, 140)
  circle(o3x, o3y, 28)

  let o4x = map(noise(frequency + 60), 0, 1, -22, 22)
  let o4y = map(noise(frequency + 70), 0, 1, -22, 22)
  fill(50, 120)
  circle(o4x, o4y, 22)

  let o5x = map(noise(frequency + 80), 0, 1, -25, 25)
  let o5y = map(noise(frequency + 90), 0, 1, -25, 25)
  fill(70, 100)
  circle(o5x, o5y, 20)

  let o6x = map(noise(frequency + 100), 0, 1, -12, 12)
  let o6y = map(noise(frequency + 110), 0, 1, -12, 12)
  fill(90, 150)
  circle(o6x, o6y, 18)

  // inner circle shaking
  let shakeX = map(noise(frequency + 120), 0, 1, -8, 8)
  let shakeY = map(noise(frequency + 130), 0, 1, -8, 8)
  fill(0)
  circle(shakeX, shakeY, innerSize)

  let f1x = map(noise(frequency * 2), 0, 1, -10, 10)
  let f1y = map(noise(frequency * 2 + 50), 0, 1, -10, 10)
  fill(30, 200)
  circle(f1x, f1y, 12)

  let f2x = map(noise(frequency * 2 + 100), 0, 1, -14, 14)
  let f2y = map(noise(frequency * 2 + 150), 0, 1, -14, 14)
  fill(20, 180)
  circle(f2x, f2y, 10)

  pop()
}


// draws inner white dots showing how many parts were collected
function drawCollectedDots(cx, cy, count) {
  push()
  translate(cx, cy)

  noStroke()
  fill(255)

  if (count >= 1) { circle(0, 0, 5) }
  if (count >= 2) { circle(-5, -4, 4) }
  if (count >= 3) { circle(5, -4, 4) }
  if (count >= 4) { circle(-5, 4, 4) }
  if (count >= 5) { circle(5, 4, 4) }

  pop()
}


// draws external spikes (lines) around the creature body
// one spike per collected part, they grow and shrink with sin
function drawSpikes(sx, sy, count) {
  if (count < 1) {
    return
  }

  push()
  translate(sx, sy)

  // rotate the whole spike ring slowly
  rotate(spikeRotation)

  stroke(255)
  strokeWeight(2)
  noFill()

  // spacing between spikes depends on how many there are
  let angleStep = (2 * PI) / count

  for (let i = 0; i < count; i++) {
    let angle = i * angleStep

    // each spike grows and shrinks at its own pace using sin with offset
    let spikeLen = map(sin(frameCount * 0.03 + i * 1.2), -1, 1, 8, spikeMaxLen)

    // start from the edge of the creature body
    let startDist = creatureSize / 2
    let endDist = startDist + spikeLen

    let x1 = cos(angle) * startDist
    let y1 = sin(angle) * startDist
    let x2 = cos(angle) * endDist
    let y2 = sin(angle) * endDist

    line(x1, y1, x2, y2)

    // small dot at the tip of each spike
    noStroke()
    fill(255)
    circle(x2, y2, 4)
    stroke(255)
    strokeWeight(2)
  }

  pop()
}


// press G to save a 5 second GIF
function keyPressed() {
  if (key === 'g' || key === 'G') {
    saveGif('void-wanderer', 5)
  }
}
