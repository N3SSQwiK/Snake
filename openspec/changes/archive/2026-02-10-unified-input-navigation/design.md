## Context

Navigation logic is spread across four systems with overlapping responsibilities:

1. **InputHandler escape callback** (DOMContentLoaded, ~line 3993): Handles keyboard Escape for settings, leaderboard, shortcuts, initials, PAUSED/GAMEOVER. Does NOT handle mode-select. No audio feedback.
2. **UIManager.navigateBack()** (~line 2303): Handles Backspace/gamepad Circle for shortcuts, mode-select, leaderboard, settings, PAUSED, GAMEOVER. Does NOT handle initials. Includes audio feedback.
3. **UIManager._handleMenuKeyDown()** (~line 2341): Handles arrow keys and Backspace/Delete. Does NOT handle Escape. Routes Backspace to `navigateBack()`.
4. **UIManager.navigateMenu()** (~line 2193): Handles Up/Down/Left/Right focus movement with mode-select grid special case.

Additionally, `_getNavigableButtons()` resolves focusable elements per screen via `_getVisibleScreen()`, which maps `data-ui` and `data-state` to screen selectors.

**Known bugs:**
- Keyboard Escape doesn't work on mode-select (missing from escape callback)
- Escape on PAUSED quits to menu, but Circle on PAUSED resumes (inconsistent)
- Keyboard Escape is silent; Circle has audio feedback
- Mouse→keyboard/gamepad transition has no focus recovery — clicking Play with mouse leaves no element focused for keyboard nav

## Goals / Non-Goals

**Goals:**
- Single back/dismiss dispatch: all input methods (Escape, Backspace, Circle) route through one function with consistent behavior and audio
- Per-screen navigation contracts: each screen declares focus entry, navigable elements, back action, and optional grid layout — eliminating scattered special cases
- Focus recovery on input mode switch: first keyboard/D-pad input on any screen auto-focuses the correct element
- Initials modal uses standard `_releaseFocus()` instead of hardcoded gameover button focus

**Non-Goals:**
- Changing any user-visible navigation behavior beyond fixing the documented bugs
- Adding new screens or modifying screen layouts
- Changing gamepad button mappings or touch input handling
- Refactoring InputHandler beyond escape callback routing

## Decisions

### 1. Screen registry object over switch/case chains

**Decision:** Define a `SCREEN_NAV` constant mapping screen identifiers to navigation contracts.

```js
const SCREEN_NAV = {
  'mode-select': { back: 'hideModeSelect', focusEntry: '.mode-card[aria-checked="true"]', grid: { cols: 2, selector: '.mode-card' } },
  'settings':    { back: 'hideSettings',    focusEntry: '.screen-settings .ui-panel__close' },
  'leaderboard': { back: 'hideLeaderboard', focusEntry: '.screen-leaderboard .ui-panel__close' },
  'shortcuts':   { back: 'hideShortcuts',   focusEntry: '.screen-shortcuts .ui-panel__close' },
  'initials':    { back: 'hideInitials',    focusEntry: null, ownKeyHandler: true },
};
```

State-based screens (PAUSED, GAMEOVER) also get entries keyed by state name.

**Why over alternatives:**
- Switch/case chains (current): Every new screen requires editing 3-4 functions. Easy to miss one.
- Registry: New screen = one entry. `navigateBack()` does `SCREEN_NAV[id].back`. `navigateMenu` checks `SCREEN_NAV[id].grid`. Focus recovery reads `SCREEN_NAV[id].focusEntry`.

### 2. Unified escape routing through navigateBack()

**Decision:** The InputHandler escape callback calls `this.uiManager.navigateBack()` instead of its own switch/case. Remove the parallel escape handler entirely.

**Why:** Gamepad Circle already routes through `navigateBack()`. Keyboard Escape and Backspace should take the same path. This eliminates the mode-select gap and the PAUSED behavior mismatch.

**PAUSED resolution:** `navigateBack()` currently resumes the game on PAUSED. The escape callback currently quits to menu. We'll keep the resume behavior (matches Circle) — quitting from pause is already available via the Quit button on the pause screen.

### 3. Focus recovery via navigateMenu entry point

**Decision:** When `navigateMenu()` is called and no element within the current screen has focus, auto-focus the screen's `focusEntry` element before processing the direction.

**Why over alternatives:**
- Global keyboard listener that focuses on any keypress: Too broad, would interfere with typing in initials
- Focus on screen open (tried, reverted): `element.focus()` after mouse click doesn't reliably produce `:focus-visible` state
- Recovery on first navigation input: Precisely scoped — only triggers when the user is actually trying to navigate, and the `focusEntry` from the registry ensures the correct element per screen

### 4. Keep initials modal's own key handler

**Decision:** The initials modal retains its custom keydown handler for arrow/letter/enter input. The `SCREEN_NAV` entry for `initials` sets `ownKeyHandler: true` so `navigateMenu` and `_handleMenuKeyDown` skip it. Back/dismiss still routes through `navigateBack()` → `hideInitials()`.

**Why:** Initials needs completely different arrow key behavior (cycle letters, not move focus). Forcing it through the generic system would add more complexity than the special case.

### 5. Standardize initials focus restoration

**Decision:** `hideInitials()` calls `_releaseFocus()` (which restores the previously focused element) instead of hardcoding `gameover-restart` button focus.

**Why:** Every other modal uses `_releaseFocus()`. The initials modal is the only exception. `_trapFocus` already stores the previously focused element, so restoration is automatic.

## Risks / Trade-offs

**[Registry adds indirection]** → Mitigated by keeping the registry as a simple constant object at the top of the file. The lookup is `O(1)` and the structure is self-documenting. Debugging is easier because all screen contracts are visible in one place.

**[PAUSED Escape behavior change]** → Currently Escape on PAUSED quits to menu. After this change, it resumes (matching Circle). Risk: users who muscle-memory Escape-to-quit. Mitigation: The pause screen has an explicit Quit/Menu button. This aligns keyboard and gamepad behavior.

**[Initials modal hybrid approach]** → The initials modal keeps its own key handler while other modals use the unified system. Risk: future modals might also need custom handlers, creating precedent for exceptions. Mitigation: The `ownKeyHandler` flag in the registry explicitly marks this, and the pattern is documented.

**[Focus recovery timing]** → `focusEntry` element might not be rendered/visible when recovery triggers during rapid screen transitions. Mitigation: Guard with `offsetParent !== null` check before focusing.
