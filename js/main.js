// Create the canvas
const canvas = document.getElementById('canvas');
(function createCanvas() {
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
})();

// Change pen color
const colorButtons = document.querySelectorAll('input[type=radio]');
let colorChoice;

function changePenColor(e) {
  colorChoice = e.target.value;
  dotSize.style.backgroundColor = colorChoice;
}

colorButtons.forEach((btn) => {
  btn.addEventListener('click', changePenColor);
});

// Change pen size
// https://codepen.io/onyx1812/pen/GRJxmva?editors=0010
const penSize = document.getElementById('penSize');
const dotSize = document.querySelector('.dot-size');
const rangeValue = document.getElementById('rangeValue');

(setValue = () => {
  const newValue = Number(
    ((penSize.value - penSize.min) * 100) / (penSize.max - penSize.min)
  );
  dotSize.style.width = penSize.value + 'px';
  dotSize.style.height = penSize.value + 'px';
  rangeValue.style.left = `${newValue}%`;
})();

penSize.addEventListener('input', setValue);

// Shake animation
let shake = gsap.to('.etchasketch', {
  rotate: 0.5,
  x: 15,
  yoyo: true,
  duration: 0.05,
  repeat: 8,
  ease: 'back',
  paused: true, //paused so animation doesn't run automatically on page load
});

// Reset canvas
function shakeAndReset() {
  shake.restart();
  setTimeout(function () {
    location.reload(true);
  }, 200);
}

const reset = document.getElementById('reset');
reset.addEventListener('click', shakeAndReset);

// Window resize canvas correction
window.addEventListener('resize', () => {
  location.reload(true);
});

// Download image of drawing
const download = document.getElementById('download');
download.addEventListener('click', () => {
  download.href = canvas.toDataURL();
  download.download = 'etch-a-sketch.png';
});

// Touch events
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
