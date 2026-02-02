## MODIFIED Requirements

### Requirement: Settings Screen
The system SHALL provide a settings screen as a modal overlay that does not change the game state. The system SHALL track the previous screen so the back button returns to the correct context. The system SHALL display animated previews for toggle settings and theme swatches.

#### Scenario: Settings display
- **WHEN** the player opens settings
- **THEN** current settings are displayed with toggle controls and animated previews

#### Scenario: Settings from menu
- **GIVEN** the game is in MENU state
- **WHEN** the player opens settings and clicks back
- **THEN** the start menu is displayed

#### Scenario: Settings from pause
- **GIVEN** the game is in PAUSED state
- **WHEN** the player opens settings and clicks back
- **THEN** the pause overlay is displayed

#### Scenario: Wall collision toggle
- **GIVEN** the settings screen is displayed
- **WHEN** the player toggles wall collision
- **THEN** the setting is updated and saved immediately

#### Scenario: Return from settings
- **GIVEN** the settings screen is displayed
- **WHEN** the player clicks back
- **THEN** the previous screen is displayed and all preview animations are stopped

#### Scenario: Keyboard actions blocked during settings
- **GIVEN** the settings screen is displayed
- **WHEN** the player presses spacebar or Escape
- **THEN** the keypresses are ignored and game state does not change
