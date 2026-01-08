## ADDED Requirements

### Requirement: Difficulty Levels
The system SHALL provide three difficulty levels with distinct gameplay parameters.

#### Scenario: Easy difficulty
- **WHEN** Easy difficulty is selected
- **THEN** the game uses slow starting speed, gentle acceleration, and lower poison food chance

#### Scenario: Medium difficulty
- **WHEN** Medium difficulty is selected
- **THEN** the game uses moderate starting speed, standard acceleration, and moderate poison food chance

#### Scenario: Hard difficulty
- **WHEN** Hard difficulty is selected
- **THEN** the game uses fast starting speed, aggressive acceleration, and higher poison food chance

#### Scenario: Difficulty persistence
- **WHEN** the player selects a difficulty
- **THEN** the selection is saved and restored on next visit

### Requirement: Progressive Speed
The system SHALL increase snake speed as the player's score increases.

#### Scenario: Speed increase
- **GIVEN** the player scores points
- **WHEN** the score increases
- **THEN** the snake speed increases based on the difficulty's acceleration rate

#### Scenario: Maximum speed
- **GIVEN** the snake has accelerated
- **WHEN** the speed would exceed the maximum
- **THEN** the speed is capped at the difficulty's maximum speed

#### Scenario: Speed reset
- **WHEN** a new game starts
- **THEN** the speed resets to the difficulty's base speed

### Requirement: Bonus Food
The system SHALL spawn time-limited bonus food worth extra points.

#### Scenario: Bonus spawn
- **GIVEN** regular food is eaten
- **WHEN** random chance succeeds (based on difficulty)
- **THEN** bonus food spawns at a random valid position

#### Scenario: Bonus timer
- **WHEN** bonus food spawns
- **THEN** a countdown timer begins (visible to player)

#### Scenario: Bonus eaten
- **WHEN** the snake eats bonus food
- **THEN** the player receives extra points (more than regular food)

#### Scenario: Bonus expires
- **WHEN** the bonus food timer reaches zero
- **THEN** the bonus food disappears without being eaten

### Requirement: Poisonous Food
The system SHALL spawn time-limited poisonous food that ends the game if eaten.

#### Scenario: Poison spawn
- **GIVEN** regular food is eaten
- **WHEN** random chance succeeds (based on difficulty)
- **THEN** poisonous food spawns at a random valid position

#### Scenario: Poison timer
- **WHEN** poisonous food spawns
- **THEN** a countdown timer begins (visible to player)

#### Scenario: Poison eaten
- **WHEN** the snake eats poisonous food
- **THEN** the game transitions to GAMEOVER state

#### Scenario: Poison expires
- **WHEN** the poisonous food timer reaches zero
- **THEN** the poisonous food disappears

#### Scenario: Poison visual
- **WHEN** poisonous food is rendered
- **THEN** it is visually distinct as dangerous (warning color)

### Requirement: Difficulty Selection
The system SHALL allow players to select difficulty from the settings screen.

#### Scenario: Difficulty selector
- **WHEN** the settings screen is displayed
- **THEN** difficulty options (Easy, Medium, Hard) are shown

#### Scenario: Difficulty description
- **WHEN** the difficulty selector is displayed
- **THEN** each option includes a brief description

#### Scenario: Apply difficulty
- **WHEN** the player selects a difficulty
- **THEN** the next game uses the selected difficulty parameters
