## MODIFIED Requirements

### Requirement: Start Menu
The system SHALL display a start menu when the game is in MENU state. Overlay panels SHALL scale proportionally with the canvas size using the `--game-scale` CSS custom property.

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

#### Scenario: Panel scales with viewport
- **WHEN** the game is displayed on a large viewport
- **THEN** panel max-width, padding, button sizes, and font sizes scale proportionally via `--game-scale` within defined clamp bounds

#### Scenario: Panel fits small viewport
- **WHEN** the viewport is narrower than 480px
- **THEN** the panel width adapts to fit within the viewport with appropriate margins

### Requirement: Settings Screen
The system SHALL provide a settings screen as a modal overlay that does not change the game state. The system SHALL track the previous screen so the back button returns to the correct context. The system SHALL display animated previews for the Difficulty selector, Smooth Animation toggle, and theme swatches. Panel dimensions SHALL scale proportionally with the viewport.

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
The system SHALL display a pause button on touch devices. The button size SHALL scale with `--game-scale`.

#### Scenario: Button visibility
- **GIVEN** the device has a coarse pointer (touch device)
- **WHEN** the game is in PLAYING state
- **THEN** a pause button is visible on screen, sized proportionally to the canvas

#### Scenario: Button hidden on desktop
- **GIVEN** the device has a fine pointer (mouse)
- **WHEN** the game is in PLAYING state
- **THEN** the pause button is not visible
