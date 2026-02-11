## 1. Pager Component HTML + CSS

- [x] 1.1 Replace `.leaderboard-mode-tabs` markup in index.html with pager component: `.leaderboard-pager` container with prev/next arrow buttons (`data-action="leaderboard-prev"` / `data-action="leaderboard-next"`), mode title span (`.leaderboard-pager__title`), and dot indicators (`.leaderboard-pager__dots`)
- [x] 1.2 Remove `.leaderboard-mode-tabs` and `.leaderboard-tab` CSS rules from styles.css
- [x] 1.3 Add `.leaderboard-pager` CSS: flexbox row layout, arrow button styles, title centering, dot indicator styles (small circles, active dot highlighted with accent color)
- [x] 1.4 Add pager accessibility attributes: `aria-label` on container, `aria-current="page"` on active dot

## 2. UIManager: _cycleLeaderboardMode

- [x] 2.1 Add `LEADERBOARD_MODES` ordered array constant: `[GameMode.CLASSIC, GameMode.TIME_ATTACK, GameMode.MAZE]`
- [x] 2.2 Add `_cycleLeaderboardMode(delta)` method to UIManager: compute next mode from `_leaderboardMode` with wrapping, call `showLeaderboard(nextMode)`. Audio is NOT played here — callers (`navigateMenu`, `handleOverlayClick`) play navigate audio to avoid double-play risk
- [x] 2.3 Update `showLeaderboard()` to render pager state: set mode title text, update dot `aria-current` attributes, instead of updating tab `aria-selected`
- [x] 2.4 Remove `leaderboard-tab` click handler from `handleOverlayClick`
- [x] 2.5 Add pager arrow button click handlers in `handleOverlayClick`: `leaderboard-prev` calls `_cycleLeaderboardMode(-1)`, `leaderboard-next` calls `_cycleLeaderboardMode(1)`

## 3. Keyboard + Gamepad Integration

- [x] 3.1 Update `navigateMenu('left'/'right')` in UIManager: check container `data-ui` for `'leaderboard'` and call `_cycleLeaderboardMode` before segmented cycling fallback. This covers both keyboard (via `_handleMenuKeyDown` → `navigateMenu`) and gamepad (via InputHandler → `navigateMenu`) paths without modifying `_handleMenuKeyDown` directly

## 4. Tests

- [x] 4.1 Write tests for `_cycleLeaderboardMode`: forward cycling, backward cycling, wrapping at boundaries, audio feedback
- [x] 4.2 Write tests for keyboard integration: ArrowLeft/Right cycles leaderboard mode when leaderboard is open
- [x] 4.3 Write tests for gamepad integration: D-pad Left/Right calls navigateMenu left/right which cycles leaderboard mode
- [x] 4.4 Write tests for pager arrow click handlers in `handleOverlayClick`
- [x] 4.5 Run full test suite and verify no regressions

## 5. Cleanup + Verification

- [x] 5.1 Verify no remaining references to `.leaderboard-tab` or `.leaderboard-mode-tabs` in game.js, index.html, or styles.css
- [ ] 5.2 Manual browser test: open leaderboard, cycle modes with arrow keys, verify pager title and dots update, verify scores change per mode
