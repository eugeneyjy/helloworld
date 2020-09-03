function showTurn() {
  var color = document.getElementById('turn-color');
  var text = document.getElementById('turn-text');
  if(board.turn == "white"){
    color.style.backgroundColor = "white";
    text.innerHTML = "White to move";
  }else{
    color.style.backgroundColor = "black";
    text.innerHTML = "Black to move";
  }
}

function newGame() {
  board = new Chessboard(board_scale);
  showTurn();
}

var newgame = document.getElementById('new-game');
newgame.addEventListener('click', newGame);
