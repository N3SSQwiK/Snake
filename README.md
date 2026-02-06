# Snake

A modern browser-based Snake game featuring multiple themes, difficulty levels, mobile touch support, and local leaderboards.

## Current Status

The project is in active development with core gameplay complete:

- [x] HTML5 Canvas rendering (500×500px, 25×25 grid)
- [x] Game loop with requestAnimationFrame (60fps render, variable tick rate)
- [x] State machine (MENU, PLAYING, PAUSED, GAMEOVER)
- [x] Snake movement, growth, self-collision
- [x] Keyboard (arrows + WASD) and touch/swipe input
- [x] Food system with 4 types: regular, bonus, toxic, lethal
- [x] Difficulty levels (Easy/Medium/Hard) with progressive speed
- [x] Proximity-based hazard food spawning
- [x] Toxic food removes snake segments (scales with difficulty)
- [x] 5 color themes with CSS variables
- [x] HTML HUD above canvas (score, length, difficulty, toxic penalty)
- [x] Difficulty-scoped leaderboard with grouped sections
- [x] Procedural audio system (Web Audio API, no audio files)
- [x] Volume control and mute toggle with localStorage persistence
- [x] Settings screen with difficulty selector, animation toggle, audio controls, theme picker
- [x] Toggleable smooth/classic animation
- [x] Mobile touch support
- [x] 256 unit tests passing

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
| 2 | snake-mechanics | ✅ Complete | Snake movement, growth, self-collision |
| 3 | input-handling | ✅ Complete | Keyboard (arrows + WASD), touch/swipe |
| 4 | basic-food | ✅ Complete | Food spawning, eating, scoring |
| 5 | wall-collision | ✅ Complete | Wall collision (absorbed into difficulty) |
| 6 | ui-screens | ✅ Complete | Menus, pause, game over, settings |
| 7 | accessibility | Pending | ADA/WCAG 2.1 AA compliance |
| 8 | theme-system | ✅ Complete | 5 color themes with CSS variables |
| 9 | leaderboard | ✅ Complete | Top 50 scores with initials, difficulty-scoped |
| 10 | difficulty-system | ✅ Complete | Easy/Medium/Hard, food types, proximity spawning |
| 11 | audio-system | ✅ Complete | Procedural sound effects, volume control |

## Features

- **Controls**: Arrow keys, WASD, and touch/swipe gestures
- **Themes**: Classic, Neon, Retro, Dark, Light
- **Difficulty**: Easy (walls wrap), Medium (toxic food), Hard (toxic + lethal food)
- **Food Types**: Regular (apple), bonus (star, +25pts), toxic (diamond, removes segments), lethal (skull, instant death)
- **Proximity Spawning**: Hazard food spawns near good food — closer on harder difficulties
- **Leaderboard**: Top 50 scores with initials, grouped by difficulty
- **HUD**: HTML display above canvas showing score, length, difficulty, toxic penalty info
- **Audio**: Procedural sound effects via Web Audio API — no audio files needed
- **Settings**: Difficulty, animation style, volume/mute, theme — all persisted locally

See [PRD.md](PRD.md) for complete requirements.

## Dev Tools

A console API is available for manual testing. Open browser devtools and type `dev.help()`.

| Command | Description |
|---------|-------------|
| `dev.spawnFood(type)` | Spawn food: `regular`, `bonus`, `toxic`, `lethal` |
| `dev.setScore(n)` | Set score and update speed accordingly |
| `dev.setDifficulty(d)` | Set difficulty: `easy`, `medium`, `hard` |
| `dev.setSpeed(hz)` | Override tick rate (Hz) |
| `dev.grow(n)` | Grow snake by n segments (default 5) |
| `dev.kill()` | Trigger game over |
| `dev.status()` | Print current game state table |

### Testing recipes

```js
// Test toxic food segment removal at high score
dev.setScore(200); dev.grow(20); dev.spawnFood('toxic');

// Test lethal food proximity on hard (spawns 1-2 cells from regular food)
dev.setDifficulty('hard'); dev.spawnFood('lethal');

// Test toxic proximity on medium (spawns 4-6 cells from regular food)
dev.setDifficulty('medium'); dev.spawnFood('toxic');

// Simulate a high-score game for leaderboard testing
dev.setScore(500); dev.grow(30); dev.kill();

// Check speed scaling
dev.setScore(0); dev.status(); dev.setScore(300); dev.status();
```

## Built With

- **HTML5 Canvas** — Game rendering
- **Web Audio API** — Procedural sound generation
- **Vanilla JavaScript** — No frameworks, single-file architecture
- **CSS Custom Properties** — Theming system
- **Node.js Test Runner** — Unit testing

## AI-Assisted Development

This project is being built with AI assistance (Claude by Anthropic) as a real-world example of human-AI collaboration in software development. The human developer directs the workflow, makes decisions, and validates quality, while the AI executes tasks, writes code, and generates documentation.

See [WORKFLOW.md](WORKFLOW.md) for a detailed, non-technical walkthrough of this process, including recommendations for beginners, intermediate, and advanced users.

## License

MIT
