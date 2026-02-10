## ADDED Requirements

### Requirement: Keyboard Leaderboard Page Cycling
The system SHALL allow the player to cycle leaderboard modes using ArrowLeft and ArrowRight keys when the leaderboard modal is open.

#### Scenario: ArrowRight cycles to next mode
- **GIVEN** the leaderboard modal is open
- **WHEN** the player presses ArrowRight
- **THEN** the leaderboard advances to the next mode in order (Classic, Time Attack, Maze) with wrapping

#### Scenario: ArrowLeft cycles to previous mode
- **GIVEN** the leaderboard modal is open
- **WHEN** the player presses ArrowLeft
- **THEN** the leaderboard moves to the previous mode in order with wrapping

#### Scenario: Arrow keys do not affect segmented controls in leaderboard
- **GIVEN** the leaderboard modal is open
- **WHEN** the player presses ArrowLeft or ArrowRight
- **THEN** the leaderboard mode cycles and segmented control cycling does not occur

### Requirement: Gamepad Leaderboard Page Cycling
The system SHALL allow the player to cycle leaderboard modes using D-pad Left and Right when the leaderboard modal is open.

#### Scenario: D-pad Right cycles to next mode
- **GIVEN** a gamepad is connected and the leaderboard modal is open
- **WHEN** the player presses D-pad Right
- **THEN** the leaderboard advances to the next mode with wrapping

#### Scenario: D-pad Left cycles to previous mode
- **GIVEN** a gamepad is connected and the leaderboard modal is open
- **WHEN** the player presses D-pad Left
- **THEN** the leaderboard moves to the previous mode with wrapping
