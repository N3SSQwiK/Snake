# Tasks: Add Theme System

## 1. Theme Definitions
- [ ] 1.1 Create THEMES constant with theme objects
- [ ] 1.2 Define Classic theme (green snake, black background)
- [ ] 1.3 Define Neon theme (bright colors, dark background)
- [ ] 1.4 Define Retro theme (pixel art colors)
- [ ] 1.5 Define Dark theme (muted colors, dark background)
- [ ] 1.6 Define Light theme (dark snake, light background)
- [ ] 1.7 Each theme includes: background, grid, snake, snakeHead, food, bonusFood, poisonFood, ui colors

## 2. CSS Variables
- [ ] 2.1 Define CSS custom properties for UI colors
- [ ] 2.2 Map: --theme-bg, --theme-text, --theme-accent, --theme-button, --theme-button-hover
- [ ] 2.3 Set default values matching Classic theme
- [ ] 2.4 Add transition for smooth color changes

## 3. Theme Manager
- [ ] 3.1 Create `setTheme(themeName)` function
- [ ] 3.2 Update CSS variables on document root
- [ ] 3.3 Store active theme in Game/Renderer
- [ ] 3.4 Save theme preference to StorageManager
- [ ] 3.5 Load saved theme on init

## 4. Renderer Updates
- [ ] 4.1 Add theme property to Renderer
- [ ] 4.2 Update `clear()` to use theme.background
- [ ] 4.3 Update `drawGrid()` to use theme.grid
- [ ] 4.4 Update `drawSnake()` to use theme.snake, theme.snakeHead
- [ ] 4.5 Update `drawFood()` to use theme.food (and variants)

## 5. Theme Selector UI
- [ ] 5.1 Add theme picker section to settings screen
- [ ] 5.2 Display theme options as buttons or swatches
- [ ] 5.3 Show theme name and color preview
- [ ] 5.4 Highlight currently selected theme
- [ ] 5.5 Apply theme immediately on selection

## 6. Testing
- [ ] 6.1 Manual test: each theme applies correctly to canvas
- [ ] 6.2 Manual test: each theme applies correctly to UI
- [ ] 6.3 Manual test: theme persists after reload
- [ ] 6.4 Manual test: theme transitions smoothly
