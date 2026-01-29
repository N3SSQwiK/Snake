# Tasks: Add UI Screens

## 1. HTML Structure
- [x] 1.1 Add start menu overlay div with play, settings, high scores buttons
- [x] 1.2 Add pause overlay div with resume, quit buttons
- [x] 1.3 Add game over overlay div with score display, restart, menu buttons
- [x] 1.4 Add settings overlay div with toggles and back button
- [x] 1.5 Add mobile pause button (visible on touch devices)

## 2. CSS Styling
- [x] 2.1 Style overlay container (absolute positioning over canvas)
- [x] 2.2 Style semi-transparent backdrop
- [x] 2.3 Style buttons with hover/active states
- [x] 2.4 Add fade-in animation for game over screen
- [x] 2.5 Style settings toggles
- [x] 2.6 Hide/show mobile pause button based on device

## 3. UI Manager
- [x] 3.1 Create showScreen(screenName) method
- [x] 3.2 Create hideScreen(screenName) method
- [x] 3.3 Create hideAllScreens() method
- [x] 3.4 Bind game state changes to screen visibility

## 4. Start Menu
- [x] 4.1 Show start menu when game state is MENU
- [x] 4.2 Play button: transition to PLAYING, hide menu
- [x] 4.3 Settings button: show settings screen
- [x] 4.4 High scores button: show leaderboard (placeholder)

## 5. Pause Functionality
- [x] 5.1 Add spacebar listener for pause toggle
- [x] 5.2 Add mobile pause button click handler
- [x] 5.3 Show pause overlay when PAUSED
- [x] 5.4 Resume button: transition to PLAYING
- [x] 5.5 Quit button: transition to MENU, reset game

## 6. Game Over Screen
- [x] 6.1 Show game over overlay when GAMEOVER
- [x] 6.2 Display final score in overlay
- [x] 6.3 Trigger fade-in animation
- [x] 6.4 Restart button: reset and transition to PLAYING
- [x] 6.5 Menu button: transition to MENU

## 7. Settings Screen
- [x] 7.1 Display wall collision toggle with current value
- [x] 7.2 Toggle updates StorageManager and game config
- [x] 7.3 Back button returns to previous screen

## 8. Testing
- [x] 8.1 Manual test: navigate through all screens
- [x] 8.2 Manual test: pause/resume works correctly
- [x] 8.3 Manual test: settings persist after restart
- [x] 8.4 Manual test: mobile pause button appears on touch device
