const timerId = setInterval(moveBall, 10);
var dx = 3;
var dy = -3; /* displacement at every dt */
var x, y; /* ball location */
var score = 0; /* # of walls you have cleaned */
var tries = 0; /* # of tries to clean the wall */
var started = false; /* false means ready to kick the ball */
var wall, ball, court, paddle, brick, msg;
var court_height, court_width, paddle_left;

var bricks = new Array(4); // rows of bricks
var colors = ["red", "blue", "yellow", "green"];
/* get an element by id */
function id(s) {
  return document.getElementById(s);
}
/* convert a string with px to an integer, eg "30px" -> 30 */
function pixels(pix) {
  pix = pix.replace("px", "");
  num = Number(pix);
  return num;
}

/* place the ball on top of the paddle */
function readyToKick() {
  x = pixels(paddle.style.left) + paddle.width / 2.0 - ball.width / 2.0;
  y = pixels(paddle.style.top) - 2 * ball.height;
  ball.style.left = x + "px";
  ball.style.top = y + "px";
}

/* paddle follows the mouse movement left-right */
function movePaddle(e) {
  var ox = e.pageX - court.getBoundingClientRect().left;
  paddle.style.left =
    ox < 0
      ? "0px"
      : ox > court_width - paddle.width
      ? court_width - paddle.width + "px"
      : ox + "px";
  if (!started) readyToKick();
}

function initialize() {
  court = id("court");
  ball = id("ball");
  msg = id("messages");
  brick = id("red");
  paddle = id("paddle");
  wall = id("wall");
  court_height = pixels(court.style.height);
  court_width = pixels(court.style.width);
  for (i = 0; i <= 4; i++) {
    // each row has 20 bricks
    bricks[i] = new Array(20);
    var b = id(colors[i]);
    for (j = 0; j < 20; j++) {
      var x = b.cloneNode(true);
      bricks[i][j] = x;
      wall.appendChild(x);
    }
    b.style.visibility = "hidden";
  }
  started = false;
}

/* true if the ball at (x,y) hits the brick[i][j] */
function hits_a_brick(x, y, i, j) {
  var top = i * brick.height - 450;
  var left = j * brick.width;
  return (
    x >= left && x <= left + brick.width && y >= top && y <= top + brick.height
  );
}
//move the ball
function moveBall() {
  if (started) {
    x += dx;
    y += dy;
    ball.style.left = x + "px";
    ball.style.top = y + "px";
    if (x < 0 || x > court_width - ball.width) {
      dx = -dx;
    }
    if (y == -480) {
      dy = -dy;
    }
    if (y > 20) {
      tries++;
      msg.innerHTML = "You have missed the ball. Try again.";
      started = false;
      readyToKick();
    }
    if (
      x >= pixels(paddle.style.left) &&
      x <= pixels(paddle.style.left) + paddle.width &&
      y >= pixels(paddle.style.top) - ball.height
    ) {
      dy = -dy;
    }
    collisions();
  }
  scoreSpan = document.getElementById("score").innerHTML = score;
  triesSpan = document.getElementById("tries").innerHTML = tries;
}

//collisions function
function collisions() {
  for (i = 0; i < 4; i++) /* rows*/ {
    for (j = 0; j < 20; j++) /* columns */ {
      if (
        hits_a_brick(x, y, i, j) &&
        bricks[i][j].style.visibility != "hidden"
      ) {
        dy = -dy;
        y += dy;
        ball.style.top = y + "px";
        bricks[i][j].style.visibility = "hidden";
        score++;
        msg.innerHTML = "Score: " + score + " Tries: " + tries;
        if (score == 80) {
          msg.innerHTML = "You won! Score: " + score + " Tries: " + tries;
          started = false;
        }
      }
    }
  }
}

function ClickStart() {
  started = true;
  readyToKick();
}

function main() {
  court.onmousemove = movePaddle;
  ClickStart();
  timerId
}

function startGame() {
  main();
}

function resetGame() {
  score = 0;
  scoreSpan = document.getElementById("score").innerHTML = score;
  msg.innerHTML = "Score: " + score + " Tries: " + tries;
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 20; j++) {
      bricks[i][j].style.visibility = "visible";
    }
  }
  main();
}
