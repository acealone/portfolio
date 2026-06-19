import * as THREE from 'three';

function applyPixelFilters(tex) {
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

function canvasTexture(canvas) {
  return applyPixelFilters(new THREE.CanvasTexture(canvas));
}

export function makeFloorTexture(repeatX = 10, repeatY = 8) {
  const size = 16;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#8b5e3c';
  ctx.fillRect(0, 0, size, size);

  // Plank seam
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(0, 0, size, 1);
  ctx.fillRect(0, 8, size, 1);

  // Grain lines
  ctx.fillStyle = '#7a5234';
  ctx.fillRect(0, 3, size, 1);
  ctx.fillRect(0, 11, size, 1);

  // Light grain
  ctx.fillStyle = '#9a6e4a';
  ctx.fillRect(0, 5, size, 1);
  ctx.fillRect(0, 13, size, 1);

  // Side seam (staggered between planks)
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(8, 0, 1, 8);
  ctx.fillRect(0, 8, 1, 8);

  const tex = canvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  return tex;
}

export function makeWallTexture(repeatX = 10, repeatY = 5) {
  const size = 16;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');

  // Base brick
  ctx.fillStyle = '#6b4c3b';
  ctx.fillRect(0, 0, size, size);

  // Mortar (dark) — horizontal
  ctx.fillStyle = '#3a2820';
  ctx.fillRect(0, 0, size, 1);
  ctx.fillRect(0, 7, size, 1);
  ctx.fillRect(0, 8, size, 1);
  ctx.fillRect(0, 15, size, 1);

  // Mortar — vertical (alternating rows)
  ctx.fillRect(0, 1, 1, 6);
  ctx.fillRect(8, 9, 1, 6);

  // Brick highlight top-left edge
  ctx.fillStyle = '#7d5a48';
  ctx.fillRect(1, 1, size - 2, 1);
  ctx.fillRect(1, 1, 1, 5);
  ctx.fillRect(9, 9, size - 10, 1);
  ctx.fillRect(9, 9, 1, 5);

  const tex = canvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  return tex;
}

export function makeSideWallTexture(repeatX = 8, repeatY = 5) {
  return makeWallTexture(repeatX, repeatY);
}

export function makeCeilingTexture() {
  const size = 16;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#1a1208';
  ctx.fillRect(0, 0, size, size);

  // Subtle wood beam texture
  ctx.fillStyle = '#221810';
  ctx.fillRect(0, 0, size, 2);
  ctx.fillRect(0, 8, size, 2);

  const tex = canvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
}
