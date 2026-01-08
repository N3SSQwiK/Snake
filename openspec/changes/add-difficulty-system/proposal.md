# Change: Add Difficulty System

## Why
Progressive challenge keeps the game engaging. Difficulty levels let players choose their challenge, while speed increases reward skilled play. Advanced food types add strategic depth.

## What Changes
- Difficulty levels:
  - Easy, Medium, Hard presets
  - Each level defines starting speed and acceleration rate
  - Add difficulty selector to settings
- Progressive speed:
  - Snake speed increases as score grows
  - Acceleration rate based on difficulty
  - Maximum speed cap
- Advanced food types:
  - Bonus food: higher points, time-limited
  - Poisonous food: must avoid, time-limited, game over if eaten
  - Random spawning with configurable probabilities

## Impact
- Affected specs: `difficulty-system` (new capability)
- Affected code: `game.js` (speed system, food types, difficulty config)
- Depends on: `basic-food`, `ui-screens`
