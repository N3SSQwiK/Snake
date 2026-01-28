## ADDED Requirements

### Requirement: Keyboard Controls
The system SHALL accept keyboard input using both arrow keys and WASD for snake direction control.

#### Scenario: Arrow key input
- **WHEN** the player presses an arrow key (Up, Down, Left, Right)
- **THEN** the corresponding direction is queued for the snake

#### Scenario: WASD input
- **WHEN** the player presses W, A, S, or D
- **THEN** the corresponding direction (up, left, down, right) is queued

#### Scenario: Case insensitivity
- **WHEN** the player presses lowercase or uppercase WASD
- **THEN** the input is recognized regardless of case

### Requirement: Touch Controls
The system SHALL accept swipe gestures on touch devices for snake direction control.

#### Scenario: Swipe detection
- **WHEN** the player swipes on the canvas
- **THEN** the swipe direction is calculated from start to end point

#### Scenario: Swipe to direction
- **GIVEN** a swipe gesture is detected
- **WHEN** the swipe has a dominant horizontal or vertical component
- **THEN** the corresponding direction is queued

### Requirement: Direction Queue
The system SHALL buffer direction inputs in a queue, processing one per game tick.

#### Scenario: Queue input
- **WHEN** a valid direction input is received
- **THEN** the direction is added to the queue

#### Scenario: Process queue
- **WHEN** a game tick occurs
- **THEN** the next direction is dequeued and applied to the snake

#### Scenario: Queue limit
- **GIVEN** the direction queue has reached maximum capacity
- **WHEN** a new direction input is received
- **THEN** the input is ignored

### Requirement: Reversal Prevention
The system SHALL prevent the snake from reversing 180° into itself.

#### Scenario: Opposite direction rejected
- **GIVEN** the snake is moving right
- **WHEN** the player inputs left direction
- **THEN** the input is rejected and not queued

#### Scenario: Perpendicular direction accepted
- **GIVEN** the snake is moving right
- **WHEN** the player inputs up or down direction
- **THEN** the input is accepted and queued

#### Scenario: Same direction rejected
- **GIVEN** the snake is moving right
- **WHEN** the player inputs right direction
- **THEN** the input is rejected to prevent key repeat from clogging the queue
