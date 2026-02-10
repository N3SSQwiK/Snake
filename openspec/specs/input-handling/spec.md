# input-handling Specification

## Purpose
Player input controls for keyboard, touch, virtual D-pad, and gamepad, with direction queuing and reversal prevention.
## Requirements
### Requirement: Keyboard Controls
The system SHALL accept keyboard input using both arrow keys and WASD for snake direction control.

#### Scenario: Arrow key input
- **WHEN** the player presses an arrow key (Up, Down, Left, Right)
- **THEN** the corresponding direction is queued for the snake

#### Scenario: WASD input
- **WHEN** the player presses W, A, S, or D
- **THEN** the corresponding direction (up, left, down, right) is queued

#### Scenario: Case insensitivity
- **WHEN** the player presses lowercase or uppercase WASD
- **THEN** the input is recognized regardless of case

### Requirement: Touch Controls
The system SHALL accept swipe gestures on touch devices for snake direction control.

#### Scenario: Swipe detection
- **WHEN** the player swipes on the canvas
- **THEN** the swipe direction is calculated from start to end point

#### Scenario: Swipe to direction
- **GIVEN** a swipe gesture is detected
- **WHEN** the swipe has a dominant horizontal or vertical component
- **THEN** the corresponding direction is queued

### Requirement: Direction Queue
The system SHALL buffer direction inputs in a queue, processing one per game tick.

#### Scenario: Queue input
- **WHEN** a valid direction input is received
- **THEN** the direction is added to the queue

#### Scenario: Process queue
- **WHEN** a game tick occurs
- **THEN** the next direction is dequeued and applied to the snake

#### Scenario: Queue limit
- **GIVEN** the direction queue has reached maximum capacity
- **WHEN** a new direction input is received
- **THEN** the input is ignored

### Requirement: Reversal Prevention
The system SHALL prevent the snake from reversing 180° into itself.

#### Scenario: Opposite direction rejected
- **GIVEN** the snake is moving right
- **WHEN** the player inputs left direction
- **THEN** the input is rejected and not queued

#### Scenario: Perpendicular direction accepted
- **GIVEN** the snake is moving right
- **WHEN** the player inputs up or down direction
- **THEN** the input is accepted and queued

#### Scenario: Same direction rejected
- **GIVEN** the snake is moving right
- **WHEN** the player inputs right direction
- **THEN** the input is rejected to prevent key repeat from clogging the queue

### Requirement: Virtual D-Pad
The system SHALL provide an on-screen directional pad for mobile devices as an alternative to swipe input.

#### Scenario: D-pad visibility
- **GIVEN** the device has a coarse pointer and D-pad input mode is selected
- **WHEN** the game is in PLAYING state
- **THEN** a virtual D-pad with four directional buttons is visible, centered below the canvas

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

### Requirement: Mobile Input Method Selection
The system SHALL allow the player to choose between swipe and D-pad input methods.

#### Scenario: Input method setting
- **WHEN** the player opens settings on a coarse-pointer device
- **THEN** a "Controls" setting group is visible with the current mobile input method displayed as a segmented selector: Swipe, D-Pad

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
- **GIVEN** a gamepad is connected and the game is in PLAYING state with no overlay open
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
- **EXCEPT** during initials entry, where D-pad up/down support hold-to-repeat

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

### Requirement: Gamepad Initials Entry
The system SHALL allow the player to enter leaderboard initials using a gamepad.

#### Scenario: D-pad cycles letters
- **GIVEN** a gamepad is connected and the initials entry screen is displayed
- **WHEN** the player presses D-pad down
- **THEN** the current slot cycles to the next letter in ascending order (A→B→C)

#### Scenario: D-pad cycles letters reverse
- **GIVEN** a gamepad is connected and the initials entry screen is displayed
- **WHEN** the player presses D-pad up
- **THEN** the current slot cycles to the previous letter in descending order (Z→Y→X)

#### Scenario: Hold-to-repeat for letter cycling
- **GIVEN** a gamepad is connected and the initials entry screen is displayed
- **WHEN** the player holds D-pad up or down
- **THEN** the letter cycles once immediately, then repeats after a delay (~300ms) at a steady rate (~80ms)

#### Scenario: D-pad moves between slots
- **GIVEN** a gamepad is connected and the initials entry screen is displayed
- **WHEN** the player presses D-pad left or right
- **THEN** the active slot moves left or right (single-fire, no repeat)

#### Scenario: Cross submits initials
- **GIVEN** a gamepad is connected and the initials entry screen is displayed
- **WHEN** the player presses Cross (X)
- **THEN** the initials are submitted to the leaderboard

#### Scenario: Circle cancels initials
- **GIVEN** a gamepad is connected and the initials entry screen is displayed
- **WHEN** the player presses Circle (O)
- **THEN** the initials entry is cancelled

#### Scenario: Post-initials focus
- **GIVEN** the player has submitted or cancelled initials entry
- **WHEN** the initials screen closes
- **THEN** focus moves to the first button on the game over screen
