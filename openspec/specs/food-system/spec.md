# food-system Specification

## Purpose
Manages food spawning, collision detection, decay, scoring, and rendering for all food types in the snake game.

## Requirements

### Requirement: Food Spawning
The system SHALL spawn food at random grid positions that do not overlap with the snake.

#### Scenario: Initial food spawn
- **WHEN** a new game starts
- **THEN** regular food is spawned at a random position not occupied by the snake

#### Scenario: Respawn after eaten
- **WHEN** the snake eats regular food
- **THEN** new regular food is immediately spawned at another valid position

#### Scenario: Avoid snake collision
- **GIVEN** the snake occupies multiple grid cells
- **WHEN** food spawns
- **THEN** the food position does not overlap any snake segment

#### Scenario: Spawn with bounded attempts
- **GIVEN** the grid has limited free cells
- **WHEN** random spawn attempts exceed max tries (100)
- **THEN** the system computes valid cells and selects randomly from them

#### Scenario: Full grid
- **GIVEN** no valid cells remain
- **WHEN** food spawn is attempted
- **THEN** the spawn fails and food state is cleared (position and spawnTick set to null)

### Requirement: Food Types
The system SHALL support four food types: regular, bonus, toxic, and lethal.

#### Scenario: Regular food
- **WHEN** the snake eats regular food
- **THEN** the player gains 10 points and the snake grows by 1 segment

#### Scenario: Bonus food
- **WHEN** the snake eats bonus food
- **THEN** the player gains 25 points and the snake grows by 1 segment

#### Scenario: Toxic food
- **WHEN** the snake eats toxic food
- **THEN** the player loses points based on the formula `-5 * ceil(score / 50)` (minimum -5)
- **AND** if the score would go below zero, it is set to 0 and the game ends (GAMEOVER)

#### Scenario: Lethal food
- **WHEN** the snake eats lethal food
- **THEN** the game immediately transitions to GAMEOVER

#### Scenario: Special food slot
- **GIVEN** the game maintains a separate "special food" slot alongside regular food
- **WHEN** a special food (bonus, toxic, or lethal) spawns
- **THEN** it occupies the special slot and does not replace regular food

### Requirement: Special Food Spawning
The system SHALL spawn special food on a periodic check based on difficulty configuration.

#### Scenario: Spawn check
- **GIVEN** no special food is currently on the grid
- **WHEN** a tick occurs that is a multiple of 10
- **THEN** a random roll determines whether special food spawns, and which type, based on the difficulty's chance values

#### Scenario: Spawn exclusion
- **WHEN** special food spawns
- **THEN** it avoids all snake segments and the current regular food position

#### Scenario: Special food timer
- **WHEN** special food spawns
- **THEN** it has a 60-tick (6 second) decay timer

### Requirement: Food Decay
The system SHALL decay uneaten food after a timeout.

#### Scenario: Regular food expires
- **GIVEN** regular food has been spawned
- **WHEN** the food is not eaten within 100 ticks (10 seconds)
- **THEN** the food disappears and new regular food spawns

#### Scenario: Special food expires
- **GIVEN** special food has been spawned
- **WHEN** the special food is not eaten within 60 ticks (6 seconds)
- **THEN** the special food disappears (special slot cleared)

#### Scenario: Decay timer reset
- **WHEN** new food spawns (after eating or decay)
- **THEN** the decay timer resets to full duration

#### Scenario: Visual decay warning
- **GIVEN** food is approaching decay timeout
- **WHEN** less than 25% of decay time remains
- **THEN** the food blinks (hidden on odd 5-tick intervals) to indicate imminent decay

### Requirement: Food Collision
The system SHALL detect when the snake's head occupies the same cell as food.

#### Scenario: Collision detected
- **GIVEN** food is at position (x, y)
- **WHEN** the snake's head moves to (x, y)
- **THEN** food collision is detected

#### Scenario: No collision
- **GIVEN** food is at position (x, y)
- **WHEN** the snake's head is at a different position
- **THEN** no food collision is detected

#### Scenario: Null position
- **GIVEN** food has no position (null)
- **WHEN** collision is checked
- **THEN** no collision is detected

### Requirement: Snake Growth on Eating
The system SHALL trigger snake growth when regular or bonus food is eaten.

#### Scenario: Eat regular food
- **WHEN** regular food collision is detected
- **THEN** the snake's grow method is triggered and length increases by 1

#### Scenario: Eat bonus food
- **WHEN** bonus food collision is detected
- **THEN** the snake's grow method is triggered and length increases by 1

#### Scenario: Eat toxic or lethal food
- **WHEN** toxic or lethal food is eaten
- **THEN** the snake does NOT grow

### Requirement: Score Tracking
The system SHALL track and display the player's current score, snake length, and difficulty.

#### Scenario: Score increment
- **WHEN** the snake eats food
- **THEN** the score changes by the food type's point value (positive or negative)

#### Scenario: Score display
- **WHEN** the game is in PLAYING, PAUSED, or GAMEOVER state
- **THEN** the current score, snake length, and difficulty name are visible on the canvas HUD

#### Scenario: Score reset
- **WHEN** a new game starts
- **THEN** the score is reset to zero

### Requirement: Food Rendering
The system SHALL render each food type with a distinct visual shape using theme colors.

#### Scenario: Regular food
- **WHEN** regular food is rendered
- **THEN** it appears as an apple shape (bezier curves) with stem and leaf, using `theme.colors.food`, `foodStem`, and `foodLeaf`

#### Scenario: Bonus food
- **WHEN** bonus food is rendered
- **THEN** it appears as a 4-pointed star with a subtle size pulse, using `theme.colors.bonusFood`

#### Scenario: Toxic food
- **WHEN** toxic food is rendered
- **THEN** it appears as a diamond with an exclamation mark, using `theme.colors.poisonFood`

#### Scenario: Lethal food
- **WHEN** lethal food is rendered
- **THEN** it appears as a 16-point spiky circle with skull markings (X eyes, line mouth) and a size pulse, using `theme.colors.poisonFood`

#### Scenario: Glow effect
- **WHEN** food is rendered
- **THEN** a shadow/glow effect is applied using the food's theme color

#### Scenario: Render decay warning
- **GIVEN** food is in decay warning state (< 25% time remaining)
- **WHEN** the game renders a frame
- **THEN** the food blinks (alternating visible/hidden every 5 ticks)

#### Edge Cases
- Spawn uses bounded random attempts, falling back to computed valid cells
- Food decay prevents grid congestion regardless of snake length
- Theme colors used (not hardcoded) for accessibility across themes
- Full grid returns false from spawn and clears food state
