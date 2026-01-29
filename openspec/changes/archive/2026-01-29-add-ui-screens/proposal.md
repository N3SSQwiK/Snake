# Change: Add UI Screens

## Why
The game needs proper user interface screens for navigation: a start menu to begin playing and access settings, a pause overlay, and an animated game over screen with restart options.

## What Changes
- Create UI overlay system:
  - HTML overlays positioned over canvas
  - Show/hide based on game state
- Start menu screen:
  - Play button
  - Settings button (opens settings)
  - High scores button (placeholder for leaderboard)
- Pause overlay:
  - Pause/resume with spacebar
  - Mobile pause button
  - "Paused" indicator with resume/quit options
- Game over screen:
  - Animated overlay (fade in)
  - Final score display
  - Restart and menu buttons
- Settings screen:
  - Wall collision toggle
  - Placeholder for future settings

## Design Requirements

> **MANDATORY**: Use `/game-ui-design` skill before implementing any visual components.

### UI Components Requiring Design
| Component | Design Elements |
|-----------|-----------------|
| Start Menu | Layout, button styles, logo/title treatment, background |
| Pause Overlay | Semi-transparent backdrop, centered modal, button group |
| Game Over Screen | Fade animation, score typography, button hierarchy |
| Settings Screen | Form layout, toggle/switch styles, section headers |
| Mobile Pause Button | Position, size (44x44px min), icon design |

### Design Considerations
- Glassmorphism/neo-modern aesthetic (avoid generic AI patterns)
- Responsive layout for desktop and mobile
- Consistent button styles across all screens
- Focus states for keyboard navigation
- Touch-friendly tap targets (44x44px minimum)

## Impact
- Affected specs: `ui-screens` (new capability)
- Affected code: `index.html` (overlay markup), `styles.css` (overlay styles), `game.js` (UI management)
- Depends on: `wall-collision` (settings exist)
