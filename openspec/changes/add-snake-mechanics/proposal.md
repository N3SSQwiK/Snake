# Change: Add Snake Mechanics

## Why
The snake is the core gameplay element. Players need to control a snake that moves on the grid, grows when eating food, and dies when colliding with itself.

## What Changes
- Create Snake class with:
  - Body represented as array of grid coordinates
  - Direction property (up/down/left/right)
  - Movement logic (shift body segments)
  - Growth mechanic (add segment on next move)
  - Self-collision detection
- Integrate Snake with Game class tick/render cycle
- Render snake body and head with distinct colors

## Impact
- Affected specs: `snake-mechanics` (new capability)
- Affected code: `game.js` (add Snake class, integrate with Game)
- Depends on: `core-game-loop`
