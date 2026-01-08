# Tasks: Add Leaderboard System

## 1. StorageManager Extension
- [ ] 1.1 Add `getLeaderboard()` method returning array of score entries
- [ ] 1.2 Add `addScore(initials, score)` method
- [ ] 1.3 Implement sorted insertion (highest first)
- [ ] 1.4 Limit to top 10 entries
- [ ] 1.5 Include timestamp with each entry
- [ ] 1.6 Add `isHighScore(score)` method to check if score qualifies

## 2. Initials Entry UI
- [ ] 2.1 Add initials input overlay to HTML
- [ ] 2.2 Style arcade-style character selection (3 chars)
- [ ] 2.3 Support keyboard input for initials
- [ ] 2.4 Support arrow keys/buttons for character cycling
- [ ] 2.5 Add confirm button to submit initials

## 3. Leaderboard Display
- [ ] 3.1 Add leaderboard screen overlay to HTML
- [ ] 3.2 Create table layout: rank, initials, score, date
- [ ] 3.3 Style leaderboard with theme colors
- [ ] 3.4 Populate from StorageManager on display
- [ ] 3.5 Add back button to return to menu

## 4. High Score Integration
- [ ] 4.1 Check if final score qualifies for leaderboard on game over
- [ ] 4.2 If qualifies, show initials entry before game over screen
- [ ] 4.3 After entry, save score and show game over screen
- [ ] 4.4 Highlight new entry in leaderboard

## 5. High Score Celebration
- [ ] 5.1 Detect when score becomes new #1 high score
- [ ] 5.2 Add visual celebration effect (CSS animation)
- [ ] 5.3 Display "NEW HIGH SCORE!" message
- [ ] 5.4 Trigger celebration in game over screen

## 6. Game Over Screen Update
- [ ] 6.1 Show current score vs high score comparison
- [ ] 6.2 Indicate if player made the leaderboard
- [ ] 6.3 Add "View Leaderboard" button

## 7. Testing
- [ ] 7.1 Unit test: leaderboard sorts correctly
- [ ] 7.2 Unit test: only top 10 retained
- [ ] 7.3 Unit test: isHighScore returns correct result
- [ ] 7.4 Manual test: initials entry flow
- [ ] 7.5 Manual test: leaderboard displays correctly
