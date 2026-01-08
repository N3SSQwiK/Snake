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

## Impact
- Affected specs: `ui-screens` (new capability)
- Affected code: `index.html` (overlay markup), `styles.css` (overlay styles), `game.js` (UI management)
- Depends on: `wall-collision` (settings exist)
