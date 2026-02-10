## Why

The base gamepad support (add-extended-input) maps buttons and D-pad through the standard Gamepad API, but doesn't leverage the DualSense controller's advanced hardware — haptic motors, adaptive triggers, light bar, player LEDs, gyroscope, accelerometer, and touchpad surface. These features can transform a flat button-press experience into an immersive one: feeling the snake eat, seeing the controller glow with the game theme, tilting to steer, and pressing through increasing trigger resistance as the snake grows. Progressive enhancement ensures the game stays fully functional on browsers without these APIs.

## What Changes

- **Haptic feedback layer** — dual-rumble vibration synced to game events (food eaten, death, wall proximity, game tempo). Uses standard Gamepad API `vibrationActuator` (Safari 16.4+, Chrome, Edge).
- **WebHID integration layer** — opt-in connection to DualSense via WebHID for advanced features (Chrome/Edge desktop only). Requires user permission prompt. Falls back gracefully when unavailable.
- **Light bar control** — RGB color synced to active theme, flashes on food/death events, gradient from green → red as grid fills.
- **Player LED indicators** — 5 LEDs below the touchpad show difficulty level or food-eaten progress.
- **Adaptive trigger effects** — L2/R2 resistance that increases as snake grows; R2 as speed boost (press through resistance for temporary acceleration), L2 as slow-mo brake (temporary deceleration, costs points or has cooldown).
- **Analog stick input** — left stick as alternative directional input with configurable deadzone.
- **Gyroscope steering** — tilt-to-steer mode as an alternative input method (WebHID only).
- **Touchpad input** — swipe the DualSense touchpad for direction; tap to pause (button 17 via standard Gamepad API, X/Y via WebHID).
- **Battery indicator** — HUD icon showing controller battery level when gamepad connected (WebHID only).
- **Immersive mode toggle** — single setting that enables all available DualSense feedback (haptics + light bar + LEDs + adaptive triggers). Respects API availability per browser.
- **DualSense settings group** — new settings section (visible when gamepad connected) for configuring haptic intensity, enabling/disabling individual features, immersive mode toggle.

### Design Requirements

- Settings UI for DualSense features should follow existing glassmorphism style
- Battery indicator should be minimal and unobtrusive — small icon in HUD corner
- WebHID permission prompt should be triggered by an explicit user action (e.g., "Connect DualSense" button), not automatically
- Light bar colors must come from the theme system's existing palette, not hardcoded values
- No neon/rainbow effects — haptic and visual feedback should feel refined, not gimmicky

## Capabilities

### New Capabilities
- `dualsense-haptics`: Haptic feedback via vibrationActuator (dual-rumble) synced to game events — food, death, proximity, tempo
- `dualsense-webhid`: WebHID integration layer for advanced DualSense features — connection management, permission flow, feature detection, fallback handling
- `dualsense-lightbar`: Light bar RGB control — theme sync, event flashes, danger gradient
- `dualsense-leds`: Player LED indicators — difficulty level, food progress
- `dualsense-triggers`: Adaptive trigger effects — resistance scaling with snake length, R2 speed boost, L2 slow-mo
- `dualsense-motion`: Gyroscope tilt-to-steer and touchpad swipe/tap input methods
- `dualsense-hud`: Battery level HUD indicator and DualSense settings group

### Modified Capabilities
- `input-handling`: Adding analog stick as directional input method, touchpad button (17) for pause, and gyroscope/touchpad as alternative input methods. Existing gamepad polling loop gains hooks for haptic and adaptive trigger updates.

## Impact

- **game.js** — New `DualSenseManager` class (or extension of InputHandler) for WebHID communication; haptic feedback calls wired into Game events (eat, die, tick); analog stick + gyroscope + touchpad direction mapping in InputHandler; adaptive trigger updates in game loop; battery polling
- **game.js AudioManager** — No changes (haptics complement audio, don't replace it)
- **game.js Renderer** — Battery icon rendering in HUD
- **index.html** — DualSense settings group markup, "Connect DualSense" button, battery indicator element
- **styles.css** — DualSense settings styles, battery indicator styles, connect button styles
- **game.test.js** — Tests for haptic triggers, WebHID mock, analog stick deadzone, gyroscope mapping, adaptive trigger scaling, battery display, feature fallback paths
- **Browser compatibility** — vibrationActuator: Chrome, Edge, Safari 16.4+ desktop. WebHID: Chrome, Edge, Opera desktop only. All features degrade gracefully.
- **No new dependencies** — WebHID and Gamepad API are native browser APIs
