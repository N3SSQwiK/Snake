# Tasks: Add Leaderboard System

## 1. StorageManager Extension
- [x] 1.1 Add `getLeaderboard()` method returning array of score entries
- [x] 1.2 Add `addScore(initials, score)` method
- [x] 1.3 Implement sorted insertion (highest first)
- [x] 1.4 Limit to top 10 entries
- [x] 1.5 Include timestamp with each entry
- [x] 1.6 Add `isHighScore(score)` method to check if score qualifies

## 2. Initials Entry UI
- [x] 2.1 Add initials input overlay to HTML
- [x] 2.2 Style arcade-style character selection (3 chars)
- [x] 2.3 Support keyboard input for initials
- [x] 2.4 Support arrow keys/buttons for character cycling
- [x] 2.5 Add confirm button to submit initials

## 3. Leaderboard Display
- [x] 3.1 Add leaderboard screen overlay to HTML
- [x] 3.2 Create table layout: rank, initials, score, date
- [x] 3.3 Style leaderboard with theme colors
- [x] 3.4 Populate from StorageManager on display
- [x] 3.5 Add back button to return to menu

## 4. High Score Integration
- [x] 4.1 Check if final score qualifies for leaderboard on game over
- [x] 4.2 If qualifies, show initials entry before game over screen
- [x] 4.3 After entry, save score and show game over screen
- [x] 4.4 Highlight new entry in leaderboard

## 5. High Score Celebration
- [x] 5.1 Detect when score becomes new #1 high score
- [x] 5.2 Add visual celebration effect (CSS animation)
- [x] 5.3 Display "NEW HIGH SCORE!" message
- [x] 5.4 Trigger celebration in game over screen

## 6. Game Over Screen Update
- [x] 6.1 Show current score vs high score comparison
- [x] 6.2 Indicate if player made the leaderboard
- [x] 6.3 Add "View Leaderboard" button

## 7. Testing
- [x] 7.1 Unit test: leaderboard sorts correctly
- [x] 7.2 Unit test: only top 10 retained
- [x] 7.3 Unit test: isHighScore returns correct result
- [x] 7.4 Manual test: initials entry flow
- [x] 7.5 Manual test: leaderboard displays correctly
