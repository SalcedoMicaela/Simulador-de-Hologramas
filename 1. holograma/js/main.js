import { SceneManager } from './SceneManager.js';
import { UIController } from './UIController.js';
import { InputController } from './InputController.js';

const viewer = document.getElementById('viewer');

const sceneManager = new SceneManager(viewer);
const uiController = new UIController(sceneManager);
new InputController(sceneManager, uiController);