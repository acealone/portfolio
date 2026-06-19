import * as THREE from 'three';
import { PALETTE } from '../utils/ColorPalette.js';

export function setupLighting(scene) {
  // Warm ambient fill
  const ambient = new THREE.AmbientLight(PALETTE.AMBIENT_WARM, 0.35);
  scene.add(ambient);

  // Chandelier — main warm point light from ceiling center
  const chandelier = new THREE.PointLight(PALETTE.CHANDELIER, 2.5, 18, 1.5);
  chandelier.position.set(0, 3.8, 0);
  chandelier.castShadow = true;
  chandelier.shadow.mapSize.width = 512;
  chandelier.shadow.mapSize.height = 512;
  chandelier.shadow.camera.near = 0.1;
  chandelier.shadow.camera.far = 20;
  scene.add(chandelier);

  // Cool fill from front-left (counters the warm, gives depth)
  const fillLeft = new THREE.PointLight(PALETTE.FILL_COOL, 0.4, 12);
  fillLeft.position.set(-4, 2.5, 3);
  scene.add(fillLeft);

  // Cool fill from front-right
  const fillRight = new THREE.PointLight(PALETTE.FILL_COOL, 0.4, 12);
  fillRight.position.set(4, 2.5, 3);
  scene.add(fillRight);

  // Warm accent behind viewer (bounced light from doorway)
  const backFill = new THREE.PointLight(0xffaa55, 0.3, 10);
  backFill.position.set(0, 2, 5);
  scene.add(backFill);

  return { chandelier };
}
