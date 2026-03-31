## Context

The game currently has one progression mechanic: high scores per mode+difficulty. Theme unlocks exist but are tied only to score thresholds. Players who don't chase leaderboard rankings have no secondary goals. An achievement system adds varied objectives (survival, exploration, difficulty mastery) that reward different play styles and increase retention.

## Goals / Non-Goals

**Goals:**
- Define 12 achievements covering score, food, survival, difficulty, and mode milestones
- Track per-session stats (foods eaten, ticks survived, toxic foods eaten) and cross-session progress (modes played, difficulties with leaderboard entries)
- Evaluate conditions at food-eaten and game-over events; unlock once, persist in localStorage
- Show non-blocking toast notifications during gameplay with queuing
- Provide a gallery screen accessible from the main menu with locked/unlocked states
- Play a distinct audio cue on unlock
- Add menu button with live progress counter

**Non-Goals:**
- Achievement tiers or rarity levels (all achievements are equal)
- Cloud sync or online achievement sharing
- Achievement-gated gameplay features (achievements are cosmetic/informational only)
- Animated achievement card transitions in the gallery

## Decisions

**AchievementManager class**: New class instantiated after StorageManager in the Game constructor. Holds the static catalog, per-session stats, and cross-session progress. Exposes `resetSession()`, `onFoodEaten(foodType)`, `checkAchievements(gameStats)`, `getAll()`, `getUnlocked()`, `getProgress()`.

**Achievement catalog as a constant**: `ACHIEVEMENTS` array defined at the top of game.js alongside other constants. Each entry: `{ id, name, description, icon, condition(stats, progress, unlocked) }`. The condition function receives session stats, cumulative progress, and the set of already-unlocked IDs — returns boolean.

**Session stats tracked in Game.tick()**: Increment counters in the Game class during food collision handling. Pass stats object to AchievementManager at game over. Stats: `{ score, foodsEaten, ticksSurvived, maxTickRate, toxicFoodsEaten, difficulty, mode, madeLeaderboard, assisted }`.

**Cross-session progress in StorageManager**: Two new keys: `achievements` (object mapping achievement ID → unlock timestamp) and `achievementProgress` (object with `{ gamesPlayed, modesPlayed: [], difficultiesWithLeaderboard: [] }`). Uses existing `get()`/`set()` pattern with corruption fallback.

**Toast notification system**: New `_showAchievementToast(achievement)` method on UIManager. Creates a temporary DOM element positioned at top-center of the game container. Uses CSS animation for slide-in and fade-out. 3s visible + 0.5s fade. Queue implemented as an array; after each toast finishes, shift and show next. Container has `role="status"` and `aria-live="polite"`.

**Gallery screen**: New `.screen-achievements` section in index.html, shown via `data-ui="achievements"`. Scrollable list of achievement items. Unlocked items show icon + name + description + date. Locked items show lock icon + name + description in dimmed style. Header shows "Achievements (X/Y)".

**Menu button placement**: New button between "High Scores" and "Settings" in `.ui-btn-group`. Label: "Achievements (X/Y)" updated on menu display.

**Audio**: New `playAchievementUnlock()` method on AudioManager. Uses a 3-note ascending sequence [784, 988, 1175] (G5-B5-D6 major triad) at 0.08s per note — shorter and higher than theme unlock to feel distinct.

## Risks / Trade-offs

**Single-file growth**: Adding AchievementManager, catalog, toast system, and gallery increases game.js size. Acceptable given the project's single-file architecture constraint.

**12 achievements may feel sparse**: Starting with 12 is intentional — each is achievable and distinct. More can be added later without schema changes since the catalog is a flat array.

**Toast during intense gameplay**: A toast appearing during a fast-paced game could be slightly distracting. Mitigated by positioning above the canvas (not overlapping play area) and keeping it non-interactive.
