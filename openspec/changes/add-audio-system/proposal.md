# Change: Add Audio System

## Why
Sound effects enhance game feel and provide important feedback. Audio cues for eating food, game over, and achievements make the game more engaging and satisfying.

## What Changes
- Create AudioManager class:
  - Web Audio API for sound generation
  - Procedural sound effects (no external files needed)
  - Volume control and mute toggle
- Sound effects for:
  - Eating regular food
  - Eating bonus food
  - Poison food appearance/disappearance
  - Game over
  - New high score achievement
  - UI button clicks
- Add animation style toggle:
  - Smooth interpolation mode
  - Classic grid-snap mode
  - Player preference in settings

## Impact
- Affected specs: `audio-system` (new capability)
- Affected code: `game.js` (AudioManager, animation toggle), `index.html` (volume controls), `styles.css` (control styling)
- Depends on: `ui-screens`, `difficulty-system` (for food type sounds)
