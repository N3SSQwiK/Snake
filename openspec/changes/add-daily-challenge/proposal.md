# Proposal: Add Daily Challenge

## Why

Gives players a reason to come back every day. A date-seeded game means everyone plays the same layout, creating natural competition even without online infrastructure.

## What Changes

- Daily seeded game: date string used as RNG seed, determining food spawn sequence and (if maze mode exists) obstacle layout
- One official attempt per day (unlimited practice with only first attempt counting)
- Daily results screen showing score and comparison to previous days
- Streak tracking — consecutive days played
- Calendar view showing past daily challenge results (score, rank)
- Daily challenge accessible from main menu

## Capabilities

### New Capabilities
- `daily-challenge` — date-seeded games, attempt tracking, streak system, calendar UI

### Modified Capabilities
- `leaderboard` — daily challenge tab (if online leaderboards exist)
- `achievements` — streak-based achievements (if achievements exist)

## Impact

- `Food` — seeded RNG for deterministic spawn sequence
- `Game` — challenge mode with seed injection
- `StorageManager` — daily state (today's score, attempt used), streak counter, historical results
- New UI: daily challenge entry screen, results screen, calendar view
- Menu — daily challenge button with streak indicator
- **Depends on**: seedable RNG (shared with replay system)
