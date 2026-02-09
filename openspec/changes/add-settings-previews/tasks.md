## 1. PreviewManager Core

- [x] 1.1 Create `PreviewManager` class with shared rAF loop that updates all registered preview canvases; loop runs continuously until settings screen is closed
- [x] 1.2 Implement `start()` / `stop()` lifecycle methods that create and cancel the animation frame loop
- [x] 1.3 Implement preview snake path logic (fixed looping route on a small grid, e.g., clockwise rectangle) that repeats indefinitely
- [x] 1.4 Add low tick rate accumulator (4-6 FPS game logic) with optional interpolation for smooth preview variant

## 2. Difficulty Preview

- [x] 2.1 Create single canvas renderer for Difficulty preview below the segmented selector
- [x] 2.2 Implement Easy difficulty preview: snake moving with wrap-through arrows at edges
- [x] 2.3 Implement Medium difficulty preview: snake moving with toxic food (diamond shape)
- [x] 2.4 Implement Hard difficulty preview: snake moving with toxic and lethal food (spiky circle)
- [x] 2.5 Wire difficulty selector clicks to update preview behavior
- [x] 2.6 Style difficulty preview container (CSS, responsive sizing for mobile)

## 3. Smooth Animation Preview

- [x] 3.1 Create side-by-side canvas pair renderer for Smooth Animation preview (two labeled canvases: "Smooth" / "Classic")
- [x] 3.2 Implement smooth preview: left canvas shows interpolated movement looping, right canvas shows grid-snap movement looping
- [x] 3.3 Hide preview container when Smooth Animation toggle has `aria-disabled="true"` (Reduce Motion is on)
- [x] 3.4 React to Reduce Motion toggle changes while settings are open: show/hide Smooth Animation preview accordingly
- [x] 3.5 Style Smooth Animation preview container and labels (CSS, responsive sizing for mobile)

## 4. Theme Swatch Previews

- [x] 4.1 Replace static color-dot preview in each theme swatch with a dynamically created mini-canvas
- [x] 4.2 Render mini snake animation on each swatch canvas using that theme's background, grid, snakeHead, and snakeTail colors, looping continuously
- [x] 4.3 Ensure locked theme swatches still animate but remain visually dimmed
- [x] 4.4 Size swatch canvases to match existing preview bar dimensions (28px desktop, 20px mobile)

## 5. Integration & Lifecycle

- [x] 5.1 Wire `PreviewManager` creation into `UIManager.showSettings()` — create canvases and start loop
- [x] 5.2 Wire `PreviewManager` teardown into `UIManager.hideSettings()` — stop loop and remove canvases from DOM
- [x] 5.3 Ensure `renderThemePicker()` rebuilds swatch previews when called (theme unlock, re-render)

## 6. Responsive & Polish

- [x] 6.1 Add mobile breakpoint CSS for preview canvas sizing (scale down at 480px)
- [x] 6.2 Verify no rAF loops run when settings screen is closed (check with browser dev tools)
- [x] 6.3 Test on mobile device: layout fits without excessive scrolling, animations are smooth
