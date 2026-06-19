import * as THREE from 'three';
import { makeSpring, stepSpring } from '../interactions/SpringPhysics.js';
import { makePictureTexture } from './PictureContent.js';
import { PALETTE } from '../utils/ColorPalette.js';

const BORDER_W  = 0.13;
const BORDER_D  = 0.07;
const PIC_DEPTH = 0.005;

const SPRING_STIFFNESS = 120;
const SPRING_DAMPING   = 18;
const HOVER_IN_TIME    = 0.35;
const HOVER_OUT_TIME   = 0.25;

export class Frame {
  constructor({ id, sectionId, label, position, size, baseRotZ = 0, baseRotY = 0 }) {
    this.id        = id;
    this.sectionId = sectionId;
    this.label     = label;
    this.size      = size;

    this._baseRotZ = baseRotZ;
    this._baseRotY = baseRotY;

    // Direction the frame faces in world space (local +Z rotated by baseRotY).
    // Used by CameraFlight to compute the approach position.
    this.faceDir = new THREE.Vector3(0, 0, 1)
      .applyEuler(new THREE.Euler(0, baseRotY, 0));

    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.group.rotation.z = baseRotZ;
    this.group.rotation.y = baseRotY; // set here too so first frame is correct

    this.springX = makeSpring();
    this.springY = makeSpring();
    this.targetX = 0;
    this.targetY = 0;
    this.isHovered = false;
    this._hoverStrength = 0;

    this._posTarget   = position.clone();
    this._scaleTarget = 1.0;

    this._buildFrame(size);
    this._buildPicture(size);
    this._buildNameplate(size);
  }

  _buildFrame({ width, height }) {
    const bw = BORDER_W;
    const bd = BORDER_D;

    const goldMat  = new THREE.MeshLambertMaterial({ color: PALETTE.GOLD_FRAME });
    const darkMat  = new THREE.MeshLambertMaterial({ color: PALETTE.GOLD_SHADOW });
    const multiMat = [darkMat, darkMat, goldMat, darkMat, goldMat, darkMat];

    const makeBar = (w, h, x, y) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, bd), multiMat);
      mesh.position.set(x, y, 0);
      mesh.castShadow = true;
      return mesh;
    };

    const hw = width / 2;
    const hh = height / 2;

    const top    = makeBar(width + bw * 2, bw, 0,          hh + bw / 2);
    const bottom = makeBar(width + bw * 2, bw, 0,         -hh - bw / 2);
    const left   = makeBar(bw, height,            -hw - bw / 2, 0);
    const right  = makeBar(bw, height,             hw + bw / 2, 0);

    const cornerMat = new THREE.MeshLambertMaterial({ color: PALETTE.GOLD_LIGHT });
    const makeCorner = (x, y) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(bw, bw, bd + 0.02),
        cornerMat
      );
      mesh.position.set(x, y, 0.01);
      mesh.castShadow = true;
      return mesh;
    };

    const corners = [
      makeCorner(-hw - bw / 2,  hh + bw / 2),
      makeCorner( hw + bw / 2,  hh + bw / 2),
      makeCorner(-hw - bw / 2, -hh - bw / 2),
      makeCorner( hw + bw / 2, -hh - bw / 2),
    ];

    const lipMat   = new THREE.MeshLambertMaterial({ color: PALETTE.GOLD_SHADOW });
    const lipThick = 0.03;
    const makeInnerLip = (w, h, x, y) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, bd * 0.5), lipMat);
      mesh.position.set(x, y, bd * 0.3);
      return mesh;
    };

    const innerLips = [
      makeInnerLip(width + lipThick * 2, lipThick, 0,          hh + lipThick / 2),
      makeInnerLip(width + lipThick * 2, lipThick, 0,         -hh - lipThick / 2),
      makeInnerLip(lipThick, height,                -hw - lipThick / 2, 0),
      makeInnerLip(lipThick, height,                 hw + lipThick / 2, 0),
    ];

    [top, bottom, left, right, ...corners, ...innerLips].forEach(m =>
      this.group.add(m)
    );
  }

  _buildPicture({ width, height }) {
    const tex = makePictureTexture(this.sectionId);
    const mat = new THREE.MeshLambertMaterial({ map: tex });
    this.pictureMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
    this.pictureMesh.position.z = PIC_DEPTH;
    this.pictureMesh.userData.frameRef = this;
    this.group.add(this.pictureMesh);

    const backMat = new THREE.MeshLambertMaterial({ color: 0x0a0a14 });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(width, height), backMat);
    back.position.z = -0.01;
    back.rotation.y = Math.PI;
    this.group.add(back);
  }

  _buildNameplate({ width }) {
    const plateMat = new THREE.MeshLambertMaterial({ color: PALETTE.GOLD_FRAME });
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.55, 0.09, 0.03),
      plateMat
    );
    plate.position.set(0, -(this.size.height / 2 + BORDER_W + 0.1), 0);
    plate.castShadow = true;
    this.group.add(plate);
  }

  teleport(position, scale = 1.0) {
    this.group.position.copy(position);
    this._posTarget.copy(position);
    this._scaleTarget = scale;
    this.group.scale.setScalar(scale);
  }

  setLayoutTarget(position, scale = 1.0) {
    this._posTarget.copy(position);
    this._scaleTarget = scale;
  }

  update(dt) {
    if (this.isHovered) {
      this._hoverStrength = Math.min(1, this._hoverStrength + dt / HOVER_IN_TIME);
    } else {
      this._hoverStrength = Math.max(0, this._hoverStrength - dt / HOVER_OUT_TIME);
    }

    const sx = this.targetX * this._hoverStrength;
    const sy = this.targetY * this._hoverStrength;
    stepSpring(this.springX, sx, dt, SPRING_STIFFNESS, SPRING_DAMPING);
    stepSpring(this.springY, sy, dt, SPRING_STIFFNESS, SPRING_DAMPING);

    this.group.rotation.x = this.springX.pos;
    this.group.rotation.y = this._baseRotY + this.springY.pos; // spring wobble on top of wall orientation

    const lf = Math.min(dt * 6, 1);
    this.group.position.lerp(this._posTarget, lf);
    const cs = this.group.scale.x;
    this.group.scale.setScalar(cs + (this._scaleTarget - cs) * lf);
  }

  setHoverTarget(localHitX, localHitY) {
    this.isHovered = true;
    this.targetY =  localHitX * 0.22;
    this.targetX = -localHitY * 0.14;
  }

  clearHover() {
    this.isHovered = false;
    this.targetX = 0;
    this.targetY = 0;
  }
}
