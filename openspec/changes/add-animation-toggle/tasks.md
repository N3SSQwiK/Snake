# Tasks: Add Animation Toggle

## 1. Snake Previous Position Tracking
- [ ] 1.1 Add `previousBody` property to Snake class
- [ ] 1.2 Copy `body` to `previousBody` at start of `move()`
- [ ] 1.3 Initialize `previousBody` in constructor and `reset()`

## 2. Interpolation Factor
- [ ] 2.1 Calculate interpolation factor in `Game.render()` as `tickAccumulator / tickInterval`
- [ ] 2.2 Clamp factor to 0.0–1.0
- [ ] 2.3 Pass factor to `Renderer.drawSnake()`

## 3. Smooth Rendering
- [ ] 3.1 Add `animationStyle` property to Game (`smooth` or `classic`)
- [ ] 3.2 Update `Renderer.drawSnake()` to accept interpolation factor
- [ ] 3.3 Lerp each segment position: `prev + (curr - prev) * factor`
- [ ] 3.4 Detect wrap-around (position delta > 1 cell) and snap instead of interpolating
- [ ] 3.5 Handle growth frame: new tail segment with no previous position renders at grid position
- [ ] 3.6 When `animationStyle` is `classic`, pass factor 0 or skip interpolation

## 4. Settings Integration
- [ ] 4.1 Add animation style toggle to settings screen HTML
- [ ] 4.2 Style the toggle matching existing wall collision toggle
- [ ] 4.3 Save animation style preference to StorageManager
- [ ] 4.4 Load saved preference on Game init (default: `smooth`)
- [ ] 4.5 Wire toggle in UIManager to update Game.animationStyle

## 5. Testing
- [ ] 5.1 Unit test: Snake.previousBody is set before move
- [ ] 5.2 Unit test: previousBody matches body state before move
- [ ] 5.3 Unit test: interpolation factor clamped to 0.0–1.0
- [ ] 5.4 Manual test: smooth animation looks fluid at 60fps
- [ ] 5.5 Manual test: classic mode snaps to grid (no interpolation)
- [ ] 5.6 Manual test: wrap-around does not interpolate across screen
- [ ] 5.7 Manual test: toggle persists after reload
