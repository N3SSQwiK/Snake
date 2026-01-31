# Tasks: Add Theme System

## 1. Theme Definitions
- [ ] 1.1 Create THEMES constant with theme objects
- [ ] 1.2 Define Classic theme (green snake, black background)
- [ ] 1.3 Define Neon theme (bright colors, dark background)
- [ ] 1.4 Define Retro theme (pixel art colors)
- [ ] 1.5 Define Dark theme (muted colors, dark background)
- [ ] 1.6 Define Light theme (dark snake, light background)
- [ ] 1.7 Each theme includes: background, grid, snake, snakeHead, food, bonusFood, poisonFood, ui colors
- [ ] 1.8 Each theme includes unlock condition (milestone type, threshold, difficulty)

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

## 4. Theme Unlock System
- [ ] 4.1 Add `getUnlockedThemes()` method to StorageManager
- [ ] 4.2 Add `unlockTheme(themeName)` method to StorageManager
- [ ] 4.3 Add `checkThemeUnlocks(score, difficulty)` method
- [ ] 4.4 Call unlock check on game over
- [ ] 4.5 Show unlock notification on game over screen when new theme earned
- [ ] 4.6 Classic unlocked by default, others gated by milestones

## 5. Renderer Updates
- [ ] 5.1 Add theme property to Renderer
- [ ] 5.2 Update `clear()` to use theme.background
- [ ] 5.3 Update `drawGrid()` to use theme.grid
- [ ] 5.4 Update `drawSnake()` to use theme.snake, theme.snakeHead
- [ ] 5.5 Update `drawFood()` to use theme.food (and variants)

## 6. Theme Selector UI
- [ ] 6.1 Add theme picker section to settings screen
- [ ] 6.2 Display theme options as buttons or swatches
- [ ] 6.3 Show theme name and color preview for unlocked themes
- [ ] 6.4 Show lock icon and milestone hint for locked themes
- [ ] 6.5 Highlight currently selected theme
- [ ] 6.6 Apply theme immediately on selection (unlocked only)
- [ ] 6.7 Block selection of locked themes

## 7. Testing
- [ ] 7.1 Unit test: theme unlock conditions evaluate correctly
- [ ] 7.2 Unit test: unlock state persists in localStorage
- [ ] 7.3 Manual test: each theme applies correctly to canvas
- [ ] 7.4 Manual test: each theme applies correctly to UI
- [ ] 7.5 Manual test: theme persists after reload
- [ ] 7.6 Manual test: theme transitions smoothly
- [ ] 7.7 Manual test: locked themes cannot be selected
- [ ] 7.8 Manual test: unlock notification appears on game over
