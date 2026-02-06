# Tasks: Add Difficulty System

## 1. Difficulty Configuration
- [x] 1.1 Create DIFFICULTY_LEVELS constant
- [x] 1.2 Define Easy: slow start (8 ticks/s), gentle acceleration (every 80pts), walls wrap, no hazard food
- [x] 1.3 Define Medium: moderate start (10 ticks/s), standard acceleration (every 50pts), walls kill, toxic food
- [x] 1.4 Define Hard: fast start (12 ticks/s), aggressive acceleration (every 30pts), walls kill, toxic and lethal food
- [x] 1.5 Each level: baseTickRate, maxTickRate, speedScoreStep, bonusFoodChance, toxicFoodChance, lethalFoodChance, wallCollision

## 2. Speed System
- [x] 2.1 Add updateTickRate() method to Game
- [x] 2.2 Calculate tickInterval from difficulty config and current score
- [x] 2.3 Increase tick rate by 1 per speedScoreStep points
- [x] 2.4 Cap tick rate at difficulty's maxTickRate
- [x] 2.5 Reset tick rate to base on game restart

## 3. Game Loop Update
- [x] 3.1 Variable tickInterval already supported by existing accumulator loop
- [x] 3.2 updateTickRate() called on food eat and game reset
- [x] 3.3 Speed resets on game restart via reset() → updateTickRate()

## 4. Food Types
- [x] 4.1 Add FoodType enum (REGULAR, BONUS, TOXIC, LETHAL)
- [x] 4.2 Add foodType property to Food class
- [x] 4.3 Extend spawn() with foodType and decayOverride params
- [x] 4.4 Add specialFood slot on Game (separate from regular food)
- [x] 4.5 Spawn special food every 10 ticks based on difficulty chance values

## 5. Bonus Food
- [x] 5.1 Spawn bonus food with probability from difficulty's bonusFoodChance
- [x] 5.2 60-tick (6s) decay timer
- [x] 5.3 Award 25 points and grow snake when eaten
- [x] 5.4 Despawn when timer expires
- [x] 5.5 Visual: 4-pointed star with pulse animation using theme bonusFood color

## 6. Toxic Food
- [x] 6.1 Spawn toxic food with probability from difficulty's toxicFoodChance
- [x] 6.2 60-tick (6s) decay timer
- [x] 6.3 Deduct points: penalty = -5 * ceil(score / 50), minimum -5
- [x] 6.4 Game over if score goes below zero (score clamped to 0)
- [x] 6.5 Despawn when timer expires
- [x] 6.6 Visual: diamond shape with exclamation mark using theme poisonFood color
- [x] 6.7 Never spawns on Easy difficulty (chance 0%)

## 7. Lethal Food
- [x] 7.1 Spawn lethal food with probability from difficulty's lethalFoodChance
- [x] 7.2 60-tick (6s) decay timer
- [x] 7.3 Instant game over when eaten
- [x] 7.4 Despawn when timer expires
- [x] 7.5 Visual: spiky circle (16 points) with skull markings using theme poisonFood color
- [x] 7.6 Never spawns on Easy or Medium difficulty (chance 0%)

## 8. Difficulty Selector UI
- [x] 8.1 Add segmented control to settings screen (Easy/Medium/Hard)
- [x] 8.2 Show description per level reflecting actual parameters
- [x] 8.3 Save/load selection via StorageManager
- [x] 8.4 Apply difficulty on game start
- [x] 8.5 Disable selector mid-game (PLAYING/PAUSED) with visual disabled state

## 9. Wall Collision Integration
- [x] 9.1 Add wallCollision field to each DIFFICULTY_LEVELS entry
- [x] 9.2 Derive wallCollisionEnabled from difficulty config (not standalone setting)
- [x] 9.3 Remove standalone wall collision toggle from settings UI
- [x] 9.4 Remove setWallCollision() method and wallCollision storage key
- [x] 9.5 Sync wallCollisionEnabled on setDifficulty() and reset()

## 10. Difficulty HUD
- [x] 10.1 Add difficultyName parameter to Renderer.drawScore()
- [x] 10.2 Display difficulty name alongside score and length on canvas

## 11. Difficulty-Scoped Leaderboard
- [x] 11.1 Store difficulty field in leaderboard entries via addScore()
- [x] 11.2 Filter getLeaderboard() by difficulty when parameter provided
- [x] 11.3 Filter isHighScore() and isNewTopScore() by difficulty
- [x] 11.4 Show all scores from main menu/game over (with difficulty column)
- [x] 11.5 Show filtered scores from pause screen (heading shows difficulty)
- [x] 11.6 Legacy entries (no difficulty) shown with "—" and included in all views

## 12. Testing
- [x] 12.1 Unit test: difficulty constants have required properties
- [x] 12.2 Unit test: speed increases correctly with score
- [x] 12.3 Unit test: speed caps at maximum
- [x] 12.4 Unit test: toxic penalty formula scales with score
- [x] 12.5 Unit test: toxic food causes game over when score goes negative
- [x] 12.6 Unit test: lethal food causes instant game over
- [x] 12.7 Unit test: bonus food awards points and grows snake
- [x] 12.8 Unit test: special food expires and is cleared
- [x] 12.9 Unit test: food type rendering dispatches correctly
- [x] 12.10 Unit test: wall collision derived from difficulty
- [x] 12.11 Unit test: leaderboard filters by difficulty
- [x] 12.12 Unit test: HUD displays difficulty name
- [x] 12.13 Unit test: difficulty persistence via storage
- [x] 12.14 Manual test: each difficulty feels distinct
- [x] 12.15 Manual test: Easy wraps walls, Medium/Hard kills on walls

## 13. Spec Sync
- [x] 13.1 Update difficulty-system spec to match implementation (toxic/lethal split, wall collision, leaderboard, HUD, mid-game lock)
- [x] 13.2 Update food-system spec to match implementation (food types, shapes, special food slot)
- [x] 13.3 Update tasks.md to reflect actual completed work
- [x] 13.4 Update proposal.md to reflect post-implementation deviations
