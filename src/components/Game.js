import React, {PureComponent} from 'react';

let canvas, ctx;
let dotId = 1;
let dotCount = 1;
let dotList = [];
let minVelocity = 1;
let maxVelocity = 10;
let minWidth = 10;
let maxWidth = 100;

function Dot(dotId, width, y, x, velocity, color, status) {
  this.dotId = dotId;
  this.width = width;
  this.y = y;
  this.x = x;
  this.velocity = velocity;
  this.color = color;
  this.status = status;
}

class Game extends PureComponent {
  constructor(props) {
    super(props);

    this.clickDot = this.clickDot.bind(this);

    this.state = {};
  }

  componentDidMount() {
    this.initializeCanvas();
    this.runGame();
  }

  getRandomIntInclusive(min, max) {
    if (!min || !max) return console.warn('min & max required');
    // max and minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  drawDot() {
    dotList.forEach(dot => {
      if (dot.status === 1) {
        dotCount++;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.width, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.closePath();
      }
    });
  }

  addDot() {
    const dotWidth = this.getRandomIntInclusive(minWidth, maxWidth);
    const dotY = -(dotWidth * 2); // start off canvas
    const dotX = this.getRandomIntInclusive(1, canvas.width);
    const velocity = this.getRandomIntInclusive(minVelocity, maxVelocity);
    const color = '#000';
    const status = 1; // 1=show, 2=remove
    // add random properties
    dotList[dotId++] = new Dot(
      dotId,
      dotWidth,
      dotY,
      dotX,
      velocity,
      color,
      status,
    );
  }

  initializeCanvas() {
    canvas = document.getElementById('game');
    canvas.height = (window.innerHeight * 400) / 480;
    canvas.width = window.innerWidth;
    ctx = canvas.getContext('2d');
    // events
    canvas.addEventListener('click', this.clickDot, false);
  }

  clickDot(e) {
    const pos = {
      x: e.clientX,
      y: e.clientY,
    };

    dotList.forEach((dot, i) => {
      if (this.isDotClicked(pos, dot)) {
        console.log(dot);
        // TODO: allow only one click if touching
        dot.color = 'red';
        dot.status = 0;
      }
    });
  }

  isDotClicked(pos, dot) {
    return (
      Math.sqrt((pos.x - dot.x) ** 2 + (pos.y - dot.y) ** 2) < dot.width * 2
    );
  }

  collisionDetection() {
    for (let i = 0, len = dotList.length; i < len; i++) {
      if (dotList[i]) {
        // prevent right edge cutting off
        if (dotList[i].x > canvas.width - dotList[i].width) {
          dotList[i].x = dotList[i].x - dotList[i].width;
        }
        // prevent left edge cutting off
        if (dotList[i].x <= dotList[i].width) {
          dotList[i].x = dotList[i].width;
        }
        // remove after reaching past bottom
        if (dotList[i].y - dotList[i].width >= canvas.height) {
          dotList.splice(i, 1);
        }
      }
    }
  }

  runGame() {
    const that = this;

    // Draw loop
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // loop draw
      that.drawDot();
      that.collisionDetection();
      // set new dot position
      dotList.forEach(dot => {
        dot.y = ~~dot.y + dot.velocity;
      });

      window.requestAnimationFrame(draw);
    }
    // add a new dot every second
    window.setInterval(() => {
      this.addDot();
      //console.log('dotList', dotList);
    }, 1000);
    // init
    draw();
  }

  render() {
    return <canvas id="game" />;
  }
}

export default Game;
