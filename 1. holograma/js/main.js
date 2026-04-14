import { SceneManager } from './SceneManager.js';
import { UIController } from './UIController.js';
import { InputController } from './InputController.js';

const viewer = document.getElementById('viewer');
const app = document.getElementById('app');
const controls = document.getElementById('controls');
const menuToggle = document.getElementById('menuToggle');
const fullscreenToggle = document.getElementById('fullscreenToggle');
const exitFullscreen = document.getElementById('exitFullscreen');

const sceneManager = new SceneManager(viewer);
const uiController = new UIController(sceneManager);
new InputController(sceneManager, uiController);

// Toggle del menú lateral
let menuOpen = true;

function openMenu() {
  menuOpen = true;
  controls.classList.remove('collapsed');
  menuToggle.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  `;
}

function closeMenu() {
  menuOpen = false;
  controls.classList.add('collapsed');
  menuToggle.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="13 17 18 12 13 7"></polyline>
      <polyline points="6 17 11 12 6 7"></polyline>
    </svg>
  `;
}

menuToggle.addEventListener('click', () => {
  if (menuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Funciones para pantalla completa
function enterFullscreen() {
  app.classList.add('fullscreen');
  setTimeout(() => sceneManager.onResize(), 100);
}

function leaveFullscreen() {
  app.classList.remove('fullscreen');
  setTimeout(() => sceneManager.onResize(), 100);
}

// Toggle de pantalla completa (botón en header)
fullscreenToggle.addEventListener('click', enterFullscreen);

// Salir de pantalla completa (botón flotante)
exitFullscreen.addEventListener('click', leaveFullscreen);

// También permitir salir con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && app.classList.contains('fullscreen')) {
    leaveFullscreen();
  }
});

// Cerrar menú al hacer clic fuera en móviles
document.addEventListener('click', (e) => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile && menuOpen && !controls.contains(e.target) && !menuToggle.contains(e.target)) {
    closeMenu();
  }
});