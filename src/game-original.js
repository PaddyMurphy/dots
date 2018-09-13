// <canvas id="myCanvas" width="480" height="320"></canvas>

(function() {
  //var canvas = document.querySelector('.app-game');
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  // ball
  // initial postion
  var x = canvas.width / 2;
  var y = canvas.height - 30;
  // amount to move ball
  var dx = 2;
  var dy = -2;
  var ballRadius = 10;
  var ballColor = '#bada55';
  // paddle
  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width - paddleWidth) / 2;
  var rightPressed = false;
  var leftPressed = false;
  var spacePressed = false;
  // Bricks
  var brickRowCount = 3;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;
  var brickColor = 'rgba(255, 255, 255, 0.8)';
  var brickLevel = 0;
  var brickLowerInterval = 2000;
  // scoring
  var score = 0;
  var lives = 3;
  // lazer
  var lazerId = 0;
  var lazerList = [];
  var lazerHeight = 8;
  var lazerWidth = 4;
  var lazerSpeed = 5;
  var lazerColor = 'red';
  var lazerStartY = canvas.height - paddleHeight;
  var maxLazers = 4;
  // set up bricks
  var bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1,
        health: 3,
        color: brickColor,
        brickHeight: brickHeight,
      };
    }
  }

  // Events
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  document.addEventListener('mousemove', mouseMoveHandler, false);
  document.addEventListener('mousedown', fireLazer, false);

  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }

  function keyDownHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = true;
    } else if (e.keyCode == 37) {
      leftPressed = true;
    } else if (e.keyCode == 32) {
      e.preventDefault();
      fireLazer();
    }
  }

  function fireLazer() {
    lazerList[lazerId++] = new Lazer(lazerId, lazerSpeed);
  }

  function keyUpHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    } else if (e.keyCode == 37) {
      leftPressed = false;
    }
  }

  function rectCircleColliding(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > rect.w / 2 + circle.r) {
      return false;
    }
    if (distY > rect.h / 2 + circle.r) {
      return false;
    }

    if (distX <= rect.w / 2) {
      return true;
    }
    if (distY <= rect.h / 2) {
      return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return dx * dx + dy * dy <= circle.r * circle.r;
  }

  function circleRectColliding(circle, rect) {
    var distX = Math.abs(rect.x - rect.w / 2 - circle.x);
    var distY = Math.abs(rect.y - rect.h / 2 - circle.y);

    if (distX > rect.w / 2 + circle.r) {
      return false;
    }
    if (distY > rect.h / 2 + circle.r) {
      return false;
    }

    if (distX <= rect.w / 2) {
      return true;
    }
    if (distY <= rect.h / 2) {
      return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return dx * dx + dy * dy <= circle.r * circle.r;
  }

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];

        if (b.status == 1) {
          // check lazer collision
          lazerList.forEach(function(lazer, i) {
            if (!lazer.status) return;
            // remove brick on lazer hit
            if (
              lazer.x > b.x &&
              lazer.x < b.x + brickWidth &&
              lazer.y > b.y &&
              lazer.y < b.y + brickHeight
            ) {
              // destroy lazer
              lazer.status = 0;
              // remove the brick
              b.health = --b.health;
              b.brickHeight = b.brickHeight - 5;
              b.color = getRandomColor();
              if (b.health === 0) {
                b.status = 0;
                // update score
                score++;
              }
            }

            // check lazer collision with ball
            if (
              circleRectColliding(
                {x: x, y: y, r: ballRadius},
                {x: lazer.x, y: lazer.y, w: lazerWidth, h: lazerHeight},
              )
            ) {
              console.log('ball hit');
              lazer.status = 0;
              // change direction
              dy = -dy;
            }
          }); // END lazerList

          // check ball collision with bricks
          if (
            rectCircleColliding(
              {x: x, y: y, r: ballRadius},
              {x: b.x, y: b.y, w: brickWidth, h: brickHeight},
            )
          ) {
            // move the ball
            dy = -dy;
            // remove the brick
            b.health = --b.health;
            // b.brickHeight = b.brickHeight - 5;
            b.color = getRandomColor();
            if (b.health === 0) {
              b.status = 0;
              // update score
              score++;
            }
          }

          // TODO: add winning
          if (score == brickRowCount * brickColumnCount) {
            console.log('YOU WIN, CONGRATULATIONS!');
            // document.location.reload();
          }
        } // end if b.status
      }
    }
  }

  function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Score: ' + score, 8, 20);
  }

  function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
  }

  // Ball
  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
  }

  // Paddle
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }

  // Lazer
  function Lazer(lazerId, lazerSpeed) {
    this.lazerId = lazerId;
    this.x = paddleX + paddleWidth / 2;
    this.y = lazerStartY;
    this.lazerSpeed = lazerSpeed;
    this.status = 1;
  }

  function drawLazer() {
    var lazerCount = 0;
    lazerList.forEach(function(lazer) {
      if (lazer.status === 1) {
        // allow a max of 3 at time
        lazerCount++;
        if (lazerCount >= maxLazers) {
          lazer.status = 0;
        }

        lazer.y = lazer.y - lazer.lazerSpeed;

        ctx.beginPath();
        ctx.fillStyle = lazerColor;
        ctx.rect(lazer.x, lazer.y, lazerWidth, lazerHeight);
        // circle lazer
        // ctx.arc(lazer.x, lazer.y + lazerStartY, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
      }
    });
  }

  function drawBricks() {
    // TODO: setInterval and lower bricks every 5 seconds
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, bricks[c][r].brickHeight);
          ctx.fillStyle = bricks[c][r].color;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function lowerBricks() {
    // start at brickLevel = 1
    // add level every few seconds
    var lowerInterval = setInterval(function() {
      if (brickLevel <= 10) {
        brickLevel++;
      }
    }, brickLowerInterval);
  }

  // Draw loop
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawLazer();
    collisionDetection();

    // bounce off walls: top & bottom
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if (!lives) {
          console.log('GAME OVER');
          // TODO: implement reload system
          document.location.reload();
        } else {
          // reset the game
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    // bounce off walls: left & right
    if (x + dx > canvas.width - ballRadius || x + dx < 0) {
      dx = -dx;
    }

    // set new ball position
    x += dx;
    y += dy;

    // set paddle postion
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    // clean up lazers
    if (lazerList.length) {
      lazerList.forEach(function(lazer) {
        // remove if it goes past the top
        if (lazer.y < 0) {
          lazer.status = 0;
        }
      });
    }

    // loop draw
    window.requestAnimationFrame(draw);
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // init
  draw();
  lowerBricks();
})();
