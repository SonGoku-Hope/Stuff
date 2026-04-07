let img;
let initials = "GOKU"; 
let choice = '1';
let screenbg = 250;
let colorPicker, sizeSlider;
let btnSave, btnClear, btnUndo;
let history = [];

function preload() {
  img = loadImage('goku.png');
}

function setup() {
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
}

function draw() {
  displayUIBackground();
  helpText();

  if (keyIsPressed) {
    choice = key; 
  }
  
  if (mouseIsPressed) {
    if (mouseX > 160 || mouseY > 300) {
      newkeyChoice(choice);
    }
  }
}

function mouseReleased() {
  if (mouseX > 160 || mouseY > 300) {
    saveState();
  }
}

function saveState() {
  let snapshot = get(0, 0, width, height);
  history.push(snapshot); 
  if (history.length > 25) {
    history.shift();
  }
}

function undoLast() {
  if (history.length > 1) {
    history.pop();
    let prevState = history[history.length - 1];
    background(screenbg); 
    image(prevState, 0, 0); 
  }
}

function newkeyChoice(toolChoice) {
  let sz = sizeSlider.value();
  let col = colorPicker.color();
  let r = red(col), g = green(col), b = blue(col);
  
  strokeWeight(sz / 5);
  stroke(col);
  fill(col);

  if (toolChoice == '1') {
    line(mouseX, mouseY, pmouseX, pmouseY);
  } 
  else if (toolChoice == '2') {
    noStroke();
    fill(r, g, b, 20); 
    ellipse(mouseX, mouseY, sz * 1.5, sz * 1.5);
  } 
  else if (toolChoice == '3') {
    stroke(r, g, b, 150);
    for (let i = 0; i < 12; i++) {
      line(mouseX, mouseY, mouseX + random(-sz, sz), mouseY + random(-sz, sz));
    }
  } 
  else if (toolChoice == '4') {
    noStroke();
    fill(r, g, b, 180);
    circle(mouseX + random(-sz, sz), mouseY + random(-sz, sz), sz / 5);
  } 
  else if (toolChoice == '5') {
    strokeWeight(sz);
    stroke(r, g, b, 60); 
    line(mouseX, mouseY, pmouseX, pmouseY);
    strokeWeight(sz/2.5);
    stroke(255, 255, 255, 220); 
    line(mouseX, mouseY, pmouseX, pmouseY);
  } 
  else if (toolChoice == '6') {
    noStroke();
    for (let i = 0; i < 6; i++) {
      rect(mouseX + random(-sz, sz), mouseY + random(-sz, sz), sz/4, sz/4);
    }
  }
  else if (toolChoice == '7') {
    noFill();
    strokeWeight(2);
    for(let i = 0; i < 3; i++) {
      stroke(r, g, b, random(100, 255));
      circle(mouseX, mouseY, random(sz/2, sz * 1.5));
    }
  }
  else if (toolChoice == '8') {
    strokeWeight(2);
    stroke(255, 255, 100); 
    let lx = mouseX, ly = mouseY;
    for (let i = 0; i < 4; i++) {
      let nx = lx + random(-sz/2, sz/2);
      let ny = ly + random(-sz/2, sz/2);
      line(lx, ly, nx, ny);
      lx = nx; ly = ny;
    }
  }
  else if (toolChoice == '9') {
    imageMode(CENTER);
    tint(r, g, b, 50); 
    image(img, mouseX + random(-10, 10), mouseY + random(-10, 10), sz * 2, sz * 2);
    noTint();
  }
  else if (toolChoice == '0') {
    noStroke();
    fill(255, 165, 0); 
    circle(mouseX, mouseY, sz);
    fill(255, 0, 0);
    textSize(sz/3);
    textAlign(CENTER, CENTER);
    text('★', mouseX, mouseY); 
  }
  else if (toolChoice == 'g' || toolChoice == 'G') {
    imageMode(CENTER);
    tint(col); 
    image(img, mouseX, mouseY, sz * 3, sz * 3);
    noTint(); 
  }
}

function clear_print() {
  background(screenbg);
  saveState();
}

function saveme() {
  let filename = initials + "_" + day() + "_" + hour() + minute() + second();
  saveCanvas(filename, 'jpg');
}

function keyPressed() {
  if (key === 'x' || key === 'X') clear_print();
  if (key === 'z' || key === 'Z') undoLast(); 
}

function displayUIBackground() {
  noStroke();
  fill(255, 230); 
  rect(0, 0, 500, 85); 
  rect(0, 85, 180, 220); 
}

function helpText() {
  fill("black");
  textSize(14);
  textAlign(LEFT);
  text('BRUSHES: 1-0  |  GOKU: G', 20, 30);
  text('CLEAR: X  |  UNDO: Z', 20, 55);
  textSize(12);
  text('COLOR:', 20, 95);
  text('SIZE:', 20, 145);
}
