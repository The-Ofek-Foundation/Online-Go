var docwidth, docheight, gowidth;
var size;
var board, boards, captures;
var blackturn, boardon;
var wcaptures, bcaptures;
var second, seconds;
var i, a;
var ss; // square size

var goban = document.getElementById("board");
var brush = goban.getContext("2d");

function draw_piece(x, y) {
  switch (board[x][y])	{
    case 'B': brush.fillStyle = "black"; break;
    case 'W': brush.fillStyle = "white"; break;
    default: return;
  }
  brush.beginPath();
  brush.arc(x * ss + ss / 2, y * ss + ss / 2, ss * 0.3, 0, Math.PI * 2);
  brush.fill();
  brush.strokeStyle = "black";
  brush.stroke();
}

function draw_board() {
  brush.beginPath();
  for (i = 1; i <= board.length; i++) {
    brush.moveTo(i * ss - ss / 2, 0);
    brush.lineTo(i * ss - ss / 2, gowidth);
  }
  for (a = 1; a <= board[0].length; a++) {
    brush.moveTo(0, a * ss - ss / 2);
    brush.lineTo(gowidth, a * ss - ss / 2);
  }
  brush.strokeStyle = "black";
  brush.stroke();
  
  for (i = 0; i < board.length; i++)
    for (a = 0; a < board[i].length; a++)
        draw_piece(i, a);
}

function new_game(length) {
  size = length;
  blackturn = true;
  boardon = 0;
  boards = new Array(size * size * 2);
  captures = new Array(size * size * 2);
  for (i = 0; i < boards.length; i++) {
    boards[i] = new Array(size);
    captures[i] = new Array(2);
    for (a = 0; a < boards[i].length; a++)
      boards[i][a] = new Array(size);
  }
  board = new Array(size);
  for (i = 0; i < board.length; i++) {
    board[i] = new Array(size);
    for (a = 0; a < board[i].length; a++)
      board[i][a] = ' ';
  }
  wcaptures = bcaptures = 0;
  boardon++;
  ss = gowidth / size;
}

$(document).ready(function() {
  
  docwidth = $(document).outerWidth(true);
  docheight = $(document).outerHeight(true);
  
  if (docwidth * 0.8 > docheight) {
    gowidth = docheight;
    $('#board').css('left', (docwidth * 0.8 - docheight)/2);
  }
  else gowidth = docwidth * 0.8;
  
  $('#board').width(gowidth).height(gowidth).css('top', (docheight - gowidth)/2);
  
  goban.setAttribute('width', gowidth);
  goban.setAttribute('height', gowidth);
  
  new_game(19);
  draw_board();
});

function get_coord(loc) {
  return parseInt(loc / ss, 10);
}
function can_place_here(x, y) {
  return true;
}

$('#board').mousedown(function(e) {  
  var x = get_coord(e.pageX - parseInt($(this).css('left'), 10));
  var y = get_coord(e.pageY - parseInt($(this).css('top'), 10));
    
  if (can_place_here(x, y))
    board[x][y] = blackturn ? 'B':'W';
  else return;
  
  
  
  boardon++;
  blackturn = !blackturn;
  draw_board();
});
