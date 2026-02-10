## 1. SCREEN_NAV Registry

- [x] 1.1 Define `SCREEN_NAV` constant object near top of game.js (after existing constants like `MODE_RULES`), with entries for: `mode-select`, `settings`, `leaderboard`, `shortcuts`, `initials`, `PAUSED`, `GAMEOVER` — each declaring `back` (method name string), `focusEntry` (CSS selector or null), optional `grid` (cols + selector), optional `ownKeyHandler` (boolean)
- [x] 1.2 Add tests: verify SCREEN_NAV has all expected keys, each entry has `back` and `focusEntry` properties, `mode-select` entry has `grid`, `initials` entry has `ownKeyHandler: true`

## 2. Unified Back Dispatch

- [x] 2.1 Rewrite `UIManager.navigateBack()` (~line 2303) to look up `SCREEN_NAV[dataUi]` or `SCREEN_NAV[gameState]` and call `this[entry.back]()` with audio feedback, instead of the current switch/case chain
- [x] 2.2 Remove the InputHandler escape callback in DOMContentLoaded (~line 3993-4016) and replace with a single call: `game.ui.navigateBack()`
- [x] 2.3 Update `InputHandler.handleKeyDown` Escape handler (~line 1416-1419) to call `this.uiManager.navigateBack()` directly instead of going through `actionCallbacks.escape`
- [x] 2.4 Add tests: Escape on mode-select calls `hideModeSelect()`, Escape on settings calls `hideSettings()`, Escape on leaderboard calls `hideLeaderboard()`, Escape on shortcuts calls `hideShortcuts()`, Escape on PAUSED resumes game, Escape on GAMEOVER returns to menu
- [x] 2.5 Add tests: navigateBack plays audio (playBack for modal dismiss, playConfirm for resume), navigateBack is no-op on unknown screen

## 3. Focus Recovery

- [x] 3.1 In `navigateMenu()` (~line 2193), before processing direction, check if any element within the current screen has focus. If not, look up `SCREEN_NAV[screen].focusEntry`, query for it, and focus it if visible (`offsetParent !== null`). Fall back to first navigable button if focusEntry is null or not visible.
- [x] 3.2 Add tests: navigateMenu with no focused element focuses the focusEntry element, navigateMenu with already-focused element proceeds normally, navigateMenu with null focusEntry falls back to first button, navigateMenu with hidden focusEntry falls back to first button

## 4. Grid Navigation Consolidation

- [x] 4.1 Update `navigateMenu()` to check `SCREEN_NAV[screen].grid` instead of hardcoding `dataUi === 'mode-select'`. When grid is declared, delegate to grid navigator and always return (no fallthrough).
- [x] 4.2 Generalize `_navigateModeCardGrid()` (~line 2235) to accept grid config from registry (`cols`, `selector`) instead of hardcoding `.mode-card-grid`, `.mode-card`, and `cols = 2`. Rename to `_navigateGrid(direction, gridConfig)`.
- [x] 4.3 Add tests: grid navigation respects `cols` from registry, grid edge produces no-op, grid down-from-bottom moves to first element below grid

## 5. Initials Modal Standardization

- [x] 5.1 Update `showInitials()` (~line 2770) to call `_trapFocus('.screen-initials')` for focus management
- [x] 5.2 Update `hideInitials()` to call `_releaseFocus()` instead of hardcoded `document.getElementById('gameover-restart').focus()`
- [x] 5.3 Verify initials modal's own keydown handler still works (Escape → hideInitials, arrows → cycle/move, Enter → submit) after adding focus trap
- [x] 5.4 Add tests: hideInitials calls _releaseFocus(), showInitials calls _trapFocus(), initials Escape routes through navigateBack → hideInitials

## 6. Cleanup

- [x] 6.1 Remove `onAction('escape', ...)` callback registration pattern from InputHandler if no other actions use it; otherwise remove just the escape callback
- [x] 6.2 Remove any dead code: old switch/case branches in navigateBack that are now handled by registry lookup, removed escape callback function
- [x] 6.3 Run full test suite (`node --test game.test.js`), fix any regressions

## 7. Integration Testing

- [x] 7.1 Browser test: Escape key works on every screen (mode-select, settings, leaderboard, shortcuts, PAUSED, GAMEOVER)
- [x] 7.2 Browser test: Backspace works on every screen (same as Escape)
- [x] 7.3 Browser test: Gamepad Circle works on every screen (same as Escape)
- [x] 7.4 Browser test: Mouse click Play → arrow keys navigate mode cards immediately (focus recovery)
- [x] 7.5 Browser test: Mouse click Settings → arrow keys navigate settings controls immediately (focus recovery)
- [x] 7.6 Browser test: Initials modal submit → focus returns to game over screen correctly
- [x] 7.7 Browser test: Escape on PAUSED resumes game (not quit to menu)
- [x] 7.8 Browser test: Audio feedback plays consistently across Escape, Backspace, and Circle
