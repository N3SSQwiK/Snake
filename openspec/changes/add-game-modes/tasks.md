## 1. Constants and Mode Infrastructure

- [ ] 1.1 Add `GameMode` constant object (`{ CLASSIC: 'classic', TIME_ATTACK: 'timeAttack', MAZE: 'maze', ZEN: 'zen' }`) near `GameState` at line ~12
- [ ] 1.2 Add `MODE_RULES` constant object with per-mode config: `onWallCollision(game)`, `onSelfCollision(game)`, `hasLeaderboard`, `hasScore`, `hasSpecialFood`, `shouldSpawnObstacles`, `hudExtras` array
- [ ] 1.3 Add Time Attack constants: `TIME_ATTACK_DURATION = 600` (60s at 10Hz tick rate), `TIME_ATTACK_SELF_COLLISION_PENALTY = 50` (5s in ticks)
- [ ] 1.4 Add Maze constants: `MAZE_OBSTACLE_COUNTS = { easy: 15, medium: 20, hard: 25 }`, `MAZE_MAX_REGEN_ATTEMPTS = 10`
- [ ] 1.5 Write tests for MODE_RULES structure: verify all four modes exist, each has required keys, Classic mode flags match current behavior

## 2. Game Class Mode Support

- [ ] 2.1 Add `this.mode` property to `Game` constructor (~line 2960), loaded from `StorageManager` with default `'classic'`
- [ ] 2.2 Add `setMode(mode)` method to Game that saves to StorageManager
- [ ] 2.3 Refactor `tick()` wall collision block (~line 3318-3322) to call `MODE_RULES[this.mode].onWallCollision(this)` instead of direct `handleGameOver()`
- [ ] 2.4 Refactor `tick()` self-collision block (~line 3324-3328) to call `MODE_RULES[this.mode].onSelfCollision(this)` instead of direct `handleGameOver()`
- [ ] 2.5 Gate special food spawning in `tick()` (~line 3396) on `MODE_RULES[this.mode].hasSpecialFood`
- [ ] 2.6 Gate score accumulation in `tick()` food collision handlers on `MODE_RULES[this.mode].hasScore`
- [ ] 2.7 Write tests: Classic mode tick behaves identically to current behavior (wall death, self-collision death, food scoring)

## 3. Time Attack Mode

- [ ] 3.1 Add `this.timeAttackTimer` property to Game, initialized to `TIME_ATTACK_DURATION` when mode is `timeAttack` in `startGame()` or reset method
- [ ] 3.2 Add `MODE_RULES.timeAttack.onTick(game)` that decrements timer each tick and calls `handleGameOver()` when timer reaches 0
- [ ] 3.3 Call `onTick` from `Game.tick()` after movement/collision processing
- [ ] 3.4 Implement `MODE_RULES.timeAttack.onSelfCollision(game)` — deduct `TIME_ATTACK_SELF_COLLISION_PENALTY` from timer, clamp to 0, trigger game over if 0
- [ ] 3.5 Add timer display to HUD: add `<span id="hud-timer">` element to index.html, update in `Game.updateHUD()` when mode is timeAttack (format as `MM:SS`)
- [ ] 3.6 Ensure timer pauses when `state !== PLAYING` (timer only decrements inside tick, which already gates on PLAYING)
- [ ] 3.7 Write tests: timer decrements per tick, self-collision deducts 5s, timer expiry triggers game over, timer doesn't decrement when paused

## 4. Maze Mode

- [ ] 4.1 Add `generateObstacles(difficulty, snakeStart, gridWidth, gridHeight)` utility function that returns array of `{x, y}` obstacle positions
- [ ] 4.2 Implement flood-fill reachability check: from snake start, verify all non-obstacle cells are reachable
- [ ] 4.3 Add regeneration loop: if flood-fill fails, reduce obstacle count by 1 and retry (up to `MAZE_MAX_REGEN_ATTEMPTS`)
- [ ] 4.4 Add `this.obstacles` array to Game, populated at game start when mode is `maze`
- [ ] 4.5 Add obstacle collision check in `tick()` after movement: if head matches any obstacle position, call `handleGameOver()`
- [ ] 4.6 Pass obstacles to `Food.spawn()` as additional excluded positions so food never spawns on obstacles
- [ ] 4.7 Add `Renderer.drawObstacles(obstacles, theme)` method that draws solid blocks at each obstacle position
- [ ] 4.8 Call `drawObstacles()` from `Game.render()` when obstacles array is non-empty
- [ ] 4.9 Write tests: obstacle generation respects count per difficulty, no obstacles on snake start or adjacent cells, flood-fill rejects unreachable layouts, obstacle collision triggers game over, food avoids obstacles

