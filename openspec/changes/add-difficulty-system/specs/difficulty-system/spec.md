## ADDED Requirements

### Requirement: Difficulty Levels
The system SHALL provide three difficulty levels with distinct gameplay parameters.

#### Scenario: Easy difficulty
- **WHEN** Easy difficulty is selected
- **THEN** the game uses slow starting speed (8 ticks/s), gentle acceleration (every 80 points), bonus food only, and walls wrap around

#### Scenario: Medium difficulty
- **WHEN** Medium difficulty is selected
- **THEN** the game uses moderate starting speed (10 ticks/s), standard acceleration (every 50 points), bonus and toxic food, and walls kill on contact

#### Scenario: Hard difficulty
- **WHEN** Hard difficulty is selected
- **THEN** the game uses fast starting speed (12 ticks/s), aggressive acceleration (every 30 points), bonus, toxic, and lethal food, and walls kill on contact

#### Scenario: Difficulty persistence
- **WHEN** the player selects a difficulty
- **THEN** the selection is saved and restored on next visit

#### Scenario: Wall collision per difficulty
- **WHEN** Easy difficulty is active
- **THEN** the snake wraps to the opposite edge on wall contact
- **WHEN** Medium or Hard difficulty is active
- **THEN** the snake dies on wall contact (GAMEOVER)

### Requirement: Progressive Speed
The system SHALL increase snake speed as the player's score increases.

#### Scenario: Speed increase
- **GIVEN** the player scores points
- **WHEN** the score increases
- **THEN** the tick rate increases by 1 per `speedScoreStep` points scored

#### Scenario: Maximum speed
- **GIVEN** the snake has accelerated
- **WHEN** the tick rate would exceed the difficulty's maximum
- **THEN** the tick rate is capped at the difficulty's `maxTickRate`

#### Scenario: Speed reset
- **WHEN** a new game starts
- **THEN** the tick rate resets to the difficulty's `baseTickRate`

### Requirement: Bonus Food
The system SHALL spawn time-limited bonus food worth extra points.

#### Scenario: Bonus spawn
- **GIVEN** no special food is currently on the grid
- **WHEN** a periodic spawn check occurs (every 10 ticks) and random chance succeeds (based on difficulty's `bonusFoodChance`)
- **THEN** bonus food spawns at a random valid position with a 60-tick (6s) timer

#### Scenario: Bonus timer
- **WHEN** bonus food is approaching expiry (< 25% time remaining)
- **THEN** it blinks to warn the player

#### Scenario: Bonus eaten
- **WHEN** the snake eats bonus food
- **THEN** the player receives 25 points and the snake grows

#### Scenario: Bonus expires
- **WHEN** the bonus food timer reaches zero
- **THEN** the bonus food disappears

#### Scenario: Bonus visual
- **WHEN** bonus food is rendered
- **THEN** it appears as a 4-pointed star shape using the theme's `bonusFood` color with a subtle pulse animation

### Requirement: Toxic Food
The system SHALL spawn time-limited toxic food that deducts points when eaten, with escalating penalties.

#### Scenario: Toxic spawn
- **GIVEN** no special food is currently on the grid
- **WHEN** a periodic spawn check occurs and random chance succeeds (based on difficulty's `toxicFoodChance`)
- **THEN** toxic food spawns at a random valid position with a 60-tick timer

#### Scenario: Toxic eaten
- **WHEN** the snake eats toxic food
- **THEN** the player loses points: `penalty = -5 * ceil(score / 50)` (minimum -5, scales with score)

#### Scenario: Toxic game over
- **WHEN** the toxic penalty causes score to go below zero
- **THEN** the score is set to 0 and the game transitions to GAMEOVER

#### Scenario: Toxic expires
- **WHEN** the toxic food timer reaches zero
- **THEN** the toxic food disappears

#### Scenario: Toxic visual
- **WHEN** toxic food is rendered
- **THEN** it appears as a diamond shape with an exclamation mark using the theme's `poisonFood` color

#### Scenario: Toxic availability
- **WHEN** Easy difficulty is active
- **THEN** toxic food never spawns (chance is 0%)

### Requirement: Lethal Food
The system SHALL spawn time-limited lethal food that instantly ends the game if eaten.

#### Scenario: Lethal spawn
- **GIVEN** no special food is currently on the grid
- **WHEN** a periodic spawn check occurs and random chance succeeds (based on difficulty's `lethalFoodChance`)
- **THEN** lethal food spawns at a random valid position with a 60-tick timer

#### Scenario: Lethal eaten
- **WHEN** the snake eats lethal food
- **THEN** the game immediately transitions to GAMEOVER

#### Scenario: Lethal expires
- **WHEN** the lethal food timer reaches zero
- **THEN** the lethal food disappears

#### Scenario: Lethal visual
- **WHEN** lethal food is rendered
- **THEN** it appears as a spiky circle with skull markings (X eyes, line mouth) using the theme's `poisonFood` color with a pulse animation

#### Scenario: Lethal availability
- **WHEN** Easy or Medium difficulty is active
- **THEN** lethal food never spawns (chance is 0%)

### Requirement: Difficulty Selection
The system SHALL allow players to select difficulty from the settings screen.

#### Scenario: Difficulty selector
- **WHEN** the settings screen is displayed
- **THEN** difficulty options (Easy, Medium, Hard) are shown as a segmented control

#### Scenario: Difficulty description
- **WHEN** the difficulty selector is displayed
- **THEN** each option includes a brief description of its parameters

#### Scenario: Apply difficulty
- **WHEN** the player selects a difficulty
- **THEN** the next game uses the selected difficulty parameters

#### Scenario: Locked mid-game
- **WHEN** the settings screen is opened during an active game (PLAYING or PAUSED)
- **THEN** the difficulty selector is visually disabled and clicks are ignored

### Requirement: Difficulty HUD
The system SHALL display the current difficulty on the in-game HUD.

#### Scenario: HUD display
- **WHEN** the game is in PLAYING, PAUSED, or GAMEOVER state
- **THEN** the difficulty name is shown alongside score and length on the canvas

### Requirement: Difficulty-Scoped Leaderboard
The system SHALL maintain leaderboard scores tagged by difficulty.

#### Scenario: Score storage
- **WHEN** a score is submitted to the leaderboard
- **THEN** the current difficulty is stored alongside the entry

#### Scenario: Filtered view (mid-game)
- **WHEN** the leaderboard is viewed from the pause screen
- **THEN** only scores for the current difficulty are shown, with the heading indicating the difficulty

#### Scenario: All scores view (menu)
- **WHEN** the leaderboard is viewed from the main menu or game over screen
- **THEN** all scores across all difficulties are shown, with a difficulty column per entry

#### Scenario: Legacy entries
- **GIVEN** leaderboard entries exist from before the difficulty system
- **WHEN** the leaderboard is displayed
- **THEN** legacy entries (no difficulty tag) appear in all views with a "—" in the difficulty column
