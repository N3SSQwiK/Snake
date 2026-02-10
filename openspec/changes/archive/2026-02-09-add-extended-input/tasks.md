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
- [x] 3.4 Extract `_cycleInitialsChar(delta)` and `_moveInitialsSlot(delta)` from `_handleInitialsKey` for shared keyboard/gamepad use

## 4. Gamepad Support
- [x] 4.1 Add gamepad connection detection (gamepadconnected / gamepaddisconnected events) in InputHandler constructor; store `gamepadIndex`
- [x] 4.2 Add `pollGamepad()` method: read `navigator.getGamepads()[gamepadIndex]`, skip if null or `mapping !== 'standard'`
- [x] 4.3 Add `prevButtonStates` array for rising-edge debounce (only process button on transition from not-pressed to pressed)
- [x] 4.4 Map D-pad buttons (12=UP, 13=DOWN, 14=LEFT, 15=RIGHT) to `queueDirection()` — check `inputGate` before queueing
- [x] 4.5 Map Cross (button 0) during PLAYING to `actionCallbacks.pause`; during menus to `document.activeElement.click()` (confirm)
- [x] 4.6 Map Circle (button 1) to `UIManager.navigateBack()` (same as Backspace)
- [x] 4.7 Map Options (button 9) to `actionCallbacks.pause`
- [x] 4.8 Map D-pad up/down during menus to `UIManager.navigateMenu('up'|'down')` — skip when state is PLAYING

## 5. Gamepad Initials Entry
- [x] 5.1 Route gamepad input to initials handlers when `data-ui === 'initials'`
- [x] 5.2 D-pad down cycles letter ascending (A→B→C), D-pad up cycles descending (Z→Y→X)
- [x] 5.3 D-pad left/right moves between slots (single-fire)
- [x] 5.4 Hold-to-repeat for D-pad up/down (~300ms delay, ~80ms repeat rate via frame counting)
- [x] 5.5 Cross submits initials, Circle cancels
- [x] 5.6 After initials close, auto-focus first GAMEOVER button

## 6. Game Loop Integration
- [x] 6.1 Call `inputHandler.pollGamepad()` in `Game.loop()` before `tick()` (every frame, not just on tick)
- [x] 6.2 Pass game state and UIManager reference to InputHandler so pollGamepad knows context (PLAYING vs menu)

## 7. Testing
- [x] 7.1 Unit test: `pollGamepad()` maps D-pad buttons to correct directions via queueDirection
- [x] 7.2 Unit test: rising-edge debounce — held button only fires once
- [x] 7.3 Unit test: Cross button calls pause during PLAYING, click during menus
- [x] 7.4 Unit test: Circle button calls navigateBack()
- [x] 7.5 Unit test: input method setting persistence via StorageManager
- [x] 7.6 Unit test: navigateMenu() cycles focus with wrap-around and plays audio
- [x] 7.7 Unit test: navigateBack() triggers correct action per data-ui/state
- [x] 7.8 Manual test: D-pad on mobile (centered below canvas)
- [x] 7.9 Manual test: PlayStation DualSense controller via Bluetooth
- [x] 7.10 Manual test: input method switching in settings
