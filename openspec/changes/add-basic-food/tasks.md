# Tasks: Add Basic Food System

## 1. Food Class
- [ ] 1.1 Create Food class with constructor (gridWidth, gridHeight)
- [ ] 1.2 Add position property {x, y}
- [ ] 1.3 Add points property (default value for basic food)

## 2. Food Spawning
- [ ] 2.1 Implement `spawn(excludePositions)` method
- [ ] 2.2 Generate random grid coordinates
- [ ] 2.3 Ensure food doesn't spawn on snake body
- [ ] 2.4 Respawn food immediately after eaten

## 3. Collision Detection
- [ ] 3.1 Implement `checkCollision(headPosition)` method
- [ ] 3.2 Return true if snake head overlaps food position
- [ ] 3.3 Integrate collision check into Game tick

## 4. Scoring System
- [ ] 4.1 Add score property to Game class
- [ ] 4.2 Increment score when food eaten
- [ ] 4.3 Track snake length separately
- [ ] 4.4 Reset score on game restart

## 5. Rendering
- [ ] 5.1 Add `drawFood(food)` method to Renderer
- [ ] 5.2 Draw food as colored cell
- [ ] 5.3 Add `drawScore(score, length)` method to Renderer
- [ ] 5.4 Display score and length on canvas or overlay

## 6. Game Integration
- [ ] 6.1 Instantiate Food in Game constructor
- [ ] 6.2 Check food collision in Game tick
- [ ] 6.3 On collision: trigger snake growth, increment score, respawn food
- [ ] 6.4 Render food and score each frame

## 7. Testing
- [ ] 7.1 Unit test: food spawns in valid position
- [ ] 7.2 Unit test: food doesn't spawn on snake
- [ ] 7.3 Unit test: collision detection accuracy
- [ ] 7.4 Unit test: score increments correctly
- [ ] 7.5 Manual test: complete gameplay loop works
