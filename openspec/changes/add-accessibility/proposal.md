# Change: Add Accessibility (ADA Compliance)

## Why
The game should be accessible to all users, including those with visual impairments, motor disabilities, and cognitive differences. ADA compliance ensures the game meets WCAG 2.1 guidelines and provides a good experience for everyone.

Key issues to address:
- Color contrast must meet WCAG AA standards (4.5:1 for text, 3:1 for UI components)
- Game must be fully playable with keyboard only
- Visual feedback should not rely solely on color
- Users with vestibular disorders need reduced motion options
- Screen readers should announce game state changes

## What Changes

### Visual Accessibility
- Audit and fix all color combinations for WCAG AA contrast ratios
- Add high contrast theme option
- Ensure all themes meet minimum contrast requirements
- Add patterns/shapes to food types (not just color differentiation)
- Add visible focus indicators for all interactive elements

### Motor Accessibility
- Ensure all controls work with keyboard only (no mouse required)
- Add customizable key bindings
- Support for reduced precision (larger touch targets on mobile)

### Cognitive Accessibility
- Add option to disable time-limited elements (bonus/poison food timers)
- Clear, consistent UI patterns
- Pause functionality always available

### Screen Reader Support
- ARIA live regions for score updates and game state changes
- Meaningful alt text and labels
- Announce game events (food eaten, game over, new high score)

### Motion Sensitivity
- Respect `prefers-reduced-motion` media query
- Option to disable animations entirely
- No flashing content (prevent seizure triggers)

## Impact
- Affected specs: `accessibility` (new capability)
- Affected code: `styles.css` (contrast, focus styles), `game.js` (ARIA, reduced motion), `index.html` (semantic markup, ARIA)
- Affects all existing and future features
- Should be implemented early to establish patterns
