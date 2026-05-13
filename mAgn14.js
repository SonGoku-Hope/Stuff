let img;
let initials = "GOKU";
let choice = '1';
let screenbg = 250;
let colorPicker, sizeSlider;
let btnSave, btnClear, btnUndo;
let history = [];

// --- Creepy Mode Variables ---
let isCreepy = false;
let capture;
let crashCycle = 0;

// --- Dragon Ball Mechanic Variables ---
let dragonBalls = [];
let collectedDBs = 0;

function preload() {
  img = loadImage('goku.png');
}

function setup() {
  // Check if the 7 Dragon Balls have already cursed this browser session
  let storageVal = localStorage.getItem('gokuCrashCount');
  if (storageVal !== null) {
    isCreepy = true;
    crashCycle = int(storageVal);
    screenbg = 0; // Dark background for creepy mode
  } else {
    screenbg = 250; // Standard background
  }

  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  background(screenbg);
  saveState();

  colorPicker = createColorPicker('#ff4500');
  colorPicker.position(20, 100);

  sizeSlider = createSlider(1, 200, 20);
  sizeSlider.position(20, 150);
  sizeSlider.style('width', '100px');

  btnSave = createButton('📸 Save Artwork');
  btnSave.position(20, 200);
  btnSave.mousePressed(saveme);

  btnClear = createButton('🗑️ Clear Canvas');
  btnClear.position(20, 230);
  btnClear.mousePressed(clear_print);

  btnUndo = createButton('↩️ Undo');
  btnUndo.position(20, 260);
  btnUndo.mousePressed(undoLast);

  if (isCreepy) {
    capture = createCapture(VIDEO);
    capture.size(windowWidth, windowHeight);
    capture.hide();
  }
}

function draw() {
  if (isCreepy) {
    // --- CREEPY MODE DRAW LOOP ---
    if (random(10000) < 1) { 
      pickACrash(); 
    }
    displayUIBackground();
    helpText();
    drawVHSOverlay();

    if (keyIsPressed) { 
      choice = key; 
    }
    if (mouseIsPressed) {
      if (mouseX > 160 || mouseY > 300) { 
        newkeyChoice(choice); 
      }
    }
    applyTVArtifacts();

  } else {
    // --- NORMAL MODE DRAW LOOP ---
    displayUIBackground();
    helpText();

    // Randomly spawn Dragon Balls
    if (frameCount % 120 === 0 && dragonBalls.length < 3 && collectedDBs < 7) {
      let dbX = random(200, width - 50);
      let dbY = random(50, height - 50);
      dragonBalls.push({x: dbX, y: dbY, size: 40});
    }

    // Draw active Dragon Balls
    for (let i = 0; i < dragonBalls.length; i++) {
      let db = dragonBalls[i];
      push();
      noStroke();
      fill(255, 165, 0); // Orange
      circle(db.x, db.y, db.size);
      fill(255, 0, 0); // Red star
      textSize(db.size / 2.5);
      textAlign(CENTER, CENTER);
      text('★', db.x, db.y);
      pop();
    }

    // Draw Collection UI
    push();
    fill(0);
    textSize(18);
    textAlign(RIGHT, TOP);
    textFont('sans-serif');
    text(`Dragon Balls: ${collectedDBs} / 7`, width - 20, 20);
    pop();

    if (keyIsPressed) { 
      choice = key; 
    }
    
    if (mouseIsPressed) {
      if (mouseX > 160 || mouseY > 300) {
        // Prevent drawing stroke if currently hovering over a Dragon Ball
        let hoveringDB = false;
        for (let db of dragonBalls) {
          if (dist(mouseX, mouseY, db.x, db.y) < db.size / 2) hoveringDB = true;
        }
        if (!hoveringDB) {
          newkeyChoice(choice);
        }
      }
    }
  }
}

// --- NEW MECHANIC: CLICKING DRAGON BALLS ---
function mousePressed() {
  if (!isCreepy) {
    for (let i = dragonBalls.length - 1; i >= 0; i--) {
      let db = dragonBalls[i];
      if (dist(mouseX, mouseY, db.x, db.y) < db.size / 2) {
        // Collect it
        dragonBalls.splice(i, 1);
        collectedDBs++;
        
        // If 7 collected, trigger the creepy mode transition
        if (collectedDBs >= 7) {
          localStorage.setItem('gokuCrashCount', 0);
          window.location.reload(); // Hard reload throws them into Creepy mode
        }
        return; // Exit out early
      }
    }
  }
}

