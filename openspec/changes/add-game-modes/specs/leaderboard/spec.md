## MODIFIED Requirements

### Requirement: Leaderboard Storage
The system SHALL store a leaderboard of the top 10 scores per mode+difficulty combination in localStorage.

#### Scenario: Score entry structure
- **WHEN** a score is saved to the leaderboard
- **THEN** the entry includes initials (3 characters), score (number), date (timestamp), difficulty, mode, and assisted flag

#### Scenario: Top 10 limit per mode+difficulty
- **GIVEN** the leaderboard has 10 entries for a specific mode+difficulty combination
- **WHEN** a new qualifying score is added for that combination
- **THEN** the lowest score in that combination is removed to maintain 10 entries

#### Scenario: Sorted order
- **WHEN** the leaderboard is retrieved
- **THEN** entries are sorted by score in descending order

#### Scenario: Persistence
- **WHEN** the page is reloaded
- **THEN** the leaderboard data is preserved

#### Scenario: Backward compatibility
- **GIVEN** existing leaderboard entries have no mode field
- **WHEN** the leaderboard is filtered by mode
- **THEN** entries with null or undefined mode are treated as Classic mode

#### Scenario: Mode-aware qualification
- **WHEN** the game ends
- **THEN** the system checks if the score qualifies for top 10 within the current mode+difficulty

### Requirement: Leaderboard Display
The system SHALL display the leaderboard filtered by mode and difficulty.

#### Scenario: Leaderboard access
- **GIVEN** the start menu is displayed
- **WHEN** the player clicks high scores
- **THEN** the leaderboard screen is displayed

#### Scenario: Mode filter
- **WHEN** the leaderboard screen is displayed
- **THEN** a mode filter row is shown with tabs for Classic, Time Attack, and Maze (no Zen)

#### Scenario: Default mode filter
- **WHEN** the leaderboard screen is opened
- **THEN** the currently selected game mode is the default filter (or Classic if Zen is selected)

#### Scenario: Entry display
- **WHEN** the leaderboard screen is displayed
- **THEN** each entry shows rank, initials, score, and date for the selected mode+difficulty

#### Scenario: Empty leaderboard for mode
- **GIVEN** no scores have been saved for the selected mode+difficulty
- **WHEN** the leaderboard screen is displayed
- **THEN** a message indicates no scores yet for that mode

### Requirement: Score Comparison
The system SHALL show mode-scoped score comparison on the game over screen.

#### Scenario: Score vs high score
- **WHEN** the game over screen is displayed
- **THEN** the player's score is shown alongside the current high score for the active mode+difficulty

#### Scenario: Leaderboard status
- **WHEN** the game over screen is displayed
- **THEN** it indicates whether the player's score made the leaderboard for the active mode+difficulty
