const imageInput = document.querySelector('#image-input');
const widthInput = document.querySelector('#width-input');
const heightInput = document.querySelector('#height-input');
const resizeButton = document.querySelector('#resize-button');
const outputCanvas = document.querySelector('#output-canvas');
const downloadButton = document.querySelector('#download-button');
const increaseButton = document.querySelector('#increase-button');
const decreaseButton = document.querySelector('#decrease-button');
const smoothingCheckbox = document.querySelector('#smoothing-checkbox');

let originalWidth = 0;
let originalHeight = 0;
let currentWidth = 0;
let currentHeight = 0;

imageInput.addEventListener('change', async (event) => {
  const image = event.target.files[0];
  const imageData = await readImage(image);
  outputCanvas.width = imageData.width;
  outputCanvas.height = imageData.height;
  const ctx = outputCanvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  originalWidth = imageData.width;
  originalHeight = imageData.height;
  currentWidth = originalWidth;
  currentHeight = originalHeight;
  widthInput.value = originalWidth;
  heightInput.value = originalHeight;
});

function handleResize() {
  const width = Number(widthInput.value);
  const height = Number(heightInput.value);
  currentWidth = width;
  currentHeight = height;
  const imageData = resizeImage(outputCanvas, width, height, smoothingCheckbox.checked);
  outputCanvas.width = width;
  outputCanvas.height = height;
  const ctx = outputCanvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
}

function handleIncrease() {
  currentWidth *= 1.05;
  currentHeight *= 1.05;
  widthInput.value = currentWidth;
  heightInput.value = currentHeight;
  handleResize();
}

function handleDecrease() {
  currentWidth *= 0.95;
  currentHeight *= 0.95;
  widthInput.value = currentWidth;
  heightInput.value = currentHeight;
  handleResize();
}

async function readImage(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const img = new Image();
      img.addEventListener('load', () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      });
      img.src = reader.result;
    });
    reader.readAsDataURL(image);
  });
}

function resizeImage(canvas, width, height, smooth) {
  const imgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  const ctx = tmpCanvas.getContext('2d');
  if (smooth) {
    ctx.imageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.mozImageSmoothingEnabled = true;
    ctx.msImageSmoothingEnabled = true;
    ctx.drawImage(canvas, 0, 0, width, height);
  } else {
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, width, height);
  }
  return ctx.getImageData(0, 0, width, height);
}

downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'resized-image.png';
  link.href = outputCanvas.toDataURL();
  link.click();
});

resizeButton.addEventListener('click', handleResize);
increaseButton.addEventListener('click', handleIncrease);
decreaseButton.addEventListener('click', handleDecrease);
