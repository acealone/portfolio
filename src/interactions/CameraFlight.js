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
    this._mode    = 'in';

    this.startPos    = new THREE.Vector3();
    this.endPos      = new THREE.Vector3();
    this.startLookAt = new THREE.Vector3(); // captured at flyTo start

    this.homePos    = camera.position.clone();
    this.homeLookAt = new THREE.Vector3(0, 2.2, -4);

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
    this.startLookAt.copy(this.homeLookAt); // ease FROM home look direction

    frame.group.getWorldPosition(this.frameLookTarget);

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

    this.camera.position.lerpVectors(this.startPos, this.endPos, t);

    if (this._mode === 'in') {
      // Ease look direction from home → frame over first 40%, then hold on frame
      const lookT       = easeInOutCubic(Math.min(this.progress / 0.40, 1));
      const lerpedLook  = new THREE.Vector3().lerpVectors(
        this.startLookAt, this.frameLookTarget, lookT
      );
      this.camera.lookAt(lerpedLook);

      // Fade to black starting at 40% progress
      if (this.fadeEl) {
        const fadeT = Math.max(0, Math.min(1, (this.progress - 0.40) / 0.60));
        this.fadeEl.style.opacity = fadeT;
      }
    } else {
      // Fly back: lerp look from frame → home over first 75%
      const lookPct    = easeInOutCubic(Math.min(this.progress / 0.75, 1));
      const lookTarget = new THREE.Vector3().lerpVectors(
        this.frameLookTarget, this.homeLookAt, lookPct
      );
      this.camera.lookAt(lookTarget);

      // Fade from black to transparent over first 45%
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
