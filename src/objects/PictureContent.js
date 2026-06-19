import * as THREE from 'three';

const W = 64;
const H = 80;

function baseCanvas(bgColor = '#1a1a2e') {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);
  return { c, ctx };
}

function makeTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

// Pixel-art face for About
function drawAbout(ctx) {
  const cx = 32;

  // Background tint
  ctx.fillStyle = '#0f0f2a';
  ctx.fillRect(0, 0, W, H);

  // Head (skin tone pixel blocks)
  const face = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,0,1,1,0,1,1],
    [1,1,1,0,0,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
  ];

  const colors = { 1: '#d4956a', 0: 'transparent' };
  const px = 4;
  const offsetX = cx - face[0].length * px / 2;
  const offsetY = 10;

  face.forEach((row, ry) => {
    row.forEach((cell, rx) => {
      if (cell) {
        ctx.fillStyle = colors[cell];
        ctx.fillRect(offsetX + rx * px, offsetY + ry * px, px, px);
      }
    });
  });

  // Eyes
  ctx.fillStyle = '#1a1a4a';
  ctx.fillRect(offsetX + 1 * px, offsetY + 2 * px, px, px);
  ctx.fillRect(offsetX + 5 * px, offsetY + 2 * px, px, px);

  // Pupils (white highlight)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(offsetX + 1 * px + 1, offsetY + 2 * px + 1, 2, 2);
  ctx.fillRect(offsetX + 5 * px + 1, offsetY + 2 * px + 1, 2, 2);

  // Hair
  ctx.fillStyle = '#3a2010';
  ctx.fillRect(offsetX, offsetY, W - offsetX * 2, px);
  ctx.fillRect(offsetX, offsetY + px, px, px);
  ctx.fillRect(offsetX + 6 * px, offsetY + px, px, px);

  // Body / shirt
  ctx.fillStyle = '#2244aa';
  ctx.fillRect(cx - 12, offsetY + 8 * px + 4, 24, 16);

  // Collar
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(cx - 4, offsetY + 8 * px + 4, 8, 4);

  // Smile dots
  ctx.fillStyle = '#7a3010';
  ctx.fillRect(offsetX + 2 * px, offsetY + 5 * px, px, px);
  ctx.fillRect(offsetX + 4 * px, offsetY + 5 * px, px, px);

  // Label
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(8, H - 14, W - 16, 1);
  ctx.fillStyle = '#f5e6c8';
  drawPixelText(ctx, 'ABOUT', 14, H - 10, 4);
}

// Pixel-art monitor for Projects
function drawProjects(ctx) {
  ctx.fillStyle = '#0a1a0a';
  ctx.fillRect(0, 0, W, H);

  // Monitor body
  ctx.fillStyle = '#2a3a2a';
  ctx.fillRect(8, 10, 48, 36);

  // Screen bezel
  ctx.fillStyle = '#1a2a1a';
  ctx.fillRect(12, 14, 40, 28);

  // Screen glow
  ctx.fillStyle = '#0a2a0a';
  ctx.fillRect(14, 16, 36, 24);

  // Code lines on screen
  const lineColors = ['#00ff41', '#00cc33', '#009922', '#00ff41', '#00cc33'];
  lineColors.forEach((col, i) => {
    ctx.fillStyle = col;
    const lineW = [24, 18, 28, 14, 20][i];
    ctx.fillRect(17, 19 + i * 4, lineW, 2);
  });

  // Cursor blink
  ctx.fillStyle = '#00ff41';
  ctx.fillRect(17 + 14, 19 + 4 * 4, 4, 2);

  // Monitor stand
  ctx.fillStyle = '#2a3a2a';
  ctx.fillRect(29, 46, 6, 8);
  ctx.fillRect(22, 53, 20, 4);

  // Label
  ctx.fillStyle = '#00ff41';
  ctx.fillRect(8, H - 14, W - 16, 1);
  ctx.fillStyle = '#f5e6c8';
  drawPixelText(ctx, 'PROJECTS', 4, H - 10, 3);
}

