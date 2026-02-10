## MODIFIED Requirements

### Requirement: Gamepad Controls
The system SHALL accept input from gamepads using the standard Gamepad API, supporting PlayStation controllers connected via Bluetooth or USB.

#### Scenario: Gamepad connection
- **WHEN** a gamepad is connected
- **THEN** the system detects and begins polling the gamepad

#### Scenario: Gamepad disconnection
- **WHEN** a connected gamepad is disconnected
- **THEN** the system stops polling and falls back to keyboard/touch input

#### Scenario: D-pad direction input
- **GIVEN** a gamepad is connected and the game is in PLAYING state
- **WHEN** the player presses a D-pad direction
- **THEN** the corresponding direction is queued

#### Scenario: Cross button confirm
- **GIVEN** a gamepad is connected and a menu screen is displayed
- **WHEN** the player presses Cross (X)
- **THEN** the focused or primary action is activated

#### Scenario: Cross button pause
- **GIVEN** a gamepad is connected and the game is in PLAYING state with no overlay open
- **WHEN** the player presses Cross (X)
- **THEN** the game transitions to PAUSED state

#### Scenario: Circle button back
- **GIVEN** a gamepad is connected and a non-menu screen is displayed
- **WHEN** the player presses Circle (O)
- **THEN** the same back action as Escape and Backspace is triggered (via UIManager.navigateBack())

#### Scenario: Options button pause
- **GIVEN** a gamepad is connected and the game is in PLAYING or PAUSED state
- **WHEN** the player presses the Options button
- **THEN** the pause state is toggled

#### Scenario: Gamepad button debounce
- **GIVEN** a gamepad is connected
- **WHEN** the player holds a button
- **THEN** only the initial press is processed; held state is ignored until released
- **EXCEPT** during initials entry, where D-pad up/down support hold-to-repeat

#### Scenario: Gamepad menu navigation
- **GIVEN** a gamepad is connected and a menu is displayed
- **WHEN** the player presses D-pad up, down, left, or right
- **THEN** focus moves between navigable elements (via UIManager.navigateMenu()) with playNavigate() audio feedback, respecting grid layout when declared

#### Scenario: Gamepad audio feedback
- **GIVEN** a gamepad is connected and a menu is displayed
- **WHEN** the player presses Cross to confirm or Circle to go back
- **THEN** the same audio feedback plays as keyboard navigation (playConfirm/playBack)

#### Scenario: Gamepad respects input gate
- **GIVEN** a gamepad is connected and a modal overlay is open (settings, leaderboard, shortcuts)
- **WHEN** the player presses a D-pad direction
- **THEN** direction input is blocked (inputGate returns true) but menu navigation buttons (Cross, Circle) still function

#### Scenario: Gamepad ignored when no standard mapping
- **GIVEN** a gamepad is connected with mapping !== "standard"
- **WHEN** the system polls for gamepad input
- **THEN** the gamepad is ignored
