# Change: Add Theme System

## Why
Visual customization increases player engagement. Multiple themes allow players to personalize their experience with different color schemes and visual styles.

## What Changes
- Create theme system:
  - Theme objects with color definitions for canvas elements
  - CSS custom properties for UI elements
  - 5 built-in themes: Classic, Neon, Retro, Dark, Light
- Theme selection:
  - Add theme picker to settings screen
  - Preview themes before selection
  - Persist selected theme
- Apply themes:
  - Renderer uses active theme colors
  - UI elements use CSS variables
  - Smooth theme transition

## Impact
- Affected specs: `theme-system` (new capability)
- Affected code: `game.js` (theme definitions, Renderer updates), `styles.css` (CSS variables), `index.html` (theme selector)
- Depends on: `ui-screens` (settings screen exists)
