# Tasks: Add Difficulty System

## 1. Difficulty Configuration
- [ ] 1.1 Create DIFFICULTY_LEVELS constant
- [ ] 1.2 Define Easy: slow start, gentle acceleration
- [ ] 1.3 Define Medium: moderate start, standard acceleration
- [ ] 1.4 Define Hard: fast start, aggressive acceleration
- [ ] 1.5 Each level: baseSpeed, accelerationRate, maxSpeed, bonusFoodChance, poisonFoodChance

## 2. Speed System
- [ ] 2.1 Add currentSpeed property to Game
- [ ] 2.2 Add tickInterval calculated from speed
- [ ] 2.3 Implement speed increase logic based on score
- [ ] 2.4 Apply acceleration rate from difficulty
- [ ] 2.5 Cap speed at maxSpeed

## 3. Game Loop Update
- [ ] 3.1 Modify tick timing to use variable interval
- [ ] 3.2 Accumulate delta time between ticks
- [ ] 3.3 Execute game tick when accumulated time exceeds interval
- [ ] 3.4 Reset speed on game restart

## 4. Advanced Food Types
- [ ] 4.1 Add foodType property to Food class (regular, bonus, poison)
- [ ] 4.2 Add timer property for time-limited food
- [ ] 4.3 Add points multiplier for bonus food
- [ ] 4.4 Implement random food type selection based on difficulty probabilities
- [ ] 4.5 Add countdown timer display for time-limited food

## 5. Bonus Food
- [ ] 5.1 Spawn bonus food with probability from difficulty
- [ ] 5.2 Set timer (e.g., 5-10 seconds)
- [ ] 5.3 Award bonus points when eaten
- [ ] 5.4 Despawn when timer expires
- [ ] 5.5 Visual distinction from regular food

## 6. Poisonous Food
- [ ] 6.1 Spawn poison food with probability from difficulty
- [ ] 6.2 Set timer (e.g., 3-5 seconds)
- [ ] 6.3 Trigger game over if eaten
- [ ] 6.4 Despawn when timer expires
- [ ] 6.5 Visual distinction (warning color)

## 7. Difficulty Selector UI
- [ ] 7.1 Add difficulty selector to settings screen
- [ ] 7.2 Display Easy, Medium, Hard options
- [ ] 7.3 Show description of each level
- [ ] 7.4 Save selection to StorageManager
- [ ] 7.5 Apply difficulty on game start

## 8. Testing
- [ ] 8.1 Unit test: speed increases correctly with score
- [ ] 8.2 Unit test: speed caps at maximum
- [ ] 8.3 Unit test: food timers expire correctly
- [ ] 8.4 Manual test: each difficulty feels distinct
- [ ] 8.5 Manual test: poison food triggers game over
