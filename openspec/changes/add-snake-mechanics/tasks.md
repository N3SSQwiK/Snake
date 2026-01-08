# Tasks: Add Snake Mechanics

## 1. Snake Class
- [ ] 1.1 Create Snake class with constructor (startX, startY, initialLength)
- [ ] 1.2 Implement body as array of {x, y} coordinates
- [ ] 1.3 Add direction property with initial value
- [ ] 1.4 Add pendingGrowth flag for delayed growth

## 2. Movement
- [ ] 2.1 Implement `setDirection(direction)` method
- [ ] 2.2 Implement `move()` method - calculate new head position
- [ ] 2.3 Shift body segments (tail follows head)
- [ ] 2.4 Handle growth - skip tail removal when pendingGrowth is true

## 3. Collision Detection
- [ ] 3.1 Implement `checkSelfCollision()` method
- [ ] 3.2 Return true if head overlaps any body segment
- [ ] 3.3 Integrate collision check into Game tick cycle

## 4. Rendering
- [ ] 4.1 Add `drawSnake(snake)` method to Renderer
- [ ] 4.2 Draw head with distinct color
- [ ] 4.3 Draw body segments with snake color

## 5. Game Integration
- [ ] 5.1 Instantiate Snake in Game constructor
- [ ] 5.2 Call snake.move() in Game tick
- [ ] 5.3 Check self-collision and trigger GAMEOVER state
- [ ] 5.4 Reset snake on game restart

## 6. Testing
- [ ] 6.1 Unit test: snake moves in correct direction
- [ ] 6.2 Unit test: snake grows correctly
- [ ] 6.3 Unit test: self-collision detected accurately
