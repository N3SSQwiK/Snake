# Tasks: Add Snake Mechanics

## 1. Snake Class
- [x] 1.1 Create Snake class with constructor (startX, startY, initialLength)
- [x] 1.2 Implement body as array of {x, y} coordinates
- [x] 1.3 Add direction property with initial value
- [x] 1.4 Add pendingGrowth flag for delayed growth

## 2. Movement
- [x] 2.1 Implement `setDirection(direction)` method
- [x] 2.2 Implement `move()` method - calculate new head position
- [x] 2.3 Shift body segments (tail follows head)
- [x] 2.4 Handle growth - skip tail removal when pendingGrowth is true

## 3. Collision Detection
- [x] 3.1 Implement `checkSelfCollision()` method
- [x] 3.2 Return true if head overlaps any body segment
- [x] 3.3 Integrate collision check into Game tick cycle

## 4. Rendering
- [x] 4.1 Add `drawSnake(snake)` method to Renderer
- [x] 4.2 Draw head with distinct color
- [x] 4.3 Draw body segments with snake color

## 5. Game Integration
- [x] 5.1 Instantiate Snake in Game constructor
- [x] 5.2 Call snake.move() in Game tick
- [x] 5.3 Check self-collision and trigger GAMEOVER state
- [x] 5.4 Reset snake on game restart

## 6. Testing
- [x] 6.1 Unit test: snake moves in correct direction
- [x] 6.2 Unit test: snake grows correctly
- [x] 6.3 Unit test: self-collision detected accurately
