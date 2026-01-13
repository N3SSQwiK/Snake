# Building a Snake Game with AI: A Workflow Documentation

This document describes how a classic Snake game was built for web browsers using AI as a collaborative tool. The AI assistant (Claude, made by Anthropic) executed tasks, wrote code, and generated documentation under the direction of the human developer.

---

## Phase 1: Ideation and Requirements Gathering

### Starting Point

The project began with a simple idea: build a Snake game that runs in a web browser. The user had set up an empty project folder and a Product Requirements Document (PRD) needed to be created before writing any code.

### User-Directed Requirements Gathering

The user prompted the AI to help build the PRD by asking a series of Yes/No questions covering the game's functionality, features, UI, and UX. This structured approach — similar to how an architect interviews a client before drawing blueprints — was specified by the user in their initial prompt.

The AI then asked questions across several categories, following the user's direction:

**Gameplay Mechanics:**
- Should the snake speed up as the player scores more points? → Yes
- Should hitting the wall end the game? → Make it a player setting
- Should there be a high score tracker? → Yes
- Should there be sound effects? → Yes

**Controls:**
- Support both arrow keys and WASD (a common alternative keyboard layout for games)? → Yes
- Allow pausing? → Yes
- Support touch/swipe on mobile phones? → Yes

**Food System:**
- Should there be different food types worth different points? → Yes, including "poisonous" food to avoid

**Visual Design:**
- Multiple color themes? → Yes
- Show a grid on the playing area? → Yes
- Animated game over screen? → Yes

**Polish Features:**
- Save settings between visits? → Yes
- Smooth snake movement vs. classic "jumpy" movement? → Make it a player setting
- Celebrate new high scores? → Yes
- Local leaderboard with player initials (like arcade games)? → Yes

Through approximately 20 questions, the AI and user defined a complete feature set without writing a single line of code.

---

## Phase 2: Creating the Product Requirements Document

### What is a PRD?

A Product Requirements Document (PRD) is like a detailed recipe for software. It lists everything the final product should do, organized by category. Having this written down prevents confusion later and ensures everyone agrees on what's being built.

### Compiling the Requirements

Once the Q&A session was complete, the AI compiled the answers into a structured PRD document. The user reviewed and approved it. The PRD covered:

- **Core Gameplay**: How the snake moves, what ends the game, how difficulty works
- **Food System**: Regular food, bonus food (worth extra points, disappears after a few seconds), and poisonous food (must avoid)
- **Scoring**: Current score, snake length, top 10 leaderboard with dates
- **User Interface**: Start menu, pause screen, game over screen, settings
- **Settings**: Wall collision toggle, difficulty level, theme selection, animation style, volume control
- **Visual Design**: Five different color themes (Classic, Neon, Retro, Dark, Light)
- **Audio**: Sound effects for eating, game over, achievements
- **Technical Requirements**: Works on modern browsers, saves data locally, targets 60 frames per second

This document became the "source of truth" for the project.

---

## Phase 3: Project Setup and Technical Decisions

### Establishing Conventions

The user ran the `/init` command, which instructed the AI to analyze the codebase and create a `CLAUDE.md` file. This special document tells future AI assistants how to work in this project — think of it as an instruction manual for the AI itself.

The user also configured OpenSpec (a specification workflow tool) for the project, which created additional documentation files that the AI would reference throughout development.

### Technology Choices

The user directed the AI to fill out the project configuration by asking clarifying questions. The AI asked, and the user decided:

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Programming Language | JavaScript (not TypeScript) | Simpler setup, no compilation step needed |
| Code Organization | Single file | Easier to manage for a small game |
| Programming Style | Class-based | More organized and scalable |
| Visual Themes | CSS variables + JavaScript objects | CSS for menus, JavaScript for game graphics |
| Testing | Node.js built-in test runner | No extra software needed |

For some questions, the AI offered recommendations with reasoning, and the user made the final call. For example, the AI recommended JavaScript over TypeScript for simplicity, and class-based programming for scalability — the user agreed with this reasoning.

**Why These Choices Matter:**

