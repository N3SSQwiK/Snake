## 1. PreviewManager Core

- [ ] 1.1 Create `PreviewManager` class with shared rAF loop that updates all registered preview canvases; loop runs continuously until settings screen is closed
- [ ] 1.2 Implement `start()` / `stop()` lifecycle methods that create and cancel the animation frame loop
- [ ] 1.3 Implement preview snake path logic (fixed looping route on a small grid, e.g., clockwise rectangle) that repeats indefinitely
- [ ] 1.4 Add low tick rate accumulator (4-6 FPS game logic) with optional interpolation for smooth preview variant

## 2. Difficulty Preview

- [ ] 2.1 Create single canvas renderer for Difficulty preview below the segmented selector
- [ ] 2.2 Implement Easy difficulty preview: snake wraps through wall continuously
- [ ] 2.3 Implement Medium/Hard difficulty preview: snake hits wall and stops/flashes, then restarts loop
- [ ] 2.4 Wire difficulty selector clicks to update preview behavior (swap wrap/wall-kill animation based on selected difficulty)
- [ ] 2.5 Style difficulty preview container (CSS, responsive sizing for mobile)

## 3. Smooth Animation Preview

- [ ] 3.1 Create side-by-side canvas pair renderer for Smooth Animation preview (two labeled canvases: "Smooth" / "Classic")
- [ ] 3.2 Implement smooth preview: left canvas shows interpolated movement looping, right canvas shows grid-snap movement looping
- [ ] 3.3 Hide preview container when Smooth Animation toggle has `aria-disabled="true"` (Reduce Motion is on)
- [ ] 3.4 React to Reduce Motion toggle changes while settings are open: show/hide Smooth Animation preview accordingly
- [ ] 3.5 Style Smooth Animation preview container and labels (CSS, responsive sizing for mobile)

## 4. Theme Swatch Previews

- [ ] 4.1 Replace static color-dot preview in each theme swatch with a dynamically created mini-canvas
- [ ] 4.2 Render mini snake animation on each swatch canvas using that theme's background, grid, snakeHead, and snakeTail colors, looping continuously
- [ ] 4.3 Ensure locked theme swatches still animate but remain visually dimmed
- [ ] 4.4 Size swatch canvases to match existing preview bar dimensions (28px desktop, 20px mobile)

## 5. Integration & Lifecycle

- [ ] 5.1 Wire `PreviewManager` creation into `UIManager.showSettings()` — create canvases and start loop
- [ ] 5.2 Wire `PreviewManager` teardown into `UIManager.hideSettings()` — stop loop and remove canvases from DOM
- [ ] 5.3 Ensure `renderThemePicker()` rebuilds swatch previews when called (theme unlock, re-render)

## 6. Responsive & Polish

- [ ] 6.1 Add mobile breakpoint CSS for preview canvas sizing (scale down at 480px)
- [ ] 6.2 Verify no rAF loops run when settings screen is closed (check with browser dev tools)
- [ ] 6.3 Test on mobile device: layout fits without excessive scrolling, animations are smooth
