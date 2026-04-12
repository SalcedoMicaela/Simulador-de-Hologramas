import * as THREE from 'three';
import { StateManager } from './StateManager.js';

export const Helpers = {
  createObjectGeometry() {
    switch (StateManager.objectType) {
      case 'sphere':
        return new THREE.SphereGeometry(1, 64, 64);
      case 'pyramid':
        return new THREE.ConeGeometry(1, 1.8, 4);
      case 'diamond':
        return new THREE.OctahedronGeometry(1);
      default:
        return new THREE.SphereGeometry(1, 64, 64);
    }
  },

  createObjectMaterial() {
    const color = new THREE.Color(StateManager.color);

    return new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity: StateManager.intensity,
      transparent: true,
      opacity: 1 - StateManager.transparency,
      shininess: 100,
      side: THREE.DoubleSide
    });
  },

  createObjectMesh() {
    return new THREE.Mesh(
      this.createObjectGeometry(),
      this.createObjectMaterial()
    );
  },

  getTextureSize(texture) {
    let width = 2;
    let height = 2;

    if (texture && texture.image && texture.image.width && texture.image.height) {
      const aspect = texture.image.width / texture.image.height;
      width = 2 * aspect;
      height = 2;
    }

    return { width, height };
  },

  createImageMesh(texture) {
    const { width, height } = this.getTextureSize(texture);

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: Math.max(0.08, 1 - StateManager.transparency),
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
      toneMapped: false,
      alphaTest: 0.06
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(StateManager.scale);
    return mesh;
  },

  disposeObject3D(object) {
    object.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
};