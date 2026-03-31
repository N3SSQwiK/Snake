# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser-based snake game with modern features: multiple themes, 4 game modes (Classic, Time Attack, Maze, Zen), difficulty levels, procedural audio, mobile touch support, achievements, and local leaderboards. See PRD.md for complete requirements.

## Development

Run locally with any static file server:
```bash
python3 -m http.server 8000
```

Run unit tests:
```bash
node --test game.test.js
```

Run Playwright E2E tests:
```bash
npx playwright test
```

Run a single unit test by name:
```bash
node --test --test-name-pattern="pattern" game.test.js
```

## Key Technical Decisions

- **Language**: Vanilla JavaScript (no build step, no bundler)
- **Structure**: Single file architecture — all game code lives in `game.js` (~4500 lines)
- **Style**: Class-based design for game entities
- **Grid**: 25×25 cells, 20px cell size (500×500 canvas)
- **Rendering**: Canvas-based for 60fps performance
- **HUD**: HTML element above canvas (not canvas-drawn) for score, length, difficulty, toxic penalty
- **Themes**: CSS variables for UI (`--ui-accent`, `--ui-glass-bg`, `--ui-text-primary`), JS objects for Canvas colors
- **State persistence**: localStorage with `snake_` prefix via StorageManager
- **Input**: Keyboard (arrows + WASD), touch/swipe, gamepad — all through InputHandler with direction queue
- **Animation**: Player-toggleable smooth interpolation vs classic grid-snap
- **Audio**: Web Audio API procedural generation (no audio files), lazy AudioContext init on first user gesture

## Architecture

### State Machine
`Game.state` is one of: `MENU`, `PLAYING`, `PAUSED`, `GAMEOVER` (all uppercase). State transitions go through `Game.setState()` → `onStateChange()` which updates UI via `UIManager.updateState()`.

### Classes (all in game.js)
- `Game` — Main controller, game loop (`tick()`), state machine, collision detection, food spawning
- `Snake` — Body segments, direction, movement, growth
- `Food` — Spawning, types (REGULAR, BONUS, TOXIC, LETHAL), decay timers, proximity spawning
- `Renderer` — Canvas drawing, interpolation, theme application
- `InputHandler` — Keyboard, touch, gamepad polling, direction queue, action callbacks
- `UIManager` — All screen management, overlays, toast notifications, focus trapping, leaderboard display
- `AudioManager` — Procedural sound effects via Web Audio API
- `StorageManager` — localStorage wrapper with `snake_` prefix, settings/leaderboard/achievement persistence
- `AchievementManager` — 12 achievements with session vs cumulative progress tracking
- `PreviewManager` / `PreviewSnake` — Settings screen theme/difficulty previews

### Screen Navigation System
`SCREEN_NAV` registry maps screen keys (data-ui values or GameState names) to navigation contracts: `back` action method, `focusEntry` selector, optional `grid` layout, and `audio` feedback. `UIManager.navigateBack()` and `navigateMenu()` use this registry for keyboard/gamepad/Escape navigation across all screens.

### Game Modes
`MODE_RULES` registry defines per-mode behavior: collision handlers (`onWallCollision`, `onSelfCollision`), feature flags (`hasLeaderboard`, `hasScore`, `shouldSpawnObstacles`), and HUD extras. Zen mode notably never triggers game over (empty collision handlers, wall wrapping).

### Initialization
`DOMContentLoaded` creates `Game` → `UIManager`, then wires InputHandler callbacks. Game instance is exposed as `window.__gameInstance` for E2E test access.

### Testing
- **Unit tests** (`game.test.js`): ~490 tests using Node.js built-in test runner with mock DOM/localStorage/canvas
- **E2E tests** (`e2e/achievements.spec.js`): Playwright tests against a local HTTP server (port 8787)

## OpenSpec Workflow

Features are developed through OpenSpec — a structured artifact workflow. Issues map 1:1 with openspec proposals. Project board: https://github.com/users/N3SSQwiK/projects/4

**Artifact sequence:** proposal → spec → design → tasks → implementation → archive

**Creating proposals:** After `openspec validate`, create matching GitHub issue:
```bash
gh issue create --title "Add [feature]" --body "..." --label "feature" --milestone "v1.0 - ..."
gh project item-add 4 --owner N3SSQwiK --url "[issue-url]"
```

**Implementing:** Reference issue in commits/PRs. Update project board status.

**Archiving:** After `openspec archive [id]`, close the GitHub issue:
```bash
gh issue close [number] --comment "Implemented and archived"
```

## Implementation Rules

1. **Design before code** — Use `/game-ui-design` skill BEFORE implementing any visual components (check proposal's Design Requirements section)
2. **Follow your own docs** — If proposal says "MANDATORY: use skill X", do it
3. **Complete proposals first** — Don't implement from incomplete specs; add missing design specs before coding
4. **Avoid AI aesthetic traps** — No neon colors (#00ff00), no emoji icons, no rainbow gradients; use sophisticated palettes
5. **Include edge cases in specs** — Every spec should consider: rapid input, resource exhaustion, concurrent operations (see AGENTS.md for checklists)
