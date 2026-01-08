## ADDED Requirements

### Requirement: Color Contrast Compliance
The system SHALL ensure all color combinations meet WCAG 2.1 AA contrast requirements.

#### Scenario: Text contrast
- **GIVEN** any text displayed in the UI
- **THEN** the text has a contrast ratio of at least 4.5:1 against its background

#### Scenario: UI component contrast
- **GIVEN** any interactive UI component (buttons, toggles)
- **THEN** the component has a contrast ratio of at least 3:1 against adjacent colors

#### Scenario: Game element contrast
- **GIVEN** game elements (snake, food, grid)
- **THEN** each element has a contrast ratio of at least 3:1 against the background

#### Scenario: High contrast theme
- **WHEN** the user selects the High Contrast theme
- **THEN** all elements meet WCAG AAA contrast requirements (7:1 for text, 4.5:1 for UI)

### Requirement: Visual Differentiation Beyond Color
The system SHALL not rely solely on color to convey information.

#### Scenario: Food type differentiation
- **GIVEN** different food types (regular, bonus, poison)
- **THEN** each type is distinguishable by shape or pattern in addition to color

#### Scenario: Game state indication
- **GIVEN** different game states (playing, paused, game over)
- **THEN** each state is indicated by text or icons, not just color

### Requirement: Keyboard Accessibility
The system SHALL be fully operable using only a keyboard.

#### Scenario: Menu navigation
- **WHEN** the user presses Tab
- **THEN** focus moves to the next interactive element in logical order

#### Scenario: Button activation
- **GIVEN** a button has keyboard focus
- **WHEN** the user presses Enter or Space
- **THEN** the button is activated

#### Scenario: Overlay dismissal
- **GIVEN** a modal overlay is displayed
- **WHEN** the user presses Escape
- **THEN** the overlay closes (or game pauses if in PLAYING state)

#### Scenario: Focus visibility
- **GIVEN** an element has keyboard focus
- **THEN** a visible focus indicator is displayed with at least 3:1 contrast

### Requirement: Screen Reader Support
The system SHALL provide information to assistive technologies via ARIA.

#### Scenario: Score announcement
- **WHEN** the player's score changes
- **THEN** the new score is announced to screen readers via ARIA live region

#### Scenario: Game state announcement
- **WHEN** the game state changes (start, pause, game over)
- **THEN** the new state is announced to screen readers

#### Scenario: Achievement announcement
- **WHEN** the player achieves a new high score
- **THEN** the achievement is announced to screen readers

#### Scenario: Button labels
- **GIVEN** any button in the UI
- **THEN** it has an accessible name that describes its action

### Requirement: Reduced Motion Support
The system SHALL respect user preferences for reduced motion.

#### Scenario: System preference detection
- **GIVEN** the user has enabled "reduce motion" in their OS settings
- **WHEN** the game loads
- **THEN** animations are disabled or minimized automatically

#### Scenario: Manual motion toggle
- **WHEN** the user enables "Reduce Motion" in game settings
- **THEN** all non-essential animations are disabled

#### Scenario: No flashing content
- **GIVEN** any visual content in the game
- **THEN** nothing flashes more than 3 times per second

### Requirement: Cognitive Accessibility
The system SHALL provide options to reduce cognitive load.

#### Scenario: Disable timed elements
- **WHEN** the user enables "Disable Timers" in settings
- **THEN** bonus and poison food do not expire

#### Scenario: Accessibility speed mode
- **WHEN** the user enables "Accessibility Mode" in settings
- **THEN** the maximum game speed is reduced

#### Scenario: Pause availability
- **GIVEN** the game is in PLAYING state
- **THEN** a pause option is always visible and accessible

### Requirement: Touch Target Size
The system SHALL provide adequately sized touch targets on mobile.

#### Scenario: Button size
- **GIVEN** any interactive button on a touch device
- **THEN** the touch target is at least 44x44 CSS pixels

#### Scenario: Touch target spacing
- **GIVEN** multiple touch targets
- **THEN** there is adequate spacing to prevent accidental activation

### Requirement: Semantic Structure
The system SHALL use semantic HTML for proper document structure.

#### Scenario: Language declaration
- **GIVEN** the HTML document
- **THEN** the lang attribute is set on the html element

#### Scenario: Heading hierarchy
- **GIVEN** headings in the UI
- **THEN** they follow a logical hierarchy (h1 before h2, etc.)

#### Scenario: Skip navigation
- **GIVEN** a keyboard user on the page
- **WHEN** they press Tab as the first action
- **THEN** a "Skip to game" link is available
