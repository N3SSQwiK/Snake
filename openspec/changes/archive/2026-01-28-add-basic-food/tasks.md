# Tasks: Add Basic Food System

## 1. Food Class
- [x] 1.1 Create Food class with constructor (gridWidth, gridHeight, decayTime)
- [x] 1.2 Add position property {x, y}
- [x] 1.3 Add points property (default value for basic food)
- [x] 1.4 Add spawnTime property (timestamp when spawned)
- [x] 1.5 Add decayDuration property (configurable, default ~10 seconds)

## 2. Food Spawning
- [x] 2.1 Implement `spawn(excludePositions)` method
- [x] 2.2 Generate random grid coordinates with max attempts (100)
- [x] 2.3 Fallback: compute valid cells if random attempts exhausted
- [x] 2.4 Ensure food doesn't spawn on snake body
- [x] 2.5 Respawn food immediately after eaten
- [x] 2.6 Reset spawnTime on each spawn

## 3. Food Decay
- [x] 3.1 Implement `isExpired(currentTime)` method
- [x] 3.2 Implement `isDecayWarning(currentTime)` method (< 25% time left)
- [x] 3.3 Check decay in Game tick, respawn if expired
- [x] 3.4 Track decay state for rendering

## 4. Collision Detection
- [x] 4.1 Implement `checkCollision(headPosition)` method
- [x] 4.2 Return true if snake head overlaps food position
- [x] 4.3 Integrate collision check into Game tick

## 5. Scoring System
- [x] 5.1 Add score property to Game class
- [x] 5.2 Increment score when food eaten
- [x] 5.3 Track snake length separately
- [x] 5.4 Reset score on game restart

## 6. Rendering
- [x] 6.1 Add `drawFood(food, isDecayWarning)` method to Renderer
- [x] 6.2 Draw food using theme.colors.food (not hardcoded)
- [x] 6.3 Add blink/pulse effect when isDecayWarning is true
- [x] 6.4 Add `drawScore(score, length)` method to Renderer
- [x] 6.5 Display score and length on canvas (top-left corner)

## 7. Game Integration
- [x] 7.1 Instantiate Food in Game constructor
- [x] 7.2 Check food collision in Game tick
- [x] 7.3 Check food decay in Game tick, respawn if expired
- [x] 7.4 On collision: trigger snake growth, increment score, respawn food
- [x] 7.5 Render food (with decay state) and score each frame

## 8. Testing
- [x] 8.1 Unit test: food spawns in valid position
- [x] 8.2 Unit test: food doesn't spawn on snake
- [x] 8.3 Unit test: spawn fallback when random attempts exhausted
- [x] 8.4 Unit test: collision detection accuracy
- [x] 8.5 Unit test: score increments correctly
- [x] 8.6 Unit test: food decay expires after timeout
- [x] 8.7 Unit test: decay warning triggers at 25% time remaining
- [x] 8.8 Manual test: complete gameplay loop with decay
