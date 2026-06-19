import * as THREE from 'three';
import { buildRoom }                          from './scene/Room.js';
import { setupLighting }                      from './scene/Lighting.js';
import { Gallery, getLayoutName, getLayoutConfig } from './scene/Gallery.js';
import { initRaycaster }                      from './interactions/Raycaster.js';
import { CameraFlight }                       from './interactions/CameraFlight.js';
import { SubpageManager }                     from './subpages/SubpageManager.js';
import { initAboutPage }                      from './subpages/AboutPage.js';
import { initProjectsPage }                   from './subpages/ProjectsPage.js';
import { initSkillsPage }                     from './subpages/SkillsPage.js';
import { initContactPage }                    from './subpages/ContactPage.js';
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

// Apply initial layout config before first render
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
gallery.setLayout(currentLayout, true); // teleport to initial layout immediately

// ─── Raycaster ──────────────────────────────────────────────────────────────

initRaycaster(renderer.domElement);

// ─── Fade overlay ───────────────────────────────────────────────────────────

const fadeOverlay = document.getElementById('fade-overlay');

// ─── Camera flight ──────────────────────────────────────────────────────────

const initCfg = getLayoutConfig(currentLayout);
const flight  = new CameraFlight(camera, fadeOverlay);
flight.setHome(initCfg.cameraPos, initCfg.cameraLookAt);

// ─── Sub-pages ──────────────────────────────────────────────────────────────

const subpages = new SubpageManager();

function makeBackHandler(sectionId) {
  return () => {
    // Instantly show the black overlay (covers sub-page while it hides)
    fadeOverlay.style.transition = 'none';
    fadeOverlay.style.opacity    = '1';

    requestAnimationFrame(() => {
      subpages.hide(sectionId, () => {
        // Panel is display:none. Fly back — CameraFlight fades overlay 1→0.
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

// ─── Click handler ──────────────────────────────────────────────────────────

renderer.domElement.addEventListener('click', () => {
  if (flight.active || subpages.isOpen()) return;
  const hovered = gallery.getHoveredFrame();
  if (!hovered) return;

  flight.flyTo(hovered, () => {
    // Overlay is fully black. Show the sub-page.
    subpages.show(hovered.sectionId);
    // Then fade the overlay away to reveal it (CameraFlight is inactive now).
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
    gallery.setLayout(newLayout); // smooth lerp to new positions

    const cfg = getLayoutConfig(newLayout);
    flight.setHome(cfg.cameraPos, cfg.cameraLookAt);

    // Only move camera if no flight/panel is active
    if (!flight.active && !subpages.isOpen()) {
      camera.position.copy(cfg.cameraPos);
      camera.fov = cfg.fov;
      camera.updateProjectionMatrix();
      camera.lookAt(cfg.cameraLookAt);
    }
  }
});

// ─── Animate ────────────────────────────────────────────────────────────────

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (!subpages.isOpen()) {
    gallery.update(dt, camera, renderer.domElement);
  }

  flight.update(dt);
  renderer.render(scene, camera);
}

animate();
