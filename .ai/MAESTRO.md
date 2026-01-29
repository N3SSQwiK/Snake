# Maestro Orchestration

## Goal
Implement the `add-leaderboard` openspec proposal — top-10 local leaderboard with initials entry, leaderboard display, and high score celebration.

## Architectural Decisions (revised after challenge rounds 2, 3 & 4)
- **No new GameState**: Initials entry uses `data-ui="initials"` overlay (like settings), NOT a new GameState. Game state goes straight to GAMEOVER; initials overlay appears on top if score qualifies. This reuses `inputGate`, avoids render/tick changes, and keeps the state machine simple.
- **Leaderboard display**: Also `data-ui="leaderboard"` overlay. Accessible from menu and game over screen.
- **Overlay z-index stacking**: Initials and leaderboard overlays must sit above game-over screen. Place after `.screen-gameover` in DOM order and use `z-index: 2` (matching settings pattern). When initials overlay is active, game-over screen remains visible but visually behind.
- **Game over flow**: Centralize all collision paths into `Game.handleGameOver()`. Flow: collision → `handleGameOver()` → `setState(GAMEOVER)` → if `isHighScore()`, show `data-ui="initials"` overlay → on submit, save score, hide overlay (returns to game-over screen), refresh game-over with leaderboard position.
- **Initials input lives in UIManager/DOM**: NOT in InputHandler. Dedicated keydown listener attached when initials overlay opens, removed when it closes. InputHandler stays gameplay-only. Arrows cycle letters, letter keys type, Enter submits, ESC skips (discards score, returns to game-over screen).
- **ESC conflict resolution**: When `data-ui="initials"` is active, ESC triggers skip-initials (not return-to-menu). `hideInitials()` simply removes `data-ui` attribute, letting underlying GAMEOVER screen show. UIManager checks for active overlay before delegating ESC to InputHandler.
- **Celebration = new #1 only**: `isHighScore(score)` checks top-10 qualification. Separate `isNewTopScore(score)` checks if score beats current #1. Celebration CSS class (`.new-high-score`) only applies for #1. Celebration is strictly CSS-based (pulsing text, glowing border, keyframe animation) — no canvas particles.
- **Storage**: Single `snake_leaderboard` array of `{initials, score, timestamp}`. Sort score DESC, timestamp ASC (earliest wins ties). Limit 10.
- **Date format**: Store Unix timestamp, format on display using `Intl.DateTimeFormat` for locale-aware short dates (e.g., "Jan 29").
- **Initials**: Uppercase A-Z only, exactly 3 characters.
- **Existing tests**: Update GameState tests if needed; add leaderboard-specific tests.

## Tasks
| ID | Description | Status | Specialist | Tool | Depends |
|----|-------------|--------|------------|------|---------|
| 1 | Extend StorageManager: getLeaderboard(), addScore(initials, score), isHighScore(score), isNewTopScore(score), formatLeaderboardDate(timestamp) using Intl.DateTimeFormat. Sort score DESC/timestamp ASC. Limit 10. | complete | code | Claude Code | - |
| 2 | Centralize game-over: add Game.handleGameOver() called from all collision paths (wall/self). Sets GAMEOVER, then checks isHighScore() to show initials overlay. Re-entry guard. | complete | code | Claude Code | 1 |
| 3 | Design leaderboard UI screens via /game-ui-design skill (initials overlay, leaderboard table, game-over updates). Uses data schema from task 1. | complete | code | Claude Code | 1 |
| 4 | Add initials entry overlay HTML/CSS: arcade-style 3-char selector, data-ui="initials". Place after .screen-gameover in DOM, z-index: 2. Add CSS visibility rule. | complete | code | Claude Code | 3 |
| 5 | Add initials entry JS in UIManager: showInitials()/hideInitials(), dedicated keydown listener (arrows cycle, letters type, Enter submits, ESC skips → returns to game-over). ESC override prevents menu-return while overlay active. On submit, call addScore() and refresh game-over screen. | complete | code | Claude Code | 2, 4 |
| 6 | Add leaderboard display: HTML/CSS/JS for top-10 table (rank, initials, score, date), empty state message, back button. data-ui="leaderboard" overlay with z-index: 2. Wire UIManager showLeaderboard()/hideLeaderboard() and existing highscores placeholder + game-over "View Leaderboard" button. | complete | code | Claude Code | 1, 3 |
| 7 | Update game-over screen: score vs personal best comparison (#1 high score), conditional .new-high-score CSS-only celebration animation (pulsing text, glow — no canvas), "View Leaderboard" button, handle empty leaderboard case. | complete | code | Claude Code | 1, 2, 5, 6 |
| 8 | Write tests: StorageManager methods (add, sort, limit, ties, qualify, isNewTopScore, formatDate), handleGameOver flow, initials overlay show/hide, existing test compatibility. | complete | test | Claude Code | 1, 2, 5, 6, 7 |
| 9 | Review and integration verification: full flow, persistence across reload, no regressions, manual UI checklist. | complete | review | Claude Code | 8 |

## Edge Case Handling
- **Ties**: Sort by score DESC, then timestamp ASC (earliest entry ranks higher)
- **Empty leaderboard**: Display "No scores yet. Play to set the first record!"
- **localStorage disabled/full**: StorageManager catches errors silently; leaderboard shows empty state
- **Rapid game-over spam**: Guard in handleGameOver() — return if already in GAMEOVER
- **Initials abandonment**: ESC skips entry, score discarded, returns to game-over screen
- **First score**: Always qualifies (leaderboard has <10 entries)
- **Celebration vs qualification**: isNewTopScore() (beats #1) triggers celebration; isHighScore() (top 10) triggers initials entry
- **ESC during initials**: Handled by UIManager overlay — hideInitials() removes data-ui, game-over screen shows through
- **Keyboard on leaderboard overlay**: Back button + ESC to close
- **Overlay stacking**: Initials/leaderboard overlays use z-index: 2, placed after game-over in DOM

## Parallelization
- Task 1 first (defines data model)
- Tasks 2 and 3 can run in parallel after 1
- Tasks 4 and 6 can run in parallel after their deps
- Tasks 5, 7, 8, 9 are sequential

## Source
Claude Code | 2026-01-29 19:00 UTC (revised after challenge round 4 — Gemini CLI, Gemini 3 Pro Preview)
