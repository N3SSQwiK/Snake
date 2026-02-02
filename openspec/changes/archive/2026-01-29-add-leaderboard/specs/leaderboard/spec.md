## ADDED Requirements

### Requirement: Leaderboard Storage
The system SHALL store a leaderboard of the top 10 scores in localStorage.

#### Scenario: Score entry structure
- **WHEN** a score is saved to the leaderboard
- **THEN** the entry includes initials (3 characters), score (number), and date (timestamp)

#### Scenario: Top 10 limit
- **GIVEN** the leaderboard has 10 entries
- **WHEN** a new qualifying score is added
- **THEN** the lowest score is removed to maintain 10 entries

#### Scenario: Sorted order
- **WHEN** the leaderboard is retrieved
- **THEN** entries are sorted by score in descending order

#### Scenario: Persistence
- **WHEN** the page is reloaded
- **THEN** the leaderboard data is preserved

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
The system SHALL display the leaderboard in a dedicated screen accessible from the start menu.

#### Scenario: Leaderboard access
- **GIVEN** the start menu is displayed
- **WHEN** the player clicks high scores
- **THEN** the leaderboard screen is displayed

#### Scenario: Entry display
- **WHEN** the leaderboard screen is displayed
- **THEN** each entry shows rank, initials, score, and date

#### Scenario: Empty leaderboard
- **GIVEN** no scores have been saved
- **WHEN** the leaderboard screen is displayed
- **THEN** a message indicates no scores yet

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
The system SHALL show score comparison on the game over screen.

#### Scenario: Score vs high score
- **WHEN** the game over screen is displayed
- **THEN** the player's score is shown alongside the current high score

#### Scenario: Leaderboard status
- **WHEN** the game over screen is displayed
- **THEN** it indicates whether the player's score made the leaderboard
