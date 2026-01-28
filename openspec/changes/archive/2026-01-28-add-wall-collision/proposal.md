# Change: Add Wall Collision System

## Why
The PRD specifies wall collision as a player-configurable setting. Players can choose between classic mode (hitting walls ends the game) or wrap-around mode (snake appears on opposite side).

## What Changes
- Add wall collision detection to Snake/Game:
  - Detect when head moves outside grid bounds
  - Trigger GAMEOVER when wall collision enabled
- Add wrap-around logic:
  - Teleport snake head to opposite edge
  - Seamless visual transition
- Create StorageManager class (foundation for settings):
  - Save/load wall collision preference
  - localStorage persistence
- Add setting toggle (minimal UI for now)

## Impact
- Affected specs: `collision-system` (new capability)
- Affected code: `game.js` (collision logic, StorageManager, settings)
- Depends on: `basic-food` (playable game exists)
