# Tasks: Add Input Handling

## 1. InputHandler Class
- [x] 1.1 Create InputHandler class with constructor (canvas, getSnakeDirection callback)
- [x] 1.2 Add directionQueue array to buffer inputs
- [x] 1.3 ~~Add currentDirection property~~ → Uses getSnakeDirection callback for live direction

## 2. Keyboard Input
- [x] 2.1 Add keydown event listener to document
- [x] 2.2 Map arrow keys to directions (ArrowUp, ArrowDown, ArrowLeft, ArrowRight)
- [x] 2.3 Map WASD keys to directions (w, a, s, d)
- [x] 2.4 Handle case-insensitivity for WASD

## 3. Direction Queue
- [x] 3.1 Implement `queueDirection(direction)` method
- [x] 3.2 Reject 180° reversals (can't go left if moving right, etc.)
- [x] 3.3 Limit queue size to prevent input flooding (max 2)
- [x] 3.4 Implement `getNextDirection()` to dequeue for next tick

## 4. Touch Input
- [x] 4.1 Add touchstart event listener to canvas
- [x] 4.2 ~~Add touchmove event listener~~ → Not needed; using touchend delta
- [x] 4.3 Add touchend event listener to complete swipe
- [x] 4.4 Calculate swipe direction from start/end coordinates
- [x] 4.5 Convert swipe to direction and queue it

## 5. Game Integration
- [x] 5.1 Instantiate InputHandler in Game constructor
- [x] 5.2 Call getNextDirection() in Game tick before snake.move()
- [x] 5.3 Apply direction to snake if valid
- [x] 5.4 Clean up event listeners on game destroy

## 6. Testing
- [x] 6.1 Unit test: 180° reversal prevention
- [x] 6.2 Unit test: direction queue limits
- [x] 6.3 Manual test: keyboard controls responsive
- [x] 6.4 Manual test: touch swipe on mobile device
