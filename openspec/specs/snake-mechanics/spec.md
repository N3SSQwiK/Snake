# snake-mechanics Specification

## Purpose
TBD - created by archiving change add-snake-mechanics. Update Purpose after archive.
## Requirements
### Requirement: Snake Body
The system SHALL represent the snake as an ordered array of grid coordinates, with the first element being the head.

#### Scenario: Initial snake
- **WHEN** a new game starts
- **THEN** the snake is created with a configurable initial length at the starting position

#### Scenario: Body structure
- **GIVEN** a snake with length N
- **THEN** the body array contains exactly N coordinate pairs

### Requirement: Snake Movement
The system SHALL move the snake by adding a new head position and removing the tail each game tick.

#### Scenario: Move in current direction
- **GIVEN** the snake is moving right
- **WHEN** a game tick occurs
- **THEN** a new head segment is added one cell to the right
- **AND** the tail segment is removed

#### Scenario: Direction change
- **GIVEN** the snake is moving right
- **WHEN** the direction is changed to up
- **THEN** the next move adds a head segment one cell upward

### Requirement: Snake Growth
The system SHALL grow the snake by one segment when the grow method is triggered.

#### Scenario: Growth on food
- **GIVEN** the snake eats food
- **WHEN** the next move occurs
- **THEN** the tail segment is not removed, increasing snake length by 1

### Requirement: Self-Collision Detection
The system SHALL detect when the snake's head collides with any of its body segments.

#### Scenario: No collision
- **GIVEN** a snake with non-overlapping segments
- **WHEN** collision is checked
- **THEN** no collision is detected

#### Scenario: Self collision
- **GIVEN** the snake's head moves into a cell occupied by its body
- **WHEN** collision is checked
- **THEN** self-collision is detected
- **AND** the game transitions to GAMEOVER state

### Requirement: Snake Rendering
The system SHALL render the snake on the canvas with the head visually distinct from the body.

#### Scenario: Render snake
- **WHEN** the game renders a frame
- **THEN** each snake segment is drawn as a filled cell
- **AND** the head uses a distinct color from the body

