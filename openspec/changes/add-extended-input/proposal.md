# Change: Add Extended Input Methods

## Why
The game currently supports keyboard (arrows + WASD) and touch swipe. Mobile players need more precise control options (on-screen D-pad), and console controller users need gamepad support — specifically PlayStation controllers connected via Bluetooth or USB-C using the standard Gamepad API.

## What Changes
- On-screen virtual D-pad for mobile:
  - Four directional buttons centered below the canvas
  - Glassmorphism styling, touch-friendly (48px+ targets)
  - Visible only on coarse-pointer devices during PLAYING state when D-pad mode selected
- Input method selection in settings:
  - Toggle between swipe and D-pad modes
  - Persisted via StorageManager
- Gamepad support (PlayStation D-pad + face buttons):
  - D-pad maps to snake directions during gameplay
  - D-pad navigates menus (up/down focus cycling via navigateMenu)
  - D-pad cycles letters and slots during initials entry (with hold-to-repeat for up/down)
  - Cross (X) = confirm/select in menus, pause during gameplay, submit initials
  - Circle (O) = back/cancel in menus, cancel initials entry
  - Options button = pause toggle
  - Uses standard Gamepad API (navigator.getGamepads)
  - Polls gamepad state every frame (not just on tick)
  - Works with any standard-mapping gamepad (PS4, PS5, generic)
- UIManager refactor:
  - Extracted navigateMenu(direction) and navigateBack() as public methods
  - Extracted _cycleInitialsChar(delta) and _moveInitialsSlot(delta) for shared keyboard/gamepad use
  - Auto-focus first button on menu screen transitions
  - Post-initials focus on GAMEOVER buttons

## Design Requirements
- Virtual D-pad follows existing glassmorphism aesthetic
- D-pad uses `--ui-glass-bg` and `--ui-glass-border` variables
- Gamepad input integrates into existing `InputHandler.queueDirection()` pipeline
- All new input methods respect direction queue, reversal prevention, and action callback patterns

## Impact
- Affected specs: `input-handling` (modified — add gamepad, D-pad)
- Affected code: `game.js` (InputHandler class, UIManager class, Game loop, initialization), `index.html` (D-pad markup, settings), `styles.css` (D-pad styles, touch-only settings group)
- Depends on: `ui-screens` (settings screen exists for input method toggle)
