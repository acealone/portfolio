import * as THREE from 'three';
import { makeSpring, stepSpring } from './SpringPhysics.js';

const MAX_PITCH = 1.45; // ±radians — allow near-ceiling/floor views (well below π/2 singularity)

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
      this._dragPitch +=  dy / window.innerHeight * 0.5;
      this._dragPitch  = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, this._dragPitch));
    }, { passive: true });
  }

  // gyroTiltX = beta delta (forward/back tilt), gyroTiltY = gamma delta (left/right roll)
  // Gyro drives rotation velocity (tilt = speed), enabling full 360° just like drag.
  update(dt, gyroTiltX = 0, gyroTiltY = 0) {
    this._dragYaw   += gyroTiltY * 1.5 * dt;
    this._dragPitch += gyroTiltX * 1.0 * dt;
    this._dragPitch  = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, this._dragPitch));

    stepSpring(this._yawSpring,   this._dragYaw,   dt, 80, 14);
    stepSpring(this._pitchSpring, this._dragPitch, dt, 80, 14);

    this.yawOffset   = this._yawSpring.pos;
    this.pitchOffset = this._pitchSpring.pos;
  }

  // Rotate camera's look direction by yaw/pitch offsets. Position stays at homePos.
  applyToCamera(camera, homePos, homeLookAt) {
    const forward = new THREE.Vector3().subVectors(homeLookAt, homePos).normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);

    // Apply yaw first, then derive the right axis from the yawed forward so that
    // pitch is always screen-up/down regardless of how far the user has rotated.
    const yawQuat     = new THREE.Quaternion().setFromAxisAngle(worldUp, this.yawOffset);
    const yawedFwd    = forward.clone().applyQuaternion(yawQuat);
    const right       = new THREE.Vector3().crossVectors(yawedFwd, worldUp).normalize();
    const pitchQuat   = new THREE.Quaternion().setFromAxisAngle(right, this.pitchOffset);

    const rotated = yawedFwd.clone().applyQuaternion(pitchQuat);

    camera.position.copy(homePos);
    camera.lookAt(homePos.clone().add(rotated));
  }
}
