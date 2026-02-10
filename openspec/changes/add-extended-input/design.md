## Context

The game currently has two input sources: keyboard (arrows + WASD) via `handleKeyDown`, and touch swipe via `handleTouchStart`/`handleTouchEnd` — both in `InputHandler`. All direction inputs feed through `queueDirection()`, which enforces reversal prevention and queue-size limits.

Menu navigation is handled separately by `UIManager._handleMenuKeyDown()`, which uses `_getNavigableButtons()` to cycle focus with arrow keys, and Backspace/Delete for back-navigation. Audio feedback (`playNavigate`, `playBack`, `playConfirm`) is played on all menu interactions.

Settings has four groups: Difficulty, Sound, Accessibility, Theme. There is no mobile input method control.

The game loop runs at 60fps via `requestAnimationFrame`, with fixed-timestep ticks. The Gamepad API requires polling (no events for button presses), so gamepad state must be read each frame.

## Goals / Non-Goals

**Goals:**
- Add virtual D-pad input for mobile (alternative to swipe)
- Add gamepad support using the standard Gamepad API (PS4/PS5/Xbox/generic)
- Gamepad works for gameplay (D-pad directions), menu navigation (D-pad focus cycling, Cross confirm, Circle back), and initials entry (D-pad cycles letters/slots, Cross submit, Circle cancel)
- All new input sources reuse existing `queueDirection()` pipeline and `_handleMenuKeyDown` action patterns
- Audio feedback for gamepad menu interactions (same sounds as keyboard nav)
- Mobile input method selection persisted in settings

**Non-Goals:**
- Analog stick input (D-pad only — analog sticks have dead-zone complexity not worth adding for a grid-based game)
- Haptic/rumble feedback via DualSense (separate change: add-dualsense-enhancements)
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
- During menus: D-pad calls `UIManager.navigateMenu(direction)` (public method extracted from `_handleMenuKeyDown`), Cross calls `.click()` on `document.activeElement`, Circle calls `UIManager.navigateBack()` (public method extracted from `_handleMenuKeyDown`)
- During initials entry: D-pad up/down calls `_cycleInitialsChar()`, D-pad left/right calls `_moveInitialsSlot()`, Cross calls `_submitInitials()`, Circle calls `hideInitials()`

**Rationale:** Extracting `navigateMenu()`, `navigateBack()`, `_cycleInitialsChar()`, and `_moveInitialsSlot()` from their respective keyboard handlers avoids duplicating logic. Both keyboard and gamepad call the same methods. Audio feedback comes for free since it's inside those methods.

**Alternative considered:** Dispatching synthetic KeyboardEvents — rejected because it's fragile (depends on event propagation) and harder to test.

### Decision 3: Mobile input method as segmented selector

**Choice:** Add a "Controls" setting group (visible only on coarse-pointer devices) with a 2-option segmented selector: Swipe (default) / D-Pad.

**Rationale:** Matches the existing Difficulty segmented selector pattern. Segmented selectors are already styled and accessible (role="radiogroup"). Hiding the entire group on desktop avoids confusion since these controls are touch-only.

**StorageManager key:** `mobileInput` with values `'swipe'` | `'dpad'`, default `'swipe'`.

### Decision 4: D-pad rendering approach

**Choice:** HTML buttons positioned below the canvas in normal document flow, centered, styled with glassmorphism variables.

**Rationale:** HTML buttons get free accessibility (focusable, labelled) and are easier to style than canvas-drawn controls. Placing below the canvas (instead of overlaying) keeps the game view unobstructed on mobile. Touch targets are 48px minimum (WCAG). Semi-transparent using `--ui-glass-bg`.

**Layout:** Four directional buttons in a cross pattern, centered below the canvas via `margin: 1rem auto 0`.

### Decision 5: Gamepad button debouncing

**Choice:** Track a `prevButtonStates` array in `InputHandler`. On each poll, only process buttons that transition from not-pressed to pressed (rising edge). Exception: during initials entry, D-pad up/down support hold-to-repeat via frame counting (~300ms initial delay, ~80ms repeat rate).

**Rationale:** The Gamepad API reports instantaneous state — a held button reads as `pressed: true` every frame. Without debouncing, a single button press would fire 60+ times per second. Rising-edge detection is the standard pattern for gamepad input. Hold-to-repeat for initials letter cycling is essential UX since there are 26 letters to scroll through.

### Decision 6: `inputGate` for gamepad

**Choice:** Check `this.inputGate` at the start of `pollGamepad()` for direction inputs, but always allow menu-navigation inputs (Cross, Circle, D-pad in menus).

**Rationale:** The existing `inputGate` blocks direction input when modals are open (settings, leaderboard). Gamepad direction polling must respect this. However, menu navigation buttons (confirm, back) should still work when modals are open — same as how keyboard Backspace works in `_handleMenuKeyDown` which runs outside the gate.

### Decision 7: Post-initials focus management

**Choice:** After `hideInitials()` removes the `data-ui` attribute, focus the first navigable button on the GAMEOVER screen via `requestAnimationFrame`.

**Rationale:** The auto-focus in `updateState(GAMEOVER)` fires before the initials modal opens (skipped because `data-ui` is set). When initials close, nothing re-triggers focus, leaving gamepad users stranded with no focused element. Explicitly focusing the first GAMEOVER button restores gamepad navigability.

## Risks / Trade-offs

**[R1] Gamepad API browser support varies** → All modern browsers support the basic API. The `mapping: "standard"` check ensures consistent button indices. Non-standard gamepads are ignored (no `mapping` fallback). User confirmed DualSense reports `standard` on Safari.

**[R2] D-pad touch events may conflict with canvas swipe** → D-pad buttons call `stopPropagation()` and `preventDefault()` to prevent touch events from reaching the canvas swipe handler. Task 1.5 explicitly covers this.

**[R3] Gamepad polling adds per-frame cost** → `navigator.getGamepads()` is lightweight (no allocation in modern engines). The rising-edge check is O(n) over ~17 buttons, negligible at 60fps.

**[R4] Settings group ordering on mobile** → The "Controls" group appears between Sound and Accessibility, keeping Difficulty at top and Theme at bottom. If the order feels wrong, it's a one-line HTML move.
