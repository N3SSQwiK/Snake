# Change: Add Input Handling

## Why
Players need to control the snake using keyboard and touch inputs. A direction queue prevents rapid input from causing 180° reversals, which would cause instant self-collision.

## What Changes
- Create InputHandler class with:
  - Keyboard event listeners (arrows + WASD)
  - Touch/swipe gesture detection for mobile
  - Direction queue to buffer inputs between ticks
  - Prevention of 180° direction reversals
- Integrate InputHandler with Game class
- Apply queued direction to Snake each tick

## Impact
- Affected specs: `input-handling` (new capability)
- Affected code: `game.js` (add InputHandler class, integrate with Game)
- Depends on: `snake-mechanics`
