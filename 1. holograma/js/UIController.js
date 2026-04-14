import { StateManager } from './StateManager.js';

export class UIController {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;

    this.modeSelect = document.getElementById('modeSelect');
    this.viewSelect = document.getElementById('viewSelect');
    this.objectSelect = document.getElementById('objectSelect');
    this.colorPicker = document.getElementById('colorPicker');
    this.scaleRange = document.getElementById('scaleRange');
    this.transparencyRange = document.getElementById('transparencyRange');
    this.intensityRange = document.getElementById('intensityRange');
    this.rotateToggle = document.getElementById('rotateToggle');
    this.zoomIn = document.getElementById('zoomIn');
    this.zoomOut = document.getElementById('zoomOut');
    this.resetViewBtn = document.getElementById('resetView');

    this.scaleValue = document.getElementById('scaleValue');
    this.transparencyValue = document.getElementById('transparencyValue');
    this.intensityValue = document.getElementById('intensityValue');
    this.colorLabel = document.getElementById('colorLabel');
    
    this.objectSection = document.getElementById('objectSection');
    this.imageSection = document.getElementById('imageSection');

    this.bindEvents();
    this.syncUI();
  }

  bindEvents() {
    this.modeSelect.addEventListener('change', (e) => {
      StateManager.mode = e.target.value;
      this.syncUI();
      this.sceneManager.updateAppearance();
    });

    this.viewSelect.addEventListener('change', (e) => {
      StateManager.view = e.target.value;
      this.sceneManager.updateAppearance();
    });

    this.objectSelect.addEventListener('change', (e) => {
      StateManager.objectType = e.target.value;
      this.sceneManager.updateAppearance();
    });

    this.colorPicker.addEventListener('input', (e) => {
      StateManager.color = e.target.value;
      this.colorLabel.textContent = e.target.value.toUpperCase();
      if (StateManager.mode === 'object') {
        this.sceneManager.updateAppearance();
      }
    });

    this.scaleRange.addEventListener('input', (e) => {
      StateManager.scale = parseFloat(e.target.value);
      this.scaleValue.textContent = StateManager.scale.toFixed(1);
      this.sceneManager.updateAppearance();
    });

    this.transparencyRange.addEventListener('input', (e) => {
      StateManager.transparency = parseFloat(e.target.value);
      const percentage = Math.round(StateManager.transparency * 100);
      this.transparencyValue.textContent = percentage + '%';
      this.sceneManager.updateAppearance();
    });

    this.intensityRange.addEventListener('input', (e) => {
      StateManager.intensity = parseFloat(e.target.value);
      this.intensityValue.textContent = StateManager.intensity.toFixed(1);
      this.sceneManager.updateAppearance();
    });

    this.rotateToggle.addEventListener('click', () => {
      StateManager.autoRotate = !StateManager.autoRotate;
      const iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>`;
      this.rotateToggle.innerHTML = `${iconSvg} Auto-rotar: ${StateManager.autoRotate ? 'ON' : 'OFF'}`;
    });

    this.zoomIn.addEventListener('click', () => {
      this.sceneManager.updateZoom(-0.5);
    });

    this.zoomOut.addEventListener('click', () => {
      this.sceneManager.updateZoom(0.5);
    });

    this.resetViewBtn.addEventListener('click', () => {
      this.sceneManager.resetView();
    });
  }

  syncUI() {
    const isObjectMode = StateManager.mode === 'object';

    // Mostrar/ocultar secciones
    if (this.objectSection) {
      this.objectSection.style.display = isObjectMode ? 'block' : 'none';
    }
    if (this.imageSection) {
      this.imageSection.style.display = isObjectMode ? 'none' : 'block';
    }

    // Habilitar/deshabilitar controles
    this.objectSelect.disabled = !isObjectMode;
    this.colorPicker.disabled = !isObjectMode;
    this.intensityRange.disabled = !isObjectMode;

    // Actualizar valores mostrados
    this.scaleValue.textContent = StateManager.scale.toFixed(1);
    const transparencyPercentage = Math.round(StateManager.transparency * 100);
    this.transparencyValue.textContent = transparencyPercentage + '%';
    this.intensityValue.textContent = StateManager.intensity.toFixed(1);
    this.colorLabel.textContent = StateManager.color.toUpperCase();
  }

  setModeToImage() {
    StateManager.mode = 'image';
    this.modeSelect.value = 'image';
    this.syncUI();
  }
}