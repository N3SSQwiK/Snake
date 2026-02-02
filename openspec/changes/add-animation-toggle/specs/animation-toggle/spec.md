## ADDED Requirements

### Requirement: Animation Style Setting
The system SHALL allow players to choose between smooth and classic animation styles.

#### Scenario: Default animation style
- **WHEN** the game loads for the first time
- **THEN** the animation style is set to Smooth

#### Scenario: Style options
- **WHEN** the settings screen is displayed
- **THEN** the player can choose between Smooth and Classic animation styles

#### Scenario: Setting persistence
- **WHEN** the player changes the animation style
- **THEN** the preference is saved to localStorage

#### Scenario: Setting restoration
- **WHEN** the game loads with a saved preference
- **THEN** the saved animation style is applied

### Requirement: Smooth Animation Mode
The system SHALL interpolate snake positions between game ticks when smooth mode is active.

#### Scenario: Snake interpolation
- **GIVEN** smooth mode is active
- **WHEN** the renderer draws between game ticks
- **THEN** each snake segment is rendered at an interpolated position between its previous and current grid cell

#### Scenario: Interpolation factor
- **GIVEN** smooth mode is active
- **WHEN** time has elapsed since the last game tick
- **THEN** the interpolation factor is calculated as elapsed time divided by tick interval, clamped to 0.0–1.0

#### Scenario: Food rendering
- **GIVEN** smooth mode is active
- **WHEN** food is rendered
- **THEN** food remains snapped to its grid cell (no interpolation)

#### Scenario: Grid rendering
- **GIVEN** smooth mode is active
- **WHEN** the grid is rendered
- **THEN** grid lines remain at fixed positions (no interpolation)

#### Scenario: Growth frame
- **GIVEN** smooth mode is active
- **WHEN** the snake grows (new segment added)
- **THEN** the new tail segment appears at the grid position without interpolation artifacts

#### Scenario: Wrap-around interpolation
- **GIVEN** smooth mode is active and wall collision is off
- **WHEN** the snake wraps from one edge to the opposite
- **THEN** the head snaps to the new position (no interpolation across the wrap boundary)

### Requirement: Classic Animation Mode
The system SHALL render the snake at exact grid positions when classic mode is active.

#### Scenario: Grid-snap rendering
- **GIVEN** classic mode is active
- **WHEN** the renderer draws
- **THEN** each snake segment is rendered at its exact grid cell position with no interpolation

#### Scenario: Existing behavior
- **GIVEN** classic mode is active
- **THEN** rendering behaves identically to the current implementation
