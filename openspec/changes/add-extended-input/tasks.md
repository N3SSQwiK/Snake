# Tasks: Add Extended Input Methods

## 1. On-Screen Virtual D-Pad
- [x] 1.1 Add D-pad HTML markup (4 directional buttons with aria-labels) inside game-container
- [x] 1.2 Style D-pad: glassmorphism (`--ui-glass-bg`, `--ui-glass-border`), absolute bottom-left, 48px+ touch targets
- [x] 1.3 Show D-pad only on pointer:coarse during PLAYING when D-pad mode selected
- [x] 1.4 Wire D-pad button touches to InputHandler.queueDirection()
- [x] 1.5 Prevent D-pad touches from triggering swipe handler (stopPropagation + preventDefault)

## 2. Tap Zones
- [x] 2.1 Implement tap-zone detection in handleTouchEnd: when tap-zone mode active and distance < minSwipeDistance, map touch position relative to canvas center to direction (dominant axis)
- [x] 2.2 Tap zones active only when tap-zone mode selected; swipe still works when swipe mode selected

## 3. Input Method Setting
- [x] 3.1 Add `mobileInput` key to StorageManager (values: 'swipe' | 'dpad' | 'tapzone', default: 'swipe')
- [x] 3.2 Add "Controls" setting group to index.html with segmented selector (Swipe / D-Pad / Tap Zones), visible only on pointer:coarse via CSS media query
- [x] 3.3 Wire selector to InputHandler: set active method, show/hide D-pad, enable/disable tap zones
- [x] 3.4 Setting persists across sessions via StorageManager

## 4. Refactor UIManager Menu Navigation
- [x] 4.1 Extract arrow-key focus cycling from `_handleMenuKeyDown` into public `navigateMenu(direction)` method (direction: 'up' | 'down'), including audio feedback
- [x] 4.2 Extract Backspace/Delete back-navigation from `_handleMenuKeyDown` into public `navigateBack()` method, including audio feedback
- [x] 4.3 Update `_handleMenuKeyDown` to call `navigateMenu()` and `navigateBack()` instead of inline logic

## 5. Gamepad Support
- [x] 5.1 Add gamepad connection detection (gamepadconnected / gamepaddisconnected events) in InputHandler constructor; store `gamepadIndex`
- [x] 5.2 Add `pollGamepad()` method: read `navigator.getGamepads()[gamepadIndex]`, skip if null or `mapping !== 'standard'`
- [x] 5.3 Add `prevButtonStates` array for rising-edge debounce (only process button on transition from not-pressed to pressed)
- [x] 5.4 Map D-pad buttons (12=UP, 13=DOWN, 14=LEFT, 15=RIGHT) to `queueDirection()` — check `inputGate` before queueing
- [x] 5.5 Map Cross (button 0) during PLAYING to `actionCallbacks.pause`; during menus to `document.activeElement.click()` (confirm)
- [x] 5.6 Map Circle (button 1) to `UIManager.navigateBack()` (same as Backspace)
- [x] 5.7 Map Options (button 9) to `actionCallbacks.pause`
- [x] 5.8 Map D-pad up/down during menus to `UIManager.navigateMenu('up'|'down')` — skip when state is PLAYING

## 6. Game Loop Integration
- [x] 6.1 Call `inputHandler.pollGamepad()` in `Game.loop()` before `tick()` (every frame, not just on tick)
- [x] 6.2 Pass game state and UIManager reference to InputHandler so pollGamepad knows context (PLAYING vs menu)

## 7. Testing
- [x] 7.1 Unit test: `pollGamepad()` maps D-pad buttons to correct directions via queueDirection
- [x] 7.2 Unit test: rising-edge debounce — held button only fires once
- [x] 7.3 Unit test: Cross button calls pause during PLAYING, click during menus
- [x] 7.4 Unit test: Circle button calls navigateBack()
- [x] 7.5 Unit test: tap-zone quadrant detection maps to correct directions
- [x] 7.6 Unit test: input method setting persistence via StorageManager
- [x] 7.7 Unit test: navigateMenu() cycles focus with wrap-around and plays audio
- [x] 7.8 Unit test: navigateBack() triggers correct action per data-ui/state
- [ ] 7.9 Manual test: D-pad on mobile (Safari touch emulation)
- [ ] 7.10 Manual test: tap zones on mobile
- [ ] 7.11 Manual test: PlayStation DualSense controller via Bluetooth
- [ ] 7.12 Manual test: input method switching in settings
