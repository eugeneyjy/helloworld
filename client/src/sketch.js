var board;
var black_images = [];
var white_images = [];
var size;
var border_width = 0;
var board_scale = 9;
var offset = border_width/2;

function preload() {
  black_images.push(loadImage('./image/Queen.png'));
  black_images.push(loadImage('./image/Rook.png'));
  black_images.push(loadImage('./image/Bishop.png'));
  black_images.push(loadImage('./image/Knight.png'));
  black_images.push(loadImage('./image/Pawn.png'));
  black_images.push(loadImage('./image/King.png'));
  white_images.push(loadImage('./image/Queen_w.png'));
  white_images.push(loadImage('./image/Rook_w.png'));
  white_images.push(loadImage('./image/Bishop_w.png'));
  white_images.push(loadImage('./image/Knight_w.png'));
  white_images.push(loadImage('./image/Pawn_w.png'));
  white_images.push(loadImage('./image/King_w.png'));
}

function setup() {
  board = new Chessboard(board_scale);
  size = board.sidegrid*board.gridsize;
  var canvas = createCanvas(size+border_width, size+border_width);
  canvas.parent('sketch-div');
}

function draw() {
  background(64,64,64);
  board.show();
  // noLoop();
}

function mouseClicked() {
  if(board.win == null){
    var x = floor(map(mouseX, 0+offset, size+offset, 0, 8));
    var y = floor(map(mouseY, 0+offset, size+offset, 0, 8));
    if(board.promoting == null){
      board.moving(x, y);
      board.isEnd();
    }else{
      board.promotion(x, y);
    }
  }
}
