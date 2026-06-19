import * as THREE from 'three';
import { makeSpring, stepSpring } from './SpringPhysics.js';

const MAX_PITCH = 0.45; // ±radians — prevent flipping past zenith/nadir

export class CameraRotate {
  constructor() {
    this._yawSpring   = makeSpring();
    this._pitchSpring = makeSpring();
    this.yawOffset    = 0;
    this.pitchOffset  = 0;

    this._dragYaw    = 0;
    this._dragPitch  = 0;
    this._isDrag     = false;
    this._lastX      = 0;
    this._lastY      = 0;
  }

  initTouchDrag(canvas) {
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      this._lastX  = e.touches[0].clientX;
      this._lastY  = e.touches[0].clientY;
      this._isDrag = false;
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this._lastX;
      const dy = e.touches[0].clientY - this._lastY;
      this._lastX = e.touches[0].clientX;
      this._lastY = e.touches[0].clientY;

      if (!this._isDrag && Math.abs(dx) + Math.abs(dy) < 10) return;
      this._isDrag = true;

      // Positive dx (drag right) → positive yaw → camera looks left (drag-world feel)
      // Positive dy (drag down)  → positive pitch → camera looks down
      this._dragYaw   +=  dx / window.innerWidth  * 0.8; // unclamped for 360° rotation
      this._dragPitch -=  dy / window.innerHeight * 0.5;
      this._dragPitch  = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, this._dragPitch));
    }, { passive: true });
  }

  // gyroTiltX = beta delta (forward/back tilt), gyroTiltY = gamma delta (left/right roll)
  update(dt, gyroTiltX = 0, gyroTiltY = 0) {
    // gyroTiltY (roll left/right) → yaw: roll right → look right (positive)
    // gyroTiltX (pitch forward/back) → pitch: tilt forward → look down (positive)
    const targetYaw   = this._dragYaw   + gyroTiltY * 0.22;
    const targetPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH,
      this._dragPitch + gyroTiltX * 0.12
    ));

    stepSpring(this._yawSpring,   targetYaw,   dt, 80, 14);
    stepSpring(this._pitchSpring, targetPitch, dt, 80, 14);

    this.yawOffset   = this._yawSpring.pos;
    this.pitchOffset = this._pitchSpring.pos;
  }

  // Rotate camera's look direction by yaw/pitch offsets. Position stays at homePos.
  applyToCamera(camera, homePos, homeLookAt) {
    const forward = new THREE.Vector3().subVectors(homeLookAt, homePos).normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const right   = new THREE.Vector3().crossVectors(forward, worldUp).normalize();

    const yawQuat   = new THREE.Quaternion().setFromAxisAngle(worldUp, this.yawOffset);
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(right,   this.pitchOffset);

    const rotated = forward.clone().applyQuaternion(yawQuat).applyQuaternion(pitchQuat);

    camera.position.copy(homePos);
    camera.lookAt(homePos.clone().add(rotated));
  }
}
