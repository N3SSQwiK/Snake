# Tasks: Add Accessibility (ADA Compliance)

## 1. Color Contrast Audit
- [x] 1.1 Audit all theme colors against WCAG AA contrast requirements
- [x] 1.2 Fix all theme grid/game element colors to meet 3:1 minimum
- [x] 1.3 Fix all UI text (textMuted, textSecondary) to meet 4.5:1 contrast ratio
- [x] 1.4 Create High Contrast theme with enhanced visibility

## 2. Visual Differentiation
- [x] 2.1 Add distinct shapes/patterns to food types (not just color)
- [x] 2.2 Regular food: circle or square
- [x] 2.3 Bonus food: star or diamond shape
- [x] 2.4 Poison food: X mark or skull pattern
- [x] 2.5 Add optional outline mode for colorblind users

## 3. Focus Management
- [x] 3.1 Add visible focus indicators to all buttons
- [x] 3.2 Ensure focus indicators meet 3:1 contrast
- [x] 3.3 Implement logical focus order in menus
- [x] 3.4 Trap focus within modal overlays
- [x] 3.5 Return focus to appropriate element after overlay closes

## 4. Keyboard Accessibility
- [x] 4.1 Ensure all UI is navigable with Tab key
- [x] 4.2 Buttons activatable with Enter and Space
- [x] 4.3 Escape key closes overlays/pauses game
- [x] 4.4 Add keyboard shortcut help (accessible via ? key)

## 5. Screen Reader Support
- [x] 5.1 Add ARIA live region for score announcements
- [x] 5.2 Add ARIA live region for game state changes
- [x] 5.3 Announce when food is eaten
- [x] 5.4 Announce game over with final score
- [x] 5.5 Announce new high score achievement
- [x] 5.6 Add descriptive labels to all buttons
- [x] 5.7 Add role="application" to game canvas area

## 6. Reduced Motion
- [x] 6.1 Detect `prefers-reduced-motion` media query
- [x] 6.2 Disable smooth snake animation when reduced motion preferred
- [x] 6.3 Disable overlay fade animations when reduced motion preferred
- [x] 6.4 Add manual "Reduce Motion" toggle in settings
- [x] 6.5 Ensure no content flashes more than 3 times per second

## 7. Cognitive Accessibility
- [x] 7.1 Add option to disable timed food (bonus/poison don't expire)
- [x] 7.2 Add option for slower game speed (accessibility mode)
- [x] 7.3 Ensure pause is always available and obvious

## 8. Touch Accessibility
- [x] 8.1 Ensure touch targets are minimum 44x44 pixels
- [x] 8.2 Add spacing between touch targets to prevent mis-taps
- [x] 8.3 Support pinch-to-zoom (don't disable viewport scaling)

## 9. Semantic HTML
- [x] 9.1 Use semantic elements (button, heading hierarchy)
- [x] 9.2 Add lang attribute to html element
- [x] 9.3 Ensure proper heading hierarchy (h1 > h2 > h3)
- [x] 9.4 Add skip link to bypass menu and go to game

## 10. Testing
- [x] 10.1 Test keyboard-only navigation
- [x] 10.2 Test with browser zoom at 200%
