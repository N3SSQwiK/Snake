# Tasks: Add Wall Collision System

## 1. Wall Collision Detection
- [x] 1.1 Add `checkWallCollision(position)` method to Game
- [x] 1.2 Check if x < 0, x >= gridWidth, y < 0, y >= gridHeight
- [x] 1.3 Return collision result

## 2. Wrap-Around Logic
- [x] 2.1 Add `wrapPosition(position)` method to Game
- [x] 2.2 If x < 0, set x = gridWidth - 1
- [x] 2.3 If x >= gridWidth, set x = 0
- [x] 2.4 If y < 0, set y = gridHeight - 1
- [x] 2.5 If y >= gridHeight, set y = 0

## 3. Settings Management
- [x] 3.1 Create StorageManager class
- [x] 3.2 Implement `get(key, defaultValue)` method
- [x] 3.3 Implement `set(key, value)` method
- [x] 3.4 Add wallCollision setting (default: true)

## 4. Game Integration
- [x] 4.1 Add wallCollisionEnabled property to Game
- [x] 4.2 Load setting from StorageManager on init
- [x] 4.3 In tick: if wallCollision enabled and collision detected, trigger GAMEOVER
- [x] 4.4 In tick: if wallCollision disabled, apply wrap-around

## 5. Minimal Settings UI
> **Deferred** to `add-ui-screens` proposal (avoids W key conflict and throwaway code)
- [ ] 5.1 Add temporary toggle mechanism (keyboard shortcut or simple button)
- [ ] 5.2 Save preference when changed
- [ ] 5.3 Display current mode indicator

Dev console workaround available: `game.setWallCollision(false)`

## 6. Testing
- [x] 6.1 Unit test: wall collision detection at all four edges
- [x] 6.2 Unit test: wrap-around coordinates calculated correctly
- [x] 6.3 Unit test: StorageManager saves and loads values
- [x] 6.4 Manual test: toggle between modes during gameplay (via dev console)

---

**Status:** Core implementation complete (Tasks 1-4, 6). UI deferred to add-ui-screens.
