## ADDED Requirements

### Requirement: Screen Navigation Registry
The system SHALL define navigation contracts for each screen in a `SCREEN_NAV` constant object, keyed by screen identifier (data-ui value or game state name).

#### Scenario: Registry structure
- **WHEN** the game initializes
- **THEN** a `SCREEN_NAV` constant exists with entries for: `mode-select`, `settings`, `leaderboard`, `shortcuts`, `initials`, `PAUSED`, `GAMEOVER`

#### Scenario: Each entry declares a back action
- **GIVEN** `SCREEN_NAV` is defined
- **WHEN** an entry is accessed
- **THEN** it contains a `back` property naming the UIManager method to call for back/dismiss

#### Scenario: Each entry declares a focus entry point
- **GIVEN** `SCREEN_NAV` is defined
- **WHEN** an entry is accessed
- **THEN** it contains a `focusEntry` property with a CSS selector for the element to focus on input mode switch (or `null` if the screen manages its own focus)

#### Scenario: Grid layout declaration
- **GIVEN** `SCREEN_NAV` is defined and a screen has a 2D navigable grid
- **WHEN** the entry is accessed
- **THEN** it contains a `grid` property with `cols` (number) and `selector` (CSS selector for grid items)

#### Scenario: Own key handler flag
- **GIVEN** `SCREEN_NAV` is defined and a screen has custom key handling (e.g., initials)
- **WHEN** the entry is accessed
- **THEN** it contains `ownKeyHandler: true` indicating that `navigateMenu` and `_handleMenuKeyDown` SHALL skip generic navigation for this screen

### Requirement: Unified Back Dispatch
The system SHALL route all back/dismiss inputs (keyboard Escape, keyboard Backspace, gamepad Circle) through a single `navigateBack()` method.

#### Scenario: navigateBack resolves screen from registry
- **WHEN** `navigateBack()` is called
- **THEN** it determines the current screen identifier (data-ui or game state) and looks up the `SCREEN_NAV` entry

#### Scenario: navigateBack calls registered back action
- **GIVEN** a `SCREEN_NAV` entry exists for the current screen
- **WHEN** `navigateBack()` is called
- **THEN** it invokes the method named in the entry's `back` property

#### Scenario: navigateBack plays audio
- **GIVEN** a `SCREEN_NAV` entry exists for the current screen
- **WHEN** `navigateBack()` is called
- **THEN** it plays the appropriate audio feedback (playBack for dismiss, playConfirm for resume)

#### Scenario: navigateBack handles unknown screen
- **GIVEN** the current screen has no `SCREEN_NAV` entry
- **WHEN** `navigateBack()` is called
- **THEN** it is a no-op

### Requirement: Focus Recovery on Input Mode Switch
The system SHALL auto-focus the correct element when the first keyboard or D-pad navigation input arrives on a screen with no focused element.

#### Scenario: No element focused on navigation input
- **GIVEN** a screen is displayed and no element within it has focus (e.g., after mouse click)
- **WHEN** the player presses an arrow key or D-pad direction
- **THEN** the element specified by `SCREEN_NAV[screen].focusEntry` receives focus

#### Scenario: Element already focused
- **GIVEN** a screen is displayed and an element within it has focus
- **WHEN** the player presses an arrow key or D-pad direction
- **THEN** normal navigation proceeds (no focus override)

#### Scenario: Screen with null focusEntry
- **GIVEN** a screen's `SCREEN_NAV` entry has `focusEntry: null`
- **WHEN** the player presses an arrow key
- **THEN** the system falls back to focusing the first navigable button

#### Scenario: Focus recovery respects visibility
- **GIVEN** a screen's `focusEntry` selector matches an element
- **WHEN** the element is hidden (`offsetParent === null`)
- **THEN** the system falls back to the first visible navigable button

### Requirement: Grid Navigation
The system SHALL support 2D directional navigation for screens that declare a `grid` property in their `SCREEN_NAV` entry.

#### Scenario: Grid navigation delegates from navigateMenu
- **GIVEN** the current screen has a `grid` property in `SCREEN_NAV`
- **WHEN** `navigateMenu(direction)` is called
- **THEN** navigation is handled by the grid navigator and does NOT fall through to flat list navigation

#### Scenario: Grid edge behavior
- **GIVEN** the focused element is at the edge of the grid
- **WHEN** the player presses a direction toward the edge (e.g., Left on leftmost column)
- **THEN** focus does not move (no-op, no wrapping)

#### Scenario: Grid to external element
- **GIVEN** the focused element is in the bottom row of a grid
- **WHEN** the player presses Down
- **THEN** focus moves to the first focusable element below the grid (e.g., a submit button)

#### Scenario: External element to grid
- **GIVEN** focus is on an element below the grid (e.g., Start Game button)
- **WHEN** the player presses Up
- **THEN** focus moves to the bottom-left element of the grid
