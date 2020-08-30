var board;

function setup() {
  board = new Chessboard(6);
  var size = board.sidegrid*board.gridsize;
  createCanvas(size, size);
}

function draw() {
  background(0);
  board.show();
  // noLoop();
}

function mouseClicked() {
  board.movePiece();
}
