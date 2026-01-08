# Change: Add Basic Food System

## Why
Food is essential for gameplay - it gives the player a goal and causes the snake to grow. This proposal adds basic food spawning, collision detection, and scoring to create a complete playable game.

## What Changes
- Create Food class with:
  - Position (grid coordinates)
  - Random spawn logic (avoiding snake body)
  - Food-snake collision detection
- Add scoring system:
  - Current score counter
  - Snake length display
  - Score increment on food eaten
- Integrate with Game tick cycle
- Render food and score display

## Impact
- Affected specs: `food-system` (new capability)
- Affected code: `game.js` (add Food class, scoring, integrate with Game)
- Depends on: `snake-mechanics`, `input-handling`
- **Milestone: Completes minimal playable game**
