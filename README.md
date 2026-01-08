# Snake

A modern browser-based Snake game featuring multiple themes, difficulty levels, mobile touch support, and local leaderboards.

## Current Status

**Version:** v0.1.0 — Core Game Loop Foundation

The project is in active development. The foundational architecture is complete:

- [x] HTML5 Canvas rendering (400x400px, 20x20 grid)
- [x] Game loop with requestAnimationFrame (60fps render, 10Hz tick)
- [x] State machine (MENU, PLAYING, PAUSED, GAMEOVER)
- [x] Renderer class with grid and cell drawing
- [x] CSS theme variables for future theming
- [x] Responsive canvas scaling
- [x] Unit tests (19 tests passing)

## Quick Start

### Run the Game

```bash
# Using npx (Node.js required)
npx serve .

# Or using Python
python3 -m http.server 8000
```

Then open [http://localhost:3000](http://localhost:3000) (or port 8000 for Python).

### Run Tests

```bash
node --test game.test.js
```

## Project Structure

```
Snake/
├── index.html          # Main HTML file with canvas
├── styles.css          # Styling and CSS theme variables
├── game.js             # Game engine (constants, Renderer, Game classes)
├── game.test.js        # Unit tests
├── PRD.md              # Product Requirements Document
├── WORKFLOW.md         # AI-assisted development documentation
├── CLAUDE.md           # AI assistant instructions
└── openspec/           # Specification-driven development
    ├── project.md      # Project conventions and tech stack
    ├── specs/          # Implemented specifications
    └── changes/        # Pending proposals
```

## Documentation

| Document | Description |
|----------|-------------|
| [PRD.md](PRD.md) | Complete product requirements covering gameplay, UI, scoring, themes, and audio |
| [WORKFLOW.md](WORKFLOW.md) | Detailed walkthrough of the AI-assisted development process |
| [CLAUDE.md](CLAUDE.md) | Project context and instructions for AI assistants |

## Development Roadmap

The project uses [OpenSpec](https://openspec.dev) for specification-driven development. Features are implemented through proposals:

| # | Proposal | Status | Description |
|---|----------|--------|-------------|
| 1 | core-game-loop | ✅ Complete | Canvas, game loop, state machine |
| 2 | snake-mechanics | Pending | Snake movement, growth, self-collision |
| 3 | input-handling | Pending | Keyboard (arrows + WASD), touch/swipe |
| 4 | basic-food | Pending | Food spawning, eating, scoring |
| 5 | wall-collision | Pending | Wall collision toggle, wrap-around mode |
| 6 | ui-screens | Pending | Menus, pause, game over, settings |
| 7 | accessibility | Pending | ADA/WCAG 2.1 AA compliance |
| 8 | theme-system | Pending | 5 color themes with CSS variables |
| 9 | leaderboard | Pending | Top 10 scores with initials |
| 10 | difficulty-system | Pending | Easy/Medium/Hard, bonus/poison food |
| 11 | audio-system | Pending | Sound effects, volume control |

After proposal #4, the game will be playable.

## Planned Features

- **Controls**: Arrow keys, WASD, and touch/swipe gestures
- **Themes**: Classic, Neon, Retro, Dark, Light
- **Difficulty**: Easy, Medium, Hard with progressive speed
- **Food Types**: Regular, bonus (timed), poisonous (avoid)
- **Leaderboard**: Top 10 local scores with arcade-style initials
- **Accessibility**: WCAG 2.1 AA compliance, screen reader support, reduced motion
- **Settings**: Wall collision, animation style, volume — all persisted locally

See [PRD.md](PRD.md) for complete requirements.

## Built With

- **HTML5 Canvas** — Game rendering
- **Vanilla JavaScript** — No frameworks, single-file architecture
- **CSS Custom Properties** — Theming system
- **Node.js Test Runner** — Unit testing

## AI-Assisted Development

This project is being built with AI assistance (Claude by Anthropic) as a real-world example of human-AI collaboration in software development. The human developer directs the workflow, makes decisions, and validates quality, while the AI executes tasks, writes code, and generates documentation.

See [WORKFLOW.md](WORKFLOW.md) for a detailed, non-technical walkthrough of this process, including recommendations for beginners, intermediate, and advanced users.

## License

MIT
