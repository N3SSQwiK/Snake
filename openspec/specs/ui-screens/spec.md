# ui-screens Specification

## Purpose
TBD - created by archiving change add-ui-screens. Update Purpose after archive.
## Requirements
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

#### Scenario: Held spacebar ignored
- **GIVEN** the game is in PLAYING or PAUSED state
- **WHEN** the player holds spacebar (key repeat)
- **THEN** only the initial keypress is processed; repeated events are ignored

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

#### Scenario: Escape key returns to menu
- **GIVEN** the game is in PLAYING, PAUSED, or GAMEOVER state
- **WHEN** the player presses Escape
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
The system SHALL provide a settings screen as a modal overlay that does not change the game state. The system SHALL track the previous screen so the back button returns to the correct context. The system SHALL display animated previews for the Difficulty selector, Smooth Animation toggle, and theme swatches.

#### Scenario: Settings display
- **WHEN** the player opens settings
- **THEN** current settings are displayed with controls and animated previews

#### Scenario: Settings from menu
- **GIVEN** the game is in MENU state
- **WHEN** the player opens settings and clicks back
- **THEN** the start menu is displayed

#### Scenario: Settings from pause
- **GIVEN** the game is in PAUSED state
- **WHEN** the player opens settings and clicks back
- **THEN** the pause overlay is displayed

#### Scenario: Difficulty selector
- **GIVEN** the settings screen is displayed
- **WHEN** the player selects a difficulty option
- **THEN** the setting is updated and saved immediately and the difficulty preview canvas updates

#### Scenario: Return from settings
- **GIVEN** the settings screen is displayed
- **WHEN** the player navigates back (Backspace or close button)
- **THEN** the previous screen is displayed and all preview animations are stopped

### Requirement: Mobile Pause Button
The system SHALL display a pause button on touch devices.

#### Scenario: Button visibility
- **GIVEN** the device has a coarse pointer (touch device)
- **WHEN** the game is in PLAYING state
- **THEN** a pause button is visible on screen

#### Scenario: Button hidden on desktop
- **GIVEN** the device has a fine pointer (mouse)
- **WHEN** the game is in PLAYING state
- **THEN** the pause button is not visible

