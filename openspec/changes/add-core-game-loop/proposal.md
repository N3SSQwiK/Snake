# Change: Add Core Game Loop

## Why
The snake game needs a foundational architecture before any gameplay features can be built. This establishes the HTML/CSS scaffold, Canvas rendering surface, game loop timing, and state machine that all other features depend on.

## What Changes
- Create `index.html` with Canvas element and basic layout
- Create `styles.css` with responsive canvas styling and CSS variables for theming
- Create `game.js` with Game class implementing:
  - requestAnimationFrame-based game loop (60fps target)
  - State machine (menu → playing → paused → gameover)
  - Grid system with configurable dimensions
  - Renderer class for Canvas drawing operations
- Establish constants for grid size, cell dimensions, and timing

## Impact
- Affected specs: `core-game-loop` (new capability)
- Affected code: `index.html`, `styles.css`, `game.js` (all new files)
- This is the foundation - all future proposals depend on this
