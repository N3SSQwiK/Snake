## Why

The leaderboard mode filter currently uses horizontal tab buttons (Classic, Time Attack, Maze) that are difficult to navigate with gamepad D-pad left/right because tabs compete with segmented control cycling. Replacing tabs with a pager component (prev/next arrows + mode title + page dots) creates a clearer navigation model: one mode visible at a time, cycled with ArrowLeft/Right or D-pad Left/Right, consistent with how the mode selector on the start menu already works.

## What Changes

- Replace `leaderboard-mode-tabs` tab row with a pager header: left arrow, mode title, right arrow, and page indicator dots
- Add `_cycleLeaderboardMode(delta)` method to UIManager that cycles through leaderboard-eligible modes (Classic, Time Attack, Maze) with wrapping
- Wire keyboard ArrowLeft/ArrowRight when `data-ui === 'leaderboard'` to call `_cycleLeaderboardMode`
- Wire gamepad D-pad Left/Right when leaderboard is open to call `_cycleLeaderboardMode`
- Remove `leaderboard-tab` HTML, CSS, and click handler; replace with pager component click handlers
- Update `showLeaderboard()` to render the pager state (active mode title, dot indicators) instead of updating tab aria-selected

## Capabilities

### New Capabilities
- `leaderboard-pager`: Paginated mode navigation component for the leaderboard modal, replacing tab-based filtering with prev/next page cycling

### Modified Capabilities
- `leaderboard`: Leaderboard display requirement changes from tab-based mode filtering to page-based mode cycling
- `input-handling`: Gamepad menu navigation adds D-pad left/right for leaderboard page cycling; keyboard adds ArrowLeft/Right for leaderboard page cycling

## Impact

- **game.js**: UIManager (`showLeaderboard`, `handleOverlayClick`, `_handleMenuKeyDown`, `navigateMenu`), InputHandler (already wired via `navigateMenu('left'/'right')`)
- **index.html**: Replace `.leaderboard-mode-tabs` markup with pager component markup
- **styles.css**: Remove `.leaderboard-tab` styles, add pager component styles
- **game.test.js**: Update leaderboard display tests, add pager cycling tests
