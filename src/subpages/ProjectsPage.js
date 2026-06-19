const PROJECTS = [
  {
    title: 'RETRO GALLERY',
    desc: 'This portfolio — a Three.js gallery room with pixel-art aesthetics, spring-physics frame wobble, and camera-flight navigation.',
    tags: ['Three.js', 'Vite', 'WebGL'],
    link: '#',
  },
  {
    title: 'PROJECT ALPHA',
    desc: 'A procedurally generated dungeon explorer built in the browser. Canvas 2D, keyboard-driven, no libraries.',
    tags: ['Canvas 2D', 'JS', 'Procedural'],
    link: '#',
  },
  {
    title: 'PROJECT BETA',
    desc: 'Real-time collaborative pixel art canvas. WebSockets, shared state, 64-colour palette.',
    tags: ['WebSockets', 'Node.js', 'Canvas'],
    link: '#',
  },
  {
    title: 'PROJECT GAMMA',
    desc: 'CLI tool for batch-converting sprite sheets. Handles palettes, animations, and atlas packing.',
    tags: ['Node.js', 'CLI', 'Tooling'],
    link: '#',
  },
];

export function initProjectsPage(panel, onBack) {
  const cards = PROJECTS.map(p => `
    <div class="project-card">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="tag-row">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <a href="${p.link}" class="project-link" target="_blank" rel="noopener">VIEW PROJECT &#9654;</a>
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="panel-inner">
      <div class="panel-header">
        <button class="pixel-btn back-btn" aria-label="Go back">&#9664; BACK</button>
        <h1 class="panel-title">PROJECTS</h1>
      </div>

      <p class="pixel-text">A selection of things I've built. Click any card to see more.</p>

      <div class="project-grid" style="margin-top: 24px;">
        ${cards}
      </div>
    </div>
  `;

  panel.querySelector('.back-btn').addEventListener('click', onBack);
}
