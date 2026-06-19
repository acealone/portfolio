export class Gyroscope {
  constructor() {
    this.active  = false;
    this.tiltX   = 0; // pitch offset normalized -1..1 (front/back)
    this.tiltY   = 0; // roll  offset normalized -1..1 (left/right)
    this._baseB  = null;
    this._baseG  = null;
    this._handler = null;
  }

  async enable() {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      let perm;
      try { perm = await DeviceOrientationEvent.requestPermission(); }
      catch { return false; }
      if (perm !== 'granted') return false;
    }

    this._handler = (e) => {
      if (e.beta === null) return;
      if (this._baseB === null) {
        this._baseB = e.beta;
        this._baseG = e.gamma ?? 0;
      }
      this.tiltX = Math.max(-1, Math.min(1, (e.beta  - this._baseB)        / 30));
      this.tiltY = Math.max(-1, Math.min(1, ((e.gamma ?? 0) - this._baseG) / 30));
      this.active = true;
    };

    window.addEventListener('deviceorientation', this._handler);
    return true;
  }

  recalibrate() {
    this._baseB = null;
    this._baseG = null;
  }

  disable() {
    if (this._handler) {
      window.removeEventListener('deviceorientation', this._handler);
      this._handler = null;
    }
    this.active = false;
    this.tiltX  = 0;
    this.tiltY  = 0;
  }
}
