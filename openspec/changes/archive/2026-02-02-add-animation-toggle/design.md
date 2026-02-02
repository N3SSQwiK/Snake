## Context

The game loop runs at 60fps (requestAnimationFrame) but game logic ticks at 10Hz (TICK_RATE). Currently the Renderer draws the snake at whatever grid position it occupies after the last tick — so visually, movement jumps 1 cell every 100ms. Smooth interpolation renders the snake at fractional positions between ticks, creating fluid 60fps motion without changing game logic timing.

The Snake class stores `body` as an array of `{x, y}` grid positions. On each tick, `move()` shifts the array. The Renderer receives the Snake object and draws each segment at `segment.x * CELL_SIZE`, `segment.y * CELL_SIZE`.

## Goals / Non-Goals

**Goals:**
- Smooth 60fps visual movement via interpolation between game ticks
- Player-selectable toggle (Smooth vs Classic)
- Zero impact on game logic — tick rate, collision, and scoring unchanged
- Correct handling of edge cases: growth, wrap-around, game over

**Non-Goals:**
- Changing the game tick rate
- Animating food or grid elements
- Adding easing curves (linear interpolation is sufficient for snake movement)

## Decisions

### Decision 1: Store previous positions in Snake, not Renderer

**Choice:** Snake stores `previousBody` (copy of `body` before each `move()`).

**Alternatives considered:**
- Renderer tracks previous frame positions — requires Renderer to know about game tick boundaries, couples rendering to game timing
- Game passes both arrays to Renderer — leaks internal state management

**Rationale:** Snake already owns its position data. Adding `previousBody` is a one-line copy before `move()`. The Renderer just reads both arrays and interpolates.

### Decision 2: Interpolation factor passed from Game loop

**Choice:** `Game.render()` calculates `tickAccumulator / tickInterval` and passes it to `Renderer.drawSnake()`.

**Rationale:** The Game loop already tracks `tickAccumulator` — the time elapsed since the last tick. Dividing by `tickInterval` gives a 0.0–1.0 factor. No new timers needed.

### Decision 3: Snap on wrap-around

**Choice:** When a segment's previous and current positions differ by more than 1 cell in any axis, skip interpolation for that segment (render at current position).

**Rationale:** Interpolating across a wrap boundary (e.g., x=0 → x=19) would draw the snake flying across the entire grid. Detecting this is cheap: `Math.abs(prev.x - curr.x) > 1 || Math.abs(prev.y - curr.y) > 1`.

### Decision 4: Default to Smooth

**Choice:** New installs default to Smooth mode. Classic is opt-in.

**Rationale:** Smooth looks more modern and polished. Players who prefer retro feel can switch to Classic in settings.

## Risks / Trade-offs

- **[Risk] Growth interpolation artifact** — When the snake grows, `body` gains a segment that has no `previousBody` counterpart. → Mitigation: On growth frame, the new tail segment renders at its grid position without interpolation. Since `previousBody` is copied before `move()`, the arrays may differ in length by 1; the extra segment falls back to grid-snap.

- **[Risk] Paused state interpolation** — If the game is paused, `tickAccumulator` keeps growing. → Mitigation: Clamp interpolation factor to 1.0 max. When paused, render at current grid positions (factor = 1.0 or 0.0 depending on convention).

- **[Risk] Performance on low-end devices** — Interpolation adds a multiply-and-add per segment per frame. → Mitigation: At 20 grid cells max snake length and 60fps, this is trivially cheap (< 0.01ms per frame).

## Open Questions

None — design is straightforward given the existing architecture.
