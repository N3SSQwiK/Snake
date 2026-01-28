# food-system Specification

## Purpose
TBD - created by archiving change add-basic-food. Update Purpose after archive.
## Requirements
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

#### Scenario: Spawn with bounded attempts
- **GIVEN** the grid has limited free cells
- **WHEN** random spawn attempts exceed max tries (e.g., 100)
- **THEN** the system computes valid cells and selects randomly from them

### Requirement: Food Decay
The system SHALL decay uneaten food after a timeout, preventing grid congestion.

#### Scenario: Food expires
- **GIVEN** food has been spawned
- **WHEN** the food is not eaten within the decay timeout
- **THEN** the food disappears and new food spawns at a different position

#### Scenario: Decay timer reset
- **WHEN** new food spawns (after eating or decay)
- **THEN** the decay timer resets to full duration

#### Scenario: Visual decay warning
- **GIVEN** food is approaching decay timeout
- **WHEN** less than 25% of decay time remains
- **THEN** the food visually indicates it will disappear soon (e.g., blinking)

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
The system SHALL render food as a distinctly colored cell on the grid using the current theme's food color.

#### Scenario: Render food
- **WHEN** the game renders a frame
- **THEN** the food is drawn at its grid position using `theme.colors.food`

#### Scenario: Render decay warning
- **GIVEN** food is in decay warning state (< 25% time remaining)
- **WHEN** the game renders a frame
- **THEN** the food blinks or pulses to indicate imminent decay

#### Edge Cases
- Spawn uses bounded random attempts, falling back to computed valid cells
- Food decay prevents grid congestion regardless of snake length
- Theme colors used (not hardcoded) for accessibility across themes

