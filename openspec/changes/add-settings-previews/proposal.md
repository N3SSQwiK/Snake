## Why

Settings toggles and theme swatches offer no indication of what they do before activation. Players must change a setting, return to gameplay, evaluate the effect, then go back to settings if they want to revert. Animated inline previews eliminate this trial-and-error loop and make the settings screen self-documenting.

## What Changes

- Add animated preview canvases next to/below Wall Collision and Smooth Animation toggles showing side-by-side comparison of on vs off behavior
- Add animated preview to each theme swatch showing a mini snake moving on that theme's background/grid colors
- All previews are lightweight canvas animations (not static images) that run only while the settings screen is visible
- Previews pause/destroy when navigating away from settings to avoid unnecessary rendering

## Capabilities

### New Capabilities
- `settings-previews`: Animated canvas-based previews for settings toggles (wall collision side-by-side, smooth animation side-by-side) and theme swatches (mini snake animation using theme colors)

### Modified Capabilities
- `ui-screens`: Settings screen layout changes to accommodate preview canvases below toggle rows and within theme swatches

## Impact

- **Code**: `Renderer` class gains preview-rendering helpers; `UIManager.showSettings`/`hideSettings` manage preview animation lifecycle
- **HTML**: New `<canvas>` elements added to settings screen structure (or dynamically created)
- **CSS**: Layout adjustments for preview containers; responsive sizing for mobile
- **Performance**: Multiple small canvases animate simultaneously; must be lightweight (low FPS, simple geometry) to avoid battery/CPU impact on mobile
