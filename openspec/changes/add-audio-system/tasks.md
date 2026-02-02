# Tasks: Add Audio System

## 1. AudioManager Class
- [ ] 1.1 Create AudioManager class with Web Audio API context
- [ ] 1.2 Add volume property (0.0 to 1.0)
- [ ] 1.3 Add muted property (boolean)
- [ ] 1.4 Implement lazy AudioContext initialization (user interaction required)

## 2. Sound Generation — Gameplay
- [ ] 2.1 Implement `playTone(frequency, duration, type)` base method
- [ ] 2.2 Create `playEat()` — short pleasant chirp
- [ ] 2.3 Create `playBonusEat()` — ascending happy tone
- [ ] 2.4 Create `playPoisonAppear()` — warning tone
- [ ] 2.5 Create `playPoisonDisappear()` — relief tone
- [ ] 2.6 Create `playGameOver()` — descending sad tone
- [ ] 2.7 Create `playHighScore()` — celebratory fanfare
- [ ] 2.8 Create `playThemeUnlock()` — reward chime

## 3. Sound Generation — UI
- [ ] 3.1 Create `playNavigate()` — subtle tick for hover/focus
- [ ] 3.2 Create `playConfirm()` — affirmative tone for selections
- [ ] 3.3 Create `playBack()` — soft dismissal tone for cancel/escape

## 4. Volume Control
- [ ] 4.1 Add volume slider to settings screen
- [ ] 4.2 Add mute toggle button to settings screen
- [ ] 4.3 Save volume/mute to StorageManager
- [ ] 4.4 Load volume/mute settings on init
- [ ] 4.5 Apply volume to all sound playback

## 5. Game Integration
- [ ] 5.1 Instantiate AudioManager in Game constructor
- [ ] 5.2 Play eat sound on regular food collision
- [ ] 5.3 Play bonus eat sound on bonus food collision
- [ ] 5.4 Play poison appear sound when poison food spawns
- [ ] 5.5 Play poison disappear sound when poison food expires
- [ ] 5.6 Play game over sound on GAMEOVER transition
- [ ] 5.7 Play high score sound when new #1 achieved
- [ ] 5.8 Play theme unlock sound when new theme earned

## 6. UI Integration
- [ ] 6.1 Play navigate sound on button hover/focus
- [ ] 6.2 Play confirm sound on play, submit, restart, apply theme
- [ ] 6.3 Play back sound on back, escape, skip, quit

## 7. Testing
- [ ] 7.1 Manual test: each gameplay sound plays at correct moment
- [ ] 7.2 Manual test: each UI sound plays at correct moment
- [ ] 7.3 Manual test: volume slider affects all sounds
- [ ] 7.4 Manual test: mute silences all sounds
- [ ] 7.5 Manual test: settings persist after reload
- [ ] 7.6 Manual test: AudioContext initializes on first user interaction
