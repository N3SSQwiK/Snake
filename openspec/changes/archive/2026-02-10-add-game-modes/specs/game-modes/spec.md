## ADDED Requirements

### Requirement: Mode Selection
The system SHALL allow the player to choose a game mode before starting a game.

#### Scenario: Mode selection screen
- **WHEN** the player clicks Play on the start menu
- **THEN** a dedicated mode selection screen is displayed with four card tiles: Classic, Time Attack, Maze, Zen
- **AND** each card shows the mode name and a short description
- **AND** the previously selected mode is highlighted
- **AND** a "Start Game" button is visible below the cards

#### Scenario: Default mode
- **GIVEN** no mode has been previously selected
- **WHEN** the game loads
- **THEN** Classic is the default selected mode

#### Scenario: Mode persistence
- **GIVEN** the player selects a mode
- **WHEN** the page is reloaded
- **THEN** the previously selected mode is still active

#### Scenario: Mode stored in localStorage
- **WHEN** the player selects a mode
- **THEN** the mode value is saved via StorageManager

#### Scenario: Mode and difficulty independence
- **GIVEN** the player selects any mode
- **WHEN** the player changes difficulty
- **THEN** both mode and difficulty are respected independently

### Requirement: Classic Mode
The system SHALL provide a Classic mode that preserves the current default gameplay behavior.

#### Scenario: Classic mode rules
- **GIVEN** Classic mode is selected
- **WHEN** the game starts
- **THEN** all current gameplay rules apply unchanged (wall collision per difficulty, self-collision = death, standard food spawning)

#### Scenario: Classic mode game over on self-collision
- **GIVEN** Classic mode is active
- **WHEN** the snake collides with itself
- **THEN** the game ends

#### Scenario: Classic mode game over on wall collision
- **GIVEN** Classic mode is active and wall collision is enabled (Medium/Hard)
- **WHEN** the snake collides with a wall
- **THEN** the game ends

#### Scenario: Classic mode wall wrap
- **GIVEN** Classic mode is active and wall collision is disabled (Easy)
- **WHEN** the snake moves past a wall boundary
- **THEN** the snake wraps to the opposite side

### Requirement: Time Attack Mode
The system SHALL provide a Time Attack mode where players score as many points as possible within a countdown timer.

#### Scenario: Timer initialization
- **GIVEN** Time Attack mode is selected
- **WHEN** the game starts
- **THEN** a 60-second countdown timer begins

#### Scenario: Timer display
- **GIVEN** Time Attack mode is active
- **WHEN** the game is in PLAYING state
- **THEN** the remaining time is displayed in the HUD

#### Scenario: Timer expiration
- **GIVEN** Time Attack mode is active
- **WHEN** the timer reaches 0
- **THEN** the game ends with the current score

#### Scenario: Self-collision penalty
- **GIVEN** Time Attack mode is active
- **WHEN** the snake collides with itself
- **THEN** 5 seconds are deducted from the timer instead of ending the game

#### Scenario: Self-collision penalty floor
- **GIVEN** Time Attack mode is active and the timer has less than 5 seconds remaining
- **WHEN** the snake collides with itself
- **THEN** the timer is set to 0 and the game ends

#### Scenario: Wall collision per difficulty
- **GIVEN** Time Attack mode is active
- **WHEN** the snake collides with a wall
- **THEN** wall collision behavior follows the difficulty setting (wrap on Easy, death on Medium/Hard)

#### Scenario: Timer pauses when game paused
- **GIVEN** Time Attack mode is active
- **WHEN** the game is paused
- **THEN** the countdown timer stops and resumes when the game resumes

### Requirement: Maze Mode
The system SHALL provide a Maze mode with procedurally generated obstacle blocks on the grid.

#### Scenario: Obstacle generation
- **GIVEN** Maze mode is selected
- **WHEN** the game starts
- **THEN** obstacle blocks are placed on the grid

#### Scenario: Obstacle count scales with difficulty
- **GIVEN** Maze mode is selected
- **WHEN** obstacles are generated
- **THEN** the count scales with difficulty: Easy=15, Medium=20, Hard=25

#### Scenario: Obstacle placement avoids snake start
- **GIVEN** Maze mode is selected
- **WHEN** obstacles are generated
- **THEN** no obstacle is placed on or adjacent to the snake's starting position

