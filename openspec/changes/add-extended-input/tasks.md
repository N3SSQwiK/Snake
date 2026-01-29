# Tasks: Add Extended Input Methods

## 1. On-Screen Virtual D-Pad
- [ ] 1.1 Add D-pad HTML markup (4 directional buttons) inside game-container
- [ ] 1.2 Style D-pad: glassmorphism, absolute bottom-left, semi-transparent
- [ ] 1.3 Show D-pad only on pointer:coarse during PLAYING when D-pad mode selected
- [ ] 1.4 Wire D-pad button touches to InputHandler.queueDirection()
- [ ] 1.5 Prevent D-pad touches from triggering swipe handler

## 2. Tap Zones
- [ ] 2.1 Implement tap-zone detection (divide canvas into 4 quadrants)
- [ ] 2.2 Map tap quadrant to direction (top=UP, bottom=DOWN, left=LEFT, right=RIGHT)
- [ ] 2.3 Wire tap zones to InputHandler.queueDirection()
- [ ] 2.4 Tap zones active only when tap-zone mode selected

## 3. Input Method Setting
- [ ] 3.1 Add input method setting to StorageManager (default: 'swipe')
- [ ] 3.2 Add input method selector to settings screen (swipe / d-pad / tap-zone)
- [ ] 3.3 InputHandler switches behavior based on active method
- [ ] 3.4 Setting persists across sessions

## 4. Gamepad Support
- [ ] 4.1 Add gamepad connection detection (gamepadconnected / gamepaddisconnected events)
- [ ] 4.2 Poll gamepad state each tick via navigator.getGamepads()
- [ ] 4.3 Map D-pad buttons (12=UP, 13=DOWN, 14=LEFT, 15=RIGHT) to directions
- [ ] 4.4 Map Cross (button 0) to confirm/pause action callback
- [ ] 4.5 Map Circle (button 1) to back/cancel action callback
- [ ] 4.6 Map Options (button 9) to pause action callback
- [ ] 4.7 Debounce gamepad button presses (prevent held-button repeat)
- [ ] 4.8 Handle gamepad in menus: D-pad navigates, Cross confirms, Circle goes back

## 5. Integration
- [ ] 5.1 Ensure all new input methods feed through existing queueDirection() pipeline
- [ ] 5.2 Reversal prevention applies equally to all input sources
- [ ] 5.3 Action callbacks (pause, escape) work from gamepad buttons

## 6. Testing
- [ ] 6.1 Unit test: gamepad polling maps buttons to correct directions
- [ ] 6.2 Unit test: tap zone quadrant detection
- [ ] 6.3 Unit test: input method setting persistence
- [ ] 6.4 Manual test: D-pad on mobile (Chrome DevTools touch emulation)
- [ ] 6.5 Manual test: tap zones on mobile
- [ ] 6.6 Manual test: PlayStation controller via Bluetooth
- [ ] 6.7 Manual test: input method switching in settings
