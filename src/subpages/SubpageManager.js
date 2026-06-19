export class SubpageManager {
  constructor() {
    this.currentSection = null;
  }

  show(sectionId) {
    const panel = document.getElementById(`panel-${sectionId}`);
    if (!panel) return;
    this.currentSection = sectionId;
    panel.style.display = 'flex';
    // Force reflow so the transition plays
    void panel.offsetWidth;
    panel.classList.add('active');

    // Hide hint text while panel is open
    const hint = document.getElementById('ui-hint');
    if (hint) hint.style.opacity = '0';
  }

  hide(sectionId, onHidden) {
    const panel = document.getElementById(`panel-${sectionId}`);
    if (!panel) {
      onHidden?.();
      return;
    }
    panel.classList.remove('active');

    const cleanup = () => {
      panel.style.display = 'none';
      this.currentSection = null;

      const hint = document.getElementById('ui-hint');
      if (hint) hint.style.opacity = '';

      onHidden?.();
    };

    // Wait for CSS transition to finish
    panel.addEventListener('transitionend', cleanup, { once: true });
  }

  isOpen() {
    return this.currentSection !== null;
  }
}
