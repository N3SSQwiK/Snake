# Change: Add Theme System

## Why
Visual customization increases player engagement. Multiple themes allow players to personalize their experience with different color schemes and visual styles.

## What Changes
- Create theme system:
  - Theme objects with color definitions for canvas elements
  - CSS custom properties for UI elements
  - 5 built-in themes: Classic, Neon, Retro, Dark, Light
- Theme selection:
  - Add theme picker to settings screen
  - Preview themes before selection
  - Persist selected theme
- Apply themes:
  - Renderer uses active theme colors
  - UI elements use CSS variables
  - Smooth theme transition

## Design Requirements

> **MANDATORY**: Use `/game-ui-design` skill before implementing theme designs.

### Theme Color Palettes Required
Each theme must define colors for:

| Element | Description |
|---------|-------------|
| `background` | Canvas background color |
| `grid` | Grid line color |
| `snake` | Snake body segment color |
| `snakeHead` | Snake head color (distinct from body) |
| `food` | Regular food color |
| `bonusFood` | Bonus food color (high value) |
| `poisonFood` | Poison food color (danger indicator) |
| `text` | Primary text color |
| `accent` | Accent/highlight color |
| `button` | Button background |
| `buttonHover` | Button hover state |
| `overlay` | Semi-transparent overlay backdrop |

### Built-in Themes to Design
1. **Classic** - Traditional green-on-black arcade style
2. **Neon** - Vibrant glowing colors on dark background
3. **Retro** - Warm, nostalgic CRT-inspired palette
4. **Dark** - Modern dark mode with subtle contrast
5. **Light** - Clean, bright daytime-friendly theme

### Theme Picker UI Design
- Grid or list of theme options with color preview swatches
- Current theme indicator (checkmark or highlight)
- Smooth transition animation between themes (300ms)

## Impact
- Affected specs: `theme-system` (new capability)
- Affected code: `game.js` (theme definitions, Renderer updates), `styles.css` (CSS variables), `index.html` (theme selector)
- Depends on: `ui-screens` (settings screen exists)
