# Change: Add Difficulty System

## Why
Progressive challenge keeps the game engaging. Difficulty levels let players choose their challenge, while speed increases reward skilled play. Advanced food types add strategic depth.

## What Changes
- Difficulty levels:
  - Easy, Medium, Hard presets
  - Each level defines starting speed and acceleration rate
  - Add difficulty selector to settings
- Progressive speed:
  - Snake speed increases as score grows
  - Acceleration rate based on difficulty
  - Maximum speed cap
- Advanced food types:
  - Bonus food: higher points, time-limited
  - Poisonous food: must avoid, time-limited, game over if eaten
  - Random spawning with configurable probabilities

## Design Requirements

> **MANDATORY**: Use `/game-ui-design` skill before implementing food type visuals and difficulty UI.

### Advanced Food Type Visual Design
| Food Type | Color | Shape/Pattern | Accessibility |
|-----------|-------|---------------|---------------|
| Regular | Red (`#ff0000`) | Square or circle | Base reference |
| Bonus | Yellow/Gold (`#ffff00`) | Star shape or sparkle effect | Distinct shape from regular |
| Poison | Purple/Magenta (`#ff00ff`) | Skull icon, X pattern, or spiky edges | Warning pattern (stripes/dots) |

### Food Type Differentiation (Critical for Accessibility)
Food types MUST be distinguishable by more than just color:

| Food Type | Primary Indicator | Secondary Indicator |
|-----------|-------------------|---------------------|
| Regular | Solid fill | Standard shape |
| Bonus | Sparkle/glow animation | Star or diamond shape |
| Poison | Warning pattern (stripes) | Spiky/angular edges or skull |

### Timer Display Design
- Visual countdown for time-limited food (bonus/poison)
- Options: shrinking outline, fading opacity, circular progress ring
- Clear indication when food is about to disappear

### Difficulty Selector UI Design
| Element | Design Specification |
|---------|---------------------|
| Layout | 3 buttons (Easy/Medium/Hard) or segmented control |
| Selection State | Clear highlight for current difficulty |
| Descriptions | Brief text explaining each level's challenge |
| Position | Settings screen, prominent placement |

### Difficulty Level Descriptions
- **Easy**: "Relaxed pace, no poison food"
- **Medium**: "Moderate speed, occasional hazards"
- **Hard**: "Fast and dangerous, for experts"

## Impact
- Affected specs: `difficulty-system` (new capability)
- Affected code: `game.js` (speed system, food types, difficulty config)
- Depends on: `basic-food`, `ui-screens`
