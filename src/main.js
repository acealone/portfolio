import * as THREE from 'three';
import { buildRoom }         from './scene/Room.js';
import { setupLighting }     from './scene/Lighting.js';
import { Gallery }           from './scene/Gallery.js';
import { initRaycaster }     from './interactions/Raycaster.js';
import { CameraFlight }      from './interactions/CameraFlight.js';
import { SubpageManager }    from './subpages/SubpageManager.js';
import { initAboutPage }     from './subpages/AboutPage.js';
import { initProjectsPage }  from './subpages/ProjectsPage.js';
import { initSkillsPage }    from './subpages/SkillsPage.js';
import { initContactPage }   from './subpages/ContactPage.js';
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
camera.position.set(0, 1.6, 4.5);
camera.lookAt(0, 2.2, -4);

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

// ─── Camera flight ──────────────────────────────────────────────────────────

const flight = new CameraFlight(camera);

// ─── Sub-pages ──────────────────────────────────────────────────────────────

const subpages = new SubpageManager();

function makeBackHandler(sectionId) {
  return () => {
    subpages.hide(sectionId, () => {
      flight.flyBack(() => {});
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
    subpages.show(hovered.sectionId);
  });
});

// ─── Resize ─────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
