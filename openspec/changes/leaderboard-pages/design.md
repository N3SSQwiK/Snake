## Context

The leaderboard modal currently uses a horizontal tab row (`leaderboard-mode-tabs`) with three tab buttons (Classic, Time Attack, Maze) to filter scores by game mode. This works for mouse/touch but creates an awkward interaction pattern for keyboard and gamepad users: ArrowLeft/Right is already wired to cycle segmented controls (mode selector, difficulty), so pressing left/right while a tab is focused should cycle tabs — but tabs use a different DOM structure (`role="tablist"`) than segmented controls (`role="radiogroup"`), requiring separate handling.

The `_cycleSegmented` helper (added in task 7.4) provides a generic cycling mechanism for `role="radiogroup"` controls. Rather than adding a parallel cycling mechanism for tabs, we can replace tabs with a pager component that has a simpler, more consistent interaction model: one page visible at a time, cycled with prev/next arrows or keyboard/gamepad left/right.

## Goals / Non-Goals

**Goals:**
- Replace tab row with a pager header (prev arrow, mode title, next arrow, page dots)
- Cycle leaderboard modes with ArrowLeft/Right keyboard keys when leaderboard is open
- Cycle leaderboard modes with D-pad Left/Right gamepad buttons when leaderboard is open
- Maintain existing behavior: default to current game mode (Classic if Zen), update leaderboard content on mode change
- Play audio feedback on page cycling (playNavigate for cycling, playConfirm reused from tab clicks)

**Non-Goals:**
- Swipe gesture support for leaderboard page cycling (touch users use prev/next buttons)
- Animated page transitions (content swaps instantly, matching current tab behavior)
- Changing leaderboard data structure or storage format

## Decisions

**Pager component structure**: A `div.leaderboard-pager` containing a left arrow button, a mode title span, a right arrow button, and a dot indicator row. Arrow buttons use `data-action="leaderboard-prev"` / `data-action="leaderboard-next"` for click handling in `handleOverlayClick`. The mode title shows the human-readable name (e.g., "Time Attack").

**`_cycleLeaderboardMode(delta)` method**: Added to UIManager. Computes the next mode from an ordered array `[GameMode.CLASSIC, GameMode.TIME_ATTACK, GameMode.MAZE]` with wrapping. Calls `showLeaderboard(nextMode)` which already handles content update, then plays navigate audio.

**Keyboard integration**: In `_handleMenuKeyDown`, before the segmented control block, check if `dataUi === 'leaderboard'` and call `_cycleLeaderboardMode` with appropriate delta. This takes priority over segmented cycling since there are no segmented controls inside the leaderboard modal.

**Gamepad integration**: Already handled — `navigateMenu('left'/'right')` is called by D-pad Left/Right. Extend the left/right branch in `navigateMenu` to check `dataUi === 'leaderboard'` and call `_cycleLeaderboardMode` before falling through to segmented cycling.

**Dot indicators**: One dot per leaderboard-eligible mode (3 dots), active dot highlighted. Updated inside `showLeaderboard()` alongside the mode title.

**Accessibility**: Pager uses `aria-label` on the container, `aria-current="page"` on the active dot, and `aria-live="polite"` on the leaderboard body (already present) to announce content changes.

## Risks / Trade-offs

**Tab keyboard pattern is more standard**: `role="tablist"` with arrow key navigation is a well-known ARIA pattern. The pager replaces this with a simpler but less conventional approach. Mitigated by clear arrow buttons and dot indicators that communicate the pagination metaphor.

**Three-mode limit**: The pager works well for 3 modes but may feel odd if modes are added later. Acceptable since adding modes is a separate change and 3-5 items is ideal for a pager.
