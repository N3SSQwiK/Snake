## Why

Navigation logic is fragmented across four separate systems — the `InputHandler` escape callback, `UIManager._handleMenuKeyDown`, `UIManager.navigateMenu`, and per-screen dedicated handlers — each handling overlapping responsibilities with different screen coverage. Every new screen (most recently mode-select) requires patching all four locations, and something always gets missed. The Escape key doesn't work on the mode-select screen, mouse-to-keyboard/gamepad transitions have no visual feedback guarantees, and there's no single source of truth for what "back" means on each screen.

## What Changes

- **Consolidate back/dismiss handling**: Replace the two parallel escape/back systems (InputHandler escape callback + UIManager.navigateBack) with a single dispatch through `navigateBack()` so every screen only needs to be registered once
- **Add mode-select to escape handler**: Immediate fix for the missing `mode-select` case in the escape callback (lines 3992-4015)
- **Define per-screen navigation contracts**: Each screen declares its navigable elements, focus entry point, back action, and grid layout (if any) — eliminating ad-hoc special cases scattered across handlers
- **Improve focus recovery on input mode switch**: When the first keyboard/D-pad input arrives and no element is focused, ensure a visible, correct element receives focus on every screen (including left/right on mode-select grid)
- **Standardize initials modal focus restoration**: Align initials modal close behavior with other modals by using `_releaseFocus()` instead of hardcoded gameover button focus

## Capabilities

### New Capabilities
- `screen-navigation`: Per-screen navigation contracts — focus entry, navigable element resolution, back/dismiss actions, and 2D grid layout support. Centralizes the rules that are currently spread across escape callbacks, `_handleMenuKeyDown`, `navigateMenu`, and `_getNavigableButtons`.

### Modified Capabilities
- `input-handling`: Escape key must route through UIManager.navigateBack() instead of a separate callback with its own screen registry. Gamepad Circle already does this — keyboard Escape should match.
- `ui-screens`: Add mode-select screen to the screen lifecycle (open/close/back), and update the "Start game" scenario to reflect the new two-step flow (Play → mode-select → Start Game). Standardize focus restoration for initials modal.

## Impact

- **game.js**: UIManager (navigateBack, navigateMenu, _handleMenuKeyDown, _getNavigableButtons, screen show/hide methods), InputHandler (escape action callback), DOMContentLoaded init block (escape registration)
- **game.test.js**: New tests for consolidated navigation, update existing UIManager navigation tests
- **No HTML/CSS changes** — this is purely behavioral
- **No breaking changes to user-facing behavior** — all existing navigation continues to work; gaps get filled