function mouseReleased() { 
  if (mouseX > 160 || mouseY > 300) saveState(); 
}

function saveState() {
  let snap = get(0, 0, width, height);
  history.push(snap);
  if (history.length > 25) {
    history.shift();
  }
}

function undoLast() {
  if (isCreepy) {
    // Directly activates the crash routine, killing the program loop
    pickACrash();
  } else {
    // Normal functional undo
    if (history.length > 1) {
      history.pop();
      let prevState = history[history.length - 1];
      background(screenbg); 
      image(prevState, 0, 0); 
    }
  }
}

function clear_print() { 
  background(screenbg); 
  saveState(); 
}

function saveme() {
  if (isCreepy) {
    if (random(1) > 0.5) { 
      window.location.href = "https://www.tacobell.com"; 
    } else { 
      let fn = initials + "" + day() + "" + hour() + minute() + second(); 
      saveCanvas(fn, 'jpg'); 
    }
  } else {
    let filename = initials + "_" + day() + "_" + hour() + minute() + second();
    saveCanvas(filename, 'jpg');
  }
}

function keyPressed() {
  if (key === 'x' || key === 'X') clear_print();
  if (key === 'z' || key === 'Z') undoLast();
}

function displayUIBackground() {
  if (isCreepy) {
    push();
    let uix = (random(100) < 5) ? random(-10, 10) : 0;
    noStroke(); 
    fill(0, 200);
    rect(uix, 0, 400, 85);
    rect(uix, 85, 180, 220);
    stroke(255, random(50, 255));
    strokeWeight(random(0.5, 3));
    noFill(); 
    rect(uix + 5, 5, 395, 300);
    pop();
  } else {
    noStroke();
    fill(255, 230); 
    rect(0, 0, 500, 85); 
    rect(0, 85, 180, 220); 
  }
}

function helpText() {
  if (isCreepy) {
    let stuff = ['BRUSHES: 1-0  |  GOKU: G', 'CLEAR: X  |  UNDO: Z', 'COLOR & SIZE BELOW'];
    push();
    textFont('Courier New'); 
    textSize(14);
    for (let i = 0; i < stuff.length; i++) {
      let x = 20; 
      let y = 30 + (i * 25);
      let s = "";
      for (let char of stuff[i]) { 
        s += (random(100) < 45) ? random(["@", "#", "$", "%", "&", "█", "░", "0", "1", "X"]) : char; 
      }
      if (random(100) < 80) {
        let j = random(-15, 15);
        fill(255, 0, 0, 150); text(s, x + j, y);
        fill(0, 255, 255, 150); text(s, x - j, y);
      }
      fill(255, random(100, 255)); 
      text(s, x, y);
    }
    pop();
  } else {
    push();
    fill("black");
    textSize(14);
    textAlign(LEFT);
    text('BRUSHES: 1-0  |  GOKU: G', 20, 30);
    text('CLEAR: X  |  UNDO: Z', 20, 55);
    textSize(12);
    text('COLOR:', 20, 95);
    text('SIZE:', 20, 145);
    pop();
  }
}

