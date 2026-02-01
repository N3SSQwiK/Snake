# Proposal: Add Online Leaderboards

## Why

Local leaderboards cap motivation once you dominate your own scores. Competing against other players globally adds a different dimension of fun and gives the game staying power.

## What Changes

- Backend service (serverless function or lightweight API) for score submission and retrieval
- Anti-cheat: basic score validation (max possible score given game duration and tick rate)
- Global leaderboard tab alongside existing local tab
- Daily / weekly / all-time filter options
- Anonymous identifiers — player initials + random tag (e.g., "ACE#7291"), no accounts needed
- Player ID persisted locally, regenerated if cleared
- Graceful offline fallback — local leaderboard always works, global shown when available
- Rate limiting on submissions

## Capabilities

### New Capabilities
- `online-leaderboard` — score submission API, global leaderboard display, player identity, anti-cheat validation, offline fallback

### Modified Capabilities
- `leaderboard` — add global/local tab switcher, display online entries

## Impact

- **New backend dependency** — serverless function or simple API (biggest scope change)
- `StorageManager` — player ID persistence
- Leaderboard UI — tab switcher, loading states, error states
- Network layer — fetch wrapper with timeout and retry
- Game over flow — submit score to both local and online
