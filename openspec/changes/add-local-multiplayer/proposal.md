# Proposal: Add Local Multiplayer

## Why

Snake on the same screen with another person is immediately fun. Local multiplayer requires no networking, keeps the single-file simplicity, and gives the game a social dimension.

## What Changes

- Shared-grid mode for 2 players on the same device
- Player 1: WASD, Player 2: Arrow keys
- Shared food spawning, independent snakes
- Collision rules:
  - Self-collision = that player dies
  - Head-to-head collision = both die
  - Head-to-body collision = the one who hit dies
- Win condition: last snake standing, or highest score if both die simultaneously
- Distinct color scheme per player (respects active theme)
- 2-player option on start menu
- Split score display in HUD

## Capabilities

### New Capabilities
- `local-multiplayer` — multi-snake game loop, per-player input binding, collision resolution, win conditions, 2-player UI

### Modified Capabilities
None (multiplayer is a separate mode, doesn't alter single-player)

## Impact

- `Snake` — support multiple independent instances
- `Game` — multi-snake tick loop, inter-snake collision detection
- `Renderer` — draw two snakes with distinct colors
- `InputHandler` — concurrent key bindings for two players (WASD vs arrows)
- Start menu — player count selection
- Game over screen — winner display, per-player scores
