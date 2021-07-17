gsap.registerPlugin(CSSPlugin);

//Create the canvas
const canvas = document.getElementById('canvas');

function createCanvas() {
  const ctx = canvas.getContext('2d');

  //Sizing the canvas
  let container = document.querySelector('.etchasketch');
  let canvasSize = container.getBoundingClientRect();
  canvas.height = canvasSize.height;
  canvas.width = canvasSize.width;

  //Fill Background Color - set here instead of CSS so that downloaded image includes bg color, important for if anything had been erased
  ctx.fillStyle = '#e5e5e3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Painting
  let painting = false;

  function startDraw(e) {
    painting = true;
    draw(e);
  }

  function endDraw() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;

    const eraser = document.querySelector('#erase');
    // Set pen & eraser size
    if (eraser.checked === true) {
      ctx.lineWidth = parseInt(penSize.value) + 5;
    } else {
      ctx.lineWidth = parseInt(penSize.value);
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colorChoice;
    ctx.lineTo(e.clientX - canvasSize.left, e.clientY - canvasSize.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvasSize.left, e.clientY - canvasSize.top);
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mousemove', draw);
}

window.addEventListener('load', createCanvas);

// CHANGE PEN COLOR
const colorButtons = document.querySelectorAll('input[type=radio]');
let colorChoice;

function changePenColor(e) {
  colorChoice = e.target.value;
}

colorButtons.forEach((btn) => {
  btn.addEventListener('click', changePenColor);
});

// CHANGE PEN SIZE
// https://codepen.io/onyx1812/pen/GRJxmva?editors=0010
const penSize = document.getElementById('penSize'),
  rangeValue = document.getElementById('rangeValue'),
  setValue = () => {
    const newValue = Number(
        ((penSize.value - penSize.min) * 100) / (penSize.max - penSize.min)
      ),
      newPosition = 14 - newValue * 0.27;
    rangeValue.innerHTML = `<span>Pen Size: ${penSize.value}</span>`;
    rangeValue.style.left = `calc(${newValue}% + (${newPosition}px))`;
  };
document.addEventListener('DOMContentLoaded', setValue);
penSize.addEventListener('input', setValue);

// SHAKE ANIMATION
let shake = gsap.to('.etchasketch', {
  rotate: 0.5,
  x: 15,
  yoyo: true,
  duration: 0.05,
  repeat: 8,
  ease: 'back',
  paused: true, //paused so animation doesn't run automatically on page load
});

// RESET CANVAS
const reset = document.getElementById('reset');

function shakeAndReset() {
  shake.restart();
  setTimeout(function () {
    location.reload(true);
  }, 200);
}

reset.addEventListener('click', shakeAndReset);

//Window resize canvas correction
window.addEventListener('resize', () => {
  location.reload(true);
});

// DOWNLOAD IMAGE OF DRAWING
const download = document.getElementById('download');
download.addEventListener('click', () => {
  download.href = canvas.toDataURL();
  download.download = 'etch-a-sketch.png';
});

// TOUCH
// Set up touch events for mobile, etc
canvas.addEventListener(
  'touchstart',
  function (e) {
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  'touchend',
  function (e) {
    var mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  'touchmove',
  function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
  };
}
