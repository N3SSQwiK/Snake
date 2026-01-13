# Project Context

## Purpose
Browser-based snake game with modern enhancements. Classic gameplay combined with multiple themes, difficulty settings, mobile touch support, and local leaderboards. See PRD.md for complete feature requirements.

## Tech Stack
- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** (no TypeScript - simpler setup, no build step for game code)
- **CSS** for UI/menus with CSS custom properties for theming
- **localStorage** for persistence
- **Node.js native test runner** for unit tests
- No external frameworks required

## Project Conventions

### Code Style
- **Single file architecture**: All game code in one JS file for simplicity
- **Class-based design**: Use classes for game entities (Snake, Food, Game, Renderer, etc.)
- Use descriptive function and variable names
- Separate game logic from rendering code
- Keep input handling decoupled from game state
- Constants (grid size, speeds, colors) defined at top of file

### Architecture Patterns
- **Game Loop**: requestAnimationFrame-based loop for 60fps
- **State Machine**: Menu → Playing → Paused → Game Over states
- **Class Separation**:
  - `Game` - Main controller, game loop, state management
  - `Snake` - Snake state, movement, growth
  - `Food` - Food spawning, types, timers
  - `Renderer` - Canvas drawing, animations
  - `InputHandler` - Keyboard, touch, direction queue
  - `AudioManager` - Sound effects, volume control
  - `StorageManager` - Settings, leaderboard persistence

### Theme System
- **Dual approach**: CSS variables for UI elements, JS objects for Canvas rendering
- Default theme: Neo-Arcade Emerald
  ```javascript
  {
    name: 'classic',
    colors: {
      background: '#0a0a0f',
      grid: '#1a1a24',
      snake: '#10b981',
      snakeHead: '#059669',
      snakeTail: '#34d399',
      snakeGlow: 'rgba(16, 185, 129, 0.4)',
      snakeEyes: 'rgba(255, 255, 255, 0.9)',
      food: '#ef4444',
      bonusFood: '#f59e0b',
      poisonFood: '#a855f7'
    }
  }
  ```
- CSS variables (e.g., `--theme-bg`, `--theme-accent`) for menus and UI
- Active theme stored in localStorage

### Implementation Rules
1. **Design before code** - Use `/game-ui-design` skill BEFORE implementing visual components
2. **Follow proposal requirements** - If proposal says "MANDATORY: use skill X", do it
3. **Complete proposals first** - Add missing design specs before coding
4. **Avoid AI aesthetic traps** - No neon colors (#00ff00), no emoji icons, no rainbow gradients

### Testing Strategy
- **Unit tests**: Node.js native test runner (`node --test`)
  - Collision detection (self, walls, food)
  - Scoring calculations
  - Snake movement and growth logic
  - Wrap-around coordinate math
  - Direction queue (preventing 180° turns)
- **Manual testing**: Cross-browser (Chrome, Firefox, Safari, Edge)
- **Device testing**: Desktop and mobile, verify touch controls
- Test file: `game.test.js` alongside main game code

### Git Workflow
- Main branch for stable releases
- Feature branches for new functionality
- Conventional commit messages preferred

## Domain Context
- Grid-based movement: snake occupies discrete cells
- Direction queue: buffer inputs to prevent 180° reversals
- Food types: regular (persistent), bonus (timed), poisonous (timed, avoid)
- Collision modes: wall-death vs wrap-around (player setting)
- Animation modes: smooth interpolation vs classic grid-snap (player setting)

## Important Constraints
- Must run in browser without server-side code
- Target 60fps on mid-range devices
- Mobile-first responsive design
- All data stored locally (no backend)

## External Dependencies
- None required for core functionality
- Optional: Web Audio API for sound effects

## Implementation Status

### Completed Specs
- `core-game-loop` - Game class, state machine, fixed-timestep loop, Renderer
- `snake-mechanics` - Snake class, movement, growth, self-collision, visual design

### Pending Changes
- `add-input-handling` - Keyboard/touch controls
- `add-basic-food` - Food spawning, collision, scoring
- `add-wall-collision` - Boundary detection
- `add-ui-screens` - Menus, pause, game over
- `add-theme-system` - Multiple themes, picker
- `add-difficulty-system` - Speed progression, food types
- `add-leaderboard` - High scores, initials entry
- `add-audio-system` - Sound effects
- `add-accessibility` - ADA compliance
