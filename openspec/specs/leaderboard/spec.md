# leaderboard Specification

## Purpose
Local leaderboard system storing top 10 scores per mode+difficulty combination, with initials entry, high score celebration, and mode-filtered display.
## Requirements
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

### Requirement: Initials Entry
The system SHALL prompt players to enter 3-character initials when their score qualifies for the leaderboard.

#### Scenario: Qualification check
- **WHEN** the game ends
- **THEN** the system checks if the score qualifies for top 10

#### Scenario: Entry prompt
- **GIVEN** the score qualifies for the leaderboard
- **WHEN** the game over sequence begins
- **THEN** the initials entry screen is displayed before the game over screen

#### Scenario: Character input
- **WHEN** entering initials
- **THEN** the player can input exactly 3 characters

#### Scenario: Entry submission
- **WHEN** the player confirms their initials
- **THEN** the score is saved to the leaderboard with the entered initials

#### Scenario: Entry dismissal
- **GIVEN** the initials entry screen is displayed
- **WHEN** the player presses Escape
- **THEN** initials entry is skipped and the game over screen is shown without saving the score

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

### Requirement: High Score Celebration
The system SHALL celebrate when a player achieves a new #1 high score.

#### Scenario: New high score detection
- **GIVEN** the current #1 score is 500
- **WHEN** the player scores 600
- **THEN** a new high score is detected

#### Scenario: Celebration effect
- **WHEN** a new #1 high score is achieved
- **THEN** a visual celebration effect is displayed

#### Scenario: High score message
- **WHEN** a new #1 high score is achieved
- **THEN** "NEW HIGH SCORE!" message is prominently displayed

### Requirement: Score Comparison
The system SHALL show mode-scoped score comparison on the game over screen.

#### Scenario: Score vs high score
- **WHEN** the game over screen is displayed
- **THEN** the player's score is shown alongside the current high score for the active mode+difficulty

#### Scenario: Leaderboard status
- **WHEN** the game over screen is displayed
- **THEN** it indicates whether the player's score made the leaderboard for the active mode+difficulty
