import * as THREE from 'three';
import { buildRoom }                              from './scene/Room.js';
import { setupLighting }                          from './scene/Lighting.js';
import { Gallery, getLayoutName, getLayoutConfig } from './scene/Gallery.js';
import { initRaycaster }                          from './interactions/Raycaster.js';
import { CameraFlight }                           from './interactions/CameraFlight.js';
import { CameraRotate }                           from './interactions/CameraRotate.js';
import { SubpageManager }                         from './subpages/SubpageManager.js';
import { initAboutPage }                          from './subpages/AboutPage.js';
import { initProjectsPage }                       from './subpages/ProjectsPage.js';
import { initSkillsPage }                         from './subpages/SkillsPage.js';
import { initContactPage }                        from './subpages/ContactPage.js';
import './style.css';

// ─── Renderer ───────────────────────────────────────────────────────────────

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.prepend(renderer.domElement);

// ─── Camera ─────────────────────────────────────────────────────────────────

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

let currentLayout = getLayoutName(window.innerWidth);
const applyLayoutToCamera = (layoutName) => {
  const cfg = getLayoutConfig(layoutName);
  camera.position.copy(cfg.cameraPos);
  camera.fov = cfg.fov;
  camera.updateProjectionMatrix();
  camera.lookAt(cfg.cameraLookAt);
};
applyLayoutToCamera(currentLayout);

// ─── Scene ──────────────────────────────────────────────────────────────────

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0d1a);
scene.fog = new THREE.Fog(0x0d0d1a, 14, 22);

buildRoom(scene);
setupLighting(scene);

// ─── Gallery ────────────────────────────────────────────────────────────────

const gallery = new Gallery(scene);

// ─── Raycaster ──────────────────────────────────────────────────────────────

initRaycaster(renderer.domElement);

// ─── Fade overlay ───────────────────────────────────────────────────────────

const fadeOverlay = document.getElementById('fade-overlay');

// ─── Camera flight ──────────────────────────────────────────────────────────

const initCfg = getLayoutConfig(currentLayout);
const flight  = new CameraFlight(camera, fadeOverlay);
flight.setHome(initCfg.cameraPos, initCfg.cameraLookAt);

// ─── Camera rotation (touch drag + desktop edge) ─────────────────────────────

const camRotate = new CameraRotate();
const isMobile  = ('ontouchstart' in window) || /Mobi|Android/i.test(navigator.userAgent);

if (isMobile) {
  camRotate.initTouchDrag(renderer.domElement);
} else {
  camRotate.initMouseCorners(renderer.domElement);
}

// ─── Sub-pages ──────────────────────────────────────────────────────────────

const subpages = new SubpageManager();

function makeBackHandler(sectionId) {
  return () => {
    fadeOverlay.style.transition = 'none';
    fadeOverlay.style.opacity    = '1';

    requestAnimationFrame(() => {
      subpages.hide(sectionId, () => {
        flight.flyBack(() => {});
      });
    });
  };
}

initAboutPage(
  document.getElementById('panel-about'),
  makeBackHandler('about')
);
initProjectsPage(
  document.getElementById('panel-projects'),
  makeBackHandler('projects')
);
initSkillsPage(
  document.getElementById('panel-skills'),
  makeBackHandler('skills')
);
initContactPage(
  document.getElementById('panel-contact'),
  makeBackHandler('contact')
);

// ─── Click / tap handler ─────────────────────────────────────────────────────

renderer.domElement.addEventListener('click', () => {
  if (flight.active || subpages.isOpen()) return;
  const hovered = gallery.getHoveredFrame();
  if (!hovered) return;

  flight.flyTo(hovered, () => {
    subpages.show(hovered.sectionId);
    requestAnimationFrame(() => {
      fadeOverlay.style.transition = 'opacity 0.5s ease';
      fadeOverlay.style.opacity    = '0';
      setTimeout(() => { fadeOverlay.style.transition = 'none'; }, 600);
    });
  });
});

// ─── Resize ─────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const newLayout = getLayoutName(window.innerWidth);
  if (newLayout !== currentLayout) {
    currentLayout = newLayout;
    const cfg = getLayoutConfig(newLayout);
    flight.setHome(cfg.cameraPos, cfg.cameraLookAt);

    if (!flight.active && !subpages.isOpen()) {
      camera.fov = cfg.fov;
      camera.updateProjectionMatrix();
      camRotate.applyToCamera(camera, cfg.cameraPos, cfg.cameraLookAt);
    }
  }
});

// ─── Animate ────────────────────────────────────────────────────────────────

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  // Rotate camera from gyro + drag when idle (not in a flight or panel)
  if (!flight.active && !subpages.isOpen()) {
    const cfg = getLayoutConfig(currentLayout);
    camRotate.update(dt);
    camRotate.applyToCamera(camera, cfg.cameraPos, cfg.cameraLookAt);
  }

  if (!subpages.isOpen()) {
    gallery.update(dt, camera, renderer.domElement);
  }

  flight.update(dt);
  renderer.render(scene, camera);
}

animate();
