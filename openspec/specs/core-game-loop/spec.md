# core-game-loop Specification

## Purpose
TBD - created by archiving change add-core-game-loop. Update Purpose after archive.
## Requirements
### Requirement: Canvas Rendering Surface
The system SHALL provide an HTML5 Canvas element as the primary rendering surface for the game.

#### Scenario: Canvas initialization
- **WHEN** the page loads
- **THEN** a Canvas element is present and sized to fit the game grid

#### Scenario: Responsive canvas
- **WHEN** the viewport is smaller than the canvas dimensions
- **THEN** the canvas scales down while maintaining aspect ratio

### Requirement: Grid System
The system SHALL use a grid-based coordinate system for all game elements.

#### Scenario: Grid dimensions
- **GIVEN** a configured grid size (default 20x20)
- **WHEN** the game initializes
- **THEN** the canvas dimensions match grid cells × cell pixel size

#### Scenario: Grid rendering
- **WHEN** the game is in PLAYING state
- **THEN** visible grid lines are drawn on the canvas

### Requirement: Game Loop
The system SHALL implement a continuous game loop using requestAnimationFrame targeting 60fps.

#### Scenario: Loop execution
- **WHEN** the game is started
- **THEN** the game loop executes continuously until stopped

#### Scenario: Frame timing
- **WHEN** the game loop runs
- **THEN** game logic updates at a consistent tick rate independent of frame rate

#### Scenario: Loop termination
- **WHEN** the game is stopped
- **THEN** the game loop ceases execution

### Requirement: Game State Machine
The system SHALL manage game flow through discrete states: MENU, PLAYING, PAUSED, and GAMEOVER.

#### Scenario: Initial state
- **WHEN** the game initializes
- **THEN** the state is set to MENU

#### Scenario: State transition to playing
- **GIVEN** the game is in MENU state
- **WHEN** the player starts the game
- **THEN** the state transitions to PLAYING

#### Scenario: State transition to paused
- **GIVEN** the game is in PLAYING state
- **WHEN** the player pauses the game
- **THEN** the state transitions to PAUSED

#### Scenario: State transition from paused
- **GIVEN** the game is in PAUSED state
- **WHEN** the player resumes the game
- **THEN** the state transitions to PLAYING

#### Scenario: State transition to game over
- **GIVEN** the game is in PLAYING state
- **WHEN** a game-ending condition occurs
- **THEN** the state transitions to GAMEOVER

#### Scenario: Restart from game over
- **GIVEN** the game is in GAMEOVER state
- **WHEN** the player restarts
- **THEN** the state transitions to PLAYING with reset game data

### Requirement: Renderer
The system SHALL provide a Renderer class for all canvas drawing operations.

#### Scenario: Clear canvas
- **WHEN** a new frame begins rendering
- **THEN** the canvas is cleared before drawing

#### Scenario: Draw cell
- **GIVEN** grid coordinates (x, y) and a color
- **WHEN** drawCell is called
- **THEN** the corresponding cell is filled with the specified color

