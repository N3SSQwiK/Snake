## MODIFIED Requirements

### Requirement: Leaderboard Display
The system SHALL display the leaderboard in a dedicated screen accessible from the start menu. Mode filtering SHALL use a pager component instead of tab buttons.

#### Scenario: Leaderboard access
- **GIVEN** the start menu is displayed
- **WHEN** the player clicks high scores
- **THEN** the leaderboard screen is displayed with the pager header showing the current game mode (or Classic if current mode is Zen)

#### Scenario: Entry display
- **WHEN** the leaderboard screen is displayed
- **THEN** each entry shows rank, initials, score, and date for the currently selected mode

#### Scenario: Empty leaderboard
- **GIVEN** no scores have been saved for the selected mode
- **WHEN** the leaderboard screen is displayed for that mode
- **THEN** a message indicates no scores yet

#### Scenario: Mode cycling updates content
- **GIVEN** the leaderboard is displayed
- **WHEN** the player cycles to a different mode via the pager
- **THEN** the leaderboard entries update to show scores for the newly selected mode

## REMOVED Requirements

### Requirement: Leaderboard Mode Tabs
**Reason**: Replaced by the leaderboard pager component which provides a more consistent navigation model for keyboard and gamepad users.
**Migration**: All tab-based mode filtering is replaced by `_cycleLeaderboardMode(delta)` and the pager component. No API changes; `showLeaderboard(mode)` continues to accept a mode parameter.
