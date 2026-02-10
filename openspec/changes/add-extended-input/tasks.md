# Tasks: Add Extended Input Methods

## 1. On-Screen Virtual D-Pad
- [x] 1.1 Add D-pad HTML markup (4 directional buttons with aria-labels) inside game-container
- [x] 1.2 Style D-pad: glassmorphism (`--ui-glass-bg`, `--ui-glass-border`), centered below canvas, 48px+ touch targets
- [x] 1.3 Show D-pad only on pointer:coarse during PLAYING when D-pad mode selected
- [x] 1.4 Wire D-pad button touches to InputHandler.queueDirection()
- [x] 1.5 Prevent D-pad touches from triggering swipe handler (stopPropagation + preventDefault)

## 2. Input Method Setting
- [x] 2.1 Add `mobileInput` key to StorageManager (values: 'swipe' | 'dpad', default: 'swipe')
- [x] 2.2 Add "Controls" setting group to index.html with segmented selector (Swipe / D-Pad), visible only on pointer:coarse via CSS media query
- [x] 2.3 Wire selector to InputHandler: set active method, show/hide D-pad
- [x] 2.4 Setting persists across sessions via StorageManager

## 3. Refactor UIManager Menu Navigation
- [x] 3.1 Extract arrow-key focus cycling from `_handleMenuKeyDown` into public `navigateMenu(direction)` method (direction: 'up' | 'down'), including audio feedback
- [x] 3.2 Extract Backspace/Delete back-navigation from `_handleMenuKeyDown` into public `navigateBack()` method, including audio feedback
- [x] 3.3 Update `_handleMenuKeyDown` to call `navigateMenu()` and `navigateBack()` instead of inline logic

## 4. Gamepad Support
- [x] 4.1 Add gamepad connection detection (gamepadconnected / gamepaddisconnected events) in InputHandler constructor; store `gamepadIndex`
- [x] 4.2 Add `pollGamepad()` method: read `navigator.getGamepads()[gamepadIndex]`, skip if null or `mapping !== 'standard'`
- [x] 4.3 Add `prevButtonStates` array for rising-edge debounce (only process button on transition from not-pressed to pressed)
- [x] 4.4 Map D-pad buttons (12=UP, 13=DOWN, 14=LEFT, 15=RIGHT) to `queueDirection()` — check `inputGate` before queueing
- [x] 4.5 Map Cross (button 0) during PLAYING to `actionCallbacks.pause`; during menus to `document.activeElement.click()` (confirm)
- [x] 4.6 Map Circle (button 1) to `UIManager.navigateBack()` (same as Backspace)
- [x] 4.7 Map Options (button 9) to `actionCallbacks.pause`
- [x] 4.8 Map D-pad up/down during menus to `UIManager.navigateMenu('up'|'down')` — skip when state is PLAYING

## 5. Game Loop Integration
- [x] 5.1 Call `inputHandler.pollGamepad()` in `Game.loop()` before `tick()` (every frame, not just on tick)
- [x] 5.2 Pass game state and UIManager reference to InputHandler so pollGamepad knows context (PLAYING vs menu)

## 6. Testing
- [x] 6.1 Unit test: `pollGamepad()` maps D-pad buttons to correct directions via queueDirection
- [x] 6.2 Unit test: rising-edge debounce — held button only fires once
- [x] 6.3 Unit test: Cross button calls pause during PLAYING, click during menus
- [x] 6.4 Unit test: Circle button calls navigateBack()
- [x] 6.5 Unit test: input method setting persistence via StorageManager
- [x] 6.6 Unit test: navigateMenu() cycles focus with wrap-around and plays audio
- [x] 6.7 Unit test: navigateBack() triggers correct action per data-ui/state
- [ ] 6.8 Manual test: D-pad on mobile (centered below canvas)
- [ ] 6.9 Manual test: PlayStation DualSense controller via Bluetooth
- [ ] 6.10 Manual test: input method switching in settings
