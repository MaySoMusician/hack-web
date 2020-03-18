var globalParameters = {
  code: `function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
    strokeWeight(3);

    drawFace();
    // drawHat();
    // drawBowTie();
}

function drawFace() {
    fill('yellow');
    circle(200, 240, 200);


    fill('black');
    // left eye
    circle(160, 220, 20);
    // right eye
    circle(240, 220, 20);

    //smile
    noFill();
    arc(200, 220, 150, 150, QUARTER_PI, PI - QUARTER_PI);
}

function drawHat() {
    fill('black');
    rect(125, 20, 150, 160);
    rect(105, 170, 190, 10);
    fill('red');
    rect(125, 130, 150, 40);
}

function drawBowTie() {
    fill('red');
    triangle(140, 340, 200, 360, 140, 380);
    triangle(260, 340, 200, 360, 260, 380);
}

`,
};

function build() {
  try {
    // eslint-disable-next-line no-new,no-new-func
    new Function(globalParameters.code);
  } catch (err) {
    return false;
  }

  return true;
}

function reload() {
  if (!build()) {
    return;
  }

  const content = document.getElementById('content');
  content.srcdoc = `
<html>
  <head>
    <script src="p5.min.js"></script>
  </head>
  <body>
    <script>${globalParameters.code}</script>
  </body>
</html>
`;
}