function newkeyChoice(toolChoice) {
  let sz = sizeSlider.value(); 
  let c = colorPicker.color();
  
  if (isCreepy && random(100) < 25) {
    c = color(random(255), random(255), random(255));
  }
  
  let r = red(c), g = green(c), b = blue(c);
  strokeWeight(sz / 5); 
  stroke(c); 
  fill(c);

  if (toolChoice == '1') line(mouseX, mouseY, pmouseX, pmouseY);
  else if (toolChoice == '2') { noStroke(); fill(r, g, b, 20); ellipse(mouseX, mouseY, sz * 1.5, sz * 1.5); }
  else if (toolChoice == '3') { stroke(r, g, b, 150); for (let i = 0; i < 12; i++) line(mouseX, mouseY, mouseX + random(-sz, sz), mouseY + random(-sz, sz)); }
  else if (toolChoice == '4') { noStroke(); fill(r, g, b, 180); circle(mouseX + random(-sz, sz), mouseY + random(-sz, sz), sz / 5); }
  else if (toolChoice == '5') { 
    strokeWeight(sz); stroke(r, g, b, 60); line(mouseX, mouseY, pmouseX, pmouseY); 
    strokeWeight(sz/2.5); 
    if (isCreepy) stroke(255, 255, 220); else stroke(255, 255, 255, 220);
    line(mouseX, mouseY, pmouseX, pmouseY); 
  }
  else if (toolChoice == '6') { noStroke(); for (let i = 0; i < 6; i++) rect(mouseX + random(-sz, sz), mouseY + random(-sz, sz), sz/4, sz/4); }
  else if (toolChoice == '7') { noFill(); strokeWeight(2); for(let i = 0; i < 3; i++) { stroke(r, g, b, random(100, 255)); circle(mouseX, mouseY, random(sz/2, sz * 1.5)); } }
  else if (toolChoice == '8') { strokeWeight(2); stroke(255, 255, 100); let lx = mouseX, ly = mouseY; for (let i = 0; i < 4; i++) { let nx = lx + random(-sz/2, sz/2); let ny = ly + random(-sz/2, sz/2); line(lx, ly, nx, ny); lx = nx; ly = ny; } }
  else if (toolChoice == '9') { imageMode(CENTER); tint(r, g, b, 50); image(img, mouseX + random(-10, 10), mouseY + random(-10, 10), sz * 2, sz * 2); noTint(); }
  else if (toolChoice == '0') { noStroke(); fill(255, 165, 0); circle(mouseX, mouseY, sz); fill(255, 0, 0); textSize(sz/3); textAlign(CENTER, CENTER); text('★', mouseX, mouseY); }
  else if (toolChoice == 'g' || toolChoice == 'G') { imageMode(CENTER); tint(c); image(img, mouseX, mouseY, sz * 3, sz * 3); noTint(); }
}

// ==========================================
// CREEPY MODE EXCLUSIVE FUNCTIONS
// ==========================================

function applyTVArtifacts() {
  stroke(0, 100); 
  strokeWeight(1);
  for (let i = 0; i < height; i += 4) { 
    line(0, i, width, i); 
  }
  if (random(100) < 40) {
    noStroke(); 
    fill(255, random(30, 60));
    for(let i = 0; i < 30; i++){ 
      rect(random(width), random(height), 2, 2); 
    }
  }
}

function drawVHSOverlay() {
  push(); 
  fill(255, 200); 
  textFont('Courier New'); 
  textSize(16);
  let hr = nf(hour(), 2); 
  let mn = nf(minute(), 2); 
  let sc = nf(second(), 2);
  let jit = random(100) < 10 ? random(-5, 5) : 0;
  text("PLAY  " + hr + ":" + mn + ":" + sc, width - 180 + jit, 40);
  pop();
}

function pickACrash() {
  noLoop();
  let next = crashCycle + 1;
  localStorage.setItem('gokuCrashCount', next);
  if (crashCycle === 0) {
    background(0, 0, 255);
    fill(255);
    textFont('monospace');
    textSize(24);
    textAlign(CENTER, CENTER);
    text("FATAL_ERROR: SIGNAL_LOSS", width/2, height/2);
    text("MEMORY_CORRUPTION_DETECTED", width/2, height/2 + 40);
    setTimeout(() => window.location.reload(), 3000);
  } else if (crashCycle === 1) {
    showCreepyText("He knows when you're strong.");
    setTimeout(() => window.location.reload(), 2500);
  } else if (crashCycle === 2) {
    showCreepyText("He forces if you're weak.");
    setTimeout(() => window.location.reload(), 2500);
  } else if (crashCycle === 3) {
    showCreepyText("Hey, he's behind you.");
    setTimeout(() => { background(0); }, 1500);
    setTimeout(() => {
      background(0);
      image(capture, 0, 0, width, height);
      filter(THRESHOLD); 
      applyTVArtifacts();
    }, 4500);
    setTimeout(() => window.location.reload(), 9000);
  } else {
    background(0, 0, 255);
    fill(255);
    textFont('monospace');
    textSize(24);
    textAlign(CENTER, CENTER);
    text("FATAL_ERROR: SIGNAL_LOSS", width/2, height/2);
    setTimeout(() => window.location.reload(), 3000);
  }
}

function showCreepyText(msg) {
  background(0);
  fill(255, 0, 0);
  textFont('Courier New');
  textSize(32);
  textAlign(CENTER, CENTER);
  text(msg, width/2, height/2);
}
