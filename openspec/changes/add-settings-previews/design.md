## Context

The settings screen currently has toggle switches for Wall Collision and Smooth Animation, and a theme picker grid with color-dot swatches. None of these convey what the setting actually does before the player activates it. The game uses vanilla JS with canvas rendering and a class-based architecture (Game, Snake, Renderer, UIManager).

## Goals / Non-Goals

**Goals:**
- Provide animated canvas previews for Wall Collision (side-by-side: wall-kill vs wrap-around), Smooth Animation (side-by-side: interpolated vs grid-snap), and each theme swatch (mini snake on theme-colored background)
- Previews run only while settings screen is visible (no background CPU cost)
- Previews are responsive and compact, especially on mobile

**Non-Goals:**
- Full gameplay simulation in previews (no food, scoring, growth)
- Audio in previews
- Previews outside the settings screen (e.g., in menus or game over)

## Decisions

### 1. Preview rendering approach: Dedicated lightweight mini-canvases

Each preview gets its own small `<canvas>` element. A new `PreviewManager` class manages the animation loop and lifecycle. This avoids polluting the main `Renderer` class.

**Rationale**: Separate canvases are simpler to position in CSS, don't interfere with the game canvas, and can be independently created/destroyed. A shared offscreen canvas would require manual blitting and complicate layout.

**Alternative considered**: CSS animations or GIFs — rejected because they can't use actual theme colors dynamically, and wouldn't match the real game rendering.

### 2. Toggle previews: Side-by-side paired canvases

Wall Collision and Smooth Animation each get two small canvases side by side, labeled (e.g., "On" / "Off"). Each shows a short looping snake animation demonstrating the behavior difference.

- **Wall Collision**: Left canvas shows snake wrapping through wall; right shows snake hitting wall and flashing/stopping.
- **Smooth Animation**: Left canvas shows smooth interpolated movement; right shows classic grid-snap movement.

**Rationale**: Side-by-side comparison is the clearest way to show a binary toggle's effect. Single preview that switches on toggle doesn't show both states simultaneously.

### 3. Theme swatch previews: Inline mini-canvas replacing color dots

Replace the current two-dot color preview in each theme swatch with a tiny animated canvas showing a ~3-segment snake moving on a mini grid using that theme's actual colors (background, grid, snakeHead, snakeTail).

**Rationale**: Reuses the existing swatch space. A separate preview area would bloat the settings panel.

**Alternative considered**: Expanding a larger preview on hover/tap — adds interaction complexity and doesn't work well on mobile.

### 4. Animation approach: requestAnimationFrame with shared loop

`PreviewManager` runs a single `requestAnimationFrame` loop that updates all active preview canvases. Each preview has a simple state: a fixed-path snake that loops (e.g., moves in a small rectangle or figure-8). Tick rate is low (~4-6 FPS for game logic) with optional interpolation for the smooth animation preview.

**Rationale**: Single rAF loop is more efficient than one per canvas. Low tick rate keeps CPU usage minimal.

### 5. Lifecycle management

- `showSettings()` creates `PreviewManager` and starts animations
- `hideSettings()` stops the rAF loop and removes preview canvases
- Canvases are created dynamically (not in HTML) to keep the DOM clean when settings are closed

**Rationale**: Avoids rendering offscreen canvases. Clean creation/teardown.

## Risks / Trade-offs

- **[Mobile performance]** Multiple animated canvases on low-end phones could cause jank → Mitigation: Low tick rate (4-6 FPS logic), small canvas sizes (80x40 for swatches, 120x60 for toggle previews), stop animations immediately on hide
- **[Layout complexity]** Side-by-side previews under toggles add vertical height to settings panel → Mitigation: Keep preview canvases small; mobile breakpoint uses even smaller sizes; panel already scrolls
- **[Theme swatch size increase]** Animated canvas replaces simple dots, may need more height → Mitigation: Canvas matches current preview bar dimensions (height ~28px desktop, ~20px mobile)
