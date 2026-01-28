# collision-system Specification

## Purpose
TBD - created by archiving change add-wall-collision. Update Purpose after archive.
## Requirements
### Requirement: Wall Collision Detection
The system SHALL detect when the snake's head moves outside the grid boundaries.

#### Scenario: Collision at right edge
- **GIVEN** grid width is 20
- **WHEN** snake head x-coordinate becomes 20 or greater
- **THEN** wall collision is detected

#### Scenario: Collision at left edge
- **WHEN** snake head x-coordinate becomes less than 0
- **THEN** wall collision is detected

#### Scenario: Collision at bottom edge
- **GIVEN** grid height is 20
- **WHEN** snake head y-coordinate becomes 20 or greater
- **THEN** wall collision is detected

#### Scenario: Collision at top edge
- **WHEN** snake head y-coordinate becomes less than 0
- **THEN** wall collision is detected

### Requirement: Wall Collision Mode
The system SHALL end the game when wall collision is enabled and the snake hits a wall.

#### Scenario: Game over on wall hit
- **GIVEN** wall collision mode is enabled
- **WHEN** wall collision is detected
- **THEN** the game transitions to GAMEOVER state

### Requirement: Wrap-Around Mode
The system SHALL teleport the snake to the opposite edge when wrap-around mode is enabled.

#### Scenario: Wrap right to left
- **GIVEN** wrap-around mode is enabled and grid width is 20
- **WHEN** snake head x-coordinate becomes 20
- **THEN** snake head x-coordinate is set to 0

#### Scenario: Wrap left to right
- **GIVEN** wrap-around mode is enabled and grid width is 20
- **WHEN** snake head x-coordinate becomes -1
- **THEN** snake head x-coordinate is set to 19

#### Scenario: Wrap bottom to top
- **GIVEN** wrap-around mode is enabled and grid height is 20
- **WHEN** snake head y-coordinate becomes 20
- **THEN** snake head y-coordinate is set to 0

#### Scenario: Wrap top to bottom
- **GIVEN** wrap-around mode is enabled and grid height is 20
- **WHEN** snake head y-coordinate becomes -1
- **THEN** snake head y-coordinate is set to 19

### Requirement: Wall Collision Setting
The system SHALL allow players to toggle between wall collision and wrap-around modes.

#### Scenario: Setting persistence
- **WHEN** the player changes the wall collision setting
- **THEN** the preference is saved to localStorage

#### Scenario: Setting restoration
- **WHEN** the game loads
- **THEN** the wall collision setting is restored from localStorage

#### Scenario: Default setting
- **GIVEN** no saved preference exists
- **WHEN** the game loads
- **THEN** wall collision mode is enabled by default

