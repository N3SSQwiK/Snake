# Change: Add Leaderboard System

## Why
Players want to track their best performances and compete with themselves over time. A local leaderboard with arcade-style initials entry provides motivation and replay value.

## What Changes
- Extend StorageManager for leaderboard:
  - Store top 10 scores with initials and dates
  - CRUD operations for score entries
  - Sorted insertion maintaining top 10
- Add initials entry UI:
  - Arcade-style 3-character input
  - Appears on game over if score qualifies
- Add leaderboard display screen:
  - Accessible from start menu
  - Shows rank, initials, score, date
- Add high score celebration:
  - Visual effect when new high score achieved
  - Display "NEW HIGH SCORE" message

## Impact
- Affected specs: `leaderboard` (new capability)
- Affected code: `game.js` (StorageManager extension), `index.html` (leaderboard UI), `styles.css` (leaderboard styles)
- Depends on: `ui-screens`
