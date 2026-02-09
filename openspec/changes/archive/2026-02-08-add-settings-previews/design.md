## Context

The settings screen currently has a Difficulty segmented selector (Easy/Medium/Hard), Sound controls (Volume slider, Mute toggle), Accessibility toggles (Reduce Motion, Smooth Animation, Shape Outlines, Extended Time Mode), and a theme picker grid with color-dot swatches. None of these convey what the setting actually does before the player activates it. The game uses vanilla JS with canvas rendering and a class-based architecture (Game, Snake, Renderer, UIManager).

Note: Smooth Animation is in the Accessibility group and uses `aria-disabled="true"` when Reduce Motion is on, with a hint "Disabled by Reduce Motion". The toggle stays focusable for keyboard navigation but its click handler is guarded.

## Goals / Non-Goals

**Goals:**
- Provide animated canvas preview for Difficulty selector showing wall behavior (wrap-around for Easy vs wall-kill for Medium/Hard)
- Provide animated canvas preview for Smooth Animation (side-by-side: interpolated vs grid-snap), hidden when toggle is disabled by Reduce Motion
- Provide animated preview in each theme swatch (mini snake on theme-colored background)
- Previews run only while settings screen is visible (no background CPU cost)
- Previews are responsive and compact, especially on mobile

**Non-Goals:**
- Full gameplay simulation in previews (no food, scoring, growth)
- Audio in previews
- Previews outside the settings screen (e.g., in menus or game over)
- Previews for Sound settings, Reduce Motion, Shape Outlines, or Extended Time Mode (these are self-explanatory or don't benefit from canvas animation)

## Decisions

### 1. Preview rendering approach: Dedicated lightweight mini-canvases

Each preview gets its own small `<canvas>` element. A new `PreviewManager` class manages the animation loop and lifecycle. This avoids polluting the main `Renderer` class.

**Rationale**: Separate canvases are simpler to position in CSS, don't interfere with the game canvas, and can be independently created/destroyed. A shared offscreen canvas would require manual blitting and complicate layout.

**Alternative considered**: CSS animations or GIFs — rejected because they can't use actual theme colors dynamically, and wouldn't match the real game rendering.

### 2. Difficulty preview: Single canvas that updates on selection change

A single canvas below the Difficulty segmented selector shows the wall behavior for the currently selected difficulty. When the player selects a different difficulty, the preview updates:
- **Easy**: Snake wraps through wall continuously
- **Medium/Hard**: Snake hits wall and flashes/stops, then restarts loop

**Rationale**: Unlike a binary toggle, the difficulty selector has three options where two share the same wall behavior. A single reactive canvas is clearer than side-by-side pairs and uses less space.

### 3. Smooth Animation preview: Side-by-side paired canvases

Smooth Animation gets two small canvases side by side, labeled ("Smooth" / "Classic"). Each shows a short looping snake animation demonstrating the behavior difference:
- **Left**: Smooth interpolated movement
- **Right**: Classic grid-snap movement

The preview container is hidden when the toggle is `aria-disabled` (Reduce Motion is on).

**Rationale**: Side-by-side comparison is the clearest way to show a binary toggle's effect. Hiding when disabled avoids showing a preview for a setting the user can't change.

### 4. Theme swatch previews: Inline mini-canvas replacing color dots

Replace the current two-dot color preview in each theme swatch with a tiny animated canvas showing a ~3-segment snake moving on a mini grid using that theme's actual colors (background, grid, snakeHead, snakeTail).

**Rationale**: Reuses the existing swatch space. A separate preview area would bloat the settings panel.

**Alternative considered**: Expanding a larger preview on hover/tap — adds interaction complexity and doesn't work well on mobile.

### 5. Animation approach: requestAnimationFrame with shared loop

`PreviewManager` runs a single `requestAnimationFrame` loop that updates all active preview canvases. Each preview has a simple state: a fixed-path snake that loops (e.g., moves in a small rectangle or figure-8). Tick rate is low (~4-6 FPS for game logic) with optional interpolation for the smooth animation preview.

**Rationale**: Single rAF loop is more efficient than one per canvas. Low tick rate keeps CPU usage minimal.

### 6. Lifecycle management

- `showSettings()` creates `PreviewManager` and starts animations
- `hideSettings()` stops the rAF loop and removes preview canvases
- Canvases are created dynamically (not in HTML) to keep the DOM clean when settings are closed
- Difficulty preview listens for difficulty selector changes to update behavior
- Smooth Animation preview checks `aria-disabled` state — if disabled, container is hidden

**Rationale**: Avoids rendering offscreen canvases. Clean creation/teardown.

## Risks / Trade-offs

- **[Mobile performance]** Multiple animated canvases on low-end phones could cause jank → Mitigation: Low tick rate (4-6 FPS logic), small canvas sizes (80x40 for swatches, 120x60 for toggle previews), stop animations immediately on hide
- **[Layout complexity]** Preview canvases add vertical height to settings panel → Mitigation: Keep preview canvases small; mobile breakpoint uses even smaller sizes; panel already scrolls
- **[Theme swatch size increase]** Animated canvas replaces simple dots, may need more height → Mitigation: Canvas matches current preview bar dimensions (height ~28px desktop, ~20px mobile)
- **[aria-disabled interaction]** Smooth Animation preview must react to Reduce Motion toggle changes while settings are open → Mitigation: Listen for Reduce Motion toggle clicks within PreviewManager to show/hide the Smooth Animation preview container
