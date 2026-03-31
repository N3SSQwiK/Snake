# achievements Specification

## Purpose
Achievement/badge system providing progression mechanics beyond high scores. Tracks player milestones, rewards varied play styles, and persists unlock state locally.

## Requirements

### Requirement: Achievement Catalog
The system SHALL define a static catalog of achievements, each with a unique ID, name, description, icon character, and unlock condition.

#### Scenario: Catalog structure
- **WHEN** the achievement catalog is initialized
- **THEN** each achievement entry contains: `id` (string), `name` (string), `description` (string), `icon` (single character), `condition` (function receiving game stats)

#### Scenario: Initial achievement set
- **WHEN** the game loads
- **THEN** the following achievements are available:
  - "First Blood" — eat your first food (total foods eaten >= 1)
  - "Glutton" — eat 50 food in a single game
  - "Speed Demon" — reach maximum tick rate in a single game
  - "Marathon" — survive for 500 ticks in a single game
  - "Century" — score 100 points in a single game
  - "Top 10" — qualify for the leaderboard
  - "Perfectionist" — fill all 10 leaderboard slots for any mode+difficulty
  - "Untouchable" — score 100 without wall collision enabled (Easy difficulty)
  - "Hazard Pay" — eat a toxic food item and survive the game with score > 0
  - "Hard Mode Hero" — score 200 on Hard difficulty
  - "Triple Threat" — make the leaderboard on 3 different difficulty levels
  - "All Rounder" — play every game mode at least once

#### Scenario: Catalog is immutable at runtime
- **WHEN** the game is running
- **THEN** the achievement catalog cannot be modified by gameplay code

### Requirement: Achievement Tracking
The system SHALL evaluate achievement conditions at relevant game events and unlock achievements when conditions are met.

#### Scenario: Check on food eaten
- **WHEN** the snake eats any food item during gameplay
- **THEN** the system evaluates food-related achievement conditions (First Blood, Glutton, Hazard Pay)

#### Scenario: Check on game over
- **WHEN** a game ends (state transitions to GAMEOVER)
- **THEN** the system evaluates all achievement conditions against final game stats (score, length, ticks survived, difficulty, mode, leaderboard qualification)

#### Scenario: Check on leaderboard update
- **WHEN** a score is added to the leaderboard
- **THEN** the system evaluates leaderboard-related achievements (Top 10, Perfectionist, Triple Threat)

#### Scenario: Achievement unlocked once
- **GIVEN** "First Blood" has already been unlocked
- **WHEN** the player eats food again in a later game
- **THEN** "First Blood" is not re-evaluated or re-triggered

#### Scenario: Multiple achievements in one event
- **GIVEN** the player eats their first food and reaches score 100 in the same tick
- **WHEN** achievement conditions are evaluated
- **THEN** both "First Blood" and "Century" unlock in the same check

#### Scenario: Session stats tracking
- **WHEN** a new game starts (state transitions to PLAYING)
- **THEN** per-session stats are reset: foods eaten, ticks survived, max tick rate reached, toxic foods eaten, and food types by category

### Requirement: Achievement Persistence
The system SHALL persist achievement unlock state and cumulative progress in localStorage via StorageManager.

#### Scenario: Unlock persistence
- **WHEN** an achievement is unlocked
- **THEN** its ID and unlock timestamp are saved to localStorage under key `achievements`

#### Scenario: Progress persistence
- **WHEN** a game ends
- **THEN** cumulative cross-session stats (total games played, modes played, difficulties with leaderboard entries) are saved under key `achievementProgress`

#### Scenario: Load on startup
- **WHEN** the game initializes
- **THEN** previously unlocked achievements and cumulative progress are loaded from localStorage

#### Scenario: Data integrity
- **GIVEN** localStorage contains corrupted achievement data
- **WHEN** the data is loaded
- **THEN** the system falls back to empty unlocks and zero progress without crashing

### Requirement: Unlock Notification Toast
The system SHALL display a non-blocking toast notification when an achievement is unlocked during gameplay or at game over.

#### Scenario: Toast appearance
- **WHEN** an achievement is unlocked
- **THEN** a toast appears showing the achievement icon, name, and "Achievement Unlocked!" label

#### Scenario: Toast positioning
- **WHEN** a toast is displayed
- **THEN** it appears at the top-center of the game container, above the canvas, and does not overlap the HUD

#### Scenario: Toast duration
- **WHEN** a toast appears
- **THEN** it is visible for 3 seconds, then fades out over 0.5 seconds

#### Scenario: Toast queueing
- **GIVEN** a toast is currently displayed
- **WHEN** another achievement is unlocked
- **THEN** the new toast is queued and displayed after the current toast finishes

#### Scenario: Toast does not block gameplay
- **WHEN** a toast is displayed during PLAYING state
- **THEN** the game continues running without pause or input interruption

#### Scenario: Toast accessibility
- **WHEN** a toast appears
- **THEN** the toast container has `role="status"` and `aria-live="polite"` so screen readers announce it

### Requirement: Achievement Gallery Screen
The system SHALL provide an achievement gallery accessible from the main menu.

#### Scenario: Menu access
- **GIVEN** the start menu is displayed
- **WHEN** the player selects "Achievements"
- **THEN** the achievement gallery screen is displayed

#### Scenario: Gallery layout
- **WHEN** the achievement gallery is displayed
- **THEN** achievements are shown in a scrollable list, each displaying icon, name, description, and unlock status

#### Scenario: Unlocked vs locked display
- **GIVEN** "First Blood" is unlocked and "Marathon" is locked
- **WHEN** the gallery is displayed
- **THEN** "First Blood" shows its icon with full opacity and unlock date; "Marathon" shows a lock icon with dimmed styling

#### Scenario: Progress counter
- **WHEN** the gallery header is displayed
- **THEN** it shows "X / Y" where X is unlocked count and Y is total achievements

#### Scenario: Gallery navigation
- **WHEN** the gallery is open
- **THEN** the player can navigate back to the menu via a back button, Escape key, or Backspace key

#### Scenario: Gallery accessibility
- **WHEN** the gallery is displayed
- **THEN** each achievement item has an accessible label combining name, description, and lock status
- **AND** the gallery container has `role="list"` and each item has `role="listitem"`

### Requirement: Achievement Audio Feedback
The system SHALL play a distinct sound when an achievement is unlocked.

#### Scenario: Unlock sound
- **WHEN** an achievement is unlocked
- **THEN** a celebratory ascending tone sequence plays (distinct from theme unlock and high score sounds)

#### Scenario: Sound respects volume settings
- **WHEN** audio is muted or volume is 0
- **THEN** no achievement sound plays

### Requirement: Menu Integration
The system SHALL add an Achievements button to the start menu.

#### Scenario: Button placement
- **WHEN** the start menu is displayed
- **THEN** an "Achievements" button is present between "High Scores" and "Settings"

#### Scenario: Button shows progress
- **WHEN** the start menu is displayed
- **THEN** the Achievements button label includes the unlock count (e.g., "Achievements (3/12)")

#### Scenario: Keyboard navigation
- **WHEN** the player navigates the menu with arrow keys or WASD
- **THEN** the Achievements button is focusable in the normal tab order
