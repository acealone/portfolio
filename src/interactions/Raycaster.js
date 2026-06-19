import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-9999, -9999);

export function initRaycaster(canvas) {
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.set(-9999, -9999);
  });

  // Touch tap: set NDC on touchstart so castRay finds the frame when click fires.
  // If touch turns into a drag (> 10 px), clear NDC immediately — no hover during drag.
  let _startX = 0;
  let _startY = 0;
  let _dragged = false;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    _startX  = e.touches[0].clientX;
    _startY  = e.touches[0].clientY;
    _dragged = false;
    const rect = canvas.getBoundingClientRect();
    mouse.x =  ((e.touches[0].clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((e.touches[0].clientY - rect.top)  / rect.height) * 2 + 1;
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1 || _dragged) return;
    const dx = e.touches[0].clientX - _startX;
    const dy = e.touches[0].clientY - _startY;
    if (Math.abs(dx) + Math.abs(dy) > 10) {
      _dragged = true;
      mouse.set(-9999, -9999); // clear hover — this is a drag, not a tap
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    if (!_dragged) {
      // Tap — keep mouse NDC briefly so the click event can find the frame
      requestAnimationFrame(() => mouse.set(-9999, -9999));
    }
  });
}

export function getMouseNDC() {
  return mouse;
}

export function castRay(camera, meshes) {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(meshes, false);
  if (hits.length === 0) return null;
  return hits[0];
}
