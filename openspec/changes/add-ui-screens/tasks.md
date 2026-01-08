# Tasks: Add UI Screens

## 1. HTML Structure
- [ ] 1.1 Add start menu overlay div with play, settings, high scores buttons
- [ ] 1.2 Add pause overlay div with resume, quit buttons
- [ ] 1.3 Add game over overlay div with score display, restart, menu buttons
- [ ] 1.4 Add settings overlay div with toggles and back button
- [ ] 1.5 Add mobile pause button (visible on touch devices)

## 2. CSS Styling
- [ ] 2.1 Style overlay container (absolute positioning over canvas)
- [ ] 2.2 Style semi-transparent backdrop
- [ ] 2.3 Style buttons with hover/active states
- [ ] 2.4 Add fade-in animation for game over screen
- [ ] 2.5 Style settings toggles
- [ ] 2.6 Hide/show mobile pause button based on device

## 3. UI Manager
- [ ] 3.1 Create showScreen(screenName) method
- [ ] 3.2 Create hideScreen(screenName) method
- [ ] 3.3 Create hideAllScreens() method
- [ ] 3.4 Bind game state changes to screen visibility

## 4. Start Menu
- [ ] 4.1 Show start menu when game state is MENU
- [ ] 4.2 Play button: transition to PLAYING, hide menu
- [ ] 4.3 Settings button: show settings screen
- [ ] 4.4 High scores button: show leaderboard (placeholder)

## 5. Pause Functionality
- [ ] 5.1 Add spacebar listener for pause toggle
- [ ] 5.2 Add mobile pause button click handler
- [ ] 5.3 Show pause overlay when PAUSED
- [ ] 5.4 Resume button: transition to PLAYING
- [ ] 5.5 Quit button: transition to MENU, reset game

## 6. Game Over Screen
- [ ] 6.1 Show game over overlay when GAMEOVER
- [ ] 6.2 Display final score in overlay
- [ ] 6.3 Trigger fade-in animation
- [ ] 6.4 Restart button: reset and transition to PLAYING
- [ ] 6.5 Menu button: transition to MENU

## 7. Settings Screen
- [ ] 7.1 Display wall collision toggle with current value
- [ ] 7.2 Toggle updates StorageManager and game config
- [ ] 7.3 Back button returns to previous screen

## 8. Testing
- [ ] 8.1 Manual test: navigate through all screens
- [ ] 8.2 Manual test: pause/resume works correctly
- [ ] 8.3 Manual test: settings persist after restart
- [ ] 8.4 Manual test: mobile pause button appears on touch device
