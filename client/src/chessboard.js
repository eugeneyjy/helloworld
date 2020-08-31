class Chessboard {
  constructor(scale) {
    this.scale = scale; // attribute to scale size of board
    this.gridsize = this.scale*10;
    this.sidegrid = 8;
    this.grid = [];
    this.movingpiece = null;
    this.turn = "white";
    // filling initial chess pieces
    for(var i = 0; i < this.sidegrid; i++){
      this.grid.push([]);
      for(var j = 0; j < this.sidegrid; j++){
        this.grid[i].push(null);
      }
    }
    this.fillPieces("black");
    this.fillPieces("white");
    // this.grid[0][0] = new Chesspiece(0,0,"white","r", this.gridsize);
    // this.grid[0][7] = new Chesspiece(0,7,"white","r", this.gridsize);

  }

  fillPieces(color) {
    var piece;
    var x;
    var y;

    for(var i = 0; i < this.sidegrid; i++){
      for(var j = 0; j < 2; j++){
        if(color == "black"){
          x = i;
          y = j;
        }else if(color == "white"){ // mirror the position
          x = this.sidegrid-i-1;
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
            piece = new King(x,y,color,this.gridsize); // creating king
          }else if(i == 4){
            piece = new Queen(x,y,color,this.gridsize); //creating queen
          }
        }
        this.grid[x][y] = piece;
      }
    }
  }

  show() {
    for(var i = 0; i < this.sidegrid; i++){
      for(var j = 0; j < this.sidegrid; j++){
        stroke(0, 74, 158);
        if((i+j)%2 == 0){
          fill(232, 235, 239);
          // fill(0);
        }else{
          fill(125, 135, 150);
          // fill(255);
        }
        rect(i*this.gridsize, j*this.gridsize, this.gridsize, this.gridsize);
      }
    }
    this.showPieces();
  }

  showPieces() {
    for(var i = 0; i < this.sidegrid; i++){
      for(var j = 0; j < this.sidegrid; j++){
        if(this.grid[i][j] != null){
          this.grid[i][j].show();
        }
      }
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

  movePiece() {
    var x = floor(map(mouseX, 0, this.sidegrid*this.gridsize, 0, 8));
    var y = floor(map(mouseY, 0, this.sidegrid*this.gridsize, 0, 8));
    if(x < 8 && y < 8){
      if(this.movingpiece == null && this.grid[x][y] != null){
        if(this.grid[x][y].color == this.turn){  // check if moving own piece
          this.movingpiece = this.grid[x][y];
          this.movingpiece.startMove();
        }
      }else if(this.movingpiece != null){
        if(this.movingpiece.canMove(this,x,y)){
          this.grid[this.movingpiece.x][this.movingpiece.y] = null;
          this.movingpiece.move(x,y);
          this.grid[x][y] = this.movingpiece;
          this.changeTurn();
        }
        this.movingpiece.stopMove();
        this.movingpiece = null;
      }
    }
  }
}
