## Context

The game currently has two input sources: keyboard (arrows + WASD) via `handleKeyDown`, and touch swipe via `handleTouchStart`/`handleTouchEnd` — both in `InputHandler`. All direction inputs feed through `queueDirection()`, which enforces reversal prevention and queue-size limits.

Menu navigation is handled separately by `UIManager._handleMenuKeyDown()`, which uses `_getNavigableButtons()` to cycle focus with arrow keys, and Backspace/Delete for back-navigation. Audio feedback (`playNavigate`, `playBack`, `playConfirm`) is played on all menu interactions.

Settings has four groups: Difficulty, Sound, Accessibility, Theme. There is no mobile input method control.

The game loop runs at 60fps via `requestAnimationFrame`, with fixed-timestep ticks. The Gamepad API requires polling (no events for button presses), so gamepad state must be read each frame.

## Goals / Non-Goals

**Goals:**
- Add virtual D-pad and tap-zone input for mobile (alternatives to swipe)
- Add gamepad support using the standard Gamepad API (PS4/PS5/Xbox/generic)
- Gamepad works for both gameplay (D-pad directions) and menu navigation (D-pad focus cycling, Cross confirm, Circle back)
- All new input sources reuse existing `queueDirection()` pipeline and `_handleMenuKeyDown` action patterns
- Audio feedback for gamepad menu interactions (same sounds as keyboard nav)
- Mobile input method selection persisted in settings

**Non-Goals:**
- Analog stick input (D-pad only — analog sticks have dead-zone complexity not worth adding for a grid-based game)
- Haptic/rumble feedback via DualSense (requires non-standard API, limited browser support)
- Gamepad button remapping UI
- Multi-gamepad support (single gamepad, index 0)

## Decisions

### Decision 1: Gamepad polling location

**Choice:** Poll in `Game.loop()` before `tick()`, delegate to `InputHandler.pollGamepad()`.

**Rationale:** The game loop already runs every frame. Polling before `tick()` ensures directions are queued before the tick processes them. Keeping the polling logic in `InputHandler` maintains the single-responsibility pattern where all input sources live in one class.

**Alternative considered:** Separate `setInterval` for gamepad — rejected because it would drift out of sync with the game loop and add unnecessary timer management.

### Decision 2: Gamepad menu navigation integration

**Choice:** Gamepad D-pad and face buttons trigger the same code paths as keyboard arrow keys and Backspace.

**Implementation:** `InputHandler.pollGamepad()` detects button presses (rising-edge only) and:
- During PLAYING: D-pad calls `queueDirection()`, Cross/Options calls `actionCallbacks.pause`
- During menus: D-pad calls `UIManager.navigateMenu(direction)` (new public method extracting the arrow-key logic from `_handleMenuKeyDown`), Cross calls `.click()` on `document.activeElement`, Circle calls `UIManager.navigateBack()` (new public method extracting the Backspace logic)

**Rationale:** Extracting `navigateMenu()` and `navigateBack()` from `_handleMenuKeyDown` avoids duplicating menu navigation logic. Both keyboard and gamepad call the same methods. Audio feedback comes for free since it's inside those methods.

**Alternative considered:** Dispatching synthetic KeyboardEvents — rejected because it's fragile (depends on event propagation) and harder to test.

### Decision 3: Mobile input method as segmented selector

**Choice:** Add a "Controls" setting group (visible only on coarse-pointer devices) with a 3-option segmented selector: Swipe (default) / D-Pad / Tap Zones.

**Rationale:** Matches the existing Difficulty segmented selector pattern. Segmented selectors are already styled and accessible (role="radiogroup"). Hiding the entire group on desktop avoids confusion since these controls are touch-only.

**StorageManager key:** `mobileInput` with values `'swipe'` | `'dpad'` | `'tapzone'`, default `'swipe'`.

### Decision 4: D-pad rendering approach

**Choice:** HTML overlay buttons positioned absolute over the canvas, styled with glassmorphism variables.

**Rationale:** HTML buttons get free accessibility (focusable, labelled) and are easier to style than canvas-drawn controls. Absolute positioning over the game container keeps them visually integrated without affecting canvas rendering.

**Layout:** Four directional buttons in a cross pattern, bottom-left of the game container. Touch targets are 48px minimum (WCAG). Semi-transparent using `--ui-glass-bg`.

### Decision 5: Tap-zone detection

**Choice:** Reuse existing `handleTouchEnd` with a mode check. When tap-zone mode is active and swipe distance is below `minSwipeDistance`, treat it as a tap and map the touch position relative to canvas center to a direction (dominant axis wins).

**Rationale:** Tap zones and swipe use the same touch events. The distinction is: swipe requires minimum distance, tap zones trigger on short/zero-distance touches. Combining them in the same handler avoids duplicate event listeners.

### Decision 6: Gamepad button debouncing

**Choice:** Track a `prevButtonStates` array in `InputHandler`. On each poll, only process buttons that transition from not-pressed to pressed (rising edge).

**Rationale:** The Gamepad API reports instantaneous state — a held button reads as `pressed: true` every frame. Without debouncing, a single button press would fire 60+ times per second. Rising-edge detection is the standard pattern for gamepad input.

### Decision 7: `inputGate` for gamepad

**Choice:** Check `this.inputGate` at the start of `pollGamepad()` for direction inputs, but always allow menu-navigation inputs (Cross, Circle, D-pad in menus).

**Rationale:** The existing `inputGate` blocks direction input when modals are open (settings, leaderboard). Gamepad direction polling must respect this. However, menu navigation buttons (confirm, back) should still work when modals are open — same as how keyboard Backspace works in `_handleMenuKeyDown` which runs outside the gate.

## Risks / Trade-offs

**[R1] Gamepad API browser support varies** → All modern browsers support the basic API. The `mapping: "standard"` check ensures consistent button indices. Non-standard gamepads are ignored (no `mapping` fallback). User confirmed DualSense reports `standard` on Safari.

**[R2] D-pad touch events may conflict with canvas swipe** → D-pad buttons call `stopPropagation()` and `preventDefault()` to prevent touch events from reaching the canvas swipe handler. Task 1.5 explicitly covers this.

**[R3] Gamepad polling adds per-frame cost** → `navigator.getGamepads()` is lightweight (no allocation in modern engines). The rising-edge check is O(n) over ~17 buttons, negligible at 60fps.

**[R4] Settings group ordering on mobile** → The "Controls" group appears between Sound and Accessibility, keeping Difficulty at top and Theme at bottom. If the order feels wrong, it's a one-line HTML move.
