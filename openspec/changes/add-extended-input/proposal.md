# Change: Add Extended Input Methods

## Why
The game currently supports keyboard (arrows + WASD) and touch swipe. Mobile players need more precise control options (on-screen D-pad and tap zones), and console controller users need gamepad support — specifically PlayStation controllers connected via Bluetooth or USB-C using the standard Gamepad API.

## What Changes
- On-screen virtual D-pad for mobile:
  - Four directional buttons overlaid on touch screens
  - Positioned bottom-left, semi-transparent, touch-friendly (44px+ targets)
  - Visible only on coarse-pointer devices during PLAYING state
- Tap zones for mobile:
  - Tap left/right/top/bottom quadrants of canvas to change direction
  - Alternative to swipe for players who prefer tap input
- Input method selection in settings:
  - Toggle between swipe, D-pad, and tap-zone modes
  - Persisted via StorageManager
- Gamepad support (PlayStation D-pad + face buttons):
  - D-pad maps to snake directions
  - Cross (X) = confirm/select in menus, pause during gameplay
  - Circle (O) = back/cancel in menus
  - Options button = pause toggle
  - Uses standard Gamepad API (navigator.getGamepads)
  - Polls gamepad state each tick (no events API)
  - Works with any standard-mapping gamepad (PS4, PS5, generic)

## Design Requirements
- Virtual D-pad and tap zones follow existing glassmorphism aesthetic
- D-pad uses `--ui-glass-bg` and `--ui-glass-border` variables
- Gamepad input integrates into existing `InputHandler.queueDirection()` pipeline
- All new input methods respect direction queue, reversal prevention, and action callback patterns

## Impact
- Affected specs: `input-handling` (modified — add gamepad, D-pad, tap zones)
- Affected code: `game.js` (InputHandler class, initialization), `index.html` (D-pad markup), `styles.css` (D-pad and tap zone styles)
- Depends on: `ui-screens` (settings screen exists for input method toggle)
