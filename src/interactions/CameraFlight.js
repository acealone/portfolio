import * as THREE from 'three';

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export class CameraFlight {
  constructor(camera, fadeEl = null) {
    this.camera   = camera;
    this.fadeEl   = fadeEl;
    this.active   = false;
    this.progress = 0;
    this.duration = 1.2;
    this._mode    = 'in'; // 'in' | 'out'

    this.startPos = new THREE.Vector3();
    this.endPos   = new THREE.Vector3();

    // Home defaults — updated by setHome()
    this.homePos    = camera.position.clone();
    this.homeLookAt = new THREE.Vector3(0, 2.2, -4);

    // Frame look target — shared between flyTo and flyBack
    this.frameLookTarget = new THREE.Vector3();

    this._onComplete = null;
  }

  setHome(pos, lookAt) {
    this.homePos.copy(pos);
    this.homeLookAt.copy(lookAt);
  }

  flyTo(frame, onComplete) {
    if (this.active) return;
    this.active   = true;
    this.progress = 0;
    this._mode    = 'in';
    this._onComplete = onComplete;

    this.startPos.copy(this.camera.position);

    // Get the frame's world-space center — this stays the look-at target throughout
    frame.group.getWorldPosition(this.frameLookTarget);

    // Stop 0.3 units in front of the picture (close enough to fill screen, avoids clipping)
    this.endPos.copy(this.frameLookTarget);
    this.endPos.z += 0.3;
  }

  flyBack(onComplete) {
    if (this.active) return;
    this.active   = true;
    this.progress = 0;
    this._mode    = 'out';
    this._onComplete = onComplete;

    this.startPos.copy(this.camera.position);
    this.endPos.copy(this.homePos);
  }

  update(dt) {
    if (!this.active) return;

    this.progress = Math.min(this.progress + dt / this.duration, 1);
    const t = easeInOutCubic(this.progress);

    // Move camera position along lerp path
    this.camera.position.lerpVectors(this.startPos, this.endPos, t);

    if (this._mode === 'in') {
      // Always look at the frame center — keeps the picture centered as we approach
      this.camera.lookAt(this.frameLookTarget);

      // Fade overlay: transparent until 55% progress, then fade to black
      if (this.fadeEl) {
        const fadeT = Math.max(0, Math.min(1, (this.progress - 0.55) / 0.45));
        this.fadeEl.style.opacity = fadeT;
      }
    } else {
      // Fly back: lerp the look target from frame back to home lookAt point
      const lookPct = easeInOutCubic(Math.min(this.progress / 0.75, 1));
      const lookTarget = new THREE.Vector3().lerpVectors(
        this.frameLookTarget,
        this.homeLookAt,
        lookPct
      );
      this.camera.lookAt(lookTarget);

      // Fade overlay: from black to transparent in the first 45% of progress
      if (this.fadeEl) {
        const fadeT = Math.max(0, 1 - this.progress / 0.45);
        this.fadeEl.style.opacity = fadeT;
      }
    }

    if (this.progress >= 1) {
      this.active = false;
      this._onComplete?.();
    }
  }
}
