## 1. Achievement Catalog Constant + AchievementManager Class

- [ ] 1.1 Add `ACHIEVEMENTS` array constant after `LEADERBOARD_MODES` (line 26 of game.js). Each entry: `{ id, name, description, icon, condition }`. Define all 12 achievements: `firstBlood`, `glutton`, `speedDemon`, `marathon`, `century`, `top10`, `perfectionist`, `untouchable`, `hazardPay`, `hardModeHero`, `tripleThreat`, `allRounder`. Condition functions receive `(stats, progress, unlocked)` and return boolean.
- [ ] 1.2 Add `AchievementManager` class after `StorageManager` (after line 697). Constructor takes `storage` (StorageManager instance). Load unlocked achievements from `storage.get('achievements', {})` and cumulative progress from `storage.get('achievementProgress', { gamesPlayed: 0, modesPlayed: [], difficultiesWithLeaderboard: [] })`. Include corruption fallback (if loaded data is not an object, reset to defaults).
- [ ] 1.3 Add `resetSession()` method to AchievementManager: resets per-session counters (`foodsEaten`, `toxicFoodsEaten`, `maxTickRate`, `ticksSurvived`, `bonusFoodsEaten`).
- [ ] 1.4 Add `onFoodEaten(foodType)` method: increments `foodsEaten`, and `toxicFoodsEaten` if type is TOXIC, `bonusFoodsEaten` if BONUS.
- [ ] 1.5 Add `checkAchievements(stats)` method: iterates `ACHIEVEMENTS`, skips already-unlocked IDs, evaluates each condition with `(stats, this.progress, this.unlocked)`. Returns array of newly unlocked achievement objects. Saves unlocked map and progress to storage.
- [ ] 1.6 Add `getAll()` method: returns `ACHIEVEMENTS` array with unlock status merged. Add `getUnlocked()`: returns array of unlocked achievement IDs. Add `getProgress()`: returns `{ unlocked: count, total: ACHIEVEMENTS.length }`.

## 2. AudioManager: Achievement Unlock Sound

- [ ] 2.1 Add `playAchievementUnlock()` method to AudioManager (after `playThemeUnlock()` at line 555). Use `_playSequence([784, 988, 1175], 0.08, 0.02)` — G5-B5-D6 ascending triad, distinct from theme unlock.

## 3. StorageManager: Achievement Helpers

- [ ] 3.1 Add `getAchievements()` method to StorageManager (after `checkThemeUnlocks` at line 696): returns `this.get('achievements', {})`.
- [ ] 3.2 Add `saveAchievements(unlocked)` method: calls `this.set('achievements', unlocked)`.
- [ ] 3.3 Add `getAchievementProgress()` and `saveAchievementProgress(progress)` methods using key `'achievementProgress'`.

## 4. Game Class: Session Tracking + Achievement Integration

- [ ] 4.1 In `Game` constructor (after line 3525), instantiate `this.achievements = new AchievementManager(this.storage)`.
- [ ] 4.2 In `Game.reset()` (line 4016), call `this.achievements.resetSession()` to clear per-session stats.
- [ ] 4.3 In `Game.tick()` regular food collision block (after line 3897 `playEat()`), call `this.achievements.onFoodEaten(FoodType.REGULAR)`.
- [ ] 4.4 In `Game.tick()` special food collision switch cases (lines 3913-3939): call `this.achievements.onFoodEaten(FoodType.BONUS)` after BONUS eat, `this.achievements.onFoodEaten(FoodType.TOXIC)` after TOXIC eat.
- [ ] 4.5 In `Game.handleGameOver()` (after theme unlock check, before setState at line 3599): build stats object from game state, call `this.achievements.checkAchievements(stats)`. Update cumulative progress (gamesPlayed, modesPlayed, madeLeaderboard → difficultiesWithLeaderboard). If achievements unlocked, call `this.ui.showAchievementToast(unlocked)` and `this.audio.playAchievementUnlock()`.

## 5. HTML: Achievement Gallery + Toast Container + Menu Button

