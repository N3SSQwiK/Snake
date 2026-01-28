# Design Decisions: Add Basic Food System

## Food Visual Design

**Reviewed with**: `/game-ui-design` skill
**Date**: 2026-01-27
**Status**: Approved

### Design Specification

| Element | Choice | Rationale |
|---------|--------|-----------|
| Shape | Apple (bezier curves) | Recognizable food shape, provides visual contrast with snake |
| Body | Red apple using `theme.colors.food` | Theme-aware, high contrast against dark background |
| Stem | Brown (#5d4037), 2px stroke | Natural apple appearance |
| Leaf | Green (#4caf50), small ellipse | Adds recognizability and visual interest |
| Effect | Soft glow (8px blur, food color) | Draws attention without neon overload |
| Decay Warning | Blink toggle every 5 ticks (~0.5s) | Clear urgency signal |

### Apple Shape Construction

```
     🍃 leaf (green ellipse)
      |  stem (brown line)
     ╭─╮ top indent
    ╱   ╲
   │     │  body (bezier curves)
    ╲   ╱
     ╰─╯ rounded bottom
```

### Design Principles Applied

From `/game-ui-design` skill:

1. **Purposeful Restraint** - Single accent effect (glow only), no stacked animations
2. **Theme-Aware Colors** - Body uses `theme.colors.food`, stem/leaf use natural colors
3. **Shape Contrast** - Organic apple shape vs rectangular snake creates visual hierarchy
4. **Dark-First Approach** - Designed for visibility against `#0a0a0f` background
5. **Recognizable Iconography** - Apple is universally understood as "food"

### Alternatives Considered

| Option | Assessment |
|--------|------------|
| Simple circle | Implemented initially, upgraded to apple for better UX |
| Square (matches snake) | Rejected - lacks visual distinction from snake segments |
| Gradient fill | Rejected - conflicts with design principle against gradient overload |
| Pulse animation | Deferred - blink is simpler, pulse could be future enhancement |

### Accessibility Notes

- Color alone does not convey food identity (shape distinction matters)
- Decay warning uses motion (blink), not just color change
- High contrast ratio maintained against dark background
