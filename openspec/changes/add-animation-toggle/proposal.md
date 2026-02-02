# Change: Add Animation Toggle

## Why
The snake currently moves in grid-snap steps. Adding smooth interpolation between cells makes movement feel fluid and modern, while keeping the classic snap mode available for players who prefer it. This is a rendering-only change — game logic stays fixed-step.

## What Changes
- Add animation style setting: Smooth (interpolated) vs Classic (grid-snap)
- Smooth mode:
  - Track time since last game tick
  - Calculate interpolation factor (0.0–1.0) between ticks
  - Render each snake segment at interpolated position between previous and current grid cell
  - Food and grid remain snapped to grid
- Classic mode: existing behavior (instant grid-to-grid rendering)
- Settings toggle in settings screen
- Persist preference via StorageManager
- Default to Smooth

## Capabilities

### New Capabilities
- `animation-toggle` — smooth interpolation rendering, animation style setting

### Modified Capabilities
None

## Impact
- Affected code: `game.js` (Renderer interpolation, Game tick timing exposure, settings toggle), `index.html` (toggle in settings), `styles.css` (toggle styling)
- Touches the render loop fundamentally — Renderer needs previous + current snake positions and a lerp factor each frame
