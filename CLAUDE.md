
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser-based snake game with modern features: multiple themes, difficulty levels, procedural audio, mobile touch support, and local leaderboards. See PRD.md for complete requirements.

## Key Technical Decisions

- **Language**: Vanilla JavaScript (no build step)
- **Structure**: Single file architecture
- **Style**: Class-based design for game entities
- **Grid**: 25×25 cells, 20px cell size (500×500 canvas)
- **Rendering**: Canvas-based for 60fps performance
- **HUD**: HTML element above canvas (not canvas-drawn) for score, length, difficulty, toxic penalty
- **Themes**: CSS variables for UI, JS objects for Canvas colors
- **State persistence**: localStorage for settings and leaderboard
- **Input**: Keyboard (arrows + WASD), touch/swipe for mobile
- **Animation**: Player-toggleable smooth interpolation vs classic grid-snap
- **Audio**: Web Audio API procedural generation (no audio files), lazy AudioContext init

## Architecture Notes

Class-based separation:
- `Game` - Main controller, game loop, state machine
- `Snake` - Snake state, movement, growth
- `Food` - Food spawning, types, timers, proximity spawning
- `Renderer` - Canvas drawing, animations, theme application
- `InputHandler` - Keyboard, touch, direction queue
- `AudioManager` - Sound effects, volume control
- `StorageManager` - Settings, leaderboard persistence

## GitHub + Openspec Workflow

Issues map 1:1 with openspec proposals. Project: https://github.com/users/N3SSQwiK/projects/4

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

1. **Design before code** - Use `/game-ui-design` skill BEFORE implementing any visual components (check proposal's Design Requirements section)
2. **Follow your own docs** - If proposal says "MANDATORY: use skill X", do it
3. **Complete proposals first** - Don't implement from incomplete specs; add missing design specs before coding
4. **Avoid AI aesthetic traps** - No neon colors (#00ff00), no emoji icons, no rainbow gradients; use sophisticated palettes
5. **Challenge before implementing** - Run `/maestro challenge <change-id>` on non-trivial features to catch edge cases before coding
6. **Include edge cases in specs** - Every spec should consider: rapid input, resource exhaustion, concurrent operations (see AGENTS.md for checklists)

## Development

Run locally with any static file server:
```bash
npx serve .
# or
python3 -m http.server 8000
```

Run unit tests:
```bash
node --test game.test.js
```