- [ ] 5.1 Add achievements button to start menu `.ui-btn-group` in index.html (between High Scores button at line 74 and the closing `</div>`): `<button class="ui-btn ui-btn--ghost" data-action="achievements">Achievements (0/12)</button>`
- [ ] 5.2 Add `.screen-achievements` section in index.html overlay (after leaderboard screen): panel with heading "Achievements (X/Y)", scrollable `.achievements-list` container, and a back button with `data-action="achievements-back"`.
- [ ] 5.3 Add `.achievement-toast` container div at top of `.game-container` in index.html, with `role="status"` and `aria-live="polite"`.

## 6. CSS: Achievement Gallery + Toast Styles

- [ ] 6.1 Add `.achievement-toast` styles in styles.css: fixed position at top-center of game container, z-index above overlay, slide-down animation, 3s visible + 0.5s fade-out via CSS animation. Include icon, name, and "Achievement Unlocked!" label layout.
- [ ] 6.2 Add `.screen-achievements` visibility rule: shown when `[data-ui="achievements"]`.
- [ ] 6.3 Add `.achievements-list` styles: scrollable container (max-height), flex-column layout.
- [ ] 6.4 Add `.achievement-item` styles: row layout with icon, name, description, status. `.achievement-item--locked` variant with dimmed opacity and lock icon. `.achievement-item--unlocked` variant with full opacity and unlock date.

## 7. UIManager: Gallery Screen + Toast + Menu Integration

- [ ] 7.1 Add `showAchievements()` method to UIManager: sets `data-ui="achievements"`, renders achievement list from `game.achievements.getAll()`, traps focus.
- [ ] 7.2 Add `hideAchievements()` method: removes `data-ui`, restores focus.
- [ ] 7.3 Add `showAchievementToast(achievements)` method: queues achievement toast notifications. Creates DOM element with icon + name + label, appends to toast container. Removes after 3.5s. If queue has more, shows next after current finishes.
- [ ] 7.4 Add `updateAchievementButton()` method: updates menu button label with current progress count (e.g., "Achievements (3/12)"). Call this in `onStateChange` when entering MENU state.
- [ ] 7.5 Add `achievements` and `achievements-back` cases to `handleOverlayClick` switch statement (after `highscores` case at line 3264): call `showAchievements()` / `hideAchievements()` with appropriate audio.
- [ ] 7.6 Add leaderboard-related achievement check: after `_submitInitials()` saves score, call `game.achievements.checkAchievements()` with updated leaderboard context for Top 10, Perfectionist, Triple Threat achievements.

## 8. Tests

- [ ] 8.1 Write tests for `AchievementManager` constructor: loads from storage, handles corruption gracefully, initializes empty state.
- [ ] 8.2 Write tests for `resetSession()`: verifies all session counters reset to 0.
- [ ] 8.3 Write tests for `onFoodEaten()`: increments correct counters per food type.
- [ ] 8.4 Write tests for `checkAchievements()`: unlocks qualifying achievements, skips already-unlocked, returns newly unlocked array, persists to storage.
- [ ] 8.5 Write tests for individual achievement conditions: First Blood (1 food), Glutton (50 food), Speed Demon (max tick rate), Marathon (500 ticks), Century (100 score), Untouchable (100 score on easy), Hard Mode Hero (200 on hard), Hazard Pay (toxic eaten + score > 0), All Rounder (all modes), Top 10 / Perfectionist / Triple Threat (leaderboard-based).
- [ ] 8.6 Write tests for `playAchievementUnlock()` audio method.
- [ ] 8.7 Write tests for toast queueing: single toast display, multiple toasts queued, toast auto-dismiss.
- [ ] 8.8 Write tests for gallery rendering: unlocked vs locked display, progress counter accuracy.
- [ ] 8.9 Run full test suite (`node --test game.test.js`) and verify no regressions.

## 9. Cleanup + Verification

- [ ] 9.1 Verify achievement button appears in menu and shows correct count.
- [ ] 9.2 Verify gallery shows all 12 achievements with correct locked/unlocked state.
- [ ] 9.3 Verify toast appears on achievement unlock and does not block gameplay.
- [ ] 9.4 Verify achievements persist across page reload.
