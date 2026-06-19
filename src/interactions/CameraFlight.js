import * as THREE from 'three';

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export class CameraFlight {
  constructor(camera) {
    this.camera   = camera;
    this.active   = false;
    this.progress = 0;
    this.duration = 1.2;

    this.startPos  = new THREE.Vector3();
    this.endPos    = new THREE.Vector3();
    this.startQuat = new THREE.Quaternion();
    this.endQuat   = new THREE.Quaternion();

    // Remember the home position so we can fly back
    this.homePos  = camera.position.clone();
    this.homeQuat = camera.quaternion.clone();

    this._onComplete = null;
  }

  flyTo(frame, onComplete) {
    if (this.active) return;
    this.active   = true;
    this.progress = 0;
    this._onComplete = onComplete;

    this.startPos.copy(this.camera.position);
    this.startQuat.copy(this.camera.quaternion);

    const frameWorldPos = new THREE.Vector3();
    frame.group.getWorldPosition(frameWorldPos);

    // Stop 0.35 units in front of the picture plane
    this.endPos.copy(frameWorldPos);
    this.endPos.z += 0.35;

    const dummy = new THREE.Object3D();
    dummy.position.copy(this.endPos);
    dummy.lookAt(frameWorldPos);
    this.endQuat.copy(dummy.quaternion);
  }

  flyBack(onComplete) {
    if (this.active) return;
    this.active   = true;
    this.progress = 0;
    this._onComplete = onComplete;

    this.startPos.copy(this.camera.position);
    this.startQuat.copy(this.camera.quaternion);

    this.endPos.copy(this.homePos);
    this.endQuat.copy(this.homeQuat);
  }

  update(dt) {
    if (!this.active) return;

    this.progress = Math.min(this.progress + dt / this.duration, 1);
    const t = easeInOutCubic(this.progress);

    this.camera.position.lerpVectors(this.startPos, this.endPos, t);
    this.camera.quaternion.slerpQuaternions(this.startQuat, this.endQuat, t);

    if (this.progress >= 1) {
      this.active = false;
      this._onComplete?.();
    }
  }
}
