## Context

The game currently runs a single play mode (Classic) with difficulty-based rule variations (easy/medium/hard). The `Game.tick()` method contains hardcoded logic for wall collision, self-collision, food spawning, and game-over conditions. Leaderboards are scoped by difficulty but not by mode. The start menu has a simple Play button with no mode selection.

Four modes are proposed: Classic (current behavior), Time Attack (timed scoring), Maze (static obstacles), and Zen (no death). Each mode applies a different rule set to the existing engine without changing core snake mechanics (movement, direction queue, rendering).

## Goals / Non-Goals

**Goals:**
- Add mode selection UI to the start menu, persisted to localStorage
- Implement four modes with distinct rule sets that compose with existing difficulty levels
- Scope leaderboards by mode+difficulty (Classic, Time Attack, Maze have scores; Zen does not)
- Add Time Attack HUD (countdown timer) and Maze rendering (obstacle blocks)
- Keep the `tick()` method clean by extracting mode-specific logic into composable rule functions

**Non-Goals:**
- Custom/user-created modes or mode editor
- Online mode synchronization or sharing
- Mode-specific achievements (deferred to add-achievements change)
- Mode-specific audio (reuse existing sounds)
- Maze level editor or pre-designed levels (procedural generation only)

## Decisions

### 1. Mode as a top-level Game property alongside difficulty

**Decision:** Add `this.mode` to Game, stored in localStorage. Mode and difficulty are orthogonal — every mode works with every difficulty level.

**Rationale:** Difficulty already controls speed, food types, and wall collision. Mode controls the win/loss condition and special mechanics. Keeping them independent avoids a combinatorial explosion of config objects. Classic mode at Hard difficulty behaves exactly like today.

**Alternative considered:** Merge mode into difficulty config (e.g., difficulty objects contain mode-specific overrides). Rejected because it couples unrelated concerns and makes adding new modes harder.

### 2. Mode rule functions instead of branching in tick()

**Decision:** Define a `MODE_RULES` constant object, keyed by mode ID, containing override functions:
- `onCollision(game, type)` — handles wall/self collision (death, time penalty, or ignore)
- `onTick(game)` — per-tick logic (decrement timer, check win condition)
- `shouldSpawnObstacles` — boolean flag for maze generation
- `hasLeaderboard` — boolean, false for Zen
- `hudExtras` — array of extra HUD field IDs to show (e.g., `['timer']`)

`Game.tick()` calls `MODE_RULES[this.mode].onCollision(this, 'wall')` instead of `this.handleGameOver()` directly. This keeps tick() readable and makes each mode's behavior explicit.

**Rationale:** The current tick() is ~80 lines and already branching on difficulty config. Adding 4-way mode branches would make it unreadable. Rule functions are testable in isolation.

**Alternative considered:** Subclass Game per mode. Rejected — single-file architecture means no module system, and class inheritance adds complexity for what amounts to a few behavior swaps.

### 3. Mode selector as a segmented control on the start menu

**Decision:** Add a segmented selector (like the existing difficulty and mobile input selectors) between the title and the Play button. Four options: Classic, Time Attack, Maze, Zen. Persisted to localStorage via StorageManager.

**Rationale:** Consistent with existing UI patterns. The segmented selector is already used for difficulty in settings and mobile input method in settings. Placing it on the start menu (not in settings) makes mode selection a first-class choice before every game.

**Alternative considered:** Mode selector in settings. Rejected — mode is a per-session choice, not a preference. Players should see it before every game.

### 4. Time Attack: 60-second countdown, self-collision penalty instead of death

**Decision:** Timer starts at 60 seconds, decrements each tick (converted from tick rate). Self-collision deducts 5 seconds instead of ending the game. Wall collision still depends on difficulty (wraps on Easy, kills on Medium/Hard). Game ends when timer hits 0. Score is final score at time-out.

**Rationale:** Making self-collision a penalty instead of death changes the gameplay dynamic — players can take risks. The 5-second penalty is significant (~8% of total time) but not devastating.

**Alternative considered:** Score multiplier that decays over time. Rejected — adds complexity with minimal gameplay benefit.

### 5. Maze: procedural obstacle generation using seeded random

**Decision:** At game start, generate a set of obstacle cells using a simple algorithm:
1. Place 15-25 obstacle blocks (scaled by difficulty: easy=15, medium=20, hard=25)
2. Use flood-fill from snake start position to verify all food-reachable cells are connected
3. If not connected, regenerate (max 10 attempts, then fall back to fewer obstacles)
4. Obstacles are drawn as solid blocks using the theme's wall/border color
5. Collision with obstacles = death (same as wall collision)

**Rationale:** Procedural generation means every game is different. Flood-fill ensures solvability. The obstacle count scales with difficulty to match the harder rule sets.

**Alternative considered:** Pre-designed levels stored as arrays. Rejected — adds maintenance burden, limited variety, and doesn't match the "procedural" philosophy of the rest of the game.

### 6. Zen mode: no death, no score, no leaderboard

**Decision:** All collisions are ignored (snake wraps at walls regardless of difficulty, passes through itself). No score tracking. Food appears for visual feedback but doesn't accumulate points. Leaderboard is disabled. HUD shows length only.

**Rationale:** Pure relaxation mode for players who want the snake-movement zen without pressure. Keeping food gives the snake something to do.

**Alternative considered:** Show score but don't save to leaderboard. Rejected — showing score contradicts the "no pressure" goal.

### 7. Leaderboard scoping: mode+difficulty composite key

**Decision:** `StorageManager.addScore()` gains a `mode` parameter. Leaderboard entries store `{ initials, score, difficulty, mode, assisted, timestamp }`. `getLeaderboard(difficulty, assisted, mode)` filters by all three. The leaderboard modal gets a mode filter tab row above the existing difficulty filter.

**Rationale:** Players expect to compare scores within the same mode. A Classic high score and a Time Attack high score aren't comparable. Storing mode on each entry means backward compatibility — existing entries with no mode are treated as Classic.

**Alternative considered:** Separate localStorage keys per mode. Rejected — harder to manage, can't share the 50-entry cap logic.

## Risks / Trade-offs

**[Maze generation performance]** → Flood-fill on a 25x25 grid is 625 cells max, runs once at game start. Negligible. If regeneration loops more than 10 times, fall back to fewer obstacles.

**[Leaderboard migration]** → Existing entries lack a `mode` field. Treat null/undefined mode as `'classic'` in `getLeaderboard()`. No data migration needed.

**[UI complexity on start menu]** → Adding a mode selector increases menu height. Mitigate by using a compact segmented control (same height as difficulty selector, ~36px). On mobile, the four labels may be tight — abbreviate to icons or short labels if needed (test during implementation).

**[Zen mode feels empty]** → Without score or death, players may lose interest quickly. Mitigate by keeping food spawning, growth, and visual feedback. Consider adding a length counter as the only metric.

**[Mode + difficulty permutations]** → 4 modes x 3 difficulties = 12 combinations. All must be tested. Time Attack + Hard (wall collision kills but self-collision is only a penalty) creates an interesting asymmetry that should be documented in specs.

## Open Questions

None — all major decisions are captured above. Mode-specific achievements are explicitly deferred to the add-achievements change.
