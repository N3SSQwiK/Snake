## 1. PreviewManager Core

- [ ] 1.1 Create `PreviewManager` class with shared rAF loop that updates all registered preview canvases; loop runs continuously until settings screen is closed
- [ ] 1.2 Implement `start()` / `stop()` lifecycle methods that create and cancel the animation frame loop
- [ ] 1.3 Implement preview snake path logic (fixed looping route on a small grid, e.g., clockwise rectangle) that repeats indefinitely
- [ ] 1.4 Add low tick rate accumulator (4-6 FPS game logic) with optional interpolation for smooth preview variant

## 2. Toggle Previews (Wall Collision & Smooth Animation)

- [ ] 2.1 Create side-by-side canvas pair renderer for toggle previews (two labeled canvases: "On" / "Off")
- [ ] 2.2 Implement Wall Collision preview: left canvas shows snake wrapping through wall continuously, right canvas shows snake hitting wall and stopping/flashing, then restarting the loop
- [ ] 2.3 Implement Smooth Animation preview: left canvas shows interpolated movement looping, right canvas shows grid-snap movement looping
- [ ] 2.4 Add preview container DOM elements below each `.ui-setting-row` in settings screen
- [ ] 2.5 Style toggle preview containers and labels (CSS, responsive sizing for mobile)

## 3. Theme Swatch Previews

- [ ] 3.1 Replace static color-dot preview in each theme swatch with a dynamically created mini-canvas
- [ ] 3.2 Render mini snake animation on each swatch canvas using that theme's background, grid, snakeHead, and snakeTail colors, looping continuously
- [ ] 3.3 Ensure locked theme swatches still animate but remain visually dimmed
- [ ] 3.4 Size swatch canvases to match existing preview bar dimensions (28px desktop, 20px mobile)

## 4. Integration & Lifecycle

- [ ] 4.1 Wire `PreviewManager` creation into `UIManager.showSettings()` — create canvases and start loop
- [ ] 4.2 Wire `PreviewManager` teardown into `UIManager.hideSettings()` — stop loop and remove canvases from DOM
- [ ] 4.3 Ensure `renderThemePicker()` rebuilds swatch previews when called (theme unlock, re-render)

## 5. Responsive & Polish

- [ ] 5.1 Add mobile breakpoint CSS for toggle preview canvas sizing (scale down at 480px)
- [ ] 5.2 Verify no rAF loops run when settings screen is closed (check with browser dev tools)
- [ ] 5.3 Test on mobile device: layout fits without excessive scrolling, animations are smooth
