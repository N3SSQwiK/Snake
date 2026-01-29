# Continuity

## Summary
Browser-based snake game with vanilla JS, canvas rendering, class-based architecture. Building toward v1.0 with themes, difficulty, audio, leaderboard, and accessibility.

## Completed
- Core game loop, snake mechanics, input handling, food system (PRs #1, #31, #32, #33)
- Wall collision with wrap-around mode, StorageManager (PR #34)
- UI screens: start menu, pause, game over, settings with glassmorphism design (PR #35)
- UIManager class, CSS data-attribute binding, event delegation, inputGate
- Extended input proposal scaffolded (add-extended-input: D-pad, tap zones, gamepad)
- OpenSpec `ui-screens` spec promoted (6 specs total), `add-ui-screens` archived
- All PRs added to GitHub project board #4

## In Progress
None

## Blocked
None

## Key Files
- `game.js` - All game code (~1050 lines): Game, Snake, Food, Renderer, InputHandler, UIManager, StorageManager
- `game.test.js` - 151 unit tests
- `styles.css` - Glassmorphism UI design system with `--ui-*` tokens
- `openspec/changes/add-extended-input/` - Scaffolded proposal for D-pad, tap zones, gamepad
- `CLAUDE.md` - Project conventions and workflow instructions

## Context
- Single-file architecture (game.js), no build step
- 6 openspec proposals remain: add-extended-input, add-theme-system, add-difficulty-system, add-audio-system, add-leaderboard, add-accessibility
- Maestro orchestration files in `.ai/MAESTRO.md` and `.ai/MAESTRO-LOG.md` (from ui-screens)
- GitHub project board: N3SSQwiK/projects/4

## Suggested Prompt
> The `add-extended-input` proposal is already scaffolded with specs and tasks (D-pad, tap zones, PlayStation gamepad via Gamepad API). Run `/maestro plan Implement add-extended-input proposal` to orchestrate, or pick a different proposal like `add-theme-system` or `add-difficulty-system`. Use `openspec list` to see all remaining proposals.

## Source
Claude Code | 2026-01-29 03:42 UTC
