# Continuity

## Summary
Browser-based snake game with vanilla JS, canvas rendering, class-based architecture. Extended input methods shipped (PR #54 merged). 8 openspec changes queued with prioritized implementation order.

## Completed
- Extended input methods (PR #54, merged): gamepad support (DualSense tested), virtual D-pad, mobile Swipe/D-Pad selector, UIManager navigateMenu/navigateBack, gamepad initials entry, hold-to-repeat, post-initials focus
- PR review fixes: swipe gating in D-pad mode, Cross button overlay routing
- Settings previews (PR #53, merged), accessibility (PR #45, merged), audio system (PR #44, merged)
- All prior openspec changes archived and synced (including add-extended-input → input-handling spec)

## Implementation Priority
Order based on: core gameplay → engagement loops → cosmetics → polish → infrastructure-heavy

1. **add-game-modes** — Biggest value-add, expands core loop, gives everything else more surface area
2. **add-achievements** — Engagement hooks, player goals. Benefits from game modes (mode-specific achievements)
3. **add-snake-skins** — Cosmetic rewards, ties into achievements as unlocks
4. **add-daily-challenge** — Daily engagement driver. Better with game modes (rotate challenge types). No backend needed
5. **add-replay-system** — Shareable moments. Nice but not critical
6. **add-dualsense-enhancements** — Polish for niche audience (DualSense + Chromium). Basic gamepad already works
7. **add-local-multiplayer** — Big architectural lift (two snakes, inter-snake collision). Solo experience should be rich first
8. **add-online-leaderboards** — Requires backend infrastructure. Highest risk/dependency. Last

All 8 changes have proposals only (no design/specs/tasks yet), except add-game-modes (4/4 artifacts, ready for implementation) and add-dualsense-enhancements (1/4 artifacts, proposal done).

## Key Files
- `game.js` - All game code (~3700 lines)
- `game.test.js` - 327 unit tests
- `openspec/changes/` - 8 active changes + archive

## Context
- GitHub project board: N3SSQwiK/projects/4
- openspec `config.yaml` rules field parser bug (warns "must be array of strings") — harmless

## Suggested Prompt
> Start implementing game modes: `/opsx:apply add-game-modes` — all artifacts complete (47 tasks across 10 groups). Create feature branch first.

## Source
Claude Code | 2026-02-10
