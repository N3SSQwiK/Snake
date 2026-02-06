# Change: Add Difficulty System

## Why
Progressive challenge keeps the game engaging. Difficulty levels let players choose their challenge, while speed increases reward skilled play. Advanced food types add strategic depth.

## What Changes
- Difficulty levels:
  - Easy, Medium, Hard presets
  - Each level defines starting speed, acceleration rate, food hazard chances, and wall behavior
  - Add difficulty selector to settings (segmented control, locked mid-game)
- Progressive speed:
  - Snake speed increases as score grows
  - Acceleration rate based on difficulty
  - Maximum speed cap
- Advanced food types:
  - Bonus food: +25 points, time-limited, star shape
  - Toxic food: point deduction scaling with score, game over if score goes negative, diamond shape
  - Lethal food: instant game over, spiky skull shape
  - Special food spawns on periodic tick check (every 10 ticks) based on difficulty probabilities
- Wall collision integrated into difficulty:
  - Easy: walls wrap around
  - Medium/Hard: walls kill
  - Standalone wall collision toggle removed
- Difficulty-scoped leaderboard:
  - Scores tagged with difficulty
  - Filtered view from pause screen, all-scores view from menu/game over
  - Legacy entries (pre-difficulty) shown with "—" label
- Difficulty HUD:
  - Difficulty name shown on canvas alongside score and length

## Design Requirements

> **MANDATORY**: Use `/game-ui-design` skill before implementing food type visuals and difficulty UI.

### Advanced Food Type Visual Design
| Food Type | Theme Color Key | Shape/Pattern | Animation |
|-----------|----------------|---------------|-----------|
| Regular | `food` | Apple (bezier curves) with stem and leaf | Glow |
| Bonus | `bonusFood` | 4-pointed star | Size pulse |
| Toxic | `poisonFood` | Diamond with exclamation mark | Glow |
| Lethal | `poisonFood` | 16-point spiky circle with skull (X eyes, line mouth) | Size pulse |

### Food Type Differentiation (Critical for Accessibility)
Food types MUST be distinguishable by more than just color:

| Food Type | Primary Indicator | Secondary Indicator |
|-----------|-------------------|---------------------|
| Regular | Apple shape | Stem and leaf |
| Bonus | Star shape | Pulse animation |
| Toxic | Diamond shape | Exclamation mark |
| Lethal | Spiky circle | Skull markings (X eyes) |

### Timer Display Design
- Decay blink warning when < 25% time remains (alternates visible/hidden every 5 ticks)
- Same blink system used for all food types (regular and special)

### Difficulty Selector UI Design
| Element | Design Specification |
|---------|---------------------|
| Layout | Segmented control (vertical stack) |
| Selection State | Accent border + glow for selected option |
| Descriptions | Brief text per level describing parameters |
| Position | Settings screen, above animation toggle |
| Mid-game | Disabled with reduced opacity, pointer-events none |

### Difficulty Level Descriptions
- **Easy**: "Walls wrap, no hazard food"
- **Medium**: "Walls kill, toxic food appears"
- **Hard**: "Walls kill, toxic and lethal food"

## Impact
- Affected specs: `difficulty-system` (new), `food-system` (updated with food types)
- Affected code: `game.js`, `index.html`, `styles.css`, `game.test.js`
- Depends on: `basic-food`, `ui-screens`, `add-theme-system`
- Removed: standalone wall collision toggle (absorbed into difficulty)

## Post-Implementation Deviations from Original Proposal
1. **Poison food split into Toxic + Lethal**: Original spec had single "poisonous food" that ended the game. Implementation splits into Toxic (point deduction with scaling penalty) and Lethal (instant game over), providing more gameplay variety.
2. **Special food spawn trigger**: Original spec tied spawning to "regular food is eaten". Implementation uses periodic tick check (every 10 ticks) for more consistent spawn behavior.
3. **Timer display**: Original spec called for "visible countdown timer". Implementation uses existing decay blink system (< 25% remaining) for consistency with regular food.
4. **Wall collision per difficulty**: Not in original proposal. Added during implementation to make Easy meaningfully easier and eliminate a confusing standalone toggle.
5. **Difficulty locked mid-game**: Not in original proposal. Added to prevent mid-game difficulty switching.
6. **Difficulty-scoped leaderboard**: Not in original proposal. Added so scores across difficulties are not mixed unfairly.
7. **Difficulty on HUD**: Not in original proposal. Added for gameplay clarity.
8. **Leaderboard context-aware views**: All scores shown from menu/game over, filtered by difficulty from pause screen.
9. **Grid size increase**: 20×20 → 25×25 (500×500 canvas) for more gameplay space with proximity-based food spawning.
10. **HUD moved to HTML**: Score/length/difficulty display migrated from canvas rendering to HTML element above canvas for better theme integration and accessibility.
11. **Proximity-based hazard spawning**: Toxic and lethal food spawn within Manhattan distance of nearest good food (Medium: 4-6 cells, Hard: 1-2 cells). Bonus food remains random.
12. **Toxic segment removal**: Toxic food now removes snake segments in addition to point deduction. Removal scales with difficulty and snake length: Medium = max(1, floor(length/10)), Hard = max(2, floor(length/5)). Game over when snake length ≤ 1 (head only), replacing previous negative-score game over.
13. **Dynamic toxic penalty HUD**: HUD shows current toxic point penalty and segment removal count, updating dynamically. Only visible on Medium/Hard.
