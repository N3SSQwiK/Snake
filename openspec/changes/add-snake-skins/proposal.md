# Proposal: Add Snake Skins

## Why

Cosmetic progression gives players something to work toward beyond scores. Unlocking and equipping skins adds personality and makes the game feel more personal.

## What Changes

- Skin definitions: head shape, body pattern, color override, optional trail effect
- Unlock conditions: score milestones, games played, achievements earned
- Skin selector screen accessible from settings or dedicated menu entry
- Preview: see skin applied to a sample snake before equipping
- Default skin follows active theme; equipped skin overrides theme default
- Skin catalog:
  - "Classic" — default, always unlocked
  - "Golden" — unlock at cumulative 1000 points
  - "Ghost" — semi-transparent, unlock after 50 games
  - "Pixel" — chunky retro style, unlock with retro theme
  - "Rainbow" — color-cycling segments, unlock all other skins first

## Capabilities

### New Capabilities
- `snake-skins` — skin definitions, unlock conditions, equip system, skin selector UI, preview, theme integration

### Modified Capabilities
- `achievements` — skin unlock triggers (if achievements exist)

## Impact

- `Renderer` — skin-aware snake drawing (head shape, body pattern, trail effects)
- `StorageManager` — equipped skin persistence, unlock state
- New UI: skin selector screen with preview
- Theme system interaction — skins override theme snake colors
- Menu or settings — skin selector access point
