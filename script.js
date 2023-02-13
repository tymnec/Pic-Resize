const imageInput = document.querySelector('#image-input');
const widthInput = document.querySelector('#width-input');
const heightInput = document.querySelector('#height-input');
const resizeButton = document.querySelector('#resize-button');
const outputCanvas = document.querySelector('#output-canvas');

imageInput.addEventListener('change', async (event) => {
  const image = event.target.files[0];
  const imageData = await readImage(image);
  outputCanvas.width = imageData.width;
  outputCanvas.height = imageData.height;
  const ctx = outputCanvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
});

resizeButton.addEventListener('click', () => {
  const width = Number(widthInput.value);
  const height = Number(heightInput.value);
  const imageData = resizeImage(outputCanvas, width, height);
  outputCanvas.width = width;
  outputCanvas.height = height;
  const ctx = outputCanvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
});

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

function resizeImage(canvas, width, height) {
  const imgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  tmpCanvas.getContext('2d').drawImage(canvas, 0, 0, width, height);
  return tmpCanvas.getContext('2d').getImageData(0, 0, width, height);
}

const downloadButton = document.querySelector('#download-button');

  downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'resized-image.png';
    link.href = outputCanvas.toDataURL();
    link.click();
  });