## MODIFIED Requirements

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
