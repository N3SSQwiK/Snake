## Why

The game canvas is hardcoded to 500×500px (25×25 grid × 20px cells). On modern desktop and tablet screens this appears small and centered with large empty margins. The entire app — canvas, menus, settings, HUD, D-pad — should scale to fill the browser viewport for an immersive experience on any screen size.

## What Changes

- Add `Renderer.resizeToFit()` method that dynamically sets canvas bitmap resolution to match display size × devicePixelRatio, with `ctx.scale()` so all existing drawing code works unchanged in the 500×500 logical coordinate system
- Add JS resize handler (debounced) that computes available space after HUD and D-pad, calls `resizeToFit()`, and sets a `--game-scale` CSS custom property
- Update `Renderer.clear()` to use logical `CANVAS_WIDTH`/`CANVAS_HEIGHT` instead of bitmap dimensions (required since context is now scaled)
- Normalize `shadowBlur` values against the scale factor so glow effects look consistent at all sizes
- Update CSS: container fills viewport, canvas sizing delegated to JS, overlay panels/buttons/title/HUD scale via `clamp()` with `--game-scale`
- D-pad button sizing derived from `--game-scale` custom property

## Capabilities

### New Capabilities
- `responsive-scaling`: Dynamic canvas scaling, viewport-aware layout, and proportional UI element sizing across all screen sizes and device pixel ratios

### Modified Capabilities
- `ui-screens`: Overlay panels, buttons, titles, and headings scale proportionally with viewport size via `--game-scale` CSS custom property

## Impact

- **game.js**: Renderer class (`resizeToFit`, `clear`, `glowScale`), DOMContentLoaded init block (resize handler), ~10 `shadowBlur` lines
- **styles.css**: `.game-container` fills viewport, `#game-canvas` constraints removed, `.ui-panel`/`.ui-title`/`.ui-heading`/`.ui-btn` use `clamp()` scaling, `.dpad` uses CSS custom properties for sizing, `.game-hud` spans full width
- **game.test.js**: Renderer tests that assert `canvas.width === 500` need updating
- **index.html**: No changes (viewport meta tag already correct)
