import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { StateManager } from './StateManager.js';
import { Helpers } from './Helpers.js';

export class SceneManager {
  constructor(container) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 7);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 16;

    this.clock = new THREE.Clock();
    this.contentGroup = new THREE.Group();
    this.scene.add(this.contentGroup);

    this.projectionMeshes = [];
    this.glowMeshes = [];
    this.scanlineGroups = [];
    this.hologramGroup = null;

    this.setupLights();
    this.buildContent();
    this.animate();

    window.addEventListener('resize', () => this.onResize());
    
    // Añadir clase al contenedor para modo YouTube
    this.container.classList.add('hologram-viewer');
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.92);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.35);
    dir.position.set(3, 4, 5);
    this.scene.add(dir);
  }

  clearContent() {
    this.scene.remove(this.contentGroup);
    Helpers.disposeObject3D(this.contentGroup);
    this.contentGroup = new THREE.Group();
    this.scene.add(this.contentGroup);
    this.projectionMeshes = [];
    this.glowMeshes = [];
    this.scanlineGroups = [];
    this.hologramGroup = null;
  }

  buildContent() {
  this.clearContent();

  if (StateManager.mode === 'object') {
    if (StateManager.view === 'flat') {
      this.buildObjectFlatView(); 
    } else {
      this.buildObjectContent();
    }
  } else {
    if (StateManager.view === 'pyramid') {
      this.buildImageProjectionView();
    } else {
      this.buildImageFlatView();
    }
  }
}

  

  buildObjectContent() {
    const mesh = Helpers.createObjectMesh();
    mesh.scale.setScalar(StateManager.scale);
    this.contentGroup.add(mesh);
  }

  buildObjectFlatView() {
  const group = new THREE.Group();

  const positions = [
    { x: 0, y: 2.2, ry: 0 },                // front
    { x: -2.2, y: 0, ry: Math.PI / 2 },     // left
    { x: 2.2, y: 0, ry: -Math.PI / 2 },     // right
    { x: 0, y: -2.2, ry: Math.PI },         // back
  ];

  positions.forEach(({ x, y, ry }) => {
    const mesh = Helpers.createObjectMesh();

    mesh.position.set(x, y, 0);
    mesh.rotation.y = ry;

    // importante para que se vea plano tipo "cara"
    mesh.scale.setScalar(0.6 * StateManager.scale);

    group.add(mesh);
  });

  this.contentGroup.add(group);
}

  // ─────────────────────────────────────────────────────────────────
  // PIRÁMIDE HOLOGRÁFICA — cómo funciona realmente:
  //
  //  La pirámide de plástico actúa como espejo semitransparente:
  //  la imagen que está en la pantalla (arriba) se refleja en cada
  //  cara a 45° y el ojo la percibe FLOTANDO en el centro, dentro
  //  de la pirámide, a media altura.
  //
  //  Para reproducirlo en 3D colocamos la imagen directamente en el
  //  CENTRO del espacio (hologramGroup) con varias capas de
  //  profundidad, tinte cian y efectos de levitación + scanlines.
  //  Las imágenes fuente se ponen muy tenues alrededor, como la
  //  "pantalla" real que alimenta la pirámide.
  // ─────────────────────────────────────────────────────────────────
  buildImageProjectionView() {
    const root = new THREE.Group();

    this.buildBase(root);
    this.buildSourceImages(root);
    this.buildCentralHologram(root);
    this.buildAmbientEffects(root);

    root.scale.setScalar(StateManager.scale);
    this.contentGroup.add(root);
  }

  // ── Base circular de referencia visual ───────────────────────
  buildBase(root) {
    const addRing = (r, opacity) => {
      const geo = new THREE.TorusGeometry(r, 0.007, 8, 80);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00ffee,
        transparent: true,
        opacity,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = -1.1;
      root.add(mesh);
      this.glowMeshes.push({ mesh, baseOpacity: opacity });
    };
    addRing(1.58, 0.5);
    addRing(1.1,  0.2);
    addRing(0.52, 0.12);
  }

  // ── Imágenes fuente muy tenues (las "pantallas" de la pirámide) ──
  buildSourceImages(root) {
  const tex = StateManager.imageTexture;
  if (!tex) return;

  const rotations = [0, Math.PI, Math.PI / 2, -Math.PI / 2];

  rotations.forEach((ry) => {
    const mesh = Helpers.createImageMesh(tex);
    mesh.material.opacity = 0.06;
    mesh.material.side = THREE.DoubleSide;
    const dist = 1.1;
    mesh.position.set(Math.sin(ry) * dist, 0.1, Math.cos(ry) * dist);
    mesh.rotation.y = ry;
    mesh.rotation.x = -Math.PI / 4;
    root.add(mesh);
  });
}

  // ── PROYECCIÓN CENTRAL — la imagen flotando en el centro ─────
  buildCentralHologram(root) {
  const mainTex = StateManager.imageTexture;
  if (!mainTex) return;

    const transparency = StateManager.transparency || 0;
    const baseOpacity = Math.max(0.65, (1 - transparency) * 0.90);
    const size = 1.1; // tamaño de la proyección central

    const hologramGroup = new THREE.Group();
    hologramGroup.position.set(0, -0.05, 0);

    // ── Capas de profundidad: dan volumen holográfico ──
    // Cada capa es una copia de la imagen ligeramente desplazada en Z
    // con opacidad decreciente hacia afuera.
    const depthLayers = [
      { z: -0.022, opacity: baseOpacity * 0.15, scale: 1.05 },
      { z: -0.010, opacity: baseOpacity * 0.35, scale: 1.02 },
      { z:  0.000, opacity: baseOpacity,         scale: 1.00 }, // capa principal
      { z:  0.010, opacity: baseOpacity * 0.35, scale: 1.02 },
      { z:  0.022, opacity: baseOpacity * 0.15, scale: 1.05 },
    ];

    // Vista frontal y trasera (rotadas 0° y 180°)
    [0, Math.PI].forEach((ry, viewIdx) => {
      const viewOpacityFactor = viewIdx === 0 ? 1.0 : 0.75;
      depthLayers.forEach(({ z, opacity, scale }) => {
        const mesh = Helpers.createImageMesh(mainTex);
        mesh.material.opacity = opacity * viewOpacityFactor;
        mesh.material.side = THREE.DoubleSide;
        mesh.material.color = new THREE.Color(0.86, 0.97, 1.0); // tinte cian suave
        mesh.position.set(0, 0, z);
        mesh.scale.setScalar(scale * size);
        mesh.rotation.y = ry;
        hologramGroup.add(mesh);
        this.projectionMeshes.push({ mesh, baseOpacity: opacity * viewOpacityFactor });
      });
    });

    // Vistas laterales (rotadas 90° y -90°)
    [Math.PI / 2, -Math.PI / 2].forEach((ry) => {
      depthLayers.forEach(({ z, opacity, scale }) => {
        const mesh = Helpers.createImageMesh(mainTex);
        mesh.material.opacity = opacity * 0.62;
        mesh.material.side = THREE.DoubleSide;
        mesh.material.color = new THREE.Color(0.86, 0.97, 1.0);
        // Para vistas laterales el eje de profundidad pasa a ser X
        mesh.position.set(z, 0, 0);
        mesh.scale.setScalar(scale * size);
        mesh.rotation.y = ry;
        hologramGroup.add(mesh);
        this.projectionMeshes.push({ mesh, baseOpacity: opacity * 0.62 });
      });
    });

    // ── Halo glow alrededor de la imagen ──
    const halo = Helpers.createImageMesh(mainTex);
    halo.material.opacity = baseOpacity * 0.12;
    halo.material.side = THREE.DoubleSide;
    halo.material.color = new THREE.Color(0.4, 1.0, 1.0);
    halo.scale.setScalar(1.28 * size);
    hologramGroup.add(halo);
    this.projectionMeshes.push({ mesh: halo, baseOpacity: baseOpacity * 0.12 });

    root.add(hologramGroup);
    this.hologramGroup = hologramGroup;

    // ── Scanlines sobre el holograma ──
    this.buildHologramScanlines(root, size);
  }

  // ── Scanlines horizontales ────────────────────────────────────
  buildHologramScanlines(root, size) {
    const lineCount = 42;
    const group = new THREE.Group();
    group.position.set(0, -0.05, 0.003);

    for (let i = 0; i < lineCount; i++) {
      const y = (-0.5 + i / (lineCount - 1)) * size;
      const points = [
        new THREE.Vector3(-size / 2, y, 0),
        new THREE.Vector3(size / 2, y, 0),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const opacity = i % 5 === 0 ? 0.07 : 0.02;
      const mat = new THREE.LineBasicMaterial({
        color: 0x00ffee,
        transparent: true,
        opacity,
      });
      group.add(new THREE.Line(geo, mat));
    }

    root.add(group);
    this.scanlineGroups.push(group);
  }

  // ── Efectos ambientales ───────────────────────────────────────
  buildAmbientEffects(root) {
    // Rayo de luz vertical
    const rayGeo = new THREE.CylinderGeometry(0.003, 0.045, 2.4, 8);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x00ffee,
      transparent: true,
      opacity: 0.06,
    });
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.y = 0.1;
    root.add(ray);
    this.glowMeshes.push({ mesh: ray, baseOpacity: 0.06 });

    // Partículas de luz flotantes
    const count = 70;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.3 + Math.random() * 1.1;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(theta) * r * 0.65;
      pos[i * 3 + 1] = -1.05 + Math.random() * 2.3;
      pos[i * 3 + 2] = Math.sin(theta) * r * 0.65;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const ptMat = new THREE.PointsMaterial({
      color: 0x00ffee,
      size: 0.014,
      transparent: true,
      opacity: 0.5,
    });
    root.add(new THREE.Points(ptGeo, ptMat));
  }

  buildImageFlatView() {
    const texture = StateManager.imageTexture;
    if (!texture) return;

    const group = new THREE.Group();
    const mapping = [
      { x: 0, y: 2.2, rz: 0 },
      { x: -2.2, y: 0, rz: Math.PI / 2 },
      { x: 2.2, y: 0, rz: -Math.PI / 2 },
      { x: 0, y: -2.2, rz: Math.PI }
    ];

    mapping.forEach(({ x, y, rz }) => {
      const mesh = Helpers.createImageMesh(texture);
      mesh.position.set(x, y, 0);
      mesh.rotation.z = rz;
      mesh.scale.multiplyScalar(0.7 * StateManager.scale);
      group.add(mesh);
    });

    this.contentGroup.add(group);
  }

  updateAppearance() {
    this.buildContent();
  }

  updateZoom(delta) {
    this.camera.position.z += delta;
    this.camera.position.z = Math.max(2, Math.min(16, this.camera.position.z));
  }

  resetView() {
    this.camera.position.set(0, 0, 7);
    this.controls.target.set(0, 0, 0);
    this.contentGroup.rotation.set(0, 0, 0);
    this.controls.update();
  }

  // ── Animaciones ───────────────────────────────────────────────
  animateProjection(elapsed) {
    if (StateManager.mode !== 'image' || StateManager.view !== 'pyramid') return;

    // Pulso de la proyección central
    for (const item of this.projectionMeshes) {
      const pulse = 0.93 + Math.sin(elapsed * 1.5) * 0.07;
      item.mesh.material.opacity = item.baseOpacity * pulse;
    }

    // Parpadeo de elementos de glow
    for (const item of this.glowMeshes) {
      const flicker = 0.87 + Math.sin(elapsed * 3.0 + item.baseOpacity * 6) * 0.13;
      item.mesh.material.opacity = item.baseOpacity * flicker;
    }

    // Barrido de scanlines
    for (const group of this.scanlineGroups) {
      group.children.forEach((line, li) => {
        const wave = Math.sin(elapsed * 2.6 + li * 0.2);
        const base = li % 5 === 0 ? 0.07 : 0.02;
        line.material.opacity = Math.max(0, base + wave * 0.025);
      });
    }

    // Levitación suave del holograma
    if (this.hologramGroup) {
      this.hologramGroup.position.y = -0.05 + Math.sin(elapsed * 1.0) * 0.07;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();

    if (StateManager.autoRotate) {
      this.contentGroup.rotation.y +=
        StateManager.mode === 'object' ? 0.005 : 0.0032;
    }

    const gif = StateManager.gifData;
    if (gif && typeof gif.update === 'function') {
      gif.update();
    }

    this.animateProjection(elapsed);

    this.contentGroup.traverse((child) => {
      if (
        StateManager.mode === 'object' &&
        child.material &&
        'opacity' in child.material
      ) {
        const baseOpacity = Math.max(0.08, 1 - StateManager.transparency);
        const pulse = 0.98 + Math.sin(elapsed * 2.0) * 0.02;
        child.material.opacity = Math.max(0.05, Math.min(1, baseOpacity * pulse));
      }
      if (
        StateManager.mode === 'object' &&
        child.material &&
        'emissiveIntensity' in child.material
      ) {
        child.material.emissiveIntensity =
          StateManager.intensity * (0.96 + Math.sin(elapsed * 2.4) * 0.04);
      }
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}