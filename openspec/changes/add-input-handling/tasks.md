# Tasks: Add Input Handling

## 1. InputHandler Class
- [ ] 1.1 Create InputHandler class with constructor (game reference)
- [ ] 1.2 Add directionQueue array to buffer inputs
- [ ] 1.3 Add currentDirection property tracking snake's actual direction

## 2. Keyboard Input
- [ ] 2.1 Add keydown event listener to document
- [ ] 2.2 Map arrow keys to directions (ArrowUp, ArrowDown, ArrowLeft, ArrowRight)
- [ ] 2.3 Map WASD keys to directions (w, a, s, d)
- [ ] 2.4 Handle case-insensitivity for WASD

## 3. Direction Queue
- [ ] 3.1 Implement `queueDirection(direction)` method
- [ ] 3.2 Reject 180° reversals (can't go left if moving right, etc.)
- [ ] 3.3 Limit queue size to prevent input flooding (max 2-3)
- [ ] 3.4 Implement `getNextDirection()` to dequeue for next tick

## 4. Touch Input
- [ ] 4.1 Add touchstart event listener to canvas
- [ ] 4.2 Add touchmove event listener to track swipe
- [ ] 4.3 Add touchend event listener to complete swipe
- [ ] 4.4 Calculate swipe direction from start/end coordinates
- [ ] 4.5 Convert swipe to direction and queue it

## 5. Game Integration
- [ ] 5.1 Instantiate InputHandler in Game constructor
- [ ] 5.2 Call getNextDirection() in Game tick before snake.move()
- [ ] 5.3 Apply direction to snake if valid
- [ ] 5.4 Clean up event listeners on game destroy

## 6. Testing
- [ ] 6.1 Unit test: 180° reversal prevention
- [ ] 6.2 Unit test: direction queue limits
- [ ] 6.3 Manual test: keyboard controls responsive
- [ ] 6.4 Manual test: touch swipe on mobile device
