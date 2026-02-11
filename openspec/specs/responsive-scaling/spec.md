# responsive-scaling Specification

## Purpose
Dynamic canvas sizing and proportional UI scaling so the game fills available viewport space at native device resolution.

## Requirements
### Requirement: Viewport-Aware Canvas Sizing
The system SHALL dynamically size the game canvas to fill available viewport space while maintaining a 1:1 aspect ratio.

#### Scenario: Canvas fills available space
- **WHEN** the game loads or the viewport resizes
- **THEN** the canvas display size is the largest square that fits within the available width and height (viewport minus HUD, D-pad, and margin)

#### Scenario: Aspect ratio maintained
- **GIVEN** the viewport is wider than tall
- **WHEN** the canvas is sized
- **THEN** the canvas height equals available height and the canvas is centered horizontally

#### Scenario: Narrow viewport
- **GIVEN** the viewport is taller than wide
- **WHEN** the canvas is sized
- **THEN** the canvas width equals available width and the canvas is centered vertically

#### Scenario: HUD and D-pad space reserved
- **GIVEN** the HUD is visible above the canvas and the D-pad is visible below
- **WHEN** the canvas is sized
- **THEN** the available height accounts for the HUD and D-pad heights

### Requirement: High-DPI Canvas Rendering
The system SHALL render the canvas at native device resolution for crisp output on high-DPI screens.

#### Scenario: Bitmap resolution matches display
- **GIVEN** a display with devicePixelRatio of 2
- **WHEN** the canvas display size is 500 CSS pixels
- **THEN** the canvas internal bitmap resolution is 1000×1000 pixels

#### Scenario: Drawing coordinates unchanged
- **GIVEN** the canvas bitmap is scaled for high-DPI
- **WHEN** drawing code uses `CELL_SIZE` (20) coordinates in the 500×500 logical space
- **THEN** the context scale transform maps logical coordinates to bitmap pixels automatically

#### Scenario: Glow effects normalized
- **WHEN** the canvas is scaled to a larger bitmap size
- **THEN** shadowBlur values are divided by the scale factor so glow effects appear the same visual size at all resolutions

### Requirement: Resize Handling
The system SHALL respond to viewport size changes smoothly.

#### Scenario: Window resize
- **WHEN** the browser window is resized
- **THEN** the canvas re-sizes to fit the new viewport after a debounce delay (100ms)

#### Scenario: Orientation change
- **WHEN** the device orientation changes
- **THEN** the canvas re-sizes to fit the new viewport dimensions

#### Scenario: DPI change
- **WHEN** the browser window moves between monitors with different devicePixelRatio
- **THEN** the canvas bitmap resolution updates to match the new DPI

### Requirement: UI Scale Property
The system SHALL expose a CSS custom property `--game-scale` that reflects the ratio of the canvas display size to the baseline 500px size.

#### Scenario: Scale property set on resize
- **WHEN** the canvas is resized
- **THEN** `--game-scale` is set on the document root element as a unitless number (e.g., 1.6 for an 800px canvas)

#### Scenario: Scale property available to CSS
- **WHEN** CSS rules reference `var(--game-scale)`
- **THEN** the value reflects the current canvas scale factor
