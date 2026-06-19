import * as THREE from 'three';
import { Frame } from '../objects/Frame.js';
import { castRay } from '../interactions/Raycaster.js';

const BASE_SIZE = { width: 1.3, height: 1.7 };

// Fixed frame positions — one per wall section.
// baseRotY = 0        → faces +Z (back wall)
// baseRotY = +PI/2    → faces +X (left wall, x = -5)
// baseRotY = -PI/2    → faces -X (right wall, x = +5)
const FRAME_CONFIGS = [
  {
    id: 'about',    sectionId: 'about',    label: 'ABOUT',
    pos: new THREE.Vector3(-2.0, 2.5, -6.93),
    scale: 1.00, baseRotY: 0,              baseRotZ: -0.025,
  },
  {
    id: 'projects', sectionId: 'projects', label: 'PROJECTS',
    pos: new THREE.Vector3( 2.2, 2.2, -6.93),
    scale: 0.95, baseRotY: 0,              baseRotZ:  0.020,
  },
  {
    id: 'skills',   sectionId: 'skills',   label: 'SKILLS',
    pos: new THREE.Vector3(-6.93, 2.45, -1.0),
    scale: 1.00, baseRotY:  Math.PI / 2,  baseRotZ:  0.015,
  },
  {
    id: 'contact',  sectionId: 'contact',  label: 'CONTACT',
    pos: new THREE.Vector3( 6.93, 2.3,  1.0),
    scale: 0.98, baseRotY: -Math.PI / 2,  baseRotZ: -0.018,
  },
];

// Camera config per layout — frame positions are fixed regardless of layout
const LAYOUTS = {
  wide: {
    cameraPos:    new THREE.Vector3(0, 1.6, 0),
    cameraLookAt: new THREE.Vector3(0, 2.0, -7),
    fov: 60,
  },
  narrow: {
    cameraPos:    new THREE.Vector3(0, 1.6, 0),
    cameraLookAt: new THREE.Vector3(0, 2.0, -7),
    fov: 72,
  },
};

export function getLayoutName(viewportWidth) {
  return viewportWidth <= 768 ? 'narrow' : 'wide';
}

export function getLayoutConfig(name) {
  return LAYOUTS[name];
}

export class Gallery {
  constructor(scene) {
    this.frames        = [];
    this.pictureMeshes = [];
    this.hoveredFrame  = null;

    const group = new THREE.Group();
    scene.add(group);

    FRAME_CONFIGS.forEach(cfg => {
      const frame = new Frame({
        id:        cfg.id,
        sectionId: cfg.sectionId,
        label:     cfg.label,
        position:  cfg.pos,
        size:      BASE_SIZE,
        baseRotY:  cfg.baseRotY,
        baseRotZ:  cfg.baseRotZ,
      });
      frame.group.scale.setScalar(cfg.scale);
      group.add(frame.group);
      this.frames.push(frame);
      this.pictureMeshes.push(frame.pictureMesh);
    });
  }

  // Frame positions are fixed — layout only affects camera settings
  setLayout(layoutName) {
    return LAYOUTS[layoutName];
  }

  update(dt, camera, canvas) {
    const hit = castRay(camera, this.pictureMeshes);
    const newHovered = hit ? hit.object.userData.frameRef : null;

    if (this.hoveredFrame && this.hoveredFrame !== newHovered) {
      this.hoveredFrame.clearHover();
    }

    if (newHovered) {
      const localHit = newHovered.group.worldToLocal(hit.point.clone());
      newHovered.setHoverTarget(localHit.x, localHit.y);
      canvas.classList.add('hovering');
    } else {
      canvas.classList.remove('hovering');
    }

    this.hoveredFrame = newHovered;
    this.frames.forEach(f => f.update(dt));
  }

  getHoveredFrame() {
    return this.hoveredFrame;
  }
}
