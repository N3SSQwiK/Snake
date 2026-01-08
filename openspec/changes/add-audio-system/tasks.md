# Tasks: Add Audio System

## 1. AudioManager Class
- [ ] 1.1 Create AudioManager class with Web Audio API context
- [ ] 1.2 Add volume property (0.0 to 1.0)
- [ ] 1.3 Add muted property (boolean)
- [ ] 1.4 Implement lazy AudioContext initialization (user interaction required)

## 2. Sound Generation
- [ ] 2.1 Implement `playTone(frequency, duration, type)` base method
- [ ] 2.2 Create `playEat()` - short pleasant chirp
- [ ] 2.3 Create `playBonusEat()` - ascending happy tone
- [ ] 2.4 Create `playPoisonAppear()` - warning tone
- [ ] 2.5 Create `playPoisonDisappear()` - relief tone
- [ ] 2.6 Create `playGameOver()` - descending sad tone
- [ ] 2.7 Create `playHighScore()` - celebratory fanfare
- [ ] 2.8 Create `playClick()` - subtle UI feedback

## 3. Volume Control
- [ ] 3.1 Add volume slider to settings screen
- [ ] 3.2 Add mute toggle button
- [ ] 3.3 Save volume/mute to StorageManager
- [ ] 3.4 Load settings on init
- [ ] 3.5 Apply volume to all sound playback

## 4. Game Integration
- [ ] 4.1 Instantiate AudioManager in Game
- [ ] 4.2 Play eat sound on food collision
- [ ] 4.3 Play appropriate sound for bonus/poison food
- [ ] 4.4 Play game over sound on GAMEOVER transition
- [ ] 4.5 Play high score sound when new #1 achieved
- [ ] 4.6 Play click sound on button interactions

## 5. Animation Style Toggle
- [ ] 5.1 Add animationStyle property to Game (smooth/classic)
- [ ] 5.2 Add toggle to settings screen
- [ ] 5.3 Save preference to StorageManager
- [ ] 5.4 Implement smooth interpolation in Renderer
- [ ] 5.5 Interpolate snake position between grid cells
- [ ] 5.6 Classic mode: instant grid-to-grid (existing behavior)

## 6. Smooth Animation Implementation
- [ ] 6.1 Track time since last tick
- [ ] 6.2 Calculate interpolation factor (0 to 1)
- [ ] 6.3 Interpolate each snake segment position
- [ ] 6.4 Render at interpolated positions
- [ ] 6.5 Ensure food and other elements align to grid

## 7. Testing
- [ ] 7.1 Manual test: each sound plays correctly
- [ ] 7.2 Manual test: volume slider affects all sounds
- [ ] 7.3 Manual test: mute silences all sounds
- [ ] 7.4 Manual test: smooth animation looks fluid
- [ ] 7.5 Manual test: classic animation snaps correctly
- [ ] 7.6 Manual test: settings persist after reload
