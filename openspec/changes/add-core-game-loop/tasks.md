# Tasks: Add Core Game Loop

## 1. HTML Structure
- [ ] 1.1 Create `index.html` with doctype, viewport meta, and responsive setup
- [ ] 1.2 Add Canvas element with id for JavaScript access
- [ ] 1.3 Add container div for centering and UI overlay positioning
- [ ] 1.4 Link CSS and JS files

## 2. CSS Foundation
- [ ] 2.1 Create `styles.css` with CSS reset/normalize basics
- [ ] 2.2 Add CSS custom properties for theme colors (defaults)
- [ ] 2.3 Style canvas container (centered, responsive)
- [ ] 2.4 Add basic UI overlay styles for future menu/game-over screens

## 3. Game Constants
- [ ] 3.1 Define grid dimensions (e.g., 20x20 cells)
- [ ] 3.2 Define cell size in pixels
- [ ] 3.3 Define game states enum (MENU, PLAYING, PAUSED, GAMEOVER)
- [ ] 3.4 Define timing constants (target FPS, tick rate)

## 4. Renderer Class
- [ ] 4.1 Create Renderer class that accepts Canvas context
- [ ] 4.2 Implement `clear()` method to clear canvas
- [ ] 4.3 Implement `drawGrid()` method to render grid lines
- [ ] 4.4 Implement `drawCell(x, y, color)` for drawing single cells

## 5. Game Class
- [ ] 5.1 Create Game class with constructor (canvas, config)
- [ ] 5.2 Implement state machine with `setState(state)` method
- [ ] 5.3 Implement `start()` method to begin game loop
- [ ] 5.4 Implement `stop()` method to halt game loop
- [ ] 5.5 Implement `tick()` method for game logic updates
- [ ] 5.6 Implement `render()` method calling Renderer
- [ ] 5.7 Implement requestAnimationFrame loop with delta timing

## 6. Initialization
- [ ] 6.1 Add DOMContentLoaded handler to bootstrap game
- [ ] 6.2 Instantiate Game with canvas element
- [ ] 6.3 Set initial state to MENU
- [ ] 6.4 Verify game loop runs at target frame rate

## 7. Testing
- [ ] 7.1 Create `game.test.js` with test scaffold
- [ ] 7.2 Write unit tests for state machine transitions
- [ ] 7.3 Manual test: verify canvas renders and grid displays
