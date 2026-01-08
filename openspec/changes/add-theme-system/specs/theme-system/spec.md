## ADDED Requirements

### Requirement: Theme Definition
The system SHALL define themes as objects containing color values for all visual elements.

#### Scenario: Theme structure
- **GIVEN** a theme object
- **THEN** it contains colors for: background, grid, snake, snakeHead, food, bonusFood, poisonFood, and UI elements

#### Scenario: Built-in themes
- **WHEN** the game initializes
- **THEN** five themes are available: Classic, Neon, Retro, Dark, Light

### Requirement: Canvas Theming
The system SHALL apply theme colors to all canvas-rendered elements.

#### Scenario: Background color
- **WHEN** the canvas is cleared
- **THEN** it is filled with the theme's background color

#### Scenario: Grid color
- **WHEN** the grid is drawn
- **THEN** grid lines use the theme's grid color

#### Scenario: Snake colors
- **WHEN** the snake is rendered
- **THEN** the head uses theme.snakeHead and body uses theme.snake

#### Scenario: Food colors
- **WHEN** food is rendered
- **THEN** it uses the appropriate theme color for its type

### Requirement: UI Theming
The system SHALL apply theme colors to UI elements via CSS custom properties.

#### Scenario: CSS variables
- **WHEN** a theme is applied
- **THEN** CSS custom properties are updated on the document root

#### Scenario: UI elements
- **WHEN** UI elements render
- **THEN** they use colors from CSS custom properties

#### Scenario: Smooth transition
- **WHEN** the theme changes
- **THEN** UI colors transition smoothly (not instant)

### Requirement: Theme Selection
The system SHALL allow players to select a theme from the settings screen.

#### Scenario: Theme picker
- **WHEN** the settings screen is displayed
- **THEN** a theme picker shows all available themes

#### Scenario: Theme preview
- **GIVEN** the theme picker is displayed
- **THEN** each theme option shows a color preview

#### Scenario: Apply theme
- **WHEN** the player selects a theme
- **THEN** the theme is applied immediately

#### Scenario: Current theme indicator
- **WHEN** the theme picker is displayed
- **THEN** the currently active theme is visually highlighted

### Requirement: Theme Persistence
The system SHALL persist the selected theme between sessions.

#### Scenario: Save preference
- **WHEN** the player selects a theme
- **THEN** the selection is saved to localStorage

#### Scenario: Load preference
- **WHEN** the game loads
- **THEN** the saved theme is applied

#### Scenario: Default theme
- **GIVEN** no saved theme preference exists
- **WHEN** the game loads
- **THEN** the Classic theme is applied
