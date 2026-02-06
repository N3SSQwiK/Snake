# Change: Add Audio System

## Why
Sound effects enhance game feel and provide important feedback. Audio cues for eating food, game over, achievements, and UI navigation make the game more engaging and satisfying. Procedural generation via Web Audio API means zero external assets and no build step.

## What Changes
- Create AudioManager class:
  - Web Audio API for procedural sound generation (no audio files)
  - Lazy AudioContext initialization (requires user interaction)
  - Volume control (0.0–1.0) and mute toggle
  - Settings persisted via StorageManager
- Gameplay sound effects:
  - **Eat** — short pleasant chirp on regular food
  - **Bonus Eat** — ascending happy tone on bonus food
  - **Poison Appear** — warning tone when poison food spawns
  - **Poison Disappear** — relief tone when poison food expires
  - **Game Over** — descending sad tone on death
  - **High Score** — celebratory fanfare on new #1
  - **Theme Unlock** — reward chime when a new theme is earned
- UI sound effects:
  - **Navigate** — subtle tick when moving between menu items or hovering buttons
  - **Confirm** — affirmative tone on selection (play, submit, apply theme)
  - **Back/Escape** — soft dismissal tone on cancel, back, or ESC
- Volume controls in settings:
  - Volume slider
  - Mute toggle
  - Persist volume/mute preference

## Capabilities

### New Capabilities
- `audio-system` — procedural sound generation, volume control, game + UI sound integration

### Modified Capabilities
None

## Impact
- Affected code: `game.js` (AudioManager class, Game integration, UIManager sound hooks), `index.html` (volume controls in settings), `styles.css` (slider/mute styling)
- No external dependencies
