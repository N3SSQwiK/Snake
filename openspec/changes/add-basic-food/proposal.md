# Change: Add Basic Food System

## Why
Food is essential for gameplay - it gives the player a goal and causes the snake to grow. This proposal adds basic food spawning, collision detection, and scoring to create a complete playable game.

## What Changes
- Create Food class with:
  - Position (grid coordinates)
  - Random spawn logic (avoiding snake body)
  - Food-snake collision detection
- Add scoring system:
  - Current score counter
  - Snake length display
  - Score increment on food eaten
- Integrate with Game tick cycle
- Render food and score display

## Design Requirements

> **MANDATORY**: Use `/game-ui-design` skill before implementing food visual design.

### Food Visual Design
| Element | Design Specification |
|---------|---------------------|
| Shape | Square (fills grid cell) or circular with padding |
| Size | Fits within grid cell with 2px inset (matches snake segments) |
| Color | Distinct from snake and background (default: red `#ff0000`) |
| Animation | Optional: subtle pulse or glow to draw attention |

### Food Rendering Options to Design
1. **Simple Square** - Filled rectangle matching snake segment style
2. **Circle** - Rounded food item for visual contrast with angular snake
3. **Apple/Fruit** - Stylized shape suggesting food (advanced)

### Score Display Design
| Element | Design Specification |
|---------|---------------------|
| Position | Top-left corner or above canvas |
| Typography | Clear, readable font; monospace for score numbers |
| Format | "Score: 000" or minimal "0" with icon |
| Color | Contrasts with background, uses theme text color |

### Design Considerations
- Food must be clearly visible against all theme backgrounds
- Score should be readable without distracting from gameplay
- Consider colorblind accessibility (shape differentiation, not just color)

## Impact
- Affected specs: `food-system` (new capability)
- Affected code: `game.js` (add Food class, scoring, integrate with Game)
- Depends on: `snake-mechanics`, `input-handling`
- **Milestone: Completes minimal playable game**
