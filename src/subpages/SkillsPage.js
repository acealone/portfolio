import { ICON } from '../utils/Icons.js';

const SKILLS = {
  'FRONTEND': [
    { name: 'JavaScript / ES2024', pct: 92 },
    { name: 'HTML &amp; CSS',      pct: 88 },
    { name: 'React / Svelte',      pct: 75 },
    { name: 'Three.js / WebGL',    pct: 80 },
  ],
  'BACKEND': [
    { name: 'Node.js',             pct: 78 },
    { name: 'SQL / Postgres',      pct: 70 },
    { name: 'REST / GraphQL APIs', pct: 74 },
  ],
  'CREATIVE': [
    { name: 'Pixel Art',           pct: 85 },
    { name: 'Game Design',         pct: 68 },
    { name: 'Shaders / GLSL',      pct: 60 },
  ],
};

function skillBar(skill) {
  return `
    <div class="skill-row">
      <span class="skill-label">${skill.name}</span>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" style="width:${skill.pct}%"></div>
      </div>
      <span class="skill-pct">${skill.pct}%</span>
    </div>
  `;
}

export function initSkillsPage(panel, onBack) {
  const categories = Object.entries(SKILLS).map(([cat, skills]) => `
    <div class="skill-category">
      <h2 class="section-title">${ICON.DIAMOND} ${cat}</h2>
      ${skills.map(skillBar).join('')}
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="panel-inner">
      <div class="panel-header">
        <button class="pixel-btn back-btn" aria-label="Go back">${ICON.ARROW_LEFT} BACK</button>
        <h1 class="panel-title">SKILLS</h1>
      </div>

      <p class="pixel-text">Technologies and tools I work with regularly.</p>

      <div style="margin-top: 24px;">
        ${categories}
      </div>
    </div>
  `;

  panel.querySelector('.back-btn').addEventListener('click', onBack);
}
