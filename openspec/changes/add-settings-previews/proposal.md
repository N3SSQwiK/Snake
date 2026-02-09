## Why

Settings controls and theme swatches offer no indication of what they do before activation. Players must change a setting, return to gameplay, evaluate the effect, then go back to settings if they want to revert. Animated inline previews eliminate this trial-and-error loop and make the settings screen self-documenting.

## What Changes

- Add animated preview canvas below the Difficulty segmented selector showing wall behavior for the selected difficulty (wrap-around for Easy, wall-kill for Medium/Hard)
- Add animated preview canvas below the Smooth Animation toggle showing side-by-side comparison of interpolated vs grid-snap movement (hidden when toggle is disabled by Reduce Motion)
- Add animated preview to each theme swatch showing a mini snake moving on that theme's background/grid colors
- All previews are lightweight canvas animations (not static images) that run only while the settings screen is visible
- Previews pause/destroy when navigating away from settings to avoid unnecessary rendering

## Capabilities

### New Capabilities
- `settings-previews`: Animated canvas-based previews for Difficulty selector (wall behavior), Smooth Animation toggle (side-by-side), and theme swatches (mini snake animation using theme colors)

### Modified Capabilities
- `ui-screens`: Settings screen layout changes to accommodate preview canvases below setting rows and within theme swatches

## Impact

- **Code**: New `PreviewManager` class handles preview canvases; `UIManager.showSettings`/`hideSettings` manage preview animation lifecycle
- **HTML**: New `<canvas>` elements added to settings screen structure (or dynamically created)
- **CSS**: Layout adjustments for preview containers; responsive sizing for mobile
- **Performance**: Multiple small canvases animate simultaneously; must be lightweight (low FPS, simple geometry) to avoid battery/CPU impact on mobile

## Current Settings Layout

The settings screen has these groups (relevant for preview placement):
- **Difficulty**: Segmented selector (Easy/Medium/Hard) — preview goes below this
- **Sound**: Volume slider, Mute toggle — no previews
- **Accessibility**: Reduce Motion, Smooth Animation (aria-disabled when Reduce Motion on), Shape Outlines, Extended Time Mode — Smooth Animation gets preview
- **Theme**: Theme picker grid — each swatch gets preview
