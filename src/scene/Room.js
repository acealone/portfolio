import * as THREE from 'three';
import {
  makeFloorTexture,
  makeWallTexture,
  makeSideWallTexture,
  makeCeilingTexture,
} from '../utils/TextureFactory.js';
import { PALETTE } from '../utils/ColorPalette.js';

export function buildRoom(scene) {
  const floorTex   = makeFloorTexture(10, 8);
  const wallTex    = makeWallTexture(10, 5);
  const sideTexL   = makeSideWallTexture(8, 5);
  const sideTexR   = makeSideWallTexture(8, 5);
  const ceilTex    = makeCeilingTexture();

  const floorMat   = new THREE.MeshLambertMaterial({ map: floorTex });
  const wallMat    = new THREE.MeshLambertMaterial({ map: wallTex });
  const sideMatL   = new THREE.MeshLambertMaterial({ map: sideTexL });
  const sideMatR   = new THREE.MeshLambertMaterial({ map: sideTexR });
  const ceilMat    = new THREE.MeshLambertMaterial({ map: ceilTex });

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Back wall
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat);
  backWall.position.set(0, 2.5, -4);
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Left wall
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), sideMatL);
  leftWall.position.set(-5, 2.5, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), sideMatR);
  rightWall.position.set(5, 2.5, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), ceilMat);
  ceiling.position.set(0, 5, 0);
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);

  // Baseboard trim along back wall
  addBaseboard(scene);
  addCrownMolding(scene);
  addWainscoting(scene);
}

function addBaseboard(scene) {
  const mat = new THREE.MeshLambertMaterial({ color: PALETTE.WOOD_DARK });
  // Back wall baseboard
  const base = new THREE.Mesh(new THREE.BoxGeometry(10, 0.18, 0.06), mat);
  base.position.set(0, 0.09, -3.97);
  base.receiveShadow = true;
  base.castShadow = true;

  const baseL = new THREE.Mesh(new THREE.BoxGeometry(8, 0.18, 0.06), mat);
  baseL.position.set(-5.03, 0.09, 0);
  baseL.rotation.y = Math.PI / 2;

  const baseR = new THREE.Mesh(new THREE.BoxGeometry(8, 0.18, 0.06), mat);
  baseR.position.set(5.03, 0.09, 0);
  baseR.rotation.y = -Math.PI / 2;

  [base, baseL, baseR].forEach(m => {
    m.receiveShadow = true;
    m.castShadow = true;
  });
  const group = new THREE.Group();
  group.add(base, baseL, baseR);
  return group;
}

function addCrownMolding(scene) {
  const mat = new THREE.MeshLambertMaterial({ color: PALETTE.WOOD_MID });
  const crown = new THREE.Mesh(new THREE.BoxGeometry(10, 0.12, 0.1), mat);
  crown.position.set(0, 4.94, -3.95);
  crown.castShadow = true;
  scene.add(crown);
}

function addWainscoting(scene) {
  // Dark wood panel along the bottom third of the back wall
  const mat = new THREE.MeshLambertMaterial({ color: PALETTE.WOOD_MID });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.0), mat);
  panel.position.set(0, 0.5, -3.98);
  scene.add(panel);

  // Panel rail divider
  const railMat = new THREE.MeshLambertMaterial({ color: PALETTE.WOOD_DARK });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(10, 0.08, 0.04), railMat);
  rail.position.set(0, 1.02, -3.97);
  rail.castShadow = true;
  scene.add(rail);
}
