<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Session Continuity
At session start, read `.claude/CONTINUITY.md`. Present the summary and ask whether to proceed or adjust. Update the file after milestones (PR merged, proposal archived).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser-based snake game with modern features: multiple themes, difficulty levels, mobile touch support, and local leaderboards. See PRD.md for complete requirements.

## Key Technical Decisions

- **Language**: Vanilla JavaScript (no build step)
- **Structure**: Single file architecture
- **Style**: Class-based design for game entities
- **Rendering**: Canvas-based for 60fps performance
- **Themes**: CSS variables for UI, JS objects for Canvas colors
- **State persistence**: localStorage for settings and leaderboard
- **Input**: Keyboard (arrows + WASD), touch/swipe for mobile
- **Animation**: Player-toggleable smooth interpolation vs classic grid-snap

## Architecture Notes

Class-based separation:
- `Game` - Main controller, game loop, state machine
- `Snake` - Snake state, movement, growth
- `Food` - Food spawning, types, timers
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
