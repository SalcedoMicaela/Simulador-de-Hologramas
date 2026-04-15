import * as THREE from 'three';
import { StateManager } from './StateManager.js';
import { parseGIF, decompressFrames } from 'https://esm.sh/gifuct-js@2.1.2';

export class InputController {
  constructor(sceneManager, uiController) {
    this.sceneManager = sceneManager;
    this.uiController = uiController;
    this.gifSpeedMultiplier = 9.0;

    this.bindInput('imageInput');
  }

  bindInput(elementId) {
    const input = document.getElementById(elementId);
    if (!input) return;

    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      this.uiController.setModeToImage();

      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.png')) {
        const objectUrl = URL.createObjectURL(file);
        this.loadPNG(objectUrl);
      } else if (fileName.endsWith('.gif')) {
        this.loadGIF(file);
      } else {
        alert('Solo se permiten PNG o GIF.');
      }
    });
  }

  cleanupGifSource() {
    if (this.activeGifImg && this.activeGifImg.parentNode) {
      this.activeGifImg.parentNode.removeChild(this.activeGifImg);
    }
    this.activeGifImg = null;

    if (this.activeGifUrl) {
      URL.revokeObjectURL(this.activeGifUrl);
      this.activeGifUrl = null;
    }
  }

  setImageTexture(texture, gifUpdater = null) {
    StateManager.imageTexture = texture;
    StateManager.gifData = gifUpdater;
    this.sceneManager.updateAppearance();
  }

  loadPNG(url) {
    this.cleanupGifSource();

    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (texture) => {
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.encoding = THREE.sRGBEncoding;

        this.setImageTexture(texture, null);
        URL.revokeObjectURL(url);
      },
      undefined,
      () => {
        URL.revokeObjectURL(url);
        alert('No se pudo cargar la imagen PNG.');
      }
    );
  }

  async loadGIF(file) {
    try {
      const buffer = await file.arrayBuffer();
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);

      if (!frames || frames.length === 0) {
        alert('El GIF no tiene frames válidos.');
        return;
      }

      const width = gif.lsd.width;
      const height = gif.lsd.height;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const getDelay = (frame) => {
        const baseDelay = (frame.delay || 10) * 10;
        return Math.max(16, baseDelay / this.gifSpeedMultiplier);
      };

      let frameIndex = 0;
      let lastTick = performance.now();
      let currentDelay = getDelay(frames[0]);
      let lastFrame = null;

      const drawFrame = (frame) => {
        const patch = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        );
        ctx.putImageData(patch, frame.dims.left, frame.dims.top);
      };

      const advance = () => {
        if (lastFrame && lastFrame.disposalType === 2) {
          ctx.clearRect(
            lastFrame.dims.left,
            lastFrame.dims.top,
            lastFrame.dims.width,
            lastFrame.dims.height
          );
        }

        const frame = frames[frameIndex];
        drawFrame(frame);

        lastFrame = frame;
        currentDelay = getDelay(frame);
        frameIndex = (frameIndex + 1) % frames.length;
      };

      advance();

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.encoding = THREE.sRGBEncoding;

      const gifUpdater = {
        update: () => {
          const now = performance.now();
          if (now - lastTick >= currentDelay) {
            lastTick = now;
            advance();
            texture.needsUpdate = true;
          }
        }
      };

      this.setImageTexture(texture, gifUpdater);
    } catch (e) {
      console.error('Error al decodificar GIF:', e);
      alert('No se pudo decodificar el GIF.');
    }
  }
}