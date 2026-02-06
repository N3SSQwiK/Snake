## ADDED Requirements

### Requirement: Audio Manager
The system SHALL provide an AudioManager class for playing sound effects using Web Audio API.

#### Scenario: Audio initialization
- **WHEN** the first user interaction occurs
- **THEN** the AudioContext is initialized (browser requirement)

#### Scenario: Sound playback
- **WHEN** a game event triggers a sound
- **THEN** the corresponding sound effect is played

### Requirement: Game Sound Effects
The system SHALL play appropriate sound effects for game events.

#### Scenario: Eat food sound
- **WHEN** the snake eats regular food
- **THEN** a pleasant eating sound plays

#### Scenario: Bonus food sound
- **WHEN** the snake eats bonus food
- **THEN** a rewarding bonus sound plays

#### Scenario: Poison appear sound
- **WHEN** poisonous food spawns
- **THEN** a warning sound plays

#### Scenario: Poison disappear sound
- **WHEN** poisonous food timer expires
- **THEN** a relief sound plays

#### Scenario: Game over sound
- **WHEN** the game transitions to GAMEOVER
- **THEN** a game over sound plays

#### Scenario: High score sound
- **WHEN** a new #1 high score is achieved
- **THEN** a celebratory sound plays

### Requirement: UI Sound Effects
The system SHALL play sound effects for UI interactions.

#### Scenario: Button click sound
- **WHEN** the player clicks a button
- **THEN** a subtle click sound plays

### Requirement: Volume Control
The system SHALL allow players to control sound volume.

#### Scenario: Volume slider
- **WHEN** the settings screen is displayed
- **THEN** a volume slider is available

#### Scenario: Volume adjustment
- **WHEN** the player adjusts the volume slider
- **THEN** all sound effects play at the new volume level

#### Scenario: Mute toggle
- **WHEN** the player toggles mute
- **THEN** all sounds are silenced (or restored)

#### Scenario: Volume persistence
- **WHEN** volume or mute settings change
- **THEN** the preferences are saved and restored on next visit

### Requirement: Animation Style
The system SHALL support two animation modes for snake movement.

#### Scenario: Smooth animation
- **GIVEN** smooth animation mode is selected
- **WHEN** the snake moves
- **THEN** the snake position is interpolated between grid cells for fluid motion

#### Scenario: Classic animation
- **GIVEN** classic animation mode is selected
- **WHEN** the snake moves
- **THEN** the snake instantly snaps from one grid cell to the next

#### Scenario: Animation toggle
- **WHEN** the settings screen is displayed
- **THEN** an animation style toggle is available

#### Scenario: Animation persistence
- **WHEN** the animation style is changed
- **THEN** the preference is saved and restored on next visit

#### Scenario: Default animation
- **GIVEN** no saved preference exists
- **WHEN** the game loads
- **THEN** smooth animation mode is active by default
