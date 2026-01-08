# Tasks: Add Wall Collision System

## 1. Wall Collision Detection
- [ ] 1.1 Add `checkWallCollision(position)` method to Game
- [ ] 1.2 Check if x < 0, x >= gridWidth, y < 0, y >= gridHeight
- [ ] 1.3 Return collision result

## 2. Wrap-Around Logic
- [ ] 2.1 Add `wrapPosition(position)` method to Game
- [ ] 2.2 If x < 0, set x = gridWidth - 1
- [ ] 2.3 If x >= gridWidth, set x = 0
- [ ] 2.4 If y < 0, set y = gridHeight - 1
- [ ] 2.5 If y >= gridHeight, set y = 0

## 3. Settings Management
- [ ] 3.1 Create StorageManager class
- [ ] 3.2 Implement `get(key, defaultValue)` method
- [ ] 3.3 Implement `set(key, value)` method
- [ ] 3.4 Add wallCollision setting (default: true)

## 4. Game Integration
- [ ] 4.1 Add wallCollisionEnabled property to Game
- [ ] 4.2 Load setting from StorageManager on init
- [ ] 4.3 In tick: if wallCollision enabled and collision detected, trigger GAMEOVER
- [ ] 4.4 In tick: if wallCollision disabled, apply wrap-around

## 5. Minimal Settings UI
- [ ] 5.1 Add temporary toggle mechanism (keyboard shortcut or simple button)
- [ ] 5.2 Save preference when changed
- [ ] 5.3 Display current mode indicator

## 6. Testing
- [ ] 6.1 Unit test: wall collision detection at all four edges
- [ ] 6.2 Unit test: wrap-around coordinates calculated correctly
- [ ] 6.3 Unit test: StorageManager saves and loads values
- [ ] 6.4 Manual test: toggle between modes during gameplay
