import * as THREE from 'three';
import { Frame } from '../objects/Frame.js';
import { castRay } from '../interactions/Raycaster.js';

const FRAME_CONFIGS = [
  {
    id: 'about',
    sectionId: 'about',
    label: 'ABOUT',
    position: new THREE.Vector3(-3.6, 2.35, -3.93),
    size: { width: 1.3, height: 1.7 },
  },
  {
    id: 'projects',
    sectionId: 'projects',
    label: 'PROJECTS',
    position: new THREE.Vector3(-1.2, 2.35, -3.93),
    size: { width: 1.3, height: 1.7 },
  },
  {
    id: 'skills',
    sectionId: 'skills',
    label: 'SKILLS',
    position: new THREE.Vector3(1.2, 2.35, -3.93),
    size: { width: 1.3, height: 1.7 },
  },
  {
    id: 'contact',
    sectionId: 'contact',
    label: 'CONTACT',
    position: new THREE.Vector3(3.6, 2.35, -3.93),
    size: { width: 1.3, height: 1.7 },
  },
];

export class Gallery {
  constructor(scene) {
    this.frames = [];
    this.pictureMeshes = [];
    this.hoveredFrame = null;

    const group = new THREE.Group();
    scene.add(group);

    FRAME_CONFIGS.forEach(cfg => {
      const frame = new Frame(cfg);
      group.add(frame.group);
      this.frames.push(frame);
      this.pictureMeshes.push(frame.pictureMesh);
    });
  }

  update(dt, camera, canvas) {
    const hit = castRay(camera, this.pictureMeshes);

    let newHovered = null;
    if (hit) {
      newHovered = hit.object.userData.frameRef;
    }

    // Update hover state
    if (this.hoveredFrame && this.hoveredFrame !== newHovered) {
      this.hoveredFrame.clearHover();
    }

    if (newHovered) {
      // Project hit point into frame local space
      const localHit = newHovered.group.worldToLocal(hit.point.clone());
      newHovered.setHoverTarget(localHit.x, localHit.y);
      canvas.classList.add('hovering');
    } else {
      canvas.classList.remove('hovering');
    }

    this.hoveredFrame = newHovered;

    // Step spring physics for all frames
    this.frames.forEach(f => f.update(dt));
  }

  getHoveredFrame() {
    return this.hoveredFrame;
  }

  getFrameById(id) {
    return this.frames.find(f => f.id === id);
  }
}
