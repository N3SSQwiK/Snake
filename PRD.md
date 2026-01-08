# Snake Game - Product Requirements Document

## Overview
A browser-based snake game featuring classic gameplay with modern enhancements, multiple themes, difficulty settings, and full mobile support.

---

## Core Gameplay

### Movement & Controls
- **Keyboard**: Support both arrow keys AND WASD for movement
- **Mobile**: Swipe gesture controls for touch devices
- **Pause**: Spacebar or on-screen button to pause/resume

### Collision Behavior
- **Self-collision**: Game ends when snake hits itself
- **Wall collision**: Player-configurable setting
  - **On**: Game ends when hitting edges
  - **Off**: Snake wraps to opposite side

### Speed & Difficulty
- **Progressive speed**: Snake speed increases as score grows
- **Difficulty levels**: Easy, Medium, Hard (affects starting speed and acceleration rate)

---

## Food System

### Food Types
| Type | Behavior | Points |
|------|----------|--------|
| Regular | Persists until eaten | Standard points |
| Bonus | Higher value, may be time-limited | Extra points |
| Poisonous | Appears temporarily, must avoid | Game over or penalty if eaten |

- Poisonous food disappears automatically after a few seconds

---

## Scoring & Leaderboard

### Current Game Display
- Current score
- Current snake length
- High score indicator

### Leaderboard
- Top 10 local scores
- Player initials entry (arcade-style)
- Date/timestamp for each score
- Persisted via localStorage

### High Score Celebration
- Visual effects when achieving new high score
- Audio feedback for new record

---

## User Interface

### Start Menu
- Play button
- Settings access
- Leaderboard/High Scores view
- Theme selector

### Game Screen
- Visible grid on play area
- Score display
- Snake length display
- Pause button (mobile)

### Game Over Screen
- Animated overlay
- Final score display
- High score comparison
- New high score celebration (if applicable)
- Initials entry (if top 10)
- Restart button
- Return to menu option

---

## Settings (Player-Configurable)

| Setting | Options | Default |
|---------|---------|---------|
| Wall Collision | On / Off | On |
| Difficulty | Easy / Medium / Hard | Medium |
| Theme | Multiple visual themes | Classic |
| Animation Style | Smooth / Classic (grid-snap) | Smooth |
| Volume | Slider or mute toggle | On |

All settings persist between sessions via localStorage.

---

## Visual Design

### Themes
Multiple selectable color schemes, examples:
- Classic (green snake, black background)
- Neon (bright colors, dark background)
- Retro (pixel art style)
- Dark mode
- Light mode

### Grid
- Visible grid lines on game board
- Grid appearance may vary by theme

### Animations
- **Smooth mode**: Interpolated movement between cells
- **Classic mode**: Instant grid-to-grid movement
- Player-selectable preference

---

## Audio

### Sound Effects
- Food eaten (regular)
- Bonus food eaten
- Poisonous food appeared/disappeared
- Game over
- New high score achievement
- Button/menu interactions

### Controls
- Mute toggle
- Volume adjustment
- Settings persist between sessions

---

## Technical Requirements

### Platform Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for desktop and mobile
- Touch and keyboard input support

### Data Persistence
- localStorage for:
  - High scores and leaderboard
  - Player settings/preferences
  - Last used theme and difficulty

### Performance
- Smooth 60fps gameplay
- Efficient rendering (Canvas or similar)
- Minimal load time

---

## Future Considerations (Out of Scope for V1)
- Online leaderboards
- Multiplayer mode
- Additional game modes (timed, obstacles, etc.)
- Achievements/badges
- Custom theme creator
