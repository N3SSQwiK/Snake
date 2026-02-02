# Continuity

## Summary
Browser-based snake game with vanilla JS, canvas rendering, class-based architecture. Building toward v1.0 with themes, difficulty, audio, extended input, and accessibility.

## Completed
- Theme system: 5 themes with score/difficulty-gated unlocks, CSS variable theming, picker UI (PR #38, archived)
- Animation toggle: smooth 60fps interpolation vs classic grid-snap, settings toggle (PR #40, open)
- Leaderboard: top-10 local scores, initials entry, celebration (PR #37, merged + archived)
- OpenSpec tooling migrated from `.claude/commands/openspec/` to multi-agent `opsx` skills
- 7 v2 feature proposals drafted (game modes, achievements, online leaderboards, multiplayer, replay, daily challenge, snake skins)

## In Progress
- PR #40 (add-animation-toggle) open on `feature/add-animation-toggle`, needs manual testing then merge

## Blocked
None

## Key Files
- `game.js` - All game code (~1700 lines): Game, Snake, Food, Renderer, InputHandler, UIManager, StorageManager, THEMES
- `game.test.js` - 192 unit tests
- `styles.css` - Glassmorphism UI with `--ui-*` and `--theme-*` CSS tokens
- `openspec/changes/add-audio-system/` - Next up: 34 tasks, fully specced (Web Audio API procedural sounds)
- `openspec/changes/add-animation-toggle/` - Current: all 24 tasks complete

## Context
- Single-file architecture (game.js), no build step
- Open changes ready to implement: add-audio-system (34 tasks), add-extended-input (31), add-difficulty-system (39), add-accessibility (48)
- Recommended order: audio system next, then difficulty, extended input, accessibility
- GitHub project board: N3SSQwiK/projects/4
- Issue #39 tracks animation toggle, issue #27 (theme system) closed

## Suggested Prompt
> PR #40 (add-animation-toggle) is open — do manual testing then merge. After merging, archive the change with `/opsx:archive add-animation-toggle` and close issue #39. Then implement `add-audio-system` next with `/opsx:apply add-audio-system` on a new feature branch. It has 34 tasks covering Web Audio API procedural sound generation, volume/mute controls, and gameplay + UI sound integration.

## Source
Claude Code | 2026-02-02 16:14 UTC
