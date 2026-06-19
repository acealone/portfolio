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

  // Touch: update NDC on tap so raycaster can find the frame for click handling
  canvas.addEventListener('touchstart', (e) => {
    const rect  = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x =  ((touch.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((touch.clientY - rect.top)  / rect.height) * 2 + 1;
  }, { passive: true });

  // Clear hover after the click event has fired (rAF fires after it)
  canvas.addEventListener('touchend', () => {
    requestAnimationFrame(() => mouse.set(-9999, -9999));
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
