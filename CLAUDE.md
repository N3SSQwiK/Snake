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
