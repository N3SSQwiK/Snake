## ADDED Requirements

### Requirement: Start Menu
The system SHALL display a start menu when the game is in MENU state.

#### Scenario: Menu display
- **WHEN** the game state is MENU
- **THEN** the start menu overlay is visible with play, settings, and high scores buttons

#### Scenario: Start game
- **GIVEN** the start menu is displayed
- **WHEN** the player clicks the play button
- **THEN** the game transitions to PLAYING state and the menu is hidden

#### Scenario: Open settings
- **GIVEN** the start menu is displayed
- **WHEN** the player clicks the settings button
- **THEN** the settings screen is displayed

### Requirement: Pause Functionality
The system SHALL allow players to pause and resume the game during play.

#### Scenario: Pause with keyboard
- **GIVEN** the game is in PLAYING state
- **WHEN** the player presses spacebar
- **THEN** the game transitions to PAUSED state

#### Scenario: Pause with button
- **GIVEN** the game is in PLAYING state on a touch device
- **WHEN** the player taps the pause button
- **THEN** the game transitions to PAUSED state

#### Scenario: Pause overlay
- **WHEN** the game state is PAUSED
- **THEN** a pause overlay is displayed with resume and quit options

#### Scenario: Resume game
- **GIVEN** the game is paused
- **WHEN** the player clicks resume or presses spacebar
- **THEN** the game transitions to PLAYING state

#### Scenario: Quit to menu
- **GIVEN** the game is paused
- **WHEN** the player clicks quit
- **THEN** the game resets and transitions to MENU state

### Requirement: Game Over Screen
The system SHALL display an animated game over screen when the game ends.

#### Scenario: Game over display
- **WHEN** the game transitions to GAMEOVER state
- **THEN** the game over overlay fades in

#### Scenario: Final score
- **WHEN** the game over screen is displayed
- **THEN** the player's final score is shown

#### Scenario: Restart game
- **GIVEN** the game over screen is displayed
- **WHEN** the player clicks restart
- **THEN** the game resets and transitions to PLAYING state

#### Scenario: Return to menu
- **GIVEN** the game over screen is displayed
- **WHEN** the player clicks menu
- **THEN** the game transitions to MENU state

### Requirement: Settings Screen
The system SHALL provide a settings screen for configuring game options.

#### Scenario: Settings display
- **WHEN** the player opens settings
- **THEN** current settings are displayed with toggle controls

#### Scenario: Wall collision toggle
- **GIVEN** the settings screen is displayed
- **WHEN** the player toggles wall collision
- **THEN** the setting is updated and saved immediately

#### Scenario: Return from settings
- **GIVEN** the settings screen is displayed
- **WHEN** the player clicks back
- **THEN** the previous screen is displayed

### Requirement: Mobile Pause Button
The system SHALL display a pause button on touch devices.

#### Scenario: Button visibility
- **GIVEN** the device supports touch input
- **WHEN** the game is in PLAYING state
- **THEN** a pause button is visible on screen

#### Scenario: Button hidden on desktop
- **GIVEN** the device does not support touch input
- **WHEN** the game is in PLAYING state
- **THEN** the pause button is not visible
