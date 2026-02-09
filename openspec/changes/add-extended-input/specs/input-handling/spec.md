## ADDED Requirements

### Requirement: Virtual D-Pad
The system SHALL provide an on-screen directional pad for mobile devices as an alternative to swipe input.

#### Scenario: D-pad visibility
- **GIVEN** the device has a coarse pointer and D-pad input mode is selected
- **WHEN** the game is in PLAYING state
- **THEN** a virtual D-pad with four directional buttons is visible

#### Scenario: D-pad hidden on desktop
- **GIVEN** the device has a fine pointer
- **WHEN** the game is in any state
- **THEN** the virtual D-pad is not visible

#### Scenario: D-pad direction input
- **GIVEN** the D-pad is visible
- **WHEN** the player taps a directional button
- **THEN** the corresponding direction is queued

#### Scenario: D-pad does not trigger swipe
- **GIVEN** the D-pad is visible
- **WHEN** the player taps a D-pad button
- **THEN** the touch event does not trigger swipe detection

### Requirement: Tap Zones
The system SHALL provide tap-zone input where tapping canvas quadrants maps to directions.

#### Scenario: Tap zone direction mapping
- **GIVEN** tap-zone input mode is selected
- **WHEN** the player taps the top quadrant of the canvas
- **THEN** the UP direction is queued

#### Scenario: Tap zone quadrants
- **GIVEN** tap-zone input mode is selected
- **WHEN** the player taps the canvas
- **THEN** the dominant axis (horizontal or vertical) relative to canvas center determines the direction

#### Scenario: Tap zones inactive when not selected
- **GIVEN** swipe or D-pad input mode is selected
- **WHEN** the player taps the canvas
- **THEN** tap-zone direction mapping does not apply

### Requirement: Mobile Input Method Selection
The system SHALL allow the player to choose between swipe, D-pad, and tap-zone input methods.

#### Scenario: Input method setting
- **WHEN** the player opens settings on a coarse-pointer device
- **THEN** a "Controls" setting group is visible with the current mobile input method displayed as a segmented selector: Swipe, D-Pad, Tap Zones

#### Scenario: Input method hidden on desktop
- **GIVEN** the device has a fine pointer
- **WHEN** the player opens settings
- **THEN** the "Controls" setting group is not visible

#### Scenario: Input method persistence
- **GIVEN** the player selects a mobile input method
- **WHEN** the player reopens the game
- **THEN** the previously selected input method is active

#### Scenario: Default input method
- **GIVEN** no input method has been selected
- **WHEN** the game loads
- **THEN** swipe is the default mobile input method

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
- **GIVEN** a gamepad is connected and the game is in PLAYING state
- **WHEN** the player presses Cross (X)
- **THEN** the game transitions to PAUSED state

#### Scenario: Circle button back
- **GIVEN** a gamepad is connected and a non-menu screen is displayed
- **WHEN** the player presses Circle (O)
- **THEN** the same back action as Backspace is triggered (via UIManager.navigateBack())

#### Scenario: Options button pause
- **GIVEN** a gamepad is connected and the game is in PLAYING or PAUSED state
- **WHEN** the player presses the Options button
- **THEN** the pause state is toggled

#### Scenario: Gamepad button debounce
- **GIVEN** a gamepad is connected
- **WHEN** the player holds a button
- **THEN** only the initial press is processed; held state is ignored until released

#### Scenario: Gamepad menu navigation
- **GIVEN** a gamepad is connected and a menu is displayed
- **WHEN** the player presses D-pad up or down
- **THEN** focus moves between menu buttons (via UIManager.navigateMenu()) with playNavigate() audio feedback

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
