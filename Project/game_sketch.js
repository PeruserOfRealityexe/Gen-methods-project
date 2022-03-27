var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(400, 400);
  centerCanvas();
  background(255, 0, 200);
}

function windowResized() {
  centerCanvas();
}

function draw() {
  background(0);
  ellipse(50,50,80,80);
}