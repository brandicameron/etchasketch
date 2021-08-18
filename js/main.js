// Create the canvas
const canvas = document.getElementById('canvas');
(function createCanvas() {
  const ctx = canvas.getContext('2d');

  //Size the canvas
  let container = document.querySelector('.etchasketch');
  let canvasSize = container.getBoundingClientRect();
  canvas.height = canvasSize.height;
  canvas.width = canvasSize.width;
  /* 
  Fill Background Color - set here instead of CSS so that downloaded 
  image includes bg color, important for if anything has been erased
  */
  ctx.fillStyle = '#f2f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Drawing
  let drawing = false;

  function startDraw(e) {
    drawing = true;
    draw(e);
  }

  function endDraw() {
    drawing = false;
    ctx.beginPath();
  }

  function draw(e) {
    const eraser = document.querySelector('#erase');

    if (!drawing) return;

    eraser.checked
      ? (ctx.lineWidth = parseInt(penSize.value) + 5)
      : (ctx.lineWidth = parseInt(penSize.value));

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
const penSize = document.getElementById('pen-size');
const dotSize = document.querySelector('.dot-size');

function setPenSize() {
  const rangeThumb = document.getElementById('rangeValue');
  const newValue = parseInt(
    ((penSize.value - penSize.min) * 100) / (penSize.max - penSize.min)
  );

  dotSize.style.width = penSize.value + 'px';
  dotSize.style.height = penSize.value + 'px';
  rangeThumb.style.left = `${newValue}%`;
}

setPenSize();
penSize.addEventListener('input', setPenSize);

// Shake animation
let shake = gsap.to('.etchasketch', {
  x: 15,
  yoyo: true,
  duration: 0.05,
  repeat: 10,
  ease: 'bounce',
  paused: true, //prevents animation from running on page load
});

// Reset canvas
function shakeAndReset() {
  shake.restart();
  setTimeout(function () {
    location.reload();
  }, 200);
}

const reset = document.getElementById('reset');
reset.addEventListener('click', shakeAndReset);

// Window resize canvas correction
window.addEventListener('resize', () => {
  location.reload();
});

// Download image of drawing
const downloadBtn = document.getElementById('download');
downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL();
  downloadBtn.download = 'etch-a-sketch.png';
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

// Prevent page from scrolling/jumping when drawing on canvas
document.body.addEventListener(
  'touchstart',
  function (e) {
    if (e.target === canvas) {
      document.body.style.overflow = 'hidden';
    }
  },
  false
);
document.body.addEventListener(
  'touchend',
  function (e) {
    if (e.target === canvas) {
      document.body.style.overflow = 'hidden';
    }
  },
  false
);
document.body.addEventListener(
  'touchmove',
  function (e) {
    if (e.target === canvas) {
      document.body.style.overflow = 'hidden';
    }
  },
  false
);