// Pixel-art bar chart for Skills
function drawSkills(ctx) {
  ctx.fillStyle = '#1a0a2a';
  ctx.fillRect(0, 0, W, H);

  // Chart bars (bottom-up)
  const bars = [
    { h: 30, color: '#ff6644', label: 'JS' },
    { h: 24, color: '#44aaff', label: 'CSS' },
    { h: 28, color: '#ffcc00', label: '3D' },
    { h: 20, color: '#44ff88', label: 'UI' },
  ];

  const baseY = H - 22;
  const barW = 10;
  const gap = 4;
  const startX = 7;

  bars.forEach((bar, i) => {
    const x = startX + i * (barW + gap);
    // Shadow
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 1, baseY - bar.h + 1, barW, bar.h);
    // Bar
    ctx.fillStyle = bar.color;
    ctx.fillRect(x, baseY - bar.h, barW, bar.h);
    // Top highlight
    ctx.fillStyle = '#ffffff44';
    ctx.fillRect(x, baseY - bar.h, barW, 2);
  });

  // Baseline
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(4, baseY + 1, W - 8, 1);

  // Label
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(8, H - 14, W - 16, 1);
  ctx.fillStyle = '#f5e6c8';
  drawPixelText(ctx, 'SKILLS', 11, H - 10, 4);
}

// Pixel-art envelope for Contact
function drawContact(ctx) {
  ctx.fillStyle = '#1a1a0a';
  ctx.fillRect(0, 0, W, H);

  const ex = 10, ey = 18, ew = 44, eh = 30;

  // Envelope body
  ctx.fillStyle = '#c8b870';
  ctx.fillRect(ex, ey, ew, eh);

  // Envelope flap (triangle via pixel blocks — simplified as rect + diagonals)
  ctx.fillStyle = '#a89850';
  ctx.fillRect(ex, ey, ew, 14);

  // Flap fold crease
  ctx.fillStyle = '#c8b870';
  // Draw diagonal fold (pixel steps)
  for (let i = 0; i <= 22; i++) {
    ctx.fillRect(ex + i, ey + i / 2, 1, 1);
    ctx.fillRect(ex + ew - 1 - i, ey + i / 2, 1, 1);
  }

  // Envelope body lines
  ctx.fillStyle = '#a89850';
  ctx.fillRect(ex, ey + eh / 2, ew, 1);

  // Seal wax dot
  ctx.fillStyle = '#cc2222';
  ctx.fillRect(ex + ew / 2 - 3, ey + 12, 6, 6);
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(ex + ew / 2 - 2, ey + 13, 4, 4);

  // @ symbol (simplified pixel art)
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(26, ey + 20, 12, 2);
  ctx.fillRect(26, ey + 22, 2, 4);
  ctx.fillRect(36, ey + 22, 2, 4);
  ctx.fillRect(30, ey + 22, 4, 2);
  ctx.fillRect(30, ey + 24, 2, 2);

  // Label
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(8, H - 14, W - 16, 1);
  ctx.fillStyle = '#f5e6c8';
  drawPixelText(ctx, 'CONTACT', 7, H - 10, 3);
}

// Minimal pixel text renderer using 3x5 bitmap font subset
const PIXEL_CHARS = {
  'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  'B': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  'C': [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  'E': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  'G': [[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
  'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  'J': [[1,1,1],[0,1,0],[0,1,0],[1,1,0],[0,1,0]],
  'K': [[1,0,1],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  'O': [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  'P': [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
  'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  'S': [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
  'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  'U': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
};

function drawPixelText(ctx, text, x, y, scale = 3) {
  let cx = x;
  for (const ch of text) {
    const bitmap = PIXEL_CHARS[ch];
    if (bitmap) {
      bitmap.forEach((row, ry) => {
        row.forEach((on, rx) => {
          if (on) ctx.fillRect(cx + rx * scale, y + ry * scale, scale, scale);
        });
      });
      cx += (3 + 1) * scale;
    } else {
      cx += 2 * scale; // space
    }
  }
}

const DRAWERS = { about: drawAbout, projects: drawProjects, skills: drawSkills, contact: drawContact };

export function makePictureTexture(sectionId) {
  const { c, ctx } = baseCanvas();
  DRAWERS[sectionId]?.(ctx);
  return makeTexture(c);
}
