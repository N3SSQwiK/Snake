# Tasks: Add Basic Food System

## 1. Food Class
- [ ] 1.1 Create Food class with constructor (gridWidth, gridHeight, decayTime)
- [ ] 1.2 Add position property {x, y}
- [ ] 1.3 Add points property (default value for basic food)
- [ ] 1.4 Add spawnTime property (timestamp when spawned)
- [ ] 1.5 Add decayDuration property (configurable, default ~10 seconds)

## 2. Food Spawning
- [ ] 2.1 Implement `spawn(excludePositions)` method
- [ ] 2.2 Generate random grid coordinates with max attempts (100)
- [ ] 2.3 Fallback: compute valid cells if random attempts exhausted
- [ ] 2.4 Ensure food doesn't spawn on snake body
- [ ] 2.5 Respawn food immediately after eaten
- [ ] 2.6 Reset spawnTime on each spawn

## 3. Food Decay
- [ ] 3.1 Implement `isExpired(currentTime)` method
- [ ] 3.2 Implement `isDecayWarning(currentTime)` method (< 25% time left)
- [ ] 3.3 Check decay in Game tick, respawn if expired
- [ ] 3.4 Track decay state for rendering

## 4. Collision Detection
- [ ] 4.1 Implement `checkCollision(headPosition)` method
- [ ] 4.2 Return true if snake head overlaps food position
- [ ] 4.3 Integrate collision check into Game tick

## 5. Scoring System
- [ ] 5.1 Add score property to Game class
- [ ] 5.2 Increment score when food eaten
- [ ] 5.3 Track snake length separately
- [ ] 5.4 Reset score on game restart

## 6. Rendering
- [ ] 6.1 Add `drawFood(food, isDecayWarning)` method to Renderer
- [ ] 6.2 Draw food using theme.colors.food (not hardcoded)
- [ ] 6.3 Add blink/pulse effect when isDecayWarning is true
- [ ] 6.4 Add `drawScore(score, length)` method to Renderer
- [ ] 6.5 Display score and length on canvas (top-left corner)

## 7. Game Integration
- [ ] 7.1 Instantiate Food in Game constructor
- [ ] 7.2 Check food collision in Game tick
- [ ] 7.3 Check food decay in Game tick, respawn if expired
- [ ] 7.4 On collision: trigger snake growth, increment score, respawn food
- [ ] 7.5 Render food (with decay state) and score each frame

## 8. Testing
- [ ] 8.1 Unit test: food spawns in valid position
- [ ] 8.2 Unit test: food doesn't spawn on snake
- [ ] 8.3 Unit test: spawn fallback when random attempts exhausted
- [ ] 8.4 Unit test: collision detection accuracy
- [ ] 8.5 Unit test: score increments correctly
- [ ] 8.6 Unit test: food decay expires after timeout
- [ ] 8.7 Unit test: decay warning triggers at 25% time remaining
- [ ] 8.8 Manual test: complete gameplay loop with decay
