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

## Design Requirements

> **MANDATORY**: Use `/game-ui-design` skill before implementing visual components.

### UI Components Requiring Design
| Component | Design Elements |
|-----------|-----------------|
| Leaderboard Table | Column layout, rank styling, alternating rows, typography |
| Initials Entry | Arcade-style character selector, current letter highlight, navigation arrows |
| High Score Celebration | Animation effect (glow/pulse/particles), "NEW HIGH SCORE!" typography |
| Score Comparison | Current score vs high score display on game over |
| Empty State | Message when no scores recorded yet |

### Design Considerations
- Arcade/retro aesthetic for initials input (chunky characters, selection highlight)
- Table should be scannable with clear visual hierarchy (rank emphasis)
- Celebration effect should feel rewarding but not overwhelming
- Dates formatted consistently (e.g., "Jan 13" or "01/13/26")
- Responsive: table should work on mobile screens

### Animation Specifications
- Initials selector: letter cycle animation (scroll up/down)
- High score celebration: 1-2 second duration, non-blocking
- Table entry: new score highlight/flash on insertion

## Impact
- Affected specs: `leaderboard` (new capability)
- Affected code: `game.js` (StorageManager extension), `index.html` (leaderboard UI), `styles.css` (leaderboard styles)
- Depends on: `ui-screens`
