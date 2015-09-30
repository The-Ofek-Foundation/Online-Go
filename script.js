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

function log_array(arr) {
  for (i = 0; i < arr.length; i++)
    console.log(arr[i]);
}

function equal(board1, board2)	{
  for (i = 0; i < board.length; i++)
    for (a = 0; a < board[i].length; a++)
      if (board1[i][a] != board2[i][a])
          return false;
  return true;
}

function set(goban, from)	{
  for (i = 0; i < goban.length; i++)
    for (a = 0; a < goban[i].length; a++)
      goban[i][a] = from[i][a];
}

function save_captures(index, b, w)	{
  captures[index][0] = b;
  captures[index][1] = w;
}
function save_seconds(index, times)	{
  seconds[index] = times;
}

function save_board(index, goban) {
  for (i = 0; i < goban.length; i++)
    for (a = 0; a < goban[i].length; a++)
      boards[index][i][a] = goban[i][a];
  save_captures(index, bcaptures, wcaptures);
  save_seconds(index, seconds);
}

function get_captures(index)	{
  bcaptures = captures[index][0];
  wcaptures = captures[index][1];
}

function get_seconds(index)	{
  second = seconds[index];
}

function get_board(index)	{
    return boards[index];
}

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

function clear_canvas() {
  brush.clearRect(0, 0, gowidth, gowidth);
}

function draw_board() {
  clear_canvas();
  
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
  seconds = new Array(size * size * 2);
  for (i = 0; i < seconds.length; i++)
    seconds[i] = new Array(2);
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
  draw_board();
}

$(document).ready(function() {
  
  docwidth = $(document).outerWidth(true);
  docheight = $(document).outerHeight(true);
  
  if (docwidth * 0.8 > docheight) {
    gowidth = docheight;
    $('#board').css('left', (docwidth * 0.8 - docheight)/3);
  }
  else gowidth = docwidth * 0.8;
  
  $('#board').width(gowidth).height(gowidth).css('top', (docheight - gowidth)/2);
  $('#settings-panel').width(docwidth - $('#board').outerWidth() - parseInt($('#board').css('left'), 10));
  
  goban.setAttribute('width', gowidth);
  goban.setAttribute('height', gowidth);
  
  new_game(19);
});

function check_dead_helper(dead, kill_char)	{
  var changed = false;
  for (i = 0; i < board.length; i++)
    for (a = 0; a < board[i].length; a++)
      if (dead[i][a] == -1) {
        if ((i > 0 && dead[i-1][a] === 0) || (i < size - 1 && dead[i+1][a] === 0) || (a > 0 && dead[i][a-1] === 0) || (a < size - 1 && dead[i][a+1] === 0)) {
          dead[i][a] = 0;
          changed = true;
          if (i > 0)
            i -= 1;
          if (a > 0)
            a -= 2;
        }
        else {
          if (i > 0 && board[i-1][a] == kill_char && dead[i-1][a] != -1) {
            dead[i-1][a] = -1;
            changed = true;
          }
          if (i < size - 1 && board[i+1][a] == kill_char && dead[i+1][a] != -1) {
            dead[i+1][a] = -1;
            changed = true;
          }
          if (a > 0 && board[i][a-1] == kill_char && dead[i][a-1] != -1) {
            dead[i][a-1] = -1;
            changed = true;
          }
          if (a < size - 1 && board[i][a+1] == kill_char && dead[i][a+1] != -1) {
            dead[i][a+1] = -1;
            changed = true;
          }
        }
      }
            
  return changed;
}

function check_dead(turn, x, y)	{
  var kill_char = turn ? 'B':'W';
  var dead = new Array(size);
  for (i = 0; i < dead.length; i++) {
    dead[i] = new Array(size);
    for (a = 0; a < dead[i].length; a++) {
      if (board[i][a] == ' ')
        dead[i][a] = 0;
      else dead[i][a] = 1;
    }
  }

  if (board[x][y] == kill_char)
    dead[x][y] = -1;
  else {
    if (x > 0 && board[x-1][y] == kill_char)
      dead[x-1][y] = -1;
    if (x < size - 1 && board[x+1][y] == kill_char)
      dead[x+1][y] = -1;
    if (y > 0 && board[x][y-1] == kill_char)
      dead[x][y-1] = -1;
    if (y < size - 1 && board[x][y+1] == kill_char)
      dead[x][y+1] = -1;
  }
        
  while (check_dead_helper(dead, kill_char));
    
  for (i = 0; i < dead.length; i++)
    for (a = 0; a < dead[i].length; a++)
      if (dead[i][a] == -1)	{
        board[i][a] = ' ';
        if (turn) wcaptures++;
        else bcaptures++;
      }
}


function get_coord(loc) {
  return parseInt(loc / ss, 10);
}

function can_place_here(x, y) {
  if (board[x][y] != ' ') {
    alert("Illegal to place on stone!");
    return false;
  }
  return true;
}

$('#board').mousedown(function(e) {  
  var x = get_coord(e.pageX - parseInt($(this).css('left'), 10));
  var y = get_coord(e.pageY - parseInt($(this).css('top'), 10));
    
  if (can_place_here(x, y))
    board[x][y] = blackturn ? 'B':'W';
  else return;
  
  check_dead(!blackturn, x, y);
  check_dead(blackturn, x, y);
  
  if (boardon > 3)
    if (equal(board, get_board(boardon-2))) {
      set(board, get_board(boardon-1));
      get_captures(boardon-1);
      get_seconds(boardon-1);
      alert("Illegal KO move!");
      return;
    }
  save_board(boardon, board);
  
  boardon++;
  blackturn = !blackturn;
  draw_board();
});

$('#form-new-game').submit(function() {
  new_game(parseInt($('input[name="board-size"]').val(), 10));
  $('#new-game-menu').animate({opacity: 0}, "slow", function() {
    $(this).css('z-index', -1);
  });
  return false;
});

$('#btn-new-game').click(function() {
  $('#new-game-menu').animate({opacity: 1}, "slow").css('z-index', 1);
});
  
