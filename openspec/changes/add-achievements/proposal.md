# Proposal: Add Achievements

## Why

High scores are the only progression mechanic. Achievements give players varied goals beyond "beat your best," creating a retention hook and rewarding different play styles.

## What Changes

- Define achievement catalog (name, description, icon, unlock condition)
- Runtime tracker that evaluates conditions after game events (food eaten, death, score milestones)
- Unlock notification toast displayed during gameplay or on game over
- Achievement gallery screen accessible from the main menu
- Persistent unlock state in localStorage
- Example achievements:
  - "First Blood" — eat your first food
  - "Speed Demon" — reach max speed
  - "Marathon" — play for 5 minutes straight
  - "Top 10" — make the leaderboard
  - "Perfectionist" — fill the entire leaderboard with your scores
  - "Untouchable" — reach score 100 without hitting a wall (walls off)

## Capabilities

### New Capabilities
- `achievements` — achievement definitions, runtime tracking, unlock persistence, gallery UI, notification toasts

### Modified Capabilities
None

## Impact

- `Game` — emit events for achievement tracking (food eaten, game over, score thresholds)
- `StorageManager` — achievement unlock persistence
- New `AchievementManager` class — definitions, condition evaluation, unlock state
- New UI: achievement gallery screen, unlock toast overlay
- Menu — add achievements button
