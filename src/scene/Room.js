import * as THREE from 'three';
import {
  makeFloorTexture,
  makeWallTexture,
  makeSideWallTexture,
  makeCeilingTexture,
} from '../utils/TextureFactory.js';
import { PALETTE } from '../utils/ColorPalette.js';

const W = 14; // room width  (x: -7 to +7)
const D = 14; // room depth  (z: -7 to +7)
const H =  5; // room height (y:  0 to  5)

export function buildRoom(scene) {
  const floorTex = makeFloorTexture(W, D);
  const backTex  = makeWallTexture(W, H);
  const sideTex  = makeSideWallTexture(D, H);
  const ceilTex  = makeCeilingTexture();

  const floorMat = new THREE.MeshLambertMaterial({ map: floorTex });
  const backMat  = new THREE.MeshLambertMaterial({ map: backTex });
  const sideMat  = new THREE.MeshLambertMaterial({ map: sideTex });
  const ceilMat  = new THREE.MeshLambertMaterial({ map: ceilTex });

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Back wall (z = -5), initial camera faces this
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), backMat);
  backWall.position.set(0, H / 2, -D / 2);
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Front wall (z = +5), rotated to face inward
  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), sideMat);
  frontWall.position.set(0, H / 2, D / 2);
  frontWall.rotation.y = Math.PI;
  frontWall.receiveShadow = true;
  scene.add(frontWall);

  // Left wall (x = -5)
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), sideMat);
  leftWall.position.set(-W / 2, H / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Right wall (x = +5)
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), sideMat);
  rightWall.position.set(W / 2, H / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
  ceiling.position.set(0, H, 0);
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);

  addTrim(scene);
}

function addTrim(scene) {
  const woodDark = new THREE.MeshLambertMaterial({ color: PALETTE.WOOD_DARK });
  const woodMid  = new THREE.MeshLambertMaterial({ color: PALETTE.WOOD_MID });

  // ── Baseboards ──────────────────────────────────────────────────────────
  const makeBaseboard = (len, pos, rotY = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.18, 0.06), woodDark);
    m.position.set(...pos);
    m.rotation.y = rotY;
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
  };
  makeBaseboard(W, [0,         0.09, -(D / 2 - 0.03)]);                  // back
  makeBaseboard(W, [0,         0.09,  (D / 2 - 0.03)], Math.PI);         // front
  makeBaseboard(D, [-(W / 2 - 0.03), 0.09, 0], Math.PI / 2);             // left
  makeBaseboard(D, [ (W / 2 - 0.03), 0.09, 0], -Math.PI / 2);            // right

  // ── Crown molding (back + side walls only) ───────────────────────────────
  const makeCrown = (len, pos, rotY = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.1), woodMid);
    m.position.set(...pos);
    m.rotation.y = rotY;
    m.castShadow = true;
    scene.add(m);
  };
  makeCrown(W, [0,         H - 0.06, -(D / 2 - 0.05)]);
  makeCrown(D, [-(W / 2 - 0.05), H - 0.06, 0], Math.PI / 2);
  makeCrown(D, [ (W / 2 - 0.05), H - 0.06, 0], -Math.PI / 2);

  // ── Wainscoting (back + side walls) ─────────────────────────────────────
  const makeWainscot = (width, pos, rotY = 0) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, 1.0), woodMid);
    panel.position.set(...pos);
    panel.rotation.y = rotY;
    scene.add(panel);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, 0.04), woodDark);
    rail.position.set(pos[0], 1.02, pos[2]);
    rail.rotation.y = rotY;
    rail.castShadow = true;
    scene.add(rail);
  };
  makeWainscot(W, [0,          0.5, -(D / 2 - 0.02)]);
  makeWainscot(D, [-(W / 2 - 0.02), 0.5, 0], Math.PI / 2);
  makeWainscot(D, [ (W / 2 - 0.02), 0.5, 0], -Math.PI / 2);
}
