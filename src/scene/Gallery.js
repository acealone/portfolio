import * as THREE from 'three';
import { Frame } from '../objects/Frame.js';
import { castRay } from '../interactions/Raycaster.js';

const BASE_SIZE = { width: 1.3, height: 1.7 };

const LAYOUTS = {
  wide: {
    cameraPos:    new THREE.Vector3(0, 1.6, 4.5),
    cameraLookAt: new THREE.Vector3(0, 2.2, -4),
    fov: 60,
    frames: [
      // Hand-crafted variation: different heights, scales, and slight tilts
      { pos: new THREE.Vector3(-3.6, 2.55, -3.93), scale: 1.05, baseRotZ: -0.035 },
      { pos: new THREE.Vector3(-1.2, 2.10, -3.93), scale: 0.93, baseRotZ:  0.022 },
      { pos: new THREE.Vector3( 1.2, 2.45, -3.93), scale: 1.02, baseRotZ: -0.018 },
      { pos: new THREE.Vector3( 3.6, 2.15, -3.93), scale: 1.08, baseRotZ:  0.030 },
    ],
  },
  narrow: {
    cameraPos:    new THREE.Vector3(0, 2.3, 3.5),
    cameraLookAt: new THREE.Vector3(0, 2.3, -4),
    fov: 65,
    frames: [
      { pos: new THREE.Vector3(-0.9, 3.12, -3.93), scale: 0.78, baseRotZ: -0.025 },
      { pos: new THREE.Vector3( 0.9, 3.05, -3.93), scale: 0.80, baseRotZ:  0.018 },
      { pos: new THREE.Vector3(-0.9, 1.52, -3.93), scale: 0.82, baseRotZ:  0.020 },
      { pos: new THREE.Vector3( 0.9, 1.58, -3.93), scale: 0.77, baseRotZ: -0.015 },
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
    this.frames        = [];
    this.pictureMeshes = [];
    this.hoveredFrame  = null;
    this._gyroX        = 0;
    this._gyroY        = 0;

    const group = new THREE.Group();
    scene.add(group);

    FRAME_DEFS.forEach((def, i) => {
      const { pos, scale, baseRotZ } = LAYOUTS.wide.frames[i];
      const frame = new Frame({ ...def, position: pos, size: BASE_SIZE, baseRotZ });
      frame.group.scale.setScalar(scale);
      group.add(frame.group);
      this.frames.push(frame);
      this.pictureMeshes.push(frame.pictureMesh);
    });
  }

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

  // Drive all frames with gyro tilt simultaneously (uniform wall-wobble feel)
  setGyroTilt(gyroX, gyroY) {
    this._gyroX = gyroX;
    this._gyroY = gyroY;
    this.frames.forEach(f => f.setGyroTilt(gyroX, gyroY));
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
