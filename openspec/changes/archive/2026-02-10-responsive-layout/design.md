## Context

The game renders to a 500×500 HTML canvas (25×25 grid, 20px cells). All drawing code uses `CELL_SIZE` (20) and `CANVAS_WIDTH`/`CANVAS_HEIGHT` (500) constants for positioning. The canvas sits in a flex column container with a HUD above and an optional D-pad below. Overlay screens (menu, settings, leaderboard, pause, game over) are absolutely positioned over the container.

CSS already has `object-fit: contain` and `max-width: 100vw` on the canvas, but no explicit CSS width/height, so the canvas just renders at its intrinsic 500×500 size. Touch input uses swipe deltas for direction (not position mapping), so CSS scaling of the canvas is safe.

## Goals / Non-Goals

**Goals:**
- Canvas fills available viewport space (minus HUD and D-pad) while maintaining 1:1 aspect ratio
- Crisp rendering at all sizes including high-DPI screens (via devicePixelRatio-aware bitmap sizing)
- All UI elements (panels, buttons, titles, D-pad) scale proportionally
- Zero changes to existing drawing code coordinates (all 60+ `CELL_SIZE` references stay as-is)
- Smooth handling of window resize, orientation change, and DPI change

**Non-Goals:**
- Changing the grid dimensions (stays 25×25)
- Non-square canvas or different aspect ratios
- Server-side rendering or offscreen canvas

## Decisions

**Hybrid JS + CSS approach**: Pure CSS scaling of a 500×500 bitmap produces blurry results on large screens. The game uses bezier curves, arcs, and glow effects that don't suit `image-rendering: pixelated`. Instead, JS dynamically sizes the canvas bitmap to `displaySize × devicePixelRatio` and applies `ctx.scale(bitmapSize / 500)` so drawing code operates in the original 500×500 coordinate space at full resolution.

**`--game-scale` CSS custom property**: Set by JS as `displaySize / 500`. Used by CSS `clamp()` functions to scale panel widths, button sizes, font sizes, and D-pad dimensions proportionally. This avoids hardcoded breakpoints for every element and scales continuously.

**`clear()` applies `setTransform` every frame**: Since `canvas.width = ...` resets context state, and resize events can happen between frames, `clear()` re-applies the scale transform at the start of each frame. Cost is negligible (register write, not a draw call).

**`shadowBlur` normalization**: Canvas `shadowBlur` scales with the context transform. On a 2× display showing a 900px canvas, `shadowBlur: 8` would render as ~29px — too large. A `glowScale` getter (`CANVAS_WIDTH / canvas.width`) normalizes this so glow effects look identical at every size.

**Debounced resize (100ms)**: Window resize events fire at 60Hz during drag. Resizing the canvas bitmap each frame causes flicker. A 100ms debounce is imperceptible to the user.

**Available space calculation**: `window.innerHeight - hudHeight - dpadHeight - margin` for height, `window.innerWidth - margin` for width. The smaller dimension constrains the square canvas. HUD and D-pad heights are measured dynamically since they vary (D-pad is conditionally visible, HUD wraps on narrow screens).

## Risks / Trade-offs

**Preview canvases unaffected**: The settings preview canvases (difficulty, smooth animation, theme swatches) have their own local dimensions and don't use the main Renderer. They remain at their fixed small sizes inside panels, which is correct — they're thumbnails, not gameplay.

**Grid line width**: At `ctx.lineWidth = 1` in the logical coordinate space, grid lines render at `scale` physical pixels wide. On very large canvases they may appear thicker than intended. Can be addressed by setting `lineWidth = 0.5` if testing reveals it's an issue.

**Test updates**: Renderer tests that assert `canvas.width === 500` will need to account for the new dynamic sizing or mock `resizeToFit`. Minimal impact — only the Renderer constructor tests are affected.
