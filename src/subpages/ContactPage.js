import { ICON } from '../utils/Icons.js';

export function initContactPage(panel, onBack) {
  panel.innerHTML = `
    <div class="panel-inner">
      <div class="panel-header">
        <button class="pixel-btn back-btn" aria-label="Go back">${ICON.ARROW_LEFT} BACK</button>
        <h1 class="panel-title">CONTACT</h1>
      </div>

      <p class="pixel-text">
        Got a project in mind? Want to collaborate? Send a message &mdash; I read everything.
      </p>

      <hr class="pixel-divider" />

      <form class="contact-form" id="contact-form">
        <div>
          <label class="pixel-label" for="contact-name">YOUR NAME</label>
          <input
            class="pixel-input"
            type="text"
            id="contact-name"
            name="name"
            placeholder="PLAYER ONE"
            autocomplete="name"
            required
          />
        </div>
        <div>
          <label class="pixel-label" for="contact-email">EMAIL ADDRESS</label>
          <input
            class="pixel-input"
            type="email"
            id="contact-email"
            name="email"
            placeholder="YOU@EXAMPLE.COM"
            autocomplete="email"
            required
          />
        </div>
        <div>
          <label class="pixel-label" for="contact-msg">MESSAGE</label>
          <textarea
            class="pixel-textarea"
            id="contact-msg"
            name="message"
            placeholder="ENTER YOUR QUEST..."
            required
          ></textarea>
        </div>
        <div>
          <button type="submit" class="pixel-btn">SEND MESSAGE ${ICON.ARROW_RIGHT}</button>
        </div>
        <p class="pixel-text" id="form-status" style="display:none; color: #44ff88;"></p>
      </form>

      <hr class="pixel-divider" />

      <h2 class="section-title">${ICON.DIAMOND} DIRECT LINKS</h2>
      <div class="social-row">
        <a href="mailto:contact@example.com" class="pixel-btn">${ICON.ENVELOPE} EMAIL</a>
        <a href="https://github.com/acealone" target="_blank" rel="noopener" class="pixel-btn">${ICON.GITHUB} GITHUB</a>
      </div>
    </div>
  `;

  panel.querySelector('.back-btn').addEventListener('click', onBack);

  panel.querySelector('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = panel.querySelector('#contact-name').value;
    const email   = panel.querySelector('#contact-email').value;
    const message = panel.querySelector('#contact-msg').value;

    const mailto = `mailto:contact@example.com?subject=Portfolio%20Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom%3A%20${encodeURIComponent(email)}`;
    window.location.href = mailto;

    const status = panel.querySelector('#form-status');
    status.textContent = 'OPENING YOUR EMAIL CLIENT...';
    status.style.display = 'block';
  });
}
