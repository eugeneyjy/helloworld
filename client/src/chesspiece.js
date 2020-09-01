class Chesspiece {
  constructor(x, y, color, scale) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.scale = scale;
    this.moving = false;
    this.type;
    this.img;
    this.alive = true;
    this.first_move = true;
  }

  show() {
    if(this.alive){
      if(this.color == "black"){
        stroke(255);
        fill(0);
      }else{
        stroke(0);
        fill(255);
      }
      if(this.moving == true){
        imageMode(CENTER);
        image(this.img, mouseX, mouseY, this.scale, this.scale);
      }else{
        imageMode(CORNER);
        image(this.img, this.x*this.scale+offset, this.y*this.scale+offset, this.scale, this.scale);
      }
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
    if(this.first_move)
      this.first_move = false; // used first_move
  }

  killed() {
    this.alive = false;
  }

  dead() {
    if(this.alive == false){
      return true;
    }
    else{
      return false;
    }
  }

  canMove(board, x, y) {}

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

  leap_forward(board, dy) {
    var y = dy;
    // console.log(this.y + y);
    while(y != 0){
      // console.log(board.getPieceAt(this.x, this.y - y));
      if(board.getPieceAt(this.x, this.y - y) && y != dy){ // see if got piece in the way
        // console.log("leap forward");
        return true;
      }
      if(y > 0){
        y--;
      }else if(y < 0){
        y++;
      }
    }
    return false;
  }

  leap_side(board, dx) {
    var x = dx;
    while(x != 0){
      if(board.getPieceAt(this.x - x, this.y) && x != dx){ // see if got piece in the way
        return true;
      }
      if(x > 0){
        x--;
      }else if(x < 0){
        x++;
      }
    }
    return false;
  }

  leap_diagonal(board, dx, dy) {
    var y = dy;
    var x = dx;
    while(x != 0 && y != 0){
      if(board.getPieceAt(this.x - x, this.y - y) && x != dx && y != dy){ // see if got piece in the way
        return true;
      }
      if(x > 0){
        x--;
      }else if(x < 0){
        x++;
      }
      if(y > 0){
        y--;
      }else if(y < 0){
        y++;
      }
    }
    return false;
  }
}

class King extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "kg";

    if(this.color == "white"){
      this.img = white_images[5];
    }else{
      this.img = black_images[5];
    }
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    if(eating != null){
      if(eating.type == "rk" && eating.color == this.color){
        return(this.canCastle(board, eating));
      }
      if(eating.color == this.color){
        return false;
      }
    }
    var dx = this.x - x;
    var dy = this.y - y;
    if(abs(dx) <= 1 && abs(dy) <= 1){
      return true;
    }else{
      return false;
    }
  }

  canCastle(board, rook) {
    if(this.first_move && rook.first_move){
      var dx = this.x - rook.x;
      if(this.leap_side(board, dx)){
        console.log("cant castle");
        return false;
      }else{
        return "castling";
      }
    }
    return false;
  }

  castle(rook) {
    var dx = this.x - rook.x;
    if(dx > 0){ // castle with left rook
      this.x -= 2;
      rook.x = this.x + 1;
    }else{      // castle with right rook
      this.x += 2;
      rook.x = this.x - 1;
    }
  }
}

class Queen extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "qn";

    if(this.color == "white"){
      this.img = white_images[0];
    }else{
      this.img = black_images[0];
    }
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(abs(dx) == abs(dy)){ // moving diagonally
      if(this.leap_diagonal(board, dx, dy))
        return false;
      else
        return true;
    }else if(dx == 0 || dy == 0){ // moving straight
      if(this.leap_forward(board, dy) || this.leap_side(board, dx)){
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }
}

class Rook extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "rk";

    if(this.color == "white"){
      this.img = white_images[1];
    }else{
      this.img = black_images[1];
    }
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(dx == 0 || dy == 0){ // moving straight
      if(this.leap_forward(board, dy) || this.leap_side(board, dx))
        return false;
      else
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

    if(this.color == "white"){
      this.img = white_images[3];
    }else{
      this.img = black_images[3];
    }
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

    if(this.color == "white"){
      this.img = white_images[2];
    }else{
      this.img = black_images[2];
    }
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(abs(dx) == abs(dy)){
      if(this.leap_diagonal(board, dx, dy))
        return false;
      else
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
    this.promotion = false;

    if(this.color == "white"){
      this.img = white_images[4];
    }else{
      this.img = black_images[4];
    }
  }

  canMove(board, x, y) {
    var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.color == board.opp){
      dy = -dy;
    }
    if(this.eatable(eating) == false){
      return false;
    }
    if(dy == 1 && abs(dx) == 1) { // moving diagonally
      if(this.eatable(eating)){
        return true;
      }else{
        return false;
      }
    }else if(dy >= 0 && dy <= 1 && dx == 0){ // moving forward
      return true;
    }else if(dy == 2 && dx == 0){ // moving forward 2 space
      if(this.first_move){ // using first move
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
      if(this.color == board.opp){
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

  reachEnd() {
    if(this.color == board.player && this.y == 0){
      this.promotion = true;
      return true;
    }else if(this.color == board.opp && this.y == 7){
      this.promotion = true;
      return true;
    }
    return false;
  }

  showPromotion() {
    var y;
    for(var i = 0; i < 4; i++){
      stroke(0);
      fill(255);
      // console.log((this.x*this.scale+offset) + " " + (this.y*this.scale*i+offset));
      if(this.y == 0){
        y = this.y + i;
      }
      else if(this.y == 7){
        y = this.y - i;
      }
      rect(this.x*this.scale+offset, y*this.scale+offset, this.scale, this.scale);
      if(this.color == "white")
        image(white_images[i], this.x*this.scale+offset, y*this.scale+offset, this.scale, this.scale)
      else
        image(black_images[i], this.x*this.scale+offset, y*this.scale+offset, this.scale, this.scale)
    }
  }
}
