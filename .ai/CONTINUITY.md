# Continuity

## Summary
Browser-based snake game with vanilla JS, canvas rendering, class-based architecture. Leaderboard pager shipped (PR #62 merged, issue #59 closed, archived) — replaced tab buttons with prev/next pager for keyboard/gamepad-friendly mode cycling. D-pad buttons enlarged for mobile. 7 openspec changes queued.

## Completed
- Leaderboard pager (PR #62, merged, archived): replaced tab row with pager component (arrows + title + dots), `_cycleLeaderboardMode()`, `navigateMenu()` integration for keyboard/gamepad, wider panel on desktop, larger D-pad buttons, 451 unit tests
- Responsive layout (PR #61, merged, archived): dynamic canvas fills viewport, DPR-aware bitmap, `--game-scale` CSS property, two-pass resize for D-pad convergence, flex-shrink fixes, grid drawn during MENU, Playwright browser tests
- Unified input navigation (PR #57, merged, archived): SCREEN_NAV registry, unified navigateBack(), focus recovery, grid nav generalization, initials modal standardization
- Game modes (PR #55, merged, archived): Classic, Time Attack, Maze, Zen + mode selection card screen
- Extended input methods (PR #54, merged): gamepad support, virtual D-pad, mobile Swipe/D-Pad selector
- Settings previews (PR #53, merged), accessibility (PR #45, merged), audio system (PR #44, merged)
- All prior openspec changes archived and synced

## Implementation Priority
1. **add-dualsense-enhancements** (#60) — Advanced DualSense features (haptics, LED, gyro). Proposal only (1/4 artifacts).

### Backlog (proposals only, not yet prioritized)
- add-achievements (#46), add-snake-skins (#52), add-daily-challenge (#47), add-replay-system (#51), add-local-multiplayer (#49), add-online-leaderboards (#50)

## Known Issues
- None currently tracked

## Key Files
- `game.js` - All game code (~4350 lines)
- `game.test.js` - 451 unit tests
- `responsive.test.cjs` - 17 Playwright browser verification tests
- `openspec/changes/` - 7 active changes + archive

## Context
- GitHub project board: N3SSQwiK/projects/4
- openspec `config.yaml` rules field parser bug (warns "must be array of strings") — harmless
- Playwright installed at `~/node_modules/playwright`, run with `NODE_PATH=~/node_modules`
- Vibration API (`navigator.vibrate()`) works on Android but not iOS Safari — no haptic feedback for web on iPhone

## Suggested Prompt
> Continue with DualSense enhancements: `/opsx:continue add-dualsense-enhancements` — needs design, specs, and tasks artifacts before implementation.

## Source
Claude Code | 2026-02-11
