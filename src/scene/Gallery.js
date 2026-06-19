import * as THREE from 'three';
import { Frame } from '../objects/Frame.js';
import { castRay } from '../interactions/Raycaster.js';

// Base frame size — all layouts use this size; scale is applied via group.scale
const BASE_SIZE = { width: 1.3, height: 1.7 };

// Wide layout: single row of four frames (desktop)
// Narrow layout: two-row 2×2 grid (mobile/tablet)
const LAYOUTS = {
  wide: {
    cameraPos:    new THREE.Vector3(0, 1.6, 4.5),
    cameraLookAt: new THREE.Vector3(0, 2.2, -4),
    fov: 60,
    frames: [
      { pos: new THREE.Vector3(-3.6, 2.35, -3.93), scale: 1.0 },
      { pos: new THREE.Vector3(-1.2, 2.35, -3.93), scale: 1.0 },
      { pos: new THREE.Vector3( 1.2, 2.35, -3.93), scale: 1.0 },
      { pos: new THREE.Vector3( 3.6, 2.35, -3.93), scale: 1.0 },
    ],
  },
  narrow: {
    cameraPos:    new THREE.Vector3(0, 2.3, 3.5),
    cameraLookAt: new THREE.Vector3(0, 2.3, -4),
    fov: 65,
    frames: [
      // top-left,  top-right,  bottom-left, bottom-right
      { pos: new THREE.Vector3(-0.9, 3.1,  -3.93), scale: 0.78 },
      { pos: new THREE.Vector3( 0.9, 3.1,  -3.93), scale: 0.78 },
      { pos: new THREE.Vector3(-0.9, 1.55, -3.93), scale: 0.78 },
      { pos: new THREE.Vector3( 0.9, 1.55, -3.93), scale: 0.78 },
    ],
  },
};

export function getLayoutName(viewportWidth) {
  return viewportWidth <= 768 ? 'narrow' : 'wide';
}

export function getLayoutConfig(name) {
  return LAYOUTS[name];
}

const FRAME_DEFS = [
  { id: 'about',    sectionId: 'about',    label: 'ABOUT' },
  { id: 'projects', sectionId: 'projects', label: 'PROJECTS' },
  { id: 'skills',   sectionId: 'skills',   label: 'SKILLS' },
  { id: 'contact',  sectionId: 'contact',  label: 'CONTACT' },
];

export class Gallery {
  constructor(scene) {
    this.frames       = [];
    this.pictureMeshes = [];
    this.hoveredFrame = null;

    const group = new THREE.Group();
    scene.add(group);

    // Build frames at wide-layout positions initially; caller calls setLayout() immediately
    FRAME_DEFS.forEach((def, i) => {
      const pos = LAYOUTS.wide.frames[i].pos;
      const frame = new Frame({ ...def, position: pos, size: BASE_SIZE });
      group.add(frame.group);
      this.frames.push(frame);
      this.pictureMeshes.push(frame.pictureMesh);
    });
  }

  // `instant` = true on first load (teleport, no lerp animation)
  setLayout(layoutName, instant = false) {
    const layout = LAYOUTS[layoutName];
    this.frames.forEach((frame, i) => {
      const { pos, scale } = layout.frames[i];
      if (instant) {
        frame.teleport(pos, scale);
      } else {
        frame.setLayoutTarget(pos, scale);
      }
    });
    return layout;
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
