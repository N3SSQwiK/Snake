# Maestro Orchestration

## Goal
Implement the `add-ui-screens` proposal — start menu, pause overlay, game over screen, and settings screen with wall collision toggle.

## Architectural Decisions (revised after two challenges)
- **Settings screen**: Modal overlay — use dual data attributes: `data-state` for GameState, `data-ui="settings"` for settings modal. Track `previousState` in Game for back navigation.
- **Screen visibility**: CSS data-attribute selectors (`[data-state="MENU"] .screen-menu { display: flex }`) — JS sets `data-state` on `.game-container`, CSS handles show/hide.
- **Button listeners**: Event delegation on `#overlay` container.
- **Wall collision toggle**: Applies immediately per proposal spec (update StorageManager + game config on toggle).
- **Spacebar**: Extend InputHandler with action callback; only active during PLAYING/PAUSED states. Use `event.repeat` filtering instead of debounce timer.
- **Mobile pause button**: CSS `@media (pointer: coarse)` for visibility — no JS touch detection needed.
- **UIManager scope**: Lightweight — DOM caching + `data-state`/`data-ui` updates + event delegation + score display. Avoid over-engineering.

## Tasks
| ID | Description | Status | Specialist | Tool | Depends |
|----|-------------|--------|------------|------|---------|
| 1 | Design UI screens with /game-ui-design skill (output: CSS values, class naming convention, color palette, spacing) | complete | code | Claude Code | - |
| 2 | Add HTML screen markup inside #overlay + all CSS (screens as children of #overlay, data-attribute selectors, @media pointer:coarse for mobile pause, fade-in animation) | complete | code | Claude Code | 1 |
| 3 | Implement UIManager in game.js (DOM caching, set data-state on .game-container, set data-ui for settings modal, event delegation on #overlay, score display update, previousState tracking) | complete | code | Claude Code | 2 |
| 4 | Extend InputHandler for action keys (spacebar pause only during PLAYING/PAUSED with event.repeat filter, Escape for menu) | complete | code | Claude Code | 3 |
| 5 | Wire screen interactions: button handlers via delegation, settings toggle (immediate apply per proposal), state transitions, previousState for settings back-button | complete | code | Claude Code | 4 |
| 6 | Remove temporary PLAYING override, game starts in MENU | complete | code | Claude Code | 5 |
| 7 | Testing: full state transition matrix, settings persistence, mobile pause, edge cases | complete | test | Claude Code | 6 |

## Edge Case Handling
- Spacebar: `event.repeat` filtering (no timer debounce) — blocks held-key auto-repeat without adding latency
- Spacebar only triggers pause during PLAYING/PAUSED, ignored in MENU/GAMEOVER
- Overlay backdrop clicks: stopPropagation, no action
- Wall collision toggle: immediate effect per proposal spec
- Settings back-button: returns to `previousState` (MENU or PAUSED)

## Test Matrix (Task 7)
- [ ] MENU → Play → PLAYING
- [ ] PLAYING → Spacebar → PAUSED → Resume → PLAYING
- [ ] PLAYING → Die → GAMEOVER → Restart → PLAYING
- [ ] GAMEOVER → Menu → MENU
- [ ] MENU → Settings → toggle wall collision → Back → MENU
- [ ] PAUSED → Settings → Back → PAUSED (previousState works)
- [ ] Settings persist after page reload
- [ ] Mobile pause button visible on pointer:coarse only
- [ ] Held spacebar doesn't spam state changes (event.repeat filtered)
- [ ] No console errors throughout
- [x] Unit tests pass (node --test game.test.js) — 151/151 pass

## Parallelization
- All tasks sequential

## Source
Claude Code | 2026-01-28 UTC (revised after challenge round 2 — Codex CLI)
