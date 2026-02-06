# Design: Add Difficulty System

## Context

The snake game needed progressive challenge to maintain engagement across skill levels. The existing codebase had:
- Fixed tick rate (no speed progression)
- Single food type (regular only)
- Standalone wall collision toggle (confusing UX)
- Global leaderboard (unfair cross-difficulty comparisons)

The game architecture uses class-based separation (Game, Snake, Food, Renderer, etc.) with a single-file vanilla JS approach.

## Goals / Non-Goals

**Goals:**
- Three distinct difficulty presets with meaningful gameplay differences
- Progressive speed that rewards skilled play
- Strategic depth through varied food types with risk/reward tradeoffs
- Fair score comparison via difficulty-scoped leaderboards
- Accessible food type differentiation (shape + animation, not just color)

**Non-Goals:**
- Custom difficulty configuration (presets only)
- Difficulty achievements or unlocks
- Difficulty-specific visual themes
- Online leaderboards (local storage only)

## Decisions

### 1. Difficulty as Configuration Object
**Decision:** Define `DIFFICULTY_LEVELS` constant with all parameters per level (baseTickRate, maxTickRate, speedScoreStep, food chances, wallCollision).

**Rationale:** Centralizes all difficulty-related values in one place. Makes adding/modifying difficulties trivial. Avoids scattered conditionals throughout codebase.

**Alternatives considered:**
- Separate config files per difficulty (rejected: over-engineering for 3 levels)
- Inheritance-based difficulty classes (rejected: no behavior variation, just data)

### 2. Special Food as Separate Slot
**Decision:** Add `specialFood` property on Game, separate from `food` (regular). Only one special food active at a time.

**Rationale:** Simplifies collision detection (check both slots). Prevents screen clutter. Makes spawn logic cleaner (periodic check, spawn if slot empty).

**Alternatives considered:**
- Food array with mixed types (rejected: complicates "regular food always present" invariant)
- Multiple special food simultaneously (rejected: too chaotic, dilutes strategic choice)

### 3. Toxic vs Lethal Split
**Decision:** Split original "poison food" into Toxic (point/segment penalty) and Lethal (instant death).

**Rationale:** Creates meaningful risk gradient. Toxic is recoverable mistake, Lethal is fatal. More interesting decisions than binary "avoid all bad food".

**Alternatives considered:**
- Single poison type with random severity (rejected: unpredictable, feels unfair)
- Poison with antidote mechanic (rejected: scope creep)

### 4. Proximity-Based Hazard Spawning
**Decision:** Toxic and lethal food spawn within Manhattan distance of nearest good food (Medium: 4-6 cells, Hard: 1-2 cells). Bonus remains random.

**Rationale:** Creates tension—hazards appear near rewards. Harder difficulties place hazards closer, requiring more precision. Random placement felt disconnected from gameplay.

**Alternatives considered:**
- Pure random placement (rejected: hazards often irrelevant, easily avoided)
- Path-based spawning (rejected: too predictable, requires pathfinding complexity)

### 5. Toxic Segment Removal
**Decision:** Toxic food removes snake segments in addition to points. Scales with difficulty and length: Medium = max(1, floor(length/10)), Hard = max(2, floor(length/5)). Game over at length ≤ 1.

**Rationale:** Points alone weren't punishing enough—long snakes could absorb many toxic hits. Segment removal creates real consequence that scales with success.

**Alternatives considered:**
- Fixed segment removal (rejected: trivial for long snakes, devastating for short)
- Speed reduction penalty (rejected: confusing, hard to communicate)

### 6. Wall Collision Integrated into Difficulty
**Decision:** Remove standalone wall collision toggle. Easy wraps walls, Medium/Hard kills on contact.

**Rationale:** Wall wrapping is a major difficulty factor. Keeping it separate created confusion ("Easy + walls kill" is harder than "Medium + walls wrap"). Integration makes difficulty presets self-contained and meaningful.

**Alternatives considered:**
- Keep toggle as difficulty modifier (rejected: confusing combinations)
- Three wall modes (wrap, kill, bounce) (rejected: bounce adds complexity without value)

### 7. HUD Migrated to HTML
**Decision:** Move score/length/difficulty from canvas rendering to HTML element above canvas.

**Rationale:** HTML elements respect CSS theme variables automatically. Better accessibility (screen readers). Cleaner separation of game rendering vs UI chrome.

**Alternatives considered:**
- Keep on canvas with theme color lookup (rejected: more complex, accessibility gap)
- Overlay HTML on canvas (rejected: z-index complexity, click-through issues)

### 8. Context-Aware Leaderboard Views
**Decision:** Pause screen shows filtered (current difficulty only), menu/game over shows all scores with difficulty column.

**Rationale:** Mid-game, players care about their current difficulty ranking. From menu, players want to see overall progress. Legacy entries (pre-difficulty) shown with "—" to preserve history.

**Alternatives considered:**
- Always filtered view (rejected: hides cross-difficulty comparison)
- Separate leaderboard per difficulty page (rejected: requires new navigation)

### 9. Grid Size Increase (20×20 → 25×25)
**Decision:** Expand canvas from 400×400 to 500×500 pixels (25×25 grid at 20px cells).

**Rationale:** Proximity-based spawning needs room to work. Larger grid allows hazards to spawn "near but not on top of" good food. Also improves mobile touch targets.

**Alternatives considered:**
- Smaller cells (rejected: visibility issues, especially food icons)
- Dynamic grid based on difficulty (rejected: inconsistent gameplay feel)

## Risks / Trade-offs

**[Risk] Toxic segment removal feels unfair** → Mitigation: Dynamic HUD shows current penalty before eating. Players can see consequences.

**[Risk] Proximity spawning creates impossible situations** → Mitigation: Fallback to random spawn if no valid proximity position found within attempts limit.

**[Risk] Legacy leaderboard entries lose context** → Mitigation: Show "—" for difficulty, include in all views. Don't delete historical data.

**[Trade-off] Difficulty locked mid-game** → Prevents cheese but may frustrate players who realize they chose wrong. Acceptable: game rounds are short.

**[Trade-off] Only 3 difficulty levels** → Limits customization but simplifies UI and leaderboard. Can add more levels later if needed.
