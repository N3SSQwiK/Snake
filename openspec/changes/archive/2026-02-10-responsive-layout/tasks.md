## 1. Renderer: Dynamic Canvas Sizing

- [x] 1.1 Add `displaySize` and `scale` properties (default `CANVAS_WIDTH` and `1`) to `Renderer` constructor
- [x] 1.2 Add `resizeToFit(containerWidth, containerHeight)` method: compute largest square, set CSS width/height, set bitmap resolution (displaySize × devicePixelRatio), apply `ctx.scale(bitmapSize / CANVAS_WIDTH)`
- [x] 1.3 Update `clear()` to use `setTransform` + `CANVAS_WIDTH`/`CANVAS_HEIGHT` instead of `canvas.width`/`canvas.height`
- [x] 1.4 Add `glowScale` getter: `CANVAS_WIDTH / canvas.width`
- [x] 1.5 Replace all `shadowBlur = N` with `shadowBlur = N * this.glowScale` (~10 occurrences in draw methods)
- [x] 1.6 Write tests: `resizeToFit` sets correct canvas dimensions and CSS style, `clear` uses logical dimensions, `glowScale` returns correct ratio

## 2. Resize Handler

- [x] 2.1 Add `handleResize()` function in DOMContentLoaded block (after `game.start()`): measure HUD height, D-pad height (if visible), compute available space with margin, call `game.renderer.resizeToFit()`, set `--game-scale` CSS property
- [x] 2.2 Add debounced `resize` event listener (100ms) on `window`
- [x] 2.3 Call `handleResize()` immediately on load for initial sizing
- [x] 2.4 Write tests: verify resize handler sets `--game-scale` property

## 3. CSS: Container and Canvas

- [x] 3.1 Update `.game-container`: `width: 100vw; height: 100dvh` (replace `max-width`/`max-height`)
- [x] 3.2 Update `#game-canvas`: remove `max-width`, `max-height`, `object-fit` (JS handles sizing)
- [x] 3.3 Add `--game-scale: 1` to `:root` custom properties

## 4. CSS: Proportional UI Scaling

- [x] 4.1 Update `.ui-panel`: `min-width: min(280px, 85vw)`, `max-width: clamp(280px, calc(340px * var(--game-scale)), 520px)`, `padding` via clamp
- [x] 4.2 Update `.ui-title` font-size: `clamp(1.5rem, calc(2rem * var(--game-scale)), 3rem)`
- [x] 4.3 Update `.ui-heading` font-size: `clamp(1.125rem, calc(1.25rem * var(--game-scale)), 1.75rem)`
- [x] 4.4 Update `.ui-btn` padding and font-size with `clamp()` + `--game-scale`
- [x] 4.5 Update `.game-hud`: add `width: 100%` for full-width spanning

## 5. CSS: D-Pad and Mobile Scaling

- [x] 5.1 Add `--dpad-size` and `--dpad-btn-size` custom properties to `.dpad` using `clamp()` with `--game-scale`
- [x] 5.2 Update `.dpad__btn` width/height to use `var(--dpad-btn-size)`
- [x] 5.3 Update D-pad button positioning (`top`, `left`, `bottom`, `right`) to use `var(--dpad-btn-size)`
- [x] 5.4 Update `.mobile-pause-btn` sizing with `clamp()` + `--game-scale`

## 6. Tests and Verification

- [x] 6.1 Update any existing Renderer tests that assert `canvas.width === 500` to account for dynamic sizing
- [x] 6.2 Run full test suite, fix regressions
- [x] 6.3 Manual browser test: desktop wide viewport (canvas fills height, centered)
- [x] 6.4 Manual browser test: desktop narrow viewport (canvas fills width, centered)
- [x] 6.5 Manual browser test: resize window (canvas scales after debounce)
- [x] 6.6 Manual browser test: all overlay panels scale proportionally
- [x] 6.7 Manual browser test: mobile portrait with D-pad (canvas + HUD + D-pad all fit)
- [x] 6.8 Manual browser test: glow effects consistent at different sizes
