# Tasks: Add Accessibility (ADA Compliance)

## 1. Color Contrast Audit
- [ ] 1.1 Audit all theme colors against WCAG AA contrast requirements
- [ ] 1.2 Fix Classic theme colors to meet 3:1 minimum for game elements
- [ ] 1.3 Fix all UI text to meet 4.5:1 contrast ratio
- [ ] 1.4 Create High Contrast theme with enhanced visibility
- [ ] 1.5 Document color contrast ratios in theme definitions

## 2. Visual Differentiation
- [ ] 2.1 Add distinct shapes/patterns to food types (not just color)
- [ ] 2.2 Regular food: circle or square
- [ ] 2.3 Bonus food: star or diamond shape
- [ ] 2.4 Poison food: X mark or skull pattern
- [ ] 2.5 Add optional outline mode for colorblind users

## 3. Focus Management
- [ ] 3.1 Add visible focus indicators to all buttons
- [ ] 3.2 Ensure focus indicators meet 3:1 contrast
- [ ] 3.3 Implement logical focus order in menus
- [ ] 3.4 Trap focus within modal overlays
- [ ] 3.5 Return focus to appropriate element after overlay closes

## 4. Keyboard Accessibility
- [ ] 4.1 Ensure all UI is navigable with Tab key
- [ ] 4.2 Buttons activatable with Enter and Space
- [ ] 4.3 Escape key closes overlays/pauses game
- [ ] 4.4 Add keyboard shortcut help (accessible via ? key)
- [ ] 4.5 Implement customizable key bindings setting

## 5. Screen Reader Support
- [ ] 5.1 Add ARIA live region for score announcements
- [ ] 5.2 Add ARIA live region for game state changes
- [ ] 5.3 Announce when food is eaten
- [ ] 5.4 Announce game over with final score
- [ ] 5.5 Announce new high score achievement
- [ ] 5.6 Add descriptive labels to all buttons
- [ ] 5.7 Add role="application" to game canvas area

## 6. Reduced Motion
- [ ] 6.1 Detect `prefers-reduced-motion` media query
- [ ] 6.2 Disable smooth snake animation when reduced motion preferred
- [ ] 6.3 Disable overlay fade animations when reduced motion preferred
- [ ] 6.4 Add manual "Reduce Motion" toggle in settings
- [ ] 6.5 Ensure no content flashes more than 3 times per second

## 7. Cognitive Accessibility
- [ ] 7.1 Add option to disable timed food (bonus/poison don't expire)
- [ ] 7.2 Add option for slower game speed (accessibility mode)
- [ ] 7.3 Ensure pause is always available and obvious
- [ ] 7.4 Use consistent iconography throughout

## 8. Touch Accessibility
- [ ] 8.1 Ensure touch targets are minimum 44x44 pixels
- [ ] 8.2 Add spacing between touch targets to prevent mis-taps
- [ ] 8.3 Support pinch-to-zoom (don't disable viewport scaling)

## 9. Semantic HTML
- [ ] 9.1 Use semantic elements (button, heading hierarchy)
- [ ] 9.2 Add lang attribute to html element
- [ ] 9.3 Ensure proper heading hierarchy (h1 > h2 > h3)
- [ ] 9.4 Add skip link to bypass menu and go to game

## 10. Testing
- [ ] 10.1 Test with screen reader (VoiceOver on Mac)
- [ ] 10.2 Test keyboard-only navigation
- [ ] 10.3 Test with browser zoom at 200%
- [ ] 10.4 Validate with axe or Lighthouse accessibility audit
- [ ] 10.5 Test all themes for color contrast compliance
