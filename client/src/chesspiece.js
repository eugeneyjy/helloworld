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

  move(x, y, target) {
    this.x = x;
    this.y = y;
    if(this.first_move)
      this.first_move = false; // used first_move
    if(target != null){
      target.alive = false;
    }
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

  canMove(board, x, y, eating) {}

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

  canMove(board, x, y, eating) {
    // var eating = board.getPieceAt(x, y);
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

  move(x, y, target) {
    if(target.type == "rk"){
      this.castle(target);
    }else{
      this.x = x;
      this.y = y;
      if(this.first_move)
        this.first_move = false; // used first_move
      if(target != null){
        target.alive = false;
      }
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

  canMove(board, x, y, eating) {
    // var eating = board.getPieceAt(x, y);
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

  canMove(board, x, y, eating) {
    // var eating = board.getPieceAt(x, y);
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

  canMove(board, x, y, eating) {
    // var eating = board.getPieceAt(x, y);
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

  canMove(board, x, y, eating) {
    // var eating = board.getPieceAt(x, y);
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
    this.enpassant = null;

    if(this.color == "white"){
      this.img = white_images[4];
    }else{
      this.img = black_images[4];
    }
  }

  canMove(board, x, y, eating) {
    // var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.color == board.opp){
      dy = -dy;
    }
    if(this.eatable(eating) == false){
      return false;
    }
    if(dy == 1 && abs(dx) == 1) { // moving diagonally
      if(this.enpassant != null && this.enpassant.x == x){  // move behind en passant
        return true;
      }
      if(this.eatable(eating)){
        return true;
      }else{
        return false;
      }
    }else if(dy >= 0 && dy <= 1 && dx == 0){ // moving forward
      return true;
    }else if(dy == 2 && dx == 0){ // moving forward 2 space
      if(this.first_move){ // using first move
        return "double";
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

  move(x, y, target) {
    var dy = abs(this.y - y);
    this.x = x;
    this.y = y;
    if(this.first_move){
      this.first_move = false; // used first_move
      if(dy == 2){ // used double move then set adjacent en passant
        var pawn_l = board.getPieceAt(x-1, y);
        var pawn_r = board.getPieceAt(x+1, y);
        if(pawn_l != null){
          pawn_l.enpassant = this;
        }
        if(pawn_r != null){
          pawn_r.enpassant = this;
        }
      }
    }
    if(target != null){
      target.alive = false;
    }else if(this.enpassant != null && this.x == this.enpassant.x){ // moved behind en passant
      this.enpassant.alive = false;
    }
    if(this.reachEnd()){
      board.promoting = this;
    }
  }

  reachEnd() {
    if(this.y == 0 || this.y == 7){
      return true;
    }
    return false;
  }

  showPromotion() {
    var y;
    var point_x = floor(map(mouseX, 0+offset, size+offset, 0, 8));
    var point_y = floor(map(mouseY, 0+offset, size+offset, 0, 8));

    for(var i = 0; i < 4; i++){
      var img_scale = this.scale;
      // stroke(#eee);
      noStroke();
      fill(255);
      // console.log((this.x*this.scale+offset) + " " + (this.y*this.scale*i+offset));
      if(this.y == 0){
        y = this.y + i;
      }
      else if(this.y == 7){
        y = this.y - i;
      }
      if(point_x == this.x && point_y == y){
        img_scale = this.scale + 5;
      }
      rect(this.x*this.scale+offset, y*this.scale+offset, this.scale, this.scale);
      if(this.color == "white")
        image(white_images[i], this.x*this.scale+offset, y*this.scale+offset, img_scale, img_scale);
      else
        image(black_images[i], this.x*this.scale+offset, y*this.scale+offset, img_scale, img_scale);
    }
  }
}
