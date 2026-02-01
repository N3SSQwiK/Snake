# Proposal: Add Replay System

## Why

"Watch that run back" is satisfying and shareable. Replays let players relive their best games and learn from mistakes. The recording is lightweight — just inputs and a seed.

## What Changes

- Make game deterministic: seedable RNG for food spawns and all random events
- Record input sequence (direction + tick number) each game
- Store replay data for top N leaderboard entries (compact format)
- Replay viewer: playback at 1x / 2x / 4x speed
- Playback controls: play, pause, speed toggle
- Accessible from leaderboard — watch any saved score's replay
- Replay data stored in localStorage alongside leaderboard entries

## Capabilities

### New Capabilities
- `replay-system` — seedable RNG, input recording, deterministic playback, replay viewer UI, replay storage

### Modified Capabilities
- `leaderboard` — associate replay data with score entries, add "Watch" button

## Impact

- `Game` — deterministic mode (seeded RNG instead of Math.random)
- `Food` — use seeded RNG for spawn positions
- `InputHandler` — record/playback mode
- `StorageManager` — replay data storage (input arrays, seeds)
- New replay viewer UI — playback controls, speed selection
- Leaderboard UI — "Watch Replay" button per entry
- **Prerequisite**: Seedable RNG utility (used by daily challenge too)
