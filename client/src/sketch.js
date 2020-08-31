var board;
var images = [];

function preload() {
  images.push(loadImage('./image/King.png'));
  images.push(loadImage('./image/King_w.png'));
  images.push(loadImage('./image/Queen.png'));
  images.push(loadImage('./image/Queen_w.png'));
  images.push(loadImage('./image/Bishop.png'));
  images.push(loadImage('./image/Bishop_w.png'));
  images.push(loadImage('./image/Knight.png'));
  images.push(loadImage('./image/Knight_w.png'));
  images.push(loadImage('./image/Rook.png'));
  images.push(loadImage('./image/Rook_w.png'));
  images.push(loadImage('./image/Pawn.png'));
  images.push(loadImage('./image/Pawn_w.png'));
}

function setup() {
  board = new Chessboard(8);
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
