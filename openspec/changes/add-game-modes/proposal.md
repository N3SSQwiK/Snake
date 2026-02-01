# Proposal: Add Game Modes

## Why

The game currently has a single play mode. Adding alternative modes multiplies replayability without requiring new core mechanics — each mode applies different rule sets to the existing engine.

## What Changes

- Add mode selection to start menu (Classic, Time Attack, Maze, Zen)
- **Classic**: Current behavior, unchanged
- **Time Attack**: 60-second countdown, eat as much as possible, no game-over on self-collision (time penalty instead)
- **Maze**: Static obstacle blocks on the grid, collision with obstacles = death, procedurally generated layout per game
- **Zen**: No death, no score, infinite play, snake always wraps, food just appears — pure relaxation mode
- Game class gets a `mode` property that adjusts rules per tick
- Leaderboard becomes per-mode (Classic and Time Attack only — Zen has no score)

## Capabilities

### New Capabilities
- `game-modes` — mode selection, per-mode rule engine, mode-specific UI

### Modified Capabilities
- `leaderboard` — per-mode score filtering and display

## Impact

- `Game` — mode property, rule variation per tick, timer for Time Attack
- `Renderer` — obstacle drawing for Maze mode, timer display for Time Attack
- `Food` — mode-aware spawning (Zen: always available, Maze: avoid obstacles)
- `StorageManager` — mode-scoped leaderboard entries
- Start menu UI — mode selector
- Game over screen — mode-specific messaging
