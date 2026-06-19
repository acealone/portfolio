// Pixel-art SVG icon strings — all fill="currentColor" so CSS color applies

export const ICON = {
  ARROW_LEFT: `<svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="vertical-align:middle;flex-shrink:0"><polygon points="7,0 1,4 7,8"/></svg>`,

  ARROW_RIGHT: `<svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="vertical-align:middle"><polygon points="1,0 7,4 1,8"/></svg>`,

  DIAMOND: `<svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="vertical-align:middle;flex-shrink:0"><polygon points="4.5,0 9,4.5 4.5,9 0,4.5"/></svg>`,

  // Pixel-art avatar face (8×10 pixel grid)
  AVATAR: `<svg width="64" height="64" viewBox="0 0 8 10" xmlns="http://www.w3.org/2000/svg" aria-label="Developer avatar" style="image-rendering:pixelated">
    <rect x="2" y="0" width="4" height="2" fill="#3a2010"/>
    <rect x="1" y="1" width="6" height="5" fill="#c8845a"/>
    <rect x="2" y="1" width="4" height="1" fill="#3a2010"/>
    <rect x="1" y="1" width="1" height="2" fill="#3a2010"/>
    <rect x="6" y="1" width="1" height="2" fill="#3a2010"/>
    <rect x="2" y="3" width="1" height="1" fill="#1a1a4a"/>
    <rect x="5" y="3" width="1" height="1" fill="#1a1a4a"/>
    <rect x="2" y="3" width="1" height="1" fill="#ffffff" opacity="0.4"/>
    <rect x="3" y="5" width="2" height="1" fill="#7a3010"/>
    <rect x="1" y="7" width="6" height="3" fill="#1a3a9a"/>
    <rect x="3" y="7" width="2" height="2" fill="#d4a017"/>
    <rect x="0" y="7" width="1" height="3" fill="#c8845a"/>
    <rect x="7" y="7" width="1" height="3" fill="#c8845a"/>
  </svg>`,

  // Envelope icon
  ENVELOPE: `<svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="vertical-align:middle">
    <rect x="0" y="0" width="14" height="11"/>
    <polygon points="0,0 7,6 14,0" fill="rgba(0,0,0,0.35)"/>
    <line x1="0" y1="11" x2="5" y2="5" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
    <line x1="14" y1="11" x2="9" y2="5" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  </svg>`,

  // GitHub mark (official simplified path)
  GITHUB: `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="vertical-align:middle">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>`,
};
