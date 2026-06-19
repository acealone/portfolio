import { ICON } from '../utils/Icons.js';

export function initAboutPage(panel, onBack) {
  panel.innerHTML = `
    <div class="panel-inner">
      <div class="panel-header">
        <button class="pixel-btn back-btn" aria-label="Go back">${ICON.ARROW_LEFT} BACK</button>
        <h1 class="panel-title">ABOUT ME</h1>
      </div>

      <div class="about-hero">
        <div class="avatar-box">${ICON.AVATAR}</div>
        <div>
          <p class="pixel-text">
            Hey! I'm a developer who loves building things on the web &mdash; from interactive 3D experiences to clean, functional UIs.
          </p>
          <br/>
          <p class="pixel-text">
            I care about craft: good code, good design, and experiences that feel alive.
          </p>
        </div>
      </div>

      <hr class="pixel-divider" />

      <h2 class="section-title">${ICON.DIAMOND} WHO AM I</h2>
      <p class="pixel-text">
        Based in the internet. Passionate about creative coding, pixel art, game dev, and building tools that people actually enjoy using.
        Currently exploring the intersection of 3D graphics and the modern web.
      </p>

      <h2 class="section-title">${ICON.DIAMOND} WHAT I DO</h2>
      <p class="pixel-text">
        Full-stack development &middot; Three.js / WebGL &middot; Game prototyping &middot; UI design &middot; Open source contributions
      </p>

      <h2 class="section-title">${ICON.DIAMOND} FIND ME</h2>
      <div class="social-row">
        <a href="https://github.com/acealone" target="_blank" rel="noopener" class="pixel-btn">${ICON.GITHUB} GITHUB</a>
        <a href="mailto:contact@example.com" class="pixel-btn">${ICON.ENVELOPE} EMAIL</a>
      </div>
    </div>
  `;

  panel.querySelector('.back-btn').addEventListener('click', onBack);
}
