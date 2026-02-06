# Design: Add Audio System

## Architecture

AudioManager is a standalone class instantiated by Game. It uses Web Audio API to procedurally generate all sounds — no audio files.

```
Game
 └── AudioManager
      ├── AudioContext (lazy init on first user interaction)
      ├── masterGain → destination
      └── per-tone: oscillator → gain (envelope) → masterGain
```

## Sound Design

All sounds use `_playTone(frequency, duration, type, attack, decay)` which creates a short-lived oscillator with envelope shaping (attack ramp → sustain → decay fade). Multi-note sounds use `_playSequence()` with staggered `setTimeout` calls.

### Waveform Choices
- **Sine**: Clean tones for positive/neutral events (eat, confirm, navigate)
- **Sawtooth**: Harsh buzz for negative events (toxic eat, poison appear)

### Sound Map
| Event | Frequency | Wave | Duration | Character |
|-------|-----------|------|----------|-----------|
| Eat | 880Hz | sine | 80ms | Quick high blip |
| Bonus eat | C5-E5-G5 | sine | 3-note arpeggio | Ascending reward |
| Toxic eat | 150Hz | sawtooth | 300ms | Low growl |
| Poison appear | 220Hz | sawtooth | 250ms | Ominous warning |
| Poison disappear | E4-A4 | sine | 2-note rise | Relief |
| Game over | G4-E4-C4-G3 | sine | 4-note descend | Sad |
| High score | C5-E5-G5-C6 | sine | 4-note ascend | Fanfare |
| Theme unlock | E5-G5-A5-C6-E6 | sine | 5-note run | Celebration |
| Navigate | 600Hz | sine | 30ms | Tiny tick |
| Confirm | 880Hz | sine | 100ms | Affirm blip |
| Back | 440Hz | sine | 80ms | Softer, lower |

## Volume Control

- masterGain node controls all output volume (0.0–1.0)
- Mute sets masterGain to 0 without changing stored volume
- Volume/mute persisted to localStorage via StorageManager
- UI: range slider (0-100%) + mute toggle in settings panel

## Browser Constraints

- AudioContext requires user gesture to create (lazy `init()` on first click/hover)
- Context can suspend on tab switch/idle; `_ensureRunning()` awaits `resume()` before scheduling tones
- Safari fallback: `window.webkitAudioContext`

## Integration Points

- **UIManager**: calls `init()` on overlay click, `playNavigate()` on button hover/focus, `playConfirm()`/`playBack()` on actions
- **Game.update()**: calls gameplay sounds inline (eat, spawn, expire, game over)
- **Game.handleGameOver()**: branches between `playHighScore()` and `playGameOver()`