- **JavaScript** is the language that web browsers understand natively. TypeScript is a stricter version that catches more errors but requires an extra "compilation" step (translating code before it runs). For a simple game, plain JavaScript keeps things straightforward.

- **Class-based programming** organizes code into logical groups. For example, all the code related to the snake lives in a "Snake class," all the drawing code lives in a "Renderer class," and so on.

- **CSS variables** are like named colors that can be changed in one place and update everywhere. This makes theming much easier.

---

## Phase 4: Planning with OpenSpec

### What is OpenSpec?

OpenSpec is a workflow system for building software in organized stages. Instead of building everything at once, you:

> **Note for readers**: Prior to this conversation, the user installed OpenSpec and ran `openspec init` in the project directory to enable this workflow. For instructions on installing and initializing OpenSpec for your own project, visit the [OpenSpec documentation](https://openspec.dev).

With OpenSpec configured, the workflow follows these steps:

1. Write a **proposal** describing what you want to add
2. List the **tasks** needed to complete it
3. Define **requirements** (specific behaviors the software must have)
4. Get approval before starting
5. Implement the feature
6. **Archive** the proposal when done

This approach prevents scope creep (when projects grow beyond their original plan) and creates documentation automatically.

### Breaking the Project into Proposals

The user asked the AI to review the codebase and list out the OpenSpec proposals needed to build the app sustainably. The AI analyzed the PRD and proposed 10 separate proposals, each building on the previous:

| # | Proposal | Purpose | Tasks |
|---|----------|---------|-------|
| 1 | Core Game Loop | Foundation: canvas, timing, game states | 30 |
| 2 | Snake Mechanics | Snake movement, growth, self-collision | 21 |
| 3 | Input Handling | Keyboard and touch controls | 24 |
| 4 | Basic Food | Food spawning, eating, scoring | 27 |
| 5 | Wall Collision | Wall death vs. wrap-around modes | 23 |
| 6 | UI Screens | Menus, pause, game over screens | 36 |
| 7 | Leaderboard | Top 10 scores with initials | 32 |
| 8 | Theme System | Multiple color schemes | 30 |
| 9 | Difficulty System | Easy/Medium/Hard, speed progression | 39 |
| 10 | Audio System | Sound effects and volume control | 40 |

After proposal #4, the game would be playable. Proposals 5-10 add polish and features.

### Adding Accessibility

During testing, the user noticed that grid lines were hard to see. This prompted the user to request an OpenSpec proposal ensuring the app would be ADA compliant (Americans with Disabilities Act) and avoid other visibility issues.

Following the user's direction, the AI created an additional proposal covering:

- **Color contrast**: Ensuring text and game elements are easy to see
- **Keyboard navigation**: Playing without a mouse
- **Screen reader support**: Announcing game events for blind users
- **Reduced motion**: Respecting system settings for users sensitive to animation
- **Touch targets**: Making buttons large enough to tap easily on mobile

The AI recommended inserting this before the theme system (so all themes would meet accessibility standards), and the user agreed with this placement.

---

## Phase 5: Implementation

### Creating a Branch

In software development, a **branch** is like a parallel universe for your code. You can make changes without affecting the main version. If something goes wrong, you simply delete the branch. If it works, you **merge** it back.

The user indicated readiness to implement the first proposal and asked the AI to create a branch. The AI created `feature/add-core-game-loop` and the user approved starting implementation.

### Files Created

Following the tasks defined in the proposal, the AI wrote four files:

**1. index.html** — The webpage structure
```
A simple HTML file with:
- A canvas element (the drawing surface for the game)
- An overlay container (for menus and popups)
- Links to the CSS and JavaScript files
```

**2. styles.css** — Visual styling
```
Defines:
- Color variables for theming
- Centered, responsive layout
- Button styles
- Overlay animations
```

**3. game.js** — The game logic
```
Contains:
- Constants (grid size, cell size, timing)
- Renderer class (draws things on screen)
- Game class (manages everything)
- Initialization code (starts the game when page loads)
```

**4. game.test.js** — Automated tests
```
19 tests verifying:
- Constants are defined correctly
- Renderer draws properly
- Game state machine works
- Game loop starts and stops correctly
```

### The Game Loop Concept

A game loop is the heartbeat of any video game. It runs continuously, doing two things:

1. **Update** ("tick"): Calculate what should happen next (move the snake, check collisions)
2. **Render**: Draw the current state on screen

The AI implemented a "fixed timestep" approach:
- The game **updates** 10 times per second (consistent game speed)
- The game **renders** 60 times per second (smooth visuals)

This separation ensures the snake moves at the same speed regardless of how fast the player's computer is.

### The State Machine

A state machine is a way to organize what the game is doing at any moment. The Snake game has four states:

```
MENU → PLAYING → PAUSED → GAMEOVER
  ↑                         |
  └─────────────────────────┘
```

The game can only be in one state at a time. Certain actions are only allowed in certain states (you can only pause while playing, you can only restart from game over, etc.).

---

## Phase 6: Testing

### Automated Tests

The AI wrote 19 automated tests using Node.js (a tool that runs JavaScript outside a browser). These tests verify that the code works correctly without needing to open the game manually.

Running `node --test game.test.js` executes all tests in about 0.1 seconds and reports any failures.

**What the tests check:**
- Grid dimensions are correct (20×20)
- The renderer can clear the canvas and draw cells
- State transitions work (MENU → PLAYING, PLAYING → PAUSED, etc.)
- Invalid states are rejected
- The game loop can start and stop

### Manual Testing

The user tested the game in a browser by:

1. Starting a local web server (`npx serve .`)
2. Opening the game in Chrome, Firefox, and Safari
3. Checking that the canvas displayed correctly
4. Testing responsive behavior by resizing the browser window
5. Testing on mobile viewport using browser developer tools

### Bug Found and Fixed

During manual testing, the user reported that grid lines were "very faint" — hard to see in both light and dark browser modes.

The AI diagnosed the problem:
- Grid color was `#111111` (very dark gray)
- Background was `#000000` (pure black)
- The contrast was too low

The fix:
- Changed grid color to `#1a3a1a` (dark green tint)
- Increased line thickness from 0.5 to 1 pixel

This small issue led to creating the comprehensive accessibility proposal mentioned earlier.

---

## Phase 7: Version Control and Collaboration

### What is Git?

Git is a system that tracks changes to files over time. Think of it as "track changes" in a word processor, but for entire projects. Every change is recorded with a message explaining what was done and why.

### What is GitHub?

GitHub is a website that hosts Git projects and adds collaboration features. It's where the project's code lives online, and it provides tools for reviewing changes before they're accepted.

### The Pull Request Process

A **pull request** (PR) is a formal proposal to merge changes from a branch into the main codebase. It includes:

- A description of what changed
- Why the changes were made
- How to test them
- A checklist of verification steps

The user requested a PR with "extensive commentary." The AI created PR #1 with detailed documentation:
- Architecture diagrams (ASCII art showing the game loop and state machine)
- Tables explaining constants and CSS variables
- Test coverage summary
- Instructions for testing locally
- A list of all commits (individual changes)

### Tracking Progress with GitHub Issues

After establishing the OpenSpec proposals, the user wanted to track progress using GitHub's project management features. The AI set up:

**GitHub Project Board**: A kanban-style board at `github.com/users/N3SSQwiK/projects/4` showing all work items in columns (Todo, In Progress, Done).

**Issues Mapped 1:1 with Proposals**: Rather than creating arbitrary issues, each GitHub issue corresponds directly to one OpenSpec proposal. This maintains a single source of truth — the proposal defines *what* to build, while the issue tracks *progress*.

| Issue | OpenSpec Proposal | Tasks |
|-------|-------------------|-------|
| #21 | add-snake-mechanics | 21 |
| #22 | add-input-handling | 24 |
| #23 | add-basic-food | 27 |
| #24 | add-wall-collision | 23 |
| #25 | add-ui-screens | 36 |
| #26 | add-leaderboard | 32 |
| #27 | add-theme-system | 30 |
| #28 | add-difficulty-system | 39 |
| #29 | add-audio-system | 40 |
| #30 | add-accessibility | 48 |

Each issue body links to the proposal files and documents dependencies (e.g., "#22 depends on #21"). This makes the implementation order clear and prevents starting work before prerequisites are complete.

**The Workflow**:
1. **Creating**: After writing an OpenSpec proposal, create a matching GitHub issue
2. **Implementing**: Reference the issue in commits and PRs; move card on project board
3. **Archiving**: After `openspec archive`, close the GitHub issue

This approach prevents the common problem of issues drifting out of sync with specifications. If you need to change scope, update the proposal first, then update the issue to match.

### Semantic Versioning

When the PR was merged, the user asked for a version tag. **Semantic versioning** uses three numbers: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes (things stop working the old way)
- **MINOR**: New features (things are added)
- **PATCH**: Bug fixes (things are corrected)

The first release was tagged `v0.1.0`:
- `0` — Not yet at version 1.0 (still in early development)
- `1` — First minor release (core game loop complete)
- `0` — No patches yet

---

## Tools and Technologies Used

| Tool | Purpose | Why It Was Chosen |
|------|---------|-------------------|
| **Claude (AI)** | Executing tasks, writing code, generating documentation | Tool for implementation under user direction |
| **JavaScript** | Programming language | Runs natively in browsers, no compilation needed |
| **HTML5 Canvas** | Drawing graphics | Standard way to create 2D graphics in browsers |
| **CSS** | Styling and theming | Standard way to style web pages |
| **Git** | Version control | Industry standard for tracking code changes |
| **GitHub** | Code hosting and collaboration | Free, widely used, good PR workflow |
| **GitHub Issues/Projects** | Progress tracking | 1:1 mapping with OpenSpec proposals |
| **Node.js** | Running tests | Executes JavaScript outside the browser |
| **OpenSpec** | Specification workflow | Organized approach to planning and documentation |
| **VS Code / Terminal** | Development environment | Where the user interacted with files and ran commands |

---

## Summary: AI as a Tool Under Human Direction

Throughout this project, the user directed the workflow while the AI executed tasks. Here's how responsibilities were divided:

### What the User Did (Direction & Decisions)
- Initiated the project and defined the overall vision
- Specified the approach for requirements gathering (Yes/No questions)
- Made all technology choices (JavaScript, single file, class-based, etc.)
- Configured tooling (OpenSpec, Git repository)
- Requested specific proposals and documentation
- Approved or modified AI recommendations
- Performed manual testing and identified issues
- Decided when to commit, merge, and tag versions

### What the AI Did (Execution & Expertise)
- Asked questions based on the user's specified approach
- Compiled answers into structured documents (PRD, proposals)
- Offered recommendations with reasoning (user made final calls)
- Wrote all code following established patterns
- Created and ran automated tests
- Fixed bugs when the user reported them
- Generated documentation and PR descriptions
- Executed Git commands as directed
- Explained technical concepts when asked

---

## What Comes Next

The project now has:
- ✅ A solid foundation (game loop, rendering, state machine)
- ✅ Comprehensive documentation
- ✅ 10 planned proposals for remaining features
- ✅ An accessibility proposal ensuring inclusivity
- ✅ Automated tests for confidence in changes

The next steps would be:
1. Implement `add-snake-mechanics` (the snake itself)
2. Implement `add-input-handling` (keyboard/touch controls)
3. Implement `add-basic-food` (complete the playable MVP)
4. Continue through the remaining proposals

Each proposal follows the same workflow: create branch → implement → test → create PR → merge → tag version.

---

## Key Takeaways

1. **The human drives the process** — the user set the approach, made decisions, and directed each phase
2. **AI executes and offers expertise** — the AI carried out tasks and provided recommendations, but didn't make decisions autonomously
3. **Planning before coding** saved time and prevented confusion
4. **Breaking work into small pieces** made progress measurable and manageable
5. **Documentation isn't extra work** — it's part of the work, and AI can generate it efficiently when directed
6. **Testing catches problems early** — the grid visibility issue was found before users ever saw it
7. **Accessibility matters from the start** — the user recognized this early and requested it be addressed

This workflow demonstrates that building software with AI is not about the AI working autonomously. The human remains in control — providing direction, making decisions, and validating quality — while the AI contributes by executing tasks, offering technical expertise, and handling implementation details.

---

## Recommendations for Improving This Workflow

Based on patterns observed during this project, here are suggestions for readers who want to adopt a similar AI-assisted development approach. These are organized by experience level.

### For Beginners

**Start with clear, specific prompts**

The more specific your request, the better the AI can help. Instead of "help me build a game," try "help me build a product requirements document by asking me Yes/No questions about the game's features." This gives the AI a concrete approach to follow.

**Ask the AI to explain its work**

Don't just accept code — ask the AI to explain what it wrote and why. This builds your understanding and helps you catch mistakes. For example: "Explain how the game loop works in the code you just wrote."

**Test frequently and report what you observe**

You don't need to know *why* something is wrong to report it. Simply describing what you see ("the grid lines are very faint") gives the AI enough information to diagnose and fix issues.

**Use version control from the start**

Even if you're new to Git, ask the AI to help you commit changes regularly. This creates save points you can return to if something breaks. Think of it as "undo" for your entire project.

**Don't skip the planning phase**

It's tempting to jump straight to code, but defining requirements first (like the PRD in this project) prevents confusion later. The AI can help you think through features you might not have considered.

### For Intermediate Users

**Establish project conventions early**

Creating a `CLAUDE.md` or similar instruction file pays dividends throughout the project. It ensures consistency even if you start new conversations or use different AI sessions.

**Break work into small, testable pieces**

The OpenSpec approach of separate proposals with defined tasks prevents scope creep and makes progress visible. Each piece should be small enough to complete, test, and commit in a single session.

**Write tests alongside implementation**

Asking the AI to write tests for each feature creates a safety net for future changes. Tests also serve as documentation — they show exactly how the code is expected to behave.

**Review AI-generated code critically**

The AI can write code quickly, but it may not always choose the optimal approach. Review the structure, ask about alternatives, and don't hesitate to request changes. You understand your project's context better than the AI does.

**Use branches for each feature**

Keeping work isolated in branches lets you experiment safely. If a feature doesn't work out, you can abandon the branch without affecting your main codebase.

**Ask for recommendations, then decide**

For technical decisions (like JavaScript vs. TypeScript), ask the AI to explain the trade-offs. Make the final decision yourself based on your project's needs, timeline, and your own comfort level.

### For Advanced Users

**Customize the AI's context window**

Files like `CLAUDE.md`, `project.md`, and OpenSpec's `AGENTS.md` shape how the AI understands your project. Invest time in making these comprehensive — include architecture decisions, coding standards, and common patterns.

**Design your own specification workflow**

OpenSpec is one approach, but you might adapt it or create your own. The key principles are: define before building, break into small pieces, and document as you go. The specific format matters less than consistency.

**Use AI for code review and refactoring**

Beyond writing new code, AI can review existing code for issues, suggest refactoring opportunities, and help enforce coding standards. Consider creating specific prompts or agents for these tasks.

**Integrate accessibility and quality from the start**

As seen in this project, adding accessibility requirements early (before theming, before extensive UI work) prevents costly retrofitting. The same applies to security, performance, and other cross-cutting concerns.

**Automate repetitive AI interactions**

If you find yourself giving the same instructions repeatedly, encode them in configuration files or create custom commands. This reduces friction and ensures consistency.

**Maintain clear boundaries**

Decide in advance what the AI should and shouldn't do autonomously. Some teams prefer AI to only suggest changes for human review; others allow direct commits for low-risk changes. Document your policy and enforce it through your workflow.

**Consider AI limitations in your architecture**

AI works best with well-documented, modular code. If your architecture makes it easy for humans to understand, it will be easier for AI to work with too. This alignment benefits both human and AI contributors.

---

## Final Thoughts

AI-assisted development is not about replacing human judgment — it's about augmenting human capabilities. The user in this project remained the decision-maker throughout: choosing the approach, approving recommendations, testing results, and directing next steps. The AI served as a capable tool that could execute quickly, offer expertise, and handle implementation details.

This partnership model scales well. Whether you're a beginner building your first project or an experienced developer streamlining your workflow, the core dynamic remains the same: you direct, the AI executes, and together you build something neither could create as efficiently alone.