## 5. Zen Mode

- [ ] 5.1 Implement `MODE_RULES.zen.onWallCollision(game)` — apply `wrapPosition()` instead of game over (regardless of difficulty)
- [ ] 5.2 Implement `MODE_RULES.zen.onSelfCollision(game)` — no-op
- [ ] 5.3 Gate HUD updates in `updateHUD()`: hide score, difficulty, and toxic info when `!MODE_RULES[this.mode].hasScore`; show length only
- [ ] 5.4 Gate initials prompt in `handleGameOver()` (~line 3078) on `MODE_RULES[this.mode].hasLeaderboard`
- [ ] 5.5 For Zen mode, skip `handleGameOver()` entirely — player exits via Escape/quit to menu (no game over screen)
- [ ] 5.6 Write tests: Zen mode ignores self-collision, wraps walls regardless of difficulty, no score accumulation, no game over on collision

## 6. Leaderboard Mode Scoping

- [ ] 6.1 Add `mode` parameter to `StorageManager.addScore(initials, score, difficulty, assisted, mode)` (~line 489)
- [ ] 6.2 Add `mode` parameter to `StorageManager.getLeaderboard(difficulty, assisted, mode)` (~line 481) — filter entries by mode, treat null/undefined as `'classic'`
- [ ] 6.3 Add `mode` parameter to `StorageManager.isHighScore()` and `isNewTopScore()` (~lines 510, 515)
- [ ] 6.4 Update `Game.handleGameOver()` to pass `this.mode` to all StorageManager score methods
- [ ] 6.5 Update leaderboard display in UIManager to pass current mode filter
- [ ] 6.6 Write tests: scores saved with mode field, getLeaderboard filters by mode, existing entries with no mode treated as classic, isHighScore respects mode

## 7. UI: Mode Selector on Start Menu

- [ ] 7.1 Add mode selector HTML to index.html start menu panel (segmented control with 4 options, between title and Play button)
- [ ] 7.2 Add CSS for mode selector in styles.css (reuse existing segmented-selector pattern from settings)
- [ ] 7.3 Wire mode selector in DOM setup (~line 3580+): read saved mode, set aria-checked, handle click to update `game.setMode()`
- [ ] 7.4 Add gamepad/keyboard navigation for mode selector (left/right D-pad or arrow keys to cycle options)
- [ ] 7.5 Write tests: mode selector updates game.mode, persists selection

## 8. UI: Leaderboard Mode Filter

- [ ] 8.1 Add mode filter tab row to leaderboard modal HTML (Classic, Time Attack, Maze tabs)
- [ ] 8.2 Add CSS for leaderboard mode tabs
- [ ] 8.3 Wire tab clicks to filter leaderboard display by mode
- [ ] 8.4 Default active tab to current game mode (or Classic if Zen)
- [ ] 8.5 Write tests: tab selection filters displayed scores by mode

## 9. UI: Mode-Specific Game Over

- [ ] 9.1 Update `UIManager.updateScore()` or game over screen logic to show mode-appropriate heading ("Game Over", "Time's Up!")
- [ ] 9.2 Show remaining time on Time Attack game over when death occurs before timer expires
- [ ] 9.3 Hide score display on game over screen for Zen mode (should not reach game over, but guard anyway)
- [ ] 9.4 Write tests: correct heading per mode, Time Attack shows remaining time on early death

## 10. Integration and Polish

- [ ] 10.1 Ensure `startGame()` / reset logic clears mode-specific state (timer, obstacles) on new game
- [ ] 10.2 Ensure Zen mode quit (Escape from PLAYING) returns to menu without game over screen
- [ ] 10.3 Test all 12 mode+difficulty combinations in browser (4 modes x 3 difficulties)
- [ ] 10.4 Verify screen reader announcements include mode info (e.g., "Time Attack started. 60 seconds.")
- [ ] 10.5 Run full test suite and fix any regressions
