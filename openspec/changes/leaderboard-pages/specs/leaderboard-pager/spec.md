## ADDED Requirements

### Requirement: Leaderboard Pager Component
The system SHALL display a pager header at the top of the leaderboard modal that allows cycling through leaderboard-eligible game modes (Classic, Time Attack, Maze) one at a time.

#### Scenario: Pager layout
- **WHEN** the leaderboard modal is displayed
- **THEN** a pager header is visible containing a left arrow button, a mode title, a right arrow button, and page indicator dots

#### Scenario: Mode title display
- **WHEN** the leaderboard is showing scores for a specific mode
- **THEN** the pager title displays the human-readable mode name (e.g., "Classic", "Time Attack", "Maze")

#### Scenario: Page indicator dots
- **WHEN** the leaderboard modal is displayed
- **THEN** three page indicator dots are shown, one per leaderboard-eligible mode, with the active mode's dot visually highlighted

#### Scenario: Next arrow click
- **GIVEN** the leaderboard is showing Classic mode
- **WHEN** the player clicks the next (right) arrow button
- **THEN** the leaderboard switches to Time Attack mode and the pager updates accordingly

#### Scenario: Previous arrow click
- **GIVEN** the leaderboard is showing Classic mode
- **WHEN** the player clicks the previous (left) arrow button
- **THEN** the leaderboard wraps to Maze mode and the pager updates accordingly

#### Scenario: Wrapping forward
- **GIVEN** the leaderboard is showing Maze mode (last in order)
- **WHEN** the player cycles to the next mode
- **THEN** the leaderboard wraps to Classic mode (first in order)

#### Scenario: Audio feedback on cycling
- **WHEN** the player cycles to a different leaderboard mode via the pager
- **THEN** navigation audio feedback plays (triggered by the caller — `navigateMenu` for keyboard/gamepad, `handleOverlayClick` for mouse/touch — not by `_cycleLeaderboardMode` itself)

### Requirement: Leaderboard Pager Accessibility
The system SHALL make the pager component accessible to screen readers and keyboard users.

#### Scenario: Pager aria labeling
- **WHEN** the leaderboard modal is displayed
- **THEN** the pager container has an accessible label describing its purpose

#### Scenario: Active dot indication
- **WHEN** a page indicator dot corresponds to the currently displayed mode
- **THEN** the dot has `aria-current="page"` set

#### Scenario: Content announcement
- **WHEN** the leaderboard mode changes via the pager
- **THEN** the leaderboard content region (with `aria-live="polite"`) announces the updated scores
