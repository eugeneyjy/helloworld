class Minimax {
  constructor(depth, color="black") {
    this.color = color;
    this.max_depth = depth;
    this.setOppColor();
  }

  setOppColor() {
    this.opp_color = "white";
    if(this.color == "white"){
      this.opp_color = "black";
    }
  }

  getAiPieces(board) {
    var ai_pieces = board.blackPieces;
    if(this.color == "white"){
      ai_pieces = board.whitePieces;
    }
    return ai_pieces;
  }

  getPlayerPieces(board) {
    var player_pieces = board.whitePieces;
    if(this.color == "white"){
      player_pieces = board.blackPieces;
    }
    return player_pieces;
  }

  getPieces(board, color) {
    var pieces = board.whitePieces;
    if(color == "black"){
      pieces = board.blackPieces;
    }
    return pieces;
  }

  utilityScore(board) {
    var score = 0;
    var ai_pieces = this.getAiPieces(board);
    var player_pieces = this.getPlayerPieces(board);
    for(var i = 0; i < ai_pieces.length; i++){
      if(!ai_pieces[i].dead())
        score += ai_pieces[i].value;
    }
    for(var i = 0; i < player_pieces.length; i++){
      if(!player_pieces[i].dead())
        score -= player_pieces[i].value;
    }
    return score;
  }

  successor(board, color) {
    var pieces = this.getPieces(board, color);
    // console.log(pieces.length-1);
    var curr_piece, moves, curr_eat;
    var result = [];
    for(var i = (pieces.length-1); i >= 0; i--){
      // console.log(i);
      curr_piece = pieces[i].clonePiece(board);
      if(curr_piece.alive){
        curr_piece.moves = curr_piece.legalMoves(board);
        result.push(curr_piece);
      }
    }
    // console.log(result);
    return result;
  }

  maxValue(board, depth) {
    if(depth >= this.max_depth){
      return this.utilityScore(board);
    }
    var value = -Infinity;
    var pieces = this.successor(board, this.color);
    var temp_board;
    var moving_piece, curr_move, move_x, move_y;
    for(var i = 0; i < pieces.length; i++){
      moving_piece = pieces[i];
      for(var j = 0; j < moving_piece.moves.length; j++){
        temp_board = board.cloneBoard();
        curr_move = moving_piece.moves[j];
        move_x = curr_move[0];
        move_y = curr_move[1];
        temp_board.movePiece(moving_piece.x, moving_piece.y, move_x, move_y);
        value = Math.max(value, this.minValue(temp_board, depth+1));
      }
    }
    return value;
  }

  minValue(board, depth) {
    if(depth >= this.max_depth){
      return this.utilityScore(board);
    }
    var value = Infinity;
    var temp_board;
    var pieces = this.successor(board, this.opp_color);
    var moving_piece, curr_move, move_x, move_y;
    for(var i = 0; i < pieces.length; i++){
      moving_piece = pieces[i];
      for(var j = 0; j < moving_piece.moves.length; j++){
        temp_board = board.cloneBoard();
        curr_move = moving_piece.moves[j];
        move_x = curr_move[0];
        move_y = curr_move[1];
        temp_board.movePiece(moving_piece.x, moving_piece.y, move_x, move_y);
        value = Math.min(value, this.maxValue(temp_board, depth+1));
      }
    }
    return value;
  }

  maxValueAB(board, depth, alpha, beta) {
    if(depth >= this.max_depth){
      return this.utilityScore(board);
    }
    var value = -Infinity;
    var pieces = this.successor(board, this.color);
    var temp_board;
    var moving_piece, curr_move, move_x, move_y;
    for(var i = 0; i < pieces.length; i++){
      moving_piece = pieces[i];
      for(var j = 0; j < moving_piece.moves.length; j++){
        temp_board = board.cloneBoard();
        curr_move = moving_piece.moves[j];
        move_x = curr_move[0];
        move_y = curr_move[1];
        temp_board.movePiece(moving_piece.x, moving_piece.y, move_x, move_y);
        value = Math.max(value, this.minValueAB(temp_board, depth+1, alpha, beta));
        if(value >= beta){
          // print("break out");
          return value;
        }
        alpha = Math.max(alpha, value);
      }
    }
    return value;
  }

  minValueAB(board, depth, alpha, beta) {
    if(depth >= this.max_depth){
      return this.utilityScore(board);
    }
    var value = Infinity;
    var temp_board;
    var pieces = this.successor(board, this.opp_color);
    // console.log(pieces);
    var moving_piece, curr_move, move_x, move_y;
    for(var i = 0; i < pieces.length; i++){
      moving_piece = pieces[i];
      for(var j = 0; j < moving_piece.moves.length; j++){
        temp_board = board.cloneBoard();
        curr_move = moving_piece.moves[j];
        move_x = curr_move[0];
        move_y = curr_move[1];
        temp_board.movePiece(moving_piece.x, moving_piece.y, move_x, move_y);
        value = Math.min(value, this.maxValueAB(temp_board, depth+1, alpha, beta));
        if(value <= alpha){
          // print("break out min");
          return value;
        }
        beta = Math.min(beta, value);
      }
    }
    return value;
  }


  getMove(board) {
    var pieces = this.successor(board, this.color);
    var temp_board, move_from, move_to, val, max_val = -Infinity;
    var moving_piece, curr_move, move_x, move_y;
    var alpha = -Infinity;
    var beta = Infinity;
    var count = 1;
    for(var i = 0; i < pieces.length; i++){
      moving_piece = pieces[i];
      for(var j = 0; j < moving_piece.moves.length; j++){
        temp_board = board.cloneBoard();
        curr_move = moving_piece.moves[j];
        move_x = curr_move[0];
        move_y = curr_move[1];
        temp_board.movePiece(moving_piece.x, moving_piece.y, move_x, move_y);
        val = this.minValueAB(temp_board, 1, alpha, beta);
        // val = this.minValue(temp_board, 0);
        console.log(moving_piece);
        console.log(val);
        if(val > max_val){
          console.log("choose");
          max_val = val;
          move_from = [moving_piece.x, moving_piece.y];
          move_to = [move_x, move_y];
        }else if(val == max_val){
          if(Math.random() * count < 1){
            console.log("change choice");
            move_from = [moving_piece.x, moving_piece.y];
            move_to = [move_x, move_y];
          }
          count += 1;
        }
        alpha = Math.max(alpha, max_val);
      }
    }
    // print(val);
    return [move_from, move_to];
  }

}
