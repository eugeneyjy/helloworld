class Chesspiece {
  constructor(x, y, color, scale) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.scale = scale;
    this.moving = false;
    this.type;
  }

  show() {
    if(this.color == "black"){
      stroke(255);
      fill(0);
    }else{
      stroke(0);
      fill(255);
    }
    if(this.moving == true){
      textSize(36);
      textAlign(CENTER, CENTER);
      text(this.type, mouseX, mouseY);
    //   console.log(this.x);
    }else{
      textSize(32);
      textAlign(CENTER, CENTER);
      text(this.type, this.x*this.scale, this.y*this.scale, this.scale, this.scale);
    }
  }

  startMove() {
    this.moving = true;
  }

  stopMove() {
    this.moving = false;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  canMove(board, x, y) {
  }

  eatable(piece) {
    if(piece != null){
      if(piece.color == this.color){
        return false;
      }else{
        return true;
      }
    }
    return null;
  }
}

class King extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "kg";
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    if(eating != null){
      if(eating.color == this.color){
        return false;
      }
    }
    var dx = this.x - x;
    var dy = this.y - y;
    if(abs(dx) <= 1 && abs(dy) <= 1){
      if(board.getPieceAt(x, y)){

      }
      return true;
    }else{
      return false;
    }
  }
}

class Queen extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "qn";
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(abs(dx) == abs(dy)){ // moving diagonally
      return true;
    }else if(dx == 0 || dy == 0){ // moving straight
      return true;
    }else{
      return false;
    }
  }
}

class Rook extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "rk";
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(dx == 0 || dy == 0){ // moving straight
      return true;
    }else{
      return false;
    }
  }
}

class Knight extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "kn";
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(abs(dx) == 1 && abs(dy) == 2){ // moving L shape
      return true;
    }else if(abs(dx) == 2 && abs(dy) == 1){ // moving lie down L shape
      return true;
    }else{
      return false;
    }
  }
}

class Bishop extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "bs";
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(abs(dx) == abs(dy)){
      return true;
    }else{
      return false;
    }
  }
}

class Pawn extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "pn";
    this.first_move = true;
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.color == "black"){
      dy = -dy;
    }
    if(this.eatable(eating) == false){
      return false;
    }
    console.log(dx + " " + dy);
    if(dy == 1 && abs(dx) == 1) { // moving diagonally
      if(this.eatable(eating)){
        return true;
      }else{
        return false;
      }
    }else if(dy >= 0 && dy <= 1 && dx == 0){ // moving forward
      if(this.first_move)
        this.first_move = false; // used first_move
      return true;
    }else if(dy == 2 && dx == 0){ // moving forward 2 space
      if(this.first_move){
        this.first_move = false; // used first_move
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  eatable(piece) {
    if(piece != null){
      var dx = this.x - piece.x;
      var dy = this.y - piece.y;
      if(this.color == "black"){
        dy = -dy;
      }
      if(piece.color == this.color){
        return false;
      }else if(dx == 0 && dy == 1){
        return false;
      }else{
        return true;
      }
    }
    return null;
  }
}
