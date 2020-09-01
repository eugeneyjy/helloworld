class Chessboard {
  constructor(scale, player="white") {
    this.scale = scale; // attribute to scale size of board
    this.gridsize = this.scale*10;
    this.sidegrid = 8;
    this.grid = [];
    this.opppieces = [];
    this.selfpieces = [];
    this.movingpiece = null;
    this.turn = "white";
    this.player = player;
    this.opp = "black"
    if(this.player == "black"){
      this.opp = "white";
    }
    this.win = null;
    this.promoting = null;
    // filling initial chess pieces
    for(var i = 0; i < this.sidegrid; i++){
      this.grid.push([]);
      for(var j = 0; j < this.sidegrid; j++){
        this.grid[i].push(null);
      }
    }
    this.fillPieces("black");
    // console.log(this.opppieces);
    this.fillPieces("white");
    // console.log(this.selfpieces);
    // this.grid[0][0] = new Pawn(0, 0, "white", this.gridsize);
    // this.selfpieces.push(this.grid[0][0]);
  }

  fillPieces(color) {
    var piece;
    var x;
    var y;

    for(var j = 0; j < 2; j++){
      for(var i = 0; i < this.sidegrid; i++){
        if(color == this.opp){
          x = i;
          y = j;
        }else if(color == this.player){ // mirror the position
          x = i;
          y = this.sidegrid-j-1;
        }
        if(j == 1){   // filling out pawns
          piece = new Pawn(x,y,color,this.gridsize);  // creating pawns
        }else if(j == 0){   //filling out other pieces
          if(i == 0 || i == 7){
            piece = new Rook(x,y,color,this.gridsize); // creating rooks
          }else if(i == 1 || i == 6){
            piece = new Knight(x,y,color,this.gridsize); // creating knight
          }else if(i == 2 || i == 5){
            piece = new Bishop(x,y,color,this.gridsize); // creating bishop
          }else if(i == 3){
            piece = new Queen(x,y,color,this.gridsize); // creating queen
          }else if(i == 4){
            piece = new King(x,y,color,this.gridsize); //creating king
          }
        }
        this.grid[x][y] = piece;
        if(color == this.opp){
          this.opppieces.push(piece);
        }else{
          this.selfpieces.push(piece);
        }
      }
    }
  }

  show() {
    for(var i = 0; i < this.sidegrid; i++){
      for(var j = 0; j < this.sidegrid; j++){
        // stroke(0, 74, 158);
        if((i+j)%2 == 0){
          stroke(232, 235, 239);
          fill(232, 235, 239);
          // fill(0);
        }else{
          stroke(125, 135, 150);
          fill(125, 135, 150);
          // fill(255);
        }
        rect(i*this.gridsize+offset, j*this.gridsize+offset, this.gridsize, this.gridsize);
      }
    }
    this.showPieces();
  }

  showPieces() {
    for(var i = 0; i < this.opppieces.length; i++){
      this.opppieces[i].show();
      if(this.selfpieces[i].type == "pn" && this.selfpieces[i].promotion)
        this.selfpieces[i].showPromotion();
    }

    for(var i = 0; i < this.selfpieces.length; i++){
      this.selfpieces[i].show();
      if(this.opppieces[i].type == "pn" && this.opppieces[i].promotion)
        this.opppieces[i].showPromotion();
    }
  }

  getPieceAt(x, y) {
    // console.log(x + " " + y);
    return this.grid[x][y];
  }

  changeTurn() {
    if(this.turn == "white"){
      this.turn = "black";
    }else{
      this.turn = "white";
    }
  }

  movePiece(piece, move, x, y) {
    if(move == "castling"){
      var rook = this.getPieceAt(x, y);
      this.grid[rook.x][rook.y] = null;
      piece.castle(rook);
      this.grid[piece.x][piece.y] = piece;
      this.grid[rook.x][rook.y] = rook;
    }else{
      piece.move(x, y);
      if(this.grid[piece.x][piece.y] == null)
        this.grid[piece.x][piece.y] = piece;
      else{
        this.grid[x][y].killed();
        this.grid[piece.x][piece.y] = piece;
      }
      if(piece.type == "pn" && piece.reachEnd()){
        console.log("reachend");
        this.promoting = piece;
        this.promoting.killed();
        // piece.promote();
      }
    }
  }

  moving(x, y) {
    var move;

    if((x >= 0 && x < 8) && (y >= 0 && y < 8)){
      if(this.movingpiece == null && this.grid[x][y] != null){
        if(this.grid[x][y].color == this.turn){  // check if moving own piece
          this.movingpiece = this.grid[x][y];
          this.movingpiece.startMove();
        }
      }else if(this.movingpiece != null){
        if(move = this.movingpiece.canMove(this,x,y)){
          this.grid[this.movingpiece.x][this.movingpiece.y] = null;
          this.movePiece(this.movingpiece, move, x, y);
          this.changeTurn();
        }
        this.movingpiece.stopMove();
        this.movingpiece = null;
      }
    }
  }

  promotion(x, y) {
    var piece_x = this.promoting.x;
    var piece_y = this.promoting.y;

    var promote = null;
    // console.log(piece_x + " " + piece_y);
    if(x == piece_x){
      if(this.promoting.color == board.player){
        if(y == 0){
          promote = new Queen(piece_x,piece_y,board.player,this.gridsize); // promote to queen
        }else if(y == 1){
          promote = new Rook(piece_x,piece_y,board.player,this.gridsize); // promote to rook
        }else if(y == 2){
          promote = new Bishop(piece_x,piece_y,board.player,this.gridsize); // promote to bishop
        }else if(y == 3){
          promote = new Knight(piece_x,piece_y,board.player,this.gridsize); // promote to knight
        }
        if(promote != null){
          this.selfpieces[this.selfpieces.indexOf(this.promoting)] = promote;;
          this.grid[piece_x][piece_y] = promote;
          this.promoting = null;
        }
      }else if(this.promoting.color == board.opp){
        if(y == 7){
          promote = new Queen(piece_x,piece_y,board.opp,this.gridsize); // promote to queen
        }else if(y == 6){
          promote = new Rook(piece_x,piece_y,board.opp,this.gridsize); // promote to rook
        }else if(y == 5){
          promote = new Bishop(piece_x,piece_y,board.opp,this.gridsize); // promote to bishop
        }else if(y == 4){
          promote = new Knight(piece_x,piece_y,board.opp,this.gridsize); // promote to knight
        }
        if(promote != null){
          this.opppieces[this.opppieces.indexOf(this.promoting)] = promote;;
          this.grid[piece_x][piece_y] = promote;
          this.promoting = null;
        }
      }
    }
  }

  isEnd() {
    if(this.opppieces[4].dead()){
      console.log("White win");
      this.win = "white";
    }else if(this.selfpieces[4].dead()){
      console.log("Black win");
      this.win = "black";
    }
  }
}