#### Scenario: Reachability guarantee
- **GIVEN** Maze mode is selected
- **WHEN** obstacles are generated
- **THEN** all non-obstacle cells are reachable from the snake's starting position (verified by flood-fill)

#### Scenario: Regeneration on unreachable layout
- **GIVEN** obstacle generation produces an unreachable layout
- **WHEN** the flood-fill check fails
- **THEN** the system regenerates obstacles (up to 10 attempts), reducing count by 1 per failed attempt

#### Scenario: Obstacle collision
- **GIVEN** Maze mode is active
- **WHEN** the snake's head moves into an obstacle cell
- **THEN** the game ends

#### Scenario: Obstacle rendering
- **GIVEN** Maze mode is active
- **WHEN** the game is rendered
- **THEN** obstacles are drawn as solid blocks using the current theme's border/wall color

#### Scenario: Food avoids obstacles
- **GIVEN** Maze mode is active
- **WHEN** food is spawned
- **THEN** food SHALL NOT be placed on an obstacle cell

#### Scenario: Obstacles persist during game
- **GIVEN** Maze mode is active
- **WHEN** the game is in progress
- **THEN** obstacles do not move or change until the game ends

#### Scenario: New layout each game
- **GIVEN** Maze mode is active
- **WHEN** the player starts a new game
- **THEN** a fresh set of obstacles is generated

### Requirement: Zen Mode
The system SHALL provide a Zen mode with no death conditions, no scoring, and no leaderboard.

#### Scenario: No self-collision death
- **GIVEN** Zen mode is active
- **WHEN** the snake collides with itself
- **THEN** nothing happens; the snake continues moving

#### Scenario: Wall always wraps
- **GIVEN** Zen mode is active
- **WHEN** the snake moves past a wall boundary
- **THEN** the snake wraps to the opposite side regardless of difficulty setting

#### Scenario: No score tracking
- **GIVEN** Zen mode is active
- **WHEN** the snake eats food
- **THEN** no score is accumulated or displayed

#### Scenario: Length display only
- **GIVEN** Zen mode is active
- **WHEN** the HUD is displayed
- **THEN** only the snake length is shown (no score, no difficulty, no toxic info)

#### Scenario: Food still spawns
- **GIVEN** Zen mode is active
- **WHEN** the game is in progress
- **THEN** regular food spawns normally and the snake grows when eating it

#### Scenario: No special food
- **GIVEN** Zen mode is active
- **WHEN** the game is in progress
- **THEN** no bonus, toxic, or lethal food spawns

#### Scenario: No leaderboard entry
- **GIVEN** Zen mode is active
- **WHEN** the player ends the game (via quit/menu)
- **THEN** no initials prompt is shown and no score is saved

#### Scenario: No game over screen
- **GIVEN** Zen mode is active
- **WHEN** the player presses Escape or quits
- **THEN** the game returns to the menu without showing the game over screen

### Requirement: Mode-Specific Game Over
The system SHALL display mode-appropriate messaging on the game over screen.

#### Scenario: Classic game over message
- **GIVEN** Classic mode is active
- **WHEN** the game ends
- **THEN** the heading shows "Game Over"

#### Scenario: Time Attack game over message
- **GIVEN** Time Attack mode is active
- **WHEN** the timer expires
- **THEN** the heading shows "Time's Up!"

#### Scenario: Time Attack early death message
- **GIVEN** Time Attack mode is active
- **WHEN** the game ends from wall collision (not timer)
- **THEN** the heading shows "Game Over" with remaining time shown

#### Scenario: Maze game over message
- **GIVEN** Maze mode is active
- **WHEN** the game ends
- **THEN** the heading shows "Game Over"

### Requirement: Mode Rule Constants
The system SHALL define mode behavior through a `MODE_RULES` constant object.

#### Scenario: MODE_RULES structure
- **WHEN** the game initializes
- **THEN** a `MODE_RULES` constant exists with keys for each mode ID: `classic`, `timeAttack`, `maze`, `zen`

#### Scenario: Each mode defines collision handlers
- **GIVEN** `MODE_RULES` is defined
- **WHEN** a mode entry is accessed
- **THEN** it contains `onWallCollision` and `onSelfCollision` functions

#### Scenario: Each mode defines feature flags
- **GIVEN** `MODE_RULES` is defined
- **WHEN** a mode entry is accessed
- **THEN** it contains boolean flags: `hasLeaderboard`, `hasScore`, `hasSpecialFood`, `shouldSpawnObstacles`
