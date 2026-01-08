## ADDED Requirements

### Requirement: Food Spawning
The system SHALL spawn food at random grid positions that do not overlap with the snake.

#### Scenario: Initial food spawn
- **WHEN** a new game starts
- **THEN** food is spawned at a random position not occupied by the snake

#### Scenario: Respawn after eaten
- **WHEN** the snake eats food
- **THEN** new food is immediately spawned at another valid position

#### Scenario: Avoid snake collision
- **GIVEN** the snake occupies multiple grid cells
- **WHEN** food spawns
- **THEN** the food position does not overlap any snake segment

### Requirement: Food Collision
The system SHALL detect when the snake's head occupies the same cell as food.

#### Scenario: Collision detected
- **GIVEN** food is at position (5, 5)
- **WHEN** the snake's head moves to (5, 5)
- **THEN** food collision is detected

#### Scenario: No collision
- **GIVEN** food is at position (5, 5)
- **WHEN** the snake's head is at a different position
- **THEN** no food collision is detected

### Requirement: Snake Growth on Eating
The system SHALL trigger snake growth when food is eaten.

#### Scenario: Eat food
- **WHEN** food collision is detected
- **THEN** the snake's grow method is triggered
- **AND** the snake length increases by 1 on the next move

### Requirement: Score Tracking
The system SHALL track and display the player's current score and snake length.

#### Scenario: Score increment
- **WHEN** the snake eats food
- **THEN** the score increases by the food's point value

#### Scenario: Score display
- **WHEN** the game is in PLAYING state
- **THEN** the current score is visible to the player

#### Scenario: Length display
- **WHEN** the game is in PLAYING state
- **THEN** the current snake length is visible to the player

#### Scenario: Score reset
- **WHEN** a new game starts
- **THEN** the score is reset to zero

### Requirement: Food Rendering
The system SHALL render food as a distinctly colored cell on the grid.

#### Scenario: Render food
- **WHEN** the game renders a frame
- **THEN** the food is drawn at its grid position with the food color
