export function initContactPage(panel, onBack) {
  panel.innerHTML = `
    <div class="panel-inner">
      <div class="panel-header">
        <button class="pixel-btn back-btn" aria-label="Go back">&#9664; BACK</button>
        <h1 class="panel-title">CONTACT</h1>
      </div>

      <p class="pixel-text">
        Got a project in mind? Want to collaborate? Send a message — I read everything.
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
          <button type="submit" class="pixel-btn">SEND MESSAGE &#9654;</button>
        </div>
        <p class="pixel-text" id="form-status" style="display:none; color: #44ff88;"></p>
      </form>

      <hr class="pixel-divider" />

      <h2 class="section-title">&#9670; DIRECT LINKS</h2>
      <div class="social-row">
        <a href="mailto:contact@example.com" class="pixel-btn">&#128140; EMAIL</a>
        <a href="https://github.com/acealone" target="_blank" rel="noopener" class="pixel-btn">&#128025; GITHUB</a>
      </div>
    </div>
  `;

  panel.querySelector('.back-btn').addEventListener('click', onBack);

  // Simple mailto fallback — no server needed for static site
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
