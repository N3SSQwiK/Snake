## ADDED Requirements

### Requirement: Difficulty preview animation
The system SHALL display an animated canvas preview below the Difficulty segmented selector showing the wall behavior for the currently selected difficulty.

#### Scenario: Difficulty preview display
- **WHEN** the settings screen is opened
- **THEN** a mini-canvas appears below the Difficulty selector showing a snake demonstrating the wall behavior for the current difficulty (wrap-around for Easy, wall-kill for Medium/Hard)

#### Scenario: Difficulty preview updates on selection change
- **GIVEN** the settings screen is visible
- **WHEN** the player selects a different difficulty
- **THEN** the preview canvas updates to show the wall behavior for the newly selected difficulty

#### Scenario: Difficulty preview loops continuously
- **WHEN** the settings screen is visible
- **THEN** the difficulty preview animation loops seamlessly without user interaction

### Requirement: Smooth Animation preview animation
The system SHALL display animated side-by-side canvas previews below the Smooth Animation toggle showing the visual difference between interpolated and grid-snap movement.

#### Scenario: Smooth Animation preview display
- **WHEN** the settings screen is opened and Smooth Animation toggle is not disabled by Reduce Motion
- **THEN** two labeled mini-canvases ("Smooth" / "Classic") appear below the Smooth Animation toggle, one showing smooth interpolated snake movement, the other showing classic grid-snap movement

#### Scenario: Smooth Animation preview hidden when disabled
- **GIVEN** the Reduce Motion toggle is on
- **WHEN** the settings screen is opened
- **THEN** the Smooth Animation preview is hidden (the toggle shows aria-disabled with "Disabled by Reduce Motion" hint)

#### Scenario: Smooth Animation preview reacts to Reduce Motion toggle
- **GIVEN** the settings screen is visible
- **WHEN** the player toggles Reduce Motion on
- **THEN** the Smooth Animation preview is hidden
- **AND** when the player toggles Reduce Motion off, the preview reappears

#### Scenario: Smooth Animation preview loops continuously
- **WHEN** the settings screen is visible and the preview is shown
- **THEN** the Smooth Animation preview animations loop seamlessly without user interaction

### Requirement: Theme swatch preview animations
The system SHALL display an animated canvas preview within each theme swatch showing a mini snake moving on that theme's background, grid, and snake colors.

#### Scenario: Theme swatch animated preview
- **WHEN** the settings screen is opened
- **THEN** each theme swatch contains an animated canvas showing a short snake moving on a mini grid rendered with that theme's actual color values (background, grid, snakeHead, snakeTail)

#### Scenario: Locked theme previews
- **WHEN** a theme is locked
- **THEN** the animated preview still plays but the swatch remains visually dimmed with its lock overlay

### Requirement: Preview lifecycle management
The system SHALL create and start preview animations only when the settings screen is visible and destroy them when the settings screen is closed.

#### Scenario: Previews start on settings open
- **WHEN** the player opens the settings screen
- **THEN** all preview canvases are created and animations begin

#### Scenario: Previews stop on settings close
- **WHEN** the player closes the settings screen
- **THEN** all preview animation loops are cancelled and canvas elements are removed from the DOM

#### Scenario: No background rendering
- **WHEN** the settings screen is not visible
- **THEN** no preview requestAnimationFrame loops are running

### Requirement: Preview performance constraints
The system SHALL render previews at a low tick rate to minimize CPU and battery impact.

#### Scenario: Low tick rate rendering
- **WHEN** preview animations are running
- **THEN** game logic ticks at 4-6 FPS with rendering at the display refresh rate (for smooth animation preview) or matching tick rate (for classic preview)

#### Scenario: Small canvas dimensions
- **WHEN** previews are rendered
- **THEN** toggle preview canvases are no larger than 120x60px and theme swatch canvases match the swatch preview area dimensions

### Requirement: Responsive preview sizing
The system SHALL scale preview canvases for mobile viewports.

#### Scenario: Mobile toggle previews
- **WHEN** the viewport width is 480px or less
- **THEN** toggle preview canvases scale down proportionally while remaining legible

#### Scenario: Mobile theme swatch previews
- **WHEN** the viewport width is 480px or less
- **THEN** theme swatch preview canvases fit within the reduced mobile swatch dimensions
