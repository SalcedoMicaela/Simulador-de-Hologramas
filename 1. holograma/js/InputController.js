import * as THREE from 'three';
import { StateManager } from './StateManager.js';

export class InputController {
  constructor(sceneManager, uiController) {
    this.sceneManager = sceneManager;
    this.uiController = uiController;

    this.bindInput('imageFront', 'front');
    this.bindInput('imageRight', 'right');
    this.bindInput('imageBack', 'back');
    this.bindInput('imageLeft', 'left');
  }

  bindInput(elementId, faceKey) {
    const input = document.getElementById(elementId);

    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      this.uiController.setModeToImage();

      const fileName = file.name.toLowerCase();
      const objectUrl = URL.createObjectURL(file);

      if (fileName.endsWith('.png')) {
        this.loadPNG(objectUrl, faceKey);
      } else if (fileName.endsWith('.gif')) {
        this.loadGIF(objectUrl, faceKey);
      } else {
        alert('Solo se permiten PNG o GIF.');
      }
    });
  }

  loadPNG(url, faceKey) {
    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (texture) => {
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.encoding = THREE.sRGBEncoding;

        StateManager.imageTextures[faceKey] = texture;
        StateManager.gifData[faceKey] = null;
        this.sceneManager.updateAppearance();
      },
      undefined,
      () => {
        alert(`No se pudo cargar la textura ${faceKey}.`);
      }
    );
  }

  loadGIF(url, faceKey) {
    const img = document.createElement('img');
    img.src = url;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.encoding = THREE.sRGBEncoding;

      StateManager.imageTextures[faceKey] = texture;
      StateManager.gifData[faceKey] = {
        update: () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          texture.needsUpdate = true;
        }
      };

      this.sceneManager.updateAppearance();
    };

    img.onerror = () => {
      alert(`No se pudo cargar el GIF ${faceKey}.`);
    };
  }
}