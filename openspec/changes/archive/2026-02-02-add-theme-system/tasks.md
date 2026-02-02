# Tasks: Add Theme System

## 1. Theme Definitions
- [x] 1.1 Create THEMES constant with theme objects
- [x] 1.2 Define Classic theme (green snake, black background)
- [x] 1.3 Define Neon theme (bright colors, dark background)
- [x] 1.4 Define Retro theme (pixel art colors)
- [x] 1.5 Define Dark theme (muted colors, dark background)
- [x] 1.6 Define Light theme (dark snake, light background)
- [x] 1.7 Each theme includes: background, grid, snake, snakeHead, food, bonusFood, poisonFood, ui colors
- [x] 1.8 Each theme includes unlock condition (milestone type, threshold, difficulty)

## 2. CSS Variables
- [x] 2.1 Define CSS custom properties for UI colors
- [x] 2.2 Map: --theme-bg, --theme-text, --theme-accent, --theme-button, --theme-button-hover
- [x] 2.3 Set default values matching Classic theme
- [x] 2.4 Add transition for smooth color changes

## 3. Theme Manager
- [x] 3.1 Create `setTheme(themeName)` function
- [x] 3.2 Update CSS variables on document root
- [x] 3.3 Store active theme in Game/Renderer
- [x] 3.4 Save theme preference to StorageManager
- [x] 3.5 Load saved theme on init

## 4. Theme Unlock System
- [x] 4.1 Add `getUnlockedThemes()` method to StorageManager
- [x] 4.2 Add `unlockTheme(themeName)` method to StorageManager
- [x] 4.3 Add `checkThemeUnlocks(score, difficulty)` method
- [x] 4.4 Call unlock check on game over
- [x] 4.5 Show unlock notification on game over screen when new theme earned
- [x] 4.6 Classic unlocked by default, others gated by milestones

## 5. Renderer Updates
- [x] 5.1 Add theme property to Renderer
- [x] 5.2 Update `clear()` to use theme.background
- [x] 5.3 Update `drawGrid()` to use theme.grid
- [x] 5.4 Update `drawSnake()` to use theme.snake, theme.snakeHead
- [x] 5.5 Update `drawFood()` to use theme.food (and variants)

## 6. Theme Selector UI
- [x] 6.1 Add theme picker section to settings screen
- [x] 6.2 Display theme options as buttons or swatches
- [x] 6.3 Show theme name and color preview for unlocked themes
- [x] 6.4 Show lock icon and milestone hint for locked themes
- [x] 6.5 Highlight currently selected theme
- [x] 6.6 Apply theme immediately on selection (unlocked only)
- [x] 6.7 Block selection of locked themes

## 7. Testing
- [x] 7.1 Unit test: theme unlock conditions evaluate correctly
- [x] 7.2 Unit test: unlock state persists in localStorage
- [x] 7.3 Manual test: each theme applies correctly to canvas
- [x] 7.4 Manual test: each theme applies correctly to UI
- [x] 7.5 Manual test: theme persists after reload
- [x] 7.6 Manual test: theme transitions smoothly
- [x] 7.7 Manual test: locked themes cannot be selected
- [x] 7.8 Manual test: unlock notification appears on game over
