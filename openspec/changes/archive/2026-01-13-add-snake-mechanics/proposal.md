# Change: Add Snake Mechanics

## Why
The snake is the core gameplay element. Players need to control a snake that moves on the grid, grows when eating food, and dies when colliding with itself.

## What Changes
- Create Snake class with:
  - Body represented as array of grid coordinates
  - Direction property (up/down/left/right)
  - Movement logic (shift body segments)
  - Growth mechanic (add segment on next move)
  - Self-collision detection
- Integrate Snake with Game class tick/render cycle
- Render snake body and head with distinct colors

## Design Requirements

> **MANDATORY**: Use `/game-ui-design` skill before implementing snake visual design.

### Snake Visual Design
| Element | Design Specification |
|---------|---------------------|
| Head | Distinct color from body (darker/lighter shade) |
| Body | Consistent color for all segments |
| Segment Size | Grid cell with 2px inset padding |
| Shape | Square segments (classic) or rounded corners (modern) |

### Snake Rendering Styles to Design
1. **Classic Grid** - Simple filled squares, head slightly different shade
2. **Rounded Segments** - Rounded rectangles for softer appearance
3. **Connected Body** - Segments visually connect (no gaps between)
4. **Gradient Body** - Color gradient from head to tail

### Head Direction Indicator (Optional Enhancement)
- Eyes or directional marker showing movement direction
- Helps player quickly identify snake orientation
- Options: dots for eyes, arrow shape, asymmetric head

### Animation Considerations
| Mode | Description |
|------|-------------|
| Classic (Grid-Snap) | Snake jumps from cell to cell each tick |
| Smooth (Interpolated) | Snake smoothly slides between cells (60fps) |

### Color Specifications (Default Theme)
| Element | Color | Hex |
|---------|-------|-----|
| Snake Body | Bright Green | `#00ff00` |
| Snake Head | Dark Green | `#00aa00` |

### Design Considerations
- Head must be clearly distinguishable from body for gameplay clarity
- Snake should stand out against grid and background
- Consider colorblind users: brightness contrast between head/body
- Smooth animation mode requires interpolation between grid positions

## Impact
- Affected specs: `snake-mechanics` (new capability)
- Affected code: `game.js` (add Snake class, integrate with Game)
- Depends on: `core-game-loop`
