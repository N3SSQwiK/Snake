// =============================================================================
// CONSTANTS
// =============================================================================

const GRID_WIDTH = 25;
const GRID_HEIGHT = 25;
const CELL_SIZE = 20;

const CANVAS_WIDTH = GRID_WIDTH * CELL_SIZE;
const CANVAS_HEIGHT = GRID_HEIGHT * CELL_SIZE;

const GameState = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
};

const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

const TARGET_FPS = 60;
const TICK_RATE = 10; // Game logic updates per second

// Food constants
const FOOD_POINTS = 10;
const FOOD_DECAY_TICKS = 100;              // 10s at 10Hz
const FOOD_DECAY_WARNING_THRESHOLD = 0.25; // Blink at <25%
const FOOD_MAX_SPAWN_ATTEMPTS = 100;

// Food types
const FoodType = {
    REGULAR: 'regular',
    BONUS: 'bonus',
    TOXIC: 'toxic',
    LETHAL: 'lethal'
};

// Special food timer (ticks before despawn)
const SPECIAL_FOOD_TICKS = 60; // 6s at 10Hz

// Extended Time Mode: doubled timers for accessibility
const FOOD_DECAY_TICKS_ACCESSIBLE = 200;    // 20s at 10Hz (2x normal)
const SPECIAL_FOOD_TICKS_ACCESSIBLE = 120;  // 12s at 10Hz (2x normal)

// Difficulty levels
const DIFFICULTY_LEVELS = {
    easy: {
        name: 'Easy',
        description: 'Walls wrap, no hazard food',
        baseTickRate: 8,
        maxTickRate: 14,
        speedScoreStep: 80,
        bonusFoodChance: 0.15,
        toxicFoodChance: 0.0,
        lethalFoodChance: 0.0,
        wallCollision: false,
        hazardProximity: null,
        toxicSegmentBase: 0,
        toxicSegmentDivisor: 0
    },
    medium: {
        name: 'Medium',
        description: 'Walls kill, toxic food appears',
        baseTickRate: 10,
        maxTickRate: 18,
        speedScoreStep: 50,
        bonusFoodChance: 0.12,
        toxicFoodChance: 0.08,
        lethalFoodChance: 0.0,
        wallCollision: true,
        hazardProximity: { min: 4, max: 6 },
        toxicSegmentBase: 1,
        toxicSegmentDivisor: 10
    },
    hard: {
        name: 'Hard',
        description: 'Walls kill, toxic and lethal food',
        baseTickRate: 12,
        maxTickRate: 22,
        speedScoreStep: 30,
        bonusFoodChance: 0.10,
        toxicFoodChance: 0.12,
        lethalFoodChance: 0.06,
        wallCollision: true,
        hazardProximity: { min: 1, max: 2 },
        toxicSegmentBase: 2,
        toxicSegmentDivisor: 5
    }
};

// Theme definitions
const THEMES = {
    classic: {
        name: 'Classic',
        colors: {
            background: '#0a0a0f',
            grid: '#5a5a7d',
            snake: '#10b981',
            snakeHead: '#059669',
            snakeTail: '#34d399',
            snakeGlow: 'rgba(16, 185, 129, 0.4)',
            snakeEyes: 'rgba(255, 255, 255, 0.9)',
            food: '#ef4444',
            bonusFood: '#f59e0b',
            poisonFood: '#a855f7',
            foodStem: '#5d4037',
            foodLeaf: '#2d7a3a',
            scoreText: '#ffffff',
            scoreShadow: 'rgba(0, 0, 0, 0.7)'
        },
        ui: {
            accent: '#10b981',
            accentGlow: 'rgba(16, 185, 129, 0.35)',
            accentHover: '#34d399',
            danger: '#f43f5e',
            dangerGlow: 'rgba(244, 63, 94, 0.3)',
            glass: 'rgba(255, 255, 255, 0.06)',
            glassBorder: 'rgba(255, 255, 255, 0.10)',
            glassHighlight: 'rgba(255, 255, 255, 0.15)',
            textPrimary: 'rgba(255, 255, 255, 0.95)',
            textSecondary: 'rgba(255, 255, 255, 0.60)',
            textMuted: 'rgba(255, 255, 255, 0.46)',
            gold: '#f59e0b',
            goldGlow: 'rgba(245, 158, 11, 0.4)'
        },
        unlockCondition: { type: 'default' }
    },
    dark: {
        name: 'Dark',
        colors: {
            background: '#0c0c10',
            grid: '#5c5c76',
            snake: '#7c8ca1',
            snakeHead: '#94a3b8',
            snakeTail: '#64748b',
            snakeGlow: 'rgba(148, 163, 184, 0.25)',
            snakeEyes: 'rgba(15, 23, 42, 0.85)',
            food: '#c2614b',
            bonusFood: '#d4915e',
            poisonFood: '#8b6caf',
            foodStem: '#4a3f38',
            foodLeaf: '#4a6350',
            scoreText: 'rgba(226, 232, 240, 0.9)',
            scoreShadow: 'rgba(0, 0, 0, 0.8)'
        },
        ui: {
            accent: '#6366f1',
            accentGlow: 'rgba(99, 102, 241, 0.3)',
            accentHover: '#818cf8',
            danger: '#e35b6f',
            dangerGlow: 'rgba(227, 91, 111, 0.25)',
            glass: 'rgba(255, 255, 255, 0.04)',
            glassBorder: 'rgba(255, 255, 255, 0.07)',
            glassHighlight: 'rgba(255, 255, 255, 0.10)',
            textPrimary: 'rgba(226, 232, 240, 0.92)',
            textSecondary: 'rgba(226, 232, 240, 0.50)',
            textMuted: 'rgba(226, 232, 240, 0.50)',
            gold: '#d4915e',
            goldGlow: 'rgba(212, 145, 94, 0.35)'
        },
        unlockCondition: { type: 'score', threshold: 50 }
    },
    light: {
        name: 'Light',
        colors: {
            background: '#e8e4df',
            grid: '#8e816e',
            snake: '#2d6a4f',
            snakeHead: '#1b4332',
            snakeTail: '#40916c',
            snakeGlow: 'rgba(45, 106, 79, 0.25)',
            snakeEyes: 'rgba(255, 255, 255, 0.9)',
            food: '#c1453b',
            bonusFood: '#ba722b',
            poisonFood: '#7b4d9e',
            foodStem: '#6b5545',
            foodLeaf: '#3a7d44',
            scoreText: '#2c2c2c',
            scoreShadow: 'rgba(255, 255, 255, 0.6)'
        },
        ui: {
            accent: '#2d6a4f',
            accentGlow: 'rgba(45, 106, 79, 0.25)',
            accentHover: '#40916c',
            danger: '#c1453b',
            dangerGlow: 'rgba(193, 69, 59, 0.2)',
            glass: 'rgba(0, 0, 0, 0.04)',
            glassBorder: 'rgba(0, 0, 0, 0.08)',
            glassHighlight: 'rgba(0, 0, 0, 0.12)',
            textPrimary: 'rgba(30, 30, 30, 0.92)',
            textSecondary: 'rgba(30, 30, 30, 0.64)',
            textMuted: 'rgba(30, 30, 30, 0.64)',
            gold: '#ba722b',
            goldGlow: 'rgba(186, 114, 43, 0.3)'
        },
        unlockCondition: { type: 'score', threshold: 100 }
    },
    retro: {
        name: 'Retro',
        colors: {
            background: '#1a120e',
            grid: '#7b5b46',
            snake: '#d4883a',
            snakeHead: '#e09940',
            snakeTail: '#b87330',
            snakeGlow: 'rgba(212, 136, 58, 0.35)',
            snakeEyes: 'rgba(60, 30, 0, 0.9)',
            food: '#c94545',
            bonusFood: '#e6c84d',
            poisonFood: '#8a5eb5',
            foodStem: '#5c4033',
            foodLeaf: '#6b8c42',
            scoreText: '#e8d5b0',
            scoreShadow: 'rgba(0, 0, 0, 0.75)'
        },
        ui: {
            accent: '#d4883a',
            accentGlow: 'rgba(212, 136, 58, 0.35)',
            accentHover: '#e09940',
            danger: '#c94545',
            dangerGlow: 'rgba(201, 69, 69, 0.3)',
            glass: 'rgba(232, 213, 176, 0.05)',
            glassBorder: 'rgba(232, 213, 176, 0.10)',
            glassHighlight: 'rgba(232, 213, 176, 0.14)',
            textPrimary: 'rgba(232, 213, 176, 0.92)',
            textSecondary: 'rgba(232, 213, 176, 0.55)',
            textMuted: 'rgba(232, 213, 176, 0.55)',
            gold: '#e6c84d',
            goldGlow: 'rgba(230, 200, 77, 0.35)'
        },
        unlockCondition: { type: 'scoreWithDifficulty', threshold: 200, minDifficulty: 'medium' }
    },
    neon: {
        name: 'Neon',
        colors: {
            background: '#080810',
            grid: '#5353a7',
            snake: '#22d3ee',
            snakeHead: '#06b6d4',
            snakeTail: '#67e8f9',
            snakeGlow: 'rgba(34, 211, 238, 0.45)',
            snakeEyes: 'rgba(255, 255, 255, 0.95)',
            food: '#f472b6',
            bonusFood: '#fbbf24',
            poisonFood: '#c084fc',
            foodStem: '#4a4055',
            foodLeaf: '#2dd4a8',
            scoreText: '#e0f2fe',
            scoreShadow: 'rgba(0, 0, 0, 0.8)'
        },
        ui: {
            accent: '#22d3ee',
            accentGlow: 'rgba(34, 211, 238, 0.35)',
            accentHover: '#67e8f9',
            danger: '#f472b6',
            dangerGlow: 'rgba(244, 114, 182, 0.3)',
            glass: 'rgba(255, 255, 255, 0.05)',
            glassBorder: 'rgba(255, 255, 255, 0.09)',
            glassHighlight: 'rgba(255, 255, 255, 0.14)',
            textPrimary: 'rgba(224, 242, 254, 0.95)',
            textSecondary: 'rgba(224, 242, 254, 0.55)',
            textMuted: 'rgba(224, 242, 254, 0.49)',
            gold: '#fbbf24',
            goldGlow: 'rgba(251, 191, 36, 0.4)'
        },
        unlockCondition: { type: 'scoreWithDifficulty', threshold: 300, minDifficulty: 'hard' }
    },
    highContrast: {
        name: 'High Contrast',
        colors: {
            background: '#000000',
            grid: '#5a5a5a',
            snake: '#00ff00',
            snakeHead: '#ffffff',
            snakeTail: '#00cc00',
            snakeGlow: 'rgba(0, 255, 0, 0.5)',
            snakeEyes: '#000000',
            food: '#ff0000',
            bonusFood: '#ffff00',
            poisonFood: '#ff00ff',
            foodStem: '#ffffff',
            foodLeaf: '#00ff00',
            scoreText: '#ffffff',
            scoreShadow: 'rgba(0, 0, 0, 1)'
        },
        ui: {
            accent: '#00ff00',
            accentGlow: 'rgba(0, 255, 0, 0.4)',
            accentHover: '#00cc00',
            danger: '#ff0000',
            dangerGlow: 'rgba(255, 0, 0, 0.4)',
            glass: 'rgba(255, 255, 255, 0.1)',
            glassBorder: 'rgba(255, 255, 255, 0.3)',
            glassHighlight: 'rgba(255, 255, 255, 0.2)',
            textPrimary: '#ffffff',
            textSecondary: '#cccccc',
            textMuted: '#999999',
            gold: '#ffff00',
            goldGlow: 'rgba(255, 255, 0, 0.5)'
        },
        unlockCondition: { type: 'default' }
    }
};

const DEFAULT_THEME = THEMES.classic;

// Difficulty rank mapping for theme unlock checks
const DIFFICULTY_RANKS = { easy: 1, medium: 2, hard: 3 };

// =============================================================================
// AUDIO MANAGER CLASS
// =============================================================================

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.volume = 0.5;
        this.muted = false;
        this.initialized = false;
    }

    // Lazy initialization - must be called after user interaction (browser requirement)
    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.muted ? 0 : this.volume;
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain && !this.muted) {
            this.masterGain.gain.setTargetAtTime(this.volume, this.audioContext.currentTime, 0.01);
        }
    }

    setMuted(muted) {
        this.muted = muted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(
                muted ? 0 : this.volume,
                this.audioContext.currentTime,
                0.01
            );
        }
    }

    // Ensure AudioContext is running before scheduling sounds
    _ensureRunning() {
        if (this.audioContext.state === 'suspended') {
            return this.audioContext.resume();
        }
        return Promise.resolve();
    }

    // Base method for procedural tone generation
    _playTone(frequency, duration, type = 'sine', attack = 0.01, decay = 0.1) {
        if (!this.initialized || !this.audioContext) return;
        this._ensureRunning().then(() => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = type;
            osc.frequency.value = frequency;
            osc.connect(gain);
            gain.connect(this.masterGain);

            const now = this.audioContext.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.3, now + attack);
            gain.gain.setValueAtTime(0.3, now + duration - decay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.start(now);
            osc.stop(now + duration);
        });
    }

    _playSequence(notes, noteLength = 0.1, gap = 0.05) {
        if (!this.initialized || !this.audioContext) return;
        this._ensureRunning().then(() => {
            notes.forEach((freq, i) => {
                setTimeout(() => this._playTone(freq, noteLength, 'sine', 0.005, 0.05), i * (noteLength + gap) * 1000);
            });
        });
    }

    // Gameplay sounds
    playEat() {
        this._playTone(880, 0.08, 'sine', 0.005, 0.03);
    }

    playBonusEat() {
        this._playSequence([523, 659, 784], 0.08, 0.02);
    }

    playPoisonAppear() {
        this._playTone(220, 0.25, 'sawtooth', 0.01, 0.15);
    }

    playPoisonDisappear() {
        this._playSequence([330, 440], 0.1, 0.05);
    }

    playToxicEat() {
        this._playTone(150, 0.3, 'sawtooth', 0.01, 0.2);
    }

    playGameOver() {
        this._playSequence([392, 330, 262, 196], 0.15, 0.05);
    }

    playHighScore() {
        this._playSequence([523, 659, 784, 1047], 0.12, 0.03);
    }

    playThemeUnlock() {
        this._playSequence([659, 784, 880, 1047, 1319], 0.1, 0.02);
    }

    // UI sounds
    playNavigate() {
        this._playTone(600, 0.03, 'sine', 0.002, 0.01);
    }

    playConfirm() {
        this._playTone(880, 0.1, 'sine', 0.005, 0.05);
    }

    playBack() {
        this._playTone(440, 0.08, 'sine', 0.005, 0.04);
    }
}

// =============================================================================
// STORAGE MANAGER CLASS
// =============================================================================

class StorageManager {
    constructor(prefix = 'snake_') {
        this.prefix = prefix;
    }

    get(key, defaultValue) {
        try {
            const value = localStorage.getItem(this.prefix + key);
            return value !== null ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch {
            // Ignore errors (e.g., private browsing mode)
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch {
            // Ignore errors
        }
    }

    getLeaderboard(difficulty, assisted = false) {
        const board = this.get('leaderboard', []);
        // Filter by assisted flag (legacy entries without field are non-assisted)
        const filtered = board.filter(e => !!(e.assisted) === assisted);
        if (!difficulty) return filtered;
        return filtered.filter(e => e.difficulty === difficulty || !e.difficulty);
    }

    addScore(initials, score, difficulty, assisted = false) {
        const sanitized = String(initials).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'AAA';
        const validScore = typeof score === 'number' && score >= 0 ? Math.floor(score) : 0;
        const entry = {
            initials: sanitized,
            score: validScore,
            difficulty: difficulty || undefined,
            assisted: assisted || undefined,
            timestamp: Date.now()
        };
        // Store all entries together, cap at 10 per difficulty
        const allEntries = this.get('leaderboard', []);
        allEntries.push(entry);
        allEntries.sort((a, b) =>
            b.score - a.score ||
            (DIFFICULTY_RANKS[b.difficulty] || 0) - (DIFFICULTY_RANKS[a.difficulty] || 0) ||
            a.timestamp - b.timestamp
        );
        this.set('leaderboard', allEntries.slice(0, 50));
    }

    isHighScore(score, difficulty, assisted = false) {
        const board = this.getLeaderboard(difficulty, assisted).slice(0, 10);
        return board.length < 10 || score > board[board.length - 1].score;
    }

    isNewTopScore(score, difficulty, assisted = false) {
        const board = this.getLeaderboard(difficulty, assisted);
        return board.length === 0 || score > board[0].score;
    }

    formatLeaderboardDate(timestamp) {
        try {
            return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(timestamp));
        } catch {
            return '';
        }
    }

    getUnlockedThemes() {
        return this.get('unlockedThemes', ['classic']);
    }

    isThemeUnlocked(themeName) {
        return this.getUnlockedThemes().includes(themeName);
    }

    unlockTheme(themeName) {
        const unlocked = this.getUnlockedThemes();
        if (!unlocked.includes(themeName)) {
            unlocked.push(themeName);
            this.set('unlockedThemes', unlocked);
        }
    }

    checkThemeUnlocks(score, difficulty) {
        const newlyUnlocked = [];
        for (const [key, theme] of Object.entries(THEMES)) {
            if (this.isThemeUnlocked(key)) continue;
            const cond = theme.unlockCondition;
            if (cond.type === 'default') {
                this.unlockTheme(key);
                newlyUnlocked.push(key);
            } else if (cond.type === 'score') {
                if (score >= cond.threshold) {
                    this.unlockTheme(key);
                    newlyUnlocked.push(key);
                }
            } else if (cond.type === 'scoreWithDifficulty') {
                if (score >= cond.threshold) {
                    // If difficulty system not present, unlock on score alone
                    if (difficulty === undefined ||
                        (DIFFICULTY_RANKS[difficulty] || 0) >= (DIFFICULTY_RANKS[cond.minDifficulty] || 0)) {
                        this.unlockTheme(key);
                        newlyUnlocked.push(key);
                    }
                }
            }
        }
        return newlyUnlocked;
    }
}

// =============================================================================
// SNAKE CLASS
// =============================================================================

class Snake {
    constructor(startX, startY, initialLength = 3) {
        this.body = [];
        this.direction = Direction.RIGHT;
        this.pendingGrowth = 0;
        this.previousBody = null;

        // Build initial body from head (startX, startY) extending left
        for (let i = 0; i < initialLength; i++) {
            this.body.push({ x: startX - i, y: startY });
        }
    }

    setDirection(newDirection) {
        // Prevent 180-degree turns (would cause immediate self-collision)
        const opposites = {
            [Direction.UP]: Direction.DOWN,
            [Direction.DOWN]: Direction.UP,
            [Direction.LEFT]: Direction.RIGHT,
            [Direction.RIGHT]: Direction.LEFT
        };

        if (opposites[this.direction] !== newDirection) {
            this.direction = newDirection;
        }
    }

    move() {
        this.previousBody = this.body.map(s => ({ x: s.x, y: s.y }));
        const head = this.body[0];
        let newHead;

        switch (this.direction) {
            case Direction.UP:
                newHead = { x: head.x, y: head.y - 1 };
                break;
            case Direction.DOWN:
                newHead = { x: head.x, y: head.y + 1 };
                break;
            case Direction.LEFT:
                newHead = { x: head.x - 1, y: head.y };
                break;
            case Direction.RIGHT:
                newHead = { x: head.x + 1, y: head.y };
                break;
        }

        // Add new head to front of body
        this.body.unshift(newHead);

        // Remove tail unless growing
        if (this.pendingGrowth > 0) {
            this.pendingGrowth--;
        } else {
            this.body.pop();
        }
    }

    grow(amount = 1) {
        this.pendingGrowth += amount;
    }

    removeSegments(count) {
        const maxRemovable = this.body.length - 1;
        const actualRemoved = Math.min(count, maxRemovable);
        if (actualRemoved > 0) {
            this.body.splice(-actualRemoved);
        }
        // Also reduce pending growth
        if (this.pendingGrowth > 0) {
            this.pendingGrowth = Math.max(0, this.pendingGrowth - count);
        }
        return actualRemoved;
    }

    checkSelfCollision() {
        const head = this.body[0];

        // Check head against all body segments (skip index 0)
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    getHead() {
        return this.body[0];
    }

    setHeadPosition(pos) {
        this.body[0] = pos;
    }

    reset(startX, startY, initialLength = 3) {
        this.body = [];
        this.direction = Direction.RIGHT;
        this.pendingGrowth = 0;
        this.previousBody = null;

        for (let i = 0; i < initialLength; i++) {
            this.body.push({ x: startX - i, y: startY });
        }
    }
}

// =============================================================================
// FOOD CLASS
// =============================================================================

class Food {
    constructor(gridWidth, gridHeight, decayTicks = FOOD_DECAY_TICKS) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.decayTicks = decayTicks;
        this.position = null;
        this.points = FOOD_POINTS;
        this.spawnTick = null;
        this.foodType = FoodType.REGULAR;
    }

    spawn(excludePositions, currentTick, foodType = FoodType.REGULAR, decayOverride = null) {
        this.foodType = foodType;
        if (decayOverride !== null) {
            this.decayTicks = decayOverride;
        } else {
            this.decayTicks = FOOD_DECAY_TICKS;
        }
        // Try random positions first
        for (let attempt = 0; attempt < FOOD_MAX_SPAWN_ATTEMPTS; attempt++) {
            const x = Math.floor(Math.random() * this.gridWidth);
            const y = Math.floor(Math.random() * this.gridHeight);

            if (!this._isPositionOccupied(x, y, excludePositions)) {
                this.position = { x, y };
                this.spawnTick = currentTick;
                return true;
            }
        }

        // Fallback: compute all valid cells and pick one
        const validCells = [];
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                if (!this._isPositionOccupied(x, y, excludePositions)) {
                    validCells.push({ x, y });
                }
            }
        }

        if (validCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * validCells.length);
            this.position = validCells[randomIndex];
            this.spawnTick = currentTick;
            return true;
        }

        // No valid position available (grid is full)
        // Clear food state to prevent stale food from being collected
        this.position = null;
        this.spawnTick = null;
        return false;
    }

    spawnNearTarget(targetPos, minDist, maxDist, excludePositions, currentTick, foodType = FoodType.REGULAR, decayOverride = null) {
        this.foodType = foodType;
        this.decayTicks = decayOverride !== null ? decayOverride : FOOD_DECAY_TICKS;

        const validPositions = [];
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                if (this._isPositionOccupied(x, y, excludePositions)) continue;
                const dist = Math.abs(x - targetPos.x) + Math.abs(y - targetPos.y);
                if (dist >= minDist && dist <= maxDist) {
                    validPositions.push({ x, y });
                }
            }
        }

        if (validPositions.length > 0) {
            this.position = validPositions[Math.floor(Math.random() * validPositions.length)];
            this.spawnTick = currentTick;
            return true;
        }

        this.position = null;
        this.spawnTick = null;
        return false;
    }

    _isPositionOccupied(x, y, excludePositions) {
        return excludePositions.some(pos => pos.x === x && pos.y === y);
    }

    checkCollision(headPosition) {
        if (!this.position) {
            return false;
        }
        return this.position.x === headPosition.x && this.position.y === headPosition.y;
    }

    isExpired(currentTick) {
        if (this.spawnTick === null) {
            return false;
        }
        return (currentTick - this.spawnTick) >= this.decayTicks;
    }

    isDecayWarning(currentTick) {
        if (this.spawnTick === null) {
            return false;
        }
        const ticksRemaining = this.decayTicks - (currentTick - this.spawnTick);
        return ticksRemaining <= this.decayTicks * FOOD_DECAY_WARNING_THRESHOLD;
    }

    reset() {
        this.position = null;
        this.spawnTick = null;
        this.foodType = FoodType.REGULAR;
    }
}

// =============================================================================
// RENDERER CLASS
// =============================================================================

class Renderer {
    constructor(canvas, theme = DEFAULT_THEME) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.theme = theme;

        // Set canvas dimensions
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
    }

    setTheme(theme) {
        this.theme = theme;
    }

    clear() {
        this.ctx.fillStyle = this.theme.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = this.theme.colors.grid;
        this.ctx.lineWidth = 1;

        // Draw vertical lines
        for (let x = 0; x <= GRID_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CELL_SIZE, 0);
            this.ctx.lineTo(x * CELL_SIZE, CANVAS_HEIGHT);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CELL_SIZE);
            this.ctx.lineTo(CANVAS_WIDTH, y * CELL_SIZE);
            this.ctx.stroke();
        }
    }

    drawCell(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * CELL_SIZE + 1,
            y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
        );
    }

    drawRoundedRect(x, y, width, height, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    lerpColor(color1, color2, t) {
        // Parse hex colors to RGB
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');

        const r1 = parseInt(hex1.substring(0, 2), 16);
        const g1 = parseInt(hex1.substring(2, 4), 16);
        const b1 = parseInt(hex1.substring(4, 6), 16);

        const r2 = parseInt(hex2.substring(0, 2), 16);
        const g2 = parseInt(hex2.substring(2, 4), 16);
        const b2 = parseInt(hex2.substring(4, 6), 16);

        // Interpolate
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return `rgb(${r}, ${g}, ${b})`;
    }

    _interpSegment(prev, curr, factor) {
        // No previous position (growth frame) — snap to grid
        if (!prev) return { x: curr.x, y: curr.y };
        // Wrap-around detection: delta > 1 cell means it wrapped
        if (Math.abs(prev.x - curr.x) > 1 || Math.abs(prev.y - curr.y) > 1) {
            return { x: curr.x, y: curr.y };
        }
        return {
            x: prev.x + (curr.x - prev.x) * factor,
            y: prev.y + (curr.y - prev.y) * factor
        };
    }

    drawSnake(snake, interpFactor = 0) {
        const colors = this.theme.colors;
        const bodyLength = snake.body.length;
        const prevBody = snake.previousBody;
        const useInterp = interpFactor > 0 && prevBody;

        // Enable glow effect for the entire snake
        this.ctx.shadowColor = colors.snakeGlow || 'rgba(16, 185, 129, 0.4)';
        this.ctx.shadowBlur = 8;

        // Draw body segments (tail to head) with gradient coloring
        for (let i = bodyLength - 1; i > 0; i--) {
            const segment = snake.body[i];
            const pos = useInterp
                ? this._interpSegment(prevBody[i], segment, interpFactor)
                : segment;

            // Calculate gradient: head color (0) -> tail color (1)
            const t = i / (bodyLength - 1);
            const tailColor = colors.snakeTail || colors.snake;
            const segmentColor = this.lerpColor(colors.snakeHead, tailColor, t);

            // Draw rounded segment with slight overlap for connected look
            const padding = 1;
            const radius = 4;
            this.drawRoundedRect(
                pos.x * CELL_SIZE + padding,
                pos.y * CELL_SIZE + padding,
                CELL_SIZE - padding * 2,
                CELL_SIZE - padding * 2,
                radius,
                segmentColor
            );
        }

        // Draw head at grid position (no interpolation — avoids jitter on the focal point)
        const head = snake.body[0];
        const headPos = head;
        const headPadding = 1;
        const headRadius = 6;

        this.drawRoundedRect(
            headPos.x * CELL_SIZE + headPadding,
            headPos.y * CELL_SIZE + headPadding,
            CELL_SIZE - headPadding * 2,
            CELL_SIZE - headPadding * 2,
            headRadius,
            colors.snakeHead
        );

        // Disable shadow for eyes (crisp rendering)
        this.ctx.shadowBlur = 0;

        // Draw eyes based on direction
        this.drawSnakeEyes(headPos, snake.direction, colors.snakeEyes || 'rgba(255, 255, 255, 0.9)');
    }

    drawSnakeEyes(head, direction, eyeColor) {
        const centerX = head.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = head.y * CELL_SIZE + CELL_SIZE / 2;
        const eyeRadius = 2.5;
        const eyeOffset = 4;

        let eye1X, eye1Y, eye2X, eye2Y;

        switch (direction) {
            case Direction.UP:
                eye1X = centerX - eyeOffset;
                eye1Y = centerY - 2;
                eye2X = centerX + eyeOffset;
                eye2Y = centerY - 2;
                break;
            case Direction.DOWN:
                eye1X = centerX - eyeOffset;
                eye1Y = centerY + 2;
                eye2X = centerX + eyeOffset;
                eye2Y = centerY + 2;
                break;
            case Direction.LEFT:
                eye1X = centerX - 2;
                eye1Y = centerY - eyeOffset;
                eye2X = centerX - 2;
                eye2Y = centerY + eyeOffset;
                break;
            case Direction.RIGHT:
                eye1X = centerX + 2;
                eye1Y = centerY - eyeOffset;
                eye2X = centerX + 2;
                eye2Y = centerY + eyeOffset;
                break;
        }

        // Draw eyes
        this.ctx.fillStyle = eyeColor;
        this.ctx.beginPath();
        this.ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawFood(food, isDecayWarning, currentTick, colorblindMode = false, reducedMotion = false) {
        if (!food.position) {
            return;
        }

        // Blink effect: toggle visibility every 5 ticks when decay warning
        // At 10Hz tick rate, this = 1 flash/second (0.5s on, 0.5s off)
        // WCAG 2.3.1 requires < 3 flashes/second - we are compliant
        if (isDecayWarning && Math.floor(currentTick / 5) % 2 === 1) {
            return;
        }

        switch (food.foodType) {
            case FoodType.BONUS:
                this._drawBonusFood(food, currentTick, colorblindMode, reducedMotion);
                break;
            case FoodType.TOXIC:
                this._drawToxicFood(food, currentTick, colorblindMode);
                break;
            case FoodType.LETHAL:
                this._drawLethalFood(food, currentTick, colorblindMode, reducedMotion);
                break;
            default:
                this._drawRegularFood(food, colorblindMode);
                break;
        }
    }

    _drawRegularFood(food, colorblindMode = false) {
        const x = food.position.x * CELL_SIZE;
        const y = food.position.y * CELL_SIZE;
        const size = CELL_SIZE;

        // Draw glow effect
        this.ctx.shadowColor = this.theme.colors.food;
        this.ctx.shadowBlur = 8;

        // Draw apple body
        this.ctx.fillStyle = this.theme.colors.food;
        this.ctx.beginPath();

        const centerX = x + size / 2;
        const topY = y + 4;
        const bottomY = y + size - 2;
        const leftX = x + 2;
        const rightX = x + size - 2;

        this.ctx.moveTo(centerX, topY + 2);
        this.ctx.bezierCurveTo(leftX - 1, topY + 2, leftX, bottomY - 4, centerX, bottomY);
        this.ctx.bezierCurveTo(rightX, bottomY - 4, rightX + 1, topY + 2, centerX, topY + 2);
        this.ctx.closePath();
        this.ctx.fill();

        // Colorblind mode: add white outline
        if (colorblindMode) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        this.ctx.shadowBlur = 0;

        // Draw stem
        this.ctx.strokeStyle = this.theme.colors.foodStem || '#5d4037';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, topY + 2);
        this.ctx.lineTo(centerX + 1, topY - 2);
        this.ctx.stroke();

        // Draw leaf
        this.ctx.fillStyle = this.theme.colors.foodLeaf || '#4caf50';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 4, topY, 3, 1.5, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    _drawBonusFood(food, currentTick, colorblindMode = false, reducedMotion = false) {
        const x = food.position.x * CELL_SIZE;
        const y = food.position.y * CELL_SIZE;
        const size = CELL_SIZE;
        const cx = x + size / 2;
        const cy = y + size / 2;

        // Subtle rotation pulse (disabled in reduced motion)
        const pulse = reducedMotion ? 1.0 : 1 + 0.08 * Math.sin(currentTick * 0.3);

        this.ctx.shadowColor = this.theme.colors.bonusFood;
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = this.theme.colors.bonusFood;

        // 4-pointed star shape
        this.ctx.beginPath();
        const outerR = (size / 2 - 2) * pulse;
        const innerR = outerR * 0.4;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Colorblind mode: add white outline
        if (colorblindMode) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        this.ctx.shadowBlur = 0;
    }

    _drawToxicFood(food, currentTick, colorblindMode = false) {
        const x = food.position.x * CELL_SIZE;
        const y = food.position.y * CELL_SIZE;
        const size = CELL_SIZE;
        const cx = x + size / 2;
        const cy = y + size / 2;

        this.ctx.shadowColor = this.theme.colors.poisonFood;
        this.ctx.shadowBlur = 8;
        this.ctx.fillStyle = this.theme.colors.poisonFood;

        // Diamond/warning shape
        const r = size / 2 - 2;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - r);       // top
        this.ctx.lineTo(cx + r, cy);       // right
        this.ctx.lineTo(cx, cy + r);       // bottom
        this.ctx.lineTo(cx - r, cy);       // left
        this.ctx.closePath();
        this.ctx.fill();

        // Colorblind mode: add white outline
        if (colorblindMode) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        this.ctx.shadowBlur = 0;

        // Exclamation mark
        this.ctx.fillStyle = this.theme.colors.background;
        this.ctx.fillRect(cx - 1.5, cy - 5, 3, 6);
        this.ctx.beginPath();
        this.ctx.arc(cx, cy + 4, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    _drawLethalFood(food, currentTick, colorblindMode = false, reducedMotion = false) {
        const x = food.position.x * CELL_SIZE;
        const y = food.position.y * CELL_SIZE;
        const size = CELL_SIZE;
        const cx = x + size / 2;
        const cy = y + size / 2;

        // Pulsing danger (disabled in reduced motion)
        const pulse = reducedMotion ? 1.0 : 0.85 + 0.15 * Math.sin(currentTick * 0.5);

        this.ctx.shadowColor = this.theme.colors.poisonFood;
        this.ctx.shadowBlur = 12;
        this.ctx.fillStyle = this.theme.colors.poisonFood;

        // Spiky circle (8 points)
        const outerR = (size / 2 - 1) * pulse;
        const innerR = outerR * 0.65;
        this.ctx.beginPath();
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI / 8) * i - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Colorblind mode: add white outline
        if (colorblindMode) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        this.ctx.shadowBlur = 0;

        // Skull: X eyes and line mouth
        this.ctx.strokeStyle = this.theme.colors.background;
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = 'round';

        // Left eye X
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 4, cy - 3);
        this.ctx.lineTo(cx - 1, cy);
        this.ctx.moveTo(cx - 1, cy - 3);
        this.ctx.lineTo(cx - 4, cy);
        this.ctx.stroke();

        // Right eye X
        this.ctx.beginPath();
        this.ctx.moveTo(cx + 1, cy - 3);
        this.ctx.lineTo(cx + 4, cy);
        this.ctx.moveTo(cx + 4, cy - 3);
        this.ctx.lineTo(cx + 1, cy);
        this.ctx.stroke();

        // Mouth
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 3, cy + 3);
        this.ctx.lineTo(cx + 3, cy + 3);
        this.ctx.stroke();
    }

}

// =============================================================================
// INPUT HANDLER CLASS
// =============================================================================

class InputHandler {
    constructor(canvas, getSnakeDirection) {
        this.canvas = canvas;
        this.getSnakeDirection = getSnakeDirection;
        this.directionQueue = [];
        this.maxQueueSize = 2;

        // Action callbacks (spacebar, escape, etc.)
        this.actionCallbacks = {};

        // Optional gate: when set and returns true, all input is suppressed
        this.inputGate = null;

        // Mobile input method: 'swipe' | 'dpad'
        this.mobileInputMethod = 'swipe';

        // Touch tracking
        this.touchStartX = null;
        this.touchStartY = null;
        this.minSwipeDistance = 30;

        // Gamepad state
        this.gamepadIndex = null;
        this.prevButtonStates = [];
        this.uiManager = null;
        this.getGameState = null;

        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this._onGamepadConnected = this._onGamepadConnected.bind(this);
        this._onGamepadDisconnected = this._onGamepadDisconnected.bind(this);

        // Attach listeners
        this.attachListeners();
    }

    attachListeners() {
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', this.handleKeyDown);
        }
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        if (typeof window !== 'undefined') {
            window.addEventListener('gamepadconnected', this._onGamepadConnected);
            window.addEventListener('gamepaddisconnected', this._onGamepadDisconnected);
        }
    }

    detachListeners() {
        if (typeof document !== 'undefined') {
            document.removeEventListener('keydown', this.handleKeyDown);
        }
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        if (typeof window !== 'undefined') {
            window.removeEventListener('gamepadconnected', this._onGamepadConnected);
            window.removeEventListener('gamepaddisconnected', this._onGamepadDisconnected);
        }
    }

    _onGamepadConnected(e) {
        if (e.gamepad.mapping === 'standard') {
            this.gamepadIndex = e.gamepad.index;
            this.prevButtonStates = new Array(e.gamepad.buttons.length).fill(false);
        }
    }

    _onGamepadDisconnected(e) {
        if (e.gamepad.index === this.gamepadIndex) {
            this.gamepadIndex = null;
            this.prevButtonStates = [];
        }
    }

    onAction(actionName, callback) {
        this.actionCallbacks[actionName] = callback;
    }

    handleKeyDown(event) {
        // Action keys always processed (filter event.repeat to prevent held-key spam)
        if (!event.repeat) {
            if (event.key === ' ' && this.actionCallbacks.pause) {
                event.preventDefault();
                this.actionCallbacks.pause();
                return;
            }
            if (event.key === 'Escape' && this.actionCallbacks.escape) {
                event.preventDefault();
                this.actionCallbacks.escape();
                return;
            }
        }

        // Block direction input when gate is active (e.g., modal overlay open)
        if (this.inputGate && this.inputGate()) return;

        const keyMap = {
            'ArrowUp': Direction.UP,
            'ArrowDown': Direction.DOWN,
            'ArrowLeft': Direction.LEFT,
            'ArrowRight': Direction.RIGHT,
            'w': Direction.UP,
            'W': Direction.UP,
            'a': Direction.LEFT,
            'A': Direction.LEFT,
            's': Direction.DOWN,
            'S': Direction.DOWN,
            'd': Direction.RIGHT,
            'D': Direction.RIGHT
        };

        const direction = keyMap[event.key];
        if (direction) {
            event.preventDefault();
            this.queueDirection(direction);
        }
    }

    handleTouchStart(event) {
        if (this.inputGate && this.inputGate()) return;
        event.preventDefault();
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }

    handleTouchEnd(event) {
        event.preventDefault();
        if (this.touchStartX === null || this.touchStartY === null) {
            return;
        }

        // Block all touch input when gate is active (e.g., modal overlay open)
        if (this.inputGate && this.inputGate()) {
            this.touchStartX = null;
            this.touchStartY = null;
            return;
        }

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        // Reset touch tracking
        this.touchStartX = null;
        this.touchStartY = null;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Require minimum distance for swipe
        if (distance < this.minSwipeDistance) {
            return;
        }

        // Determine dominant direction
        let direction;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? Direction.RIGHT : Direction.LEFT;
        } else {
            direction = deltaY > 0 ? Direction.DOWN : Direction.UP;
        }

        this.queueDirection(direction);
    }

    pollGamepad() {
        if (this.gamepadIndex === null) return;
        const gamepads = navigator.getGamepads();
        const gp = gamepads[this.gamepadIndex];
        if (!gp || gp.mapping !== 'standard') return;

        const buttons = gp.buttons;
        const pressed = (i) => i < buttons.length && buttons[i].pressed;
        const justPressed = (i) => {
            const isPressed = pressed(i);
            const wasPressed = this.prevButtonStates[i] || false;
            return isPressed && !wasPressed;
        };

        const gameState = this.getGameState ? this.getGameState() : null;
        const isPlaying = gameState === GameState.PLAYING;

        // Initials entry mode: D-pad cycles letters/slots, Cross submits, Circle cancels
        const dataUi = this.uiManager && this.uiManager.container
            ? this.uiManager.container.getAttribute('data-ui') : null;
        if (dataUi === 'initials' && this.uiManager) {
            if (justPressed(12)) this.uiManager._cycleInitialsChar(1);   // D-pad up: next letter
            if (justPressed(13)) this.uiManager._cycleInitialsChar(-1);  // D-pad down: prev letter
            if (justPressed(14)) this.uiManager._moveInitialsSlot(-1);   // D-pad left: prev slot
            if (justPressed(15)) this.uiManager._moveInitialsSlot(1);    // D-pad right: next slot
            if (justPressed(0)) this.uiManager._submitInitials();        // Cross: submit
            if (justPressed(1)) this.uiManager.hideInitials();           // Circle: cancel

            for (let i = 0; i < buttons.length; i++) {
                this.prevButtonStates[i] = buttons[i].pressed;
            }
            this.prevButtonStates.length = buttons.length;
            return;
        }

        // D-pad directions (buttons 12-15)
        if (isPlaying) {
            // During gameplay: D-pad queues directions (respect inputGate)
            if (!(this.inputGate && this.inputGate())) {
                const dpadMap = { 12: Direction.UP, 13: Direction.DOWN, 14: Direction.LEFT, 15: Direction.RIGHT };
                for (const [btnIdx, dir] of Object.entries(dpadMap)) {
                    if (justPressed(Number(btnIdx))) {
                        this.queueDirection(dir);
                    }
                }
            }
        } else {
            // During menus: D-pad navigates focus
            if (this.uiManager) {
                if (justPressed(12)) this.uiManager.navigateMenu('up');
                if (justPressed(13)) this.uiManager.navigateMenu('down');
            }
        }

        // Cross (button 0): pause during gameplay, confirm in menus
        if (justPressed(0)) {
            if (isPlaying) {
                if (this.actionCallbacks.pause) this.actionCallbacks.pause();
            } else if (this.uiManager) {
                const navBtns = this.uiManager._getNavigableButtons();
                if (navBtns.length > 0 && !navBtns.includes(document.activeElement)) {
                    navBtns[0].focus();
                }
                if (document.activeElement && typeof document.activeElement.click === 'function') {
                    document.activeElement.click();
                }
            }
        }

        // Circle (button 1): back/cancel
        if (justPressed(1)) {
            if (this.uiManager) this.uiManager.navigateBack();
        }

        // Options (button 9): pause toggle
        if (justPressed(9)) {
            if (this.actionCallbacks.pause) this.actionCallbacks.pause();
        }

        // Update previous button states
        for (let i = 0; i < buttons.length; i++) {
            this.prevButtonStates[i] = buttons[i].pressed;
        }
        this.prevButtonStates.length = buttons.length;
    }

    queueDirection(newDirection) {
        // Don't queue if at max capacity
        if (this.directionQueue.length >= this.maxQueueSize) {
            return;
        }

        // Get the reference direction (last queued or current snake direction)
        const referenceDirection = this.directionQueue.length > 0
            ? this.directionQueue[this.directionQueue.length - 1]
            : this.getSnakeDirection();

        // Check for 180° reversal
        const opposites = {
            [Direction.UP]: Direction.DOWN,
            [Direction.DOWN]: Direction.UP,
            [Direction.LEFT]: Direction.RIGHT,
            [Direction.RIGHT]: Direction.LEFT
        };

        if (opposites[referenceDirection] === newDirection) {
            return; // Reject reversal
        }

        // Reject duplicate directions (prevents key repeat from clogging queue)
        if (referenceDirection === newDirection) {
            return;
        }

        this.directionQueue.push(newDirection);
    }

    getNextDirection() {
        return this.directionQueue.shift() || null;
    }

    clearQueue() {
        this.directionQueue = [];
    }
}

// =============================================================================
// PREVIEW MANAGER CLASS
// =============================================================================

class PreviewManager {
    constructor(theme) {
        this.theme = theme;
        this.previews = [];
        this._rafId = null;
        this._lastTime = 0;
    }

    // Register a preview object { canvas, ctx, update(dt), render(interp) }
    addPreview(preview) {
        this.previews.push(preview);
    }

    start() {
        this._lastTime = performance.now();
        const loop = (now) => {
            this._rafId = requestAnimationFrame(loop);
            const dt = now - this._lastTime;
            this._lastTime = now;
            for (const p of this.previews) {
                p.update(dt);
                p.render();
            }
        };
        this._rafId = requestAnimationFrame(loop);
    }

    stop() {
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        for (const p of this.previews) {
            if (p.canvas && p.canvas.parentNode) {
                p.canvas.parentNode.removeChild(p.canvas);
            }
        }
        this.previews = [];
    }
}

// A mini-snake that follows a fixed clockwise rectangular path on a small grid
class PreviewSnake {
    constructor(gridW, gridH, length, tickRate) {
        this.gridW = gridW;
        this.gridH = gridH;
        this.length = length;
        this.tickRate = tickRate; // ticks per second
        this.tickInterval = 1000 / tickRate;
        this.tickAccum = 0;

        // Build the full clockwise rectangular path
        this.path = [];
        // Top edge: left to right
        for (let x = 0; x < gridW; x++) this.path.push({ x, y: 0 });
        // Right edge: top to bottom
        for (let y = 1; y < gridH; y++) this.path.push({ x: gridW - 1, y });
        // Bottom edge: right to left
        for (let x = gridW - 2; x >= 0; x--) this.path.push({ x, y: gridH - 1 });
        // Left edge: bottom to top
        for (let y = gridH - 2; y > 0; y--) this.path.push({ x: 0, y });

        this.pathIndex = 0;
        this.segments = [];
        // Initialize snake segments along the path (backwards from start)
        for (let i = 0; i < length; i++) {
            const idx = (this.path.length - i) % this.path.length;
            this.segments.unshift({ ...this.path[idx] });
        }

        // For interpolation
        this.prevSegments = this.segments.map(s => ({ ...s }));
        this.interpT = 1;
    }

    update(dt) {
        this.tickAccum += dt;
        if (this.tickAccum >= this.tickInterval) {
            this.tickAccum -= this.tickInterval;
            this.prevSegments = this.segments.map(s => ({ ...s }));
            this.interpT = 0;

            // Advance head
            this.pathIndex = (this.pathIndex + 1) % this.path.length;
            const newHead = { ...this.path[this.pathIndex] };
            this.segments.push(newHead);
            this.segments.shift();
        } else {
            this.interpT = Math.min(1, this.tickAccum / this.tickInterval);
        }
    }

    getSegments(interpolate) {
        if (!interpolate || this.interpT >= 1) return this.segments;
        const t = this.interpT;
        return this.segments.map((seg, i) => {
            const prev = this.prevSegments[i] || seg;
            return {
                x: prev.x + (seg.x - prev.x) * t,
                y: prev.y + (seg.y - prev.y) * t
            };
        });
    }

    reset() {
        this.pathIndex = 0;
        this.tickAccum = 0;
        this.interpT = 1;
        this.segments = [];
        for (let i = 0; i < this.length; i++) {
            const idx = (this.path.length - i) % this.path.length;
            this.segments.unshift({ ...this.path[idx] });
        }
        this.prevSegments = this.segments.map(s => ({ ...s }));
    }
}

// Preview factory: Difficulty (single canvas showing key feature of each difficulty)
// Easy: snake wrapping through walls | Medium: snake + toxic food | Hard: snake + toxic + lethal food
function createDifficultyPreview(theme, difficulty) {
    const gridW = 8, gridH = 4, cellSize = 14;
    const canvas = document.createElement('canvas');
    canvas.width = gridW * cellSize;
    canvas.height = gridH * cellSize;
    canvas.className = 'preview-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');

    const snake = new PreviewSnake(gridW, gridH, 4, 5);
    // Static food positions for medium/hard previews
    const toxicPos = { x: 5, y: 1 };
    const lethalPos = { x: 2, y: 2 };

    function drawGrid(colors) {
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        for (let x = 0; x <= gridW; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= gridH; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(canvas.width, y * cellSize);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    function drawSnake(colors, segs) {
        const pad = 1;
        for (let i = 0; i < segs.length; i++) {
            const s = segs[i];
            const isHead = i === segs.length - 1;
            ctx.fillStyle = isHead ? colors.snakeHead : colors.snakeTail;
            ctx.fillRect(
                s.x * cellSize + pad, s.y * cellSize + pad,
                cellSize - pad * 2, cellSize - pad * 2
            );
        }
    }

    // Toxic food: diamond shape with exclamation mark
    function drawToxicFood(colors, pos) {
        const cx = pos.x * cellSize + cellSize / 2;
        const cy = pos.y * cellSize + cellSize / 2;
        const r = cellSize / 2 - 2;
        ctx.fillStyle = colors.poisonFood;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r, cy);
        ctx.closePath();
        ctx.fill();
        // Exclamation mark
        ctx.fillStyle = colors.background;
        ctx.fillRect(cx - 1, cy - 4, 2, 5);
        ctx.beginPath();
        ctx.arc(cx, cy + 3, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Lethal food: spiky circle with skull
    function drawLethalFood(colors, pos) {
        const cx = pos.x * cellSize + cellSize / 2;
        const cy = pos.y * cellSize + cellSize / 2;
        const outerR = cellSize / 2 - 1;
        const innerR = outerR * 0.65;
        ctx.fillStyle = colors.poisonFood;
        ctx.beginPath();
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI / 8) * i - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        // X eyes
        ctx.strokeStyle = colors.background;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy - 2); ctx.lineTo(cx - 1, cy);
        ctx.moveTo(cx - 1, cy - 2); ctx.lineTo(cx - 3, cy);
        ctx.moveTo(cx + 1, cy - 2); ctx.lineTo(cx + 3, cy);
        ctx.moveTo(cx + 3, cy - 2); ctx.lineTo(cx + 1, cy);
        ctx.stroke();
    }

    // Wall wrap indicator: arrows showing pass-through
    function drawWrapIndicators(colors) {
        ctx.strokeStyle = colors.grid;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        // Right edge arrow
        const midY = canvas.height / 2;
        const rX = canvas.width - 3;
        ctx.beginPath();
        ctx.moveTo(rX - 4, midY - 4);
        ctx.lineTo(rX, midY);
        ctx.lineTo(rX - 4, midY + 4);
        ctx.stroke();
        // Left edge arrow
        const lX = 3;
        ctx.beginPath();
        ctx.moveTo(lX + 4, midY - 4);
        ctx.lineTo(lX, midY);
        ctx.lineTo(lX + 4, midY + 4);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    const preview = {
        canvas,
        difficulty,
        setDifficulty(d) {
            this.difficulty = d;
            snake.reset();
        },
        update(dt) {
            snake.update(dt);
        },
        render() {
            const colors = theme.colors;
            drawGrid(colors);
            drawSnake(colors, snake.getSegments(false));

            if (this.difficulty === 'easy') {
                drawWrapIndicators(colors);
            } else if (this.difficulty === 'medium') {
                drawToxicFood(colors, toxicPos);
            } else {
                drawToxicFood(colors, toxicPos);
                drawLethalFood(colors, lethalPos);
            }
        }
    };
    return preview;
}

// Preview factory: Smooth Animation (side-by-side)
function createSmoothAnimationPreview(theme) {
    const gridW = 6, gridH = 3, cellSize = 12;
    const canvasW = gridW * cellSize, canvasH = gridH * cellSize;
    const container = document.createElement('div');
    container.className = 'preview-smooth-container';

    const smoothCanvas = document.createElement('canvas');
    smoothCanvas.width = canvasW;
    smoothCanvas.height = canvasH;
    smoothCanvas.className = 'preview-canvas';
    smoothCanvas.setAttribute('aria-hidden', 'true');

    const classicCanvas = document.createElement('canvas');
    classicCanvas.width = canvasW;
    classicCanvas.height = canvasH;
    classicCanvas.className = 'preview-canvas';
    classicCanvas.setAttribute('aria-hidden', 'true');

    const smoothLabel = document.createElement('span');
    smoothLabel.className = 'preview-label';
    smoothLabel.textContent = 'Smooth';
    const classicLabel = document.createElement('span');
    classicLabel.className = 'preview-label';
    classicLabel.textContent = 'Classic';

    const leftCol = document.createElement('div');
    leftCol.className = 'preview-col';
    leftCol.appendChild(smoothCanvas);
    leftCol.appendChild(smoothLabel);

    const rightCol = document.createElement('div');
    rightCol.className = 'preview-col';
    rightCol.appendChild(classicCanvas);
    rightCol.appendChild(classicLabel);

    container.appendChild(leftCol);
    container.appendChild(rightCol);

    const smoothSnake = new PreviewSnake(gridW, gridH, 3, 5);
    const classicSnake = new PreviewSnake(gridW, gridH, 3, 5);
    const smoothCtx = smoothCanvas.getContext('2d');
    const classicCtx = classicCanvas.getContext('2d');

    function renderSnake(ctx, segs, w, h) {
        const colors = theme.colors;
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        for (let x = 0; x <= gridW; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, h);
            ctx.stroke();
        }
        for (let y = 0; y <= gridH; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(w, y * cellSize);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        const pad = 1;
        for (let i = 0; i < segs.length; i++) {
            const s = segs[i];
            const isHead = i === segs.length - 1;
            ctx.fillStyle = isHead ? colors.snakeHead : colors.snakeTail;
            ctx.fillRect(
                s.x * cellSize + pad,
                s.y * cellSize + pad,
                cellSize - pad * 2,
                cellSize - pad * 2
            );
        }
    }

    const preview = {
        canvas: container, // container used for DOM removal
        update(dt) {
            smoothSnake.update(dt);
            classicSnake.update(dt);
        },
        render() {
            renderSnake(smoothCtx, smoothSnake.getSegments(true), canvasW, canvasH);
            renderSnake(classicCtx, classicSnake.getSegments(false), canvasW, canvasH);
        }
    };
    return preview;
}

// Preview factory: Theme swatch (mini snake on theme background)
function createSwatchPreview(themeObj) {
    const gridW = 5, gridH = 3, cellSize = 8;
    const canvas = document.createElement('canvas');
    canvas.width = gridW * cellSize;
    canvas.height = gridH * cellSize;
    canvas.className = 'preview-canvas preview-swatch-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');

    const snake = new PreviewSnake(gridW, gridH, 3, 4);

    const preview = {
        canvas,
        update(dt) {
            snake.update(dt);
        },
        render() {
            const colors = themeObj.colors;
            ctx.fillStyle = colors.background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = colors.grid;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 0.25;
            for (let x = 0; x <= gridW; x++) {
                ctx.beginPath();
                ctx.moveTo(x * cellSize, 0);
                ctx.lineTo(x * cellSize, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= gridH; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y * cellSize);
                ctx.lineTo(canvas.width, y * cellSize);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            const segs = snake.getSegments(false);
            const pad = 1;
            for (let i = 0; i < segs.length; i++) {
                const s = segs[i];
                const isHead = i === segs.length - 1;
                ctx.fillStyle = isHead ? colors.snakeHead : colors.snakeTail;
                ctx.fillRect(
                    s.x * cellSize + pad,
                    s.y * cellSize + pad,
                    cellSize - pad * 2,
                    cellSize - pad * 2
                );
            }
        }
    };
    return preview;
}

// =============================================================================
// UI MANAGER CLASS
// =============================================================================

class UIManager {
    constructor(container, overlay, game) {
        this.container = container;
        this.overlay = overlay;
        this.game = game;

        // DOM cache
        this.finalScoreEl = document.getElementById('final-score');
        this.gameoverHeading = document.getElementById('gameover-heading');
        this.bestScoreEl = document.getElementById('best-score');
        this.leaderboardStatusEl = document.getElementById('leaderboard-status');
        this.initialsScoreEl = document.getElementById('initials-score');
        this.initialsSlots = container.querySelectorAll('.initials-slot');
        this.initialsMobileInput = document.getElementById('initials-mobile-input');
        this.leaderboardBody = document.getElementById('leaderboard-body');
        this.animationToggle = document.getElementById('animation-style-toggle');
        this.difficultySelector = document.getElementById('difficulty-selector');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeValue = document.getElementById('volume-value');
        this.muteToggle = document.getElementById('mute-toggle');
        this.reduceMotionToggle = document.getElementById('reduce-motion-toggle');
        this.colorblindModeToggle = document.getElementById('colorblind-mode-toggle');
        this.accessibilityModeToggle = document.getElementById('accessibility-mode-toggle');
        this.animationHint = document.getElementById('animation-hint');
        this._previewManager = null;
        this._difficultyPreview = null;
        this._smoothPreview = null;

        // Initials entry state
        this._initialsChars = [0, 0, 0]; // A=0, B=1, ... Z=25
        this._initialsIndex = 0;
        this._initialsScore = 0;
        this._initialsStorage = null;
        this._initialsKeyHandler = null;

        // Sync toggles with stored values on init
        this.animationToggle.setAttribute('aria-checked',
            String(this.game.animationStyle === 'smooth'));
        if (this.game.reducedMotion) {
            this.animationToggle.setAttribute('aria-disabled', 'true');
            if (this.animationHint) this.animationHint.hidden = false;
        }
        if (this.reduceMotionToggle) {
            this.reduceMotionToggle.setAttribute('aria-checked',
                String(this.game.reducedMotion || false));
        }
        if (this.colorblindModeToggle) {
            this.colorblindModeToggle.setAttribute('aria-checked',
                String(this.game.colorblindMode || false));
        }
        if (this.accessibilityModeToggle) {
            this.accessibilityModeToggle.setAttribute('aria-checked',
                String(this.game.accessibilityMode || false));
        }
        this.syncDifficultySelector();
        this.syncAudioControls();

        // Event delegation on overlay
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.overlay.addEventListener('click', this.handleOverlayClick);

        // Volume slider event
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value, 10) / 100;
                this.game.setVolume(value);
                this.volumeValue.textContent = `${e.target.value}%`;
            });
        }

        // Attach hover/focus sounds to buttons
        this._attachButtonSounds();

        // Focus management state
        this._previouslyFocusedElement = null;
        this._focusTrapHandler = null;
        this._currentFocusTrapContainer = null;

        // Persistent menu keydown handler for arrow navigation + backspace
        this._handleMenuKeyDown = this._handleMenuKeyDown.bind(this);
        document.addEventListener('keydown', this._handleMenuKeyDown);
    }

    _getVisibleScreen() {
        // Modals (data-ui) take priority over state screens
        const dataUi = this.container.getAttribute('data-ui');
        if (dataUi) {
            return this.container.querySelector(`.screen-${dataUi}`);
        }
        const dataState = this.container.getAttribute('data-state');
        if (dataState) {
            const stateMap = {
                'MENU': '.screen-menu',
                'PAUSED': '.screen-pause',
                'GAMEOVER': '.screen-gameover'
            };
            return this.container.querySelector(stateMap[dataState]) || null;
        }
        return null;
    }

    _getNavigableButtons() {
        const screen = this._getVisibleScreen();
        if (!screen) return [];
        const group = screen.querySelector('.ui-btn-group');
        if (group) {
            return Array.from(group.querySelectorAll('.ui-btn'))
                .filter(btn => btn.offsetParent !== null && !btn.disabled);
        }
        // Screens without a btn-group (e.g. settings): navigate all focusable elements
        return this._getFocusableElements(screen);
    }

    navigateMenu(direction) {
        const buttons = this._getNavigableButtons();
        if (buttons.length === 0) return;
        const currentIndex = buttons.indexOf(document.activeElement);
        let nextIndex;
        if (direction === 'down') {
            nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % buttons.length;
        } else {
            nextIndex = currentIndex < 0 ? buttons.length - 1 : (currentIndex - 1 + buttons.length) % buttons.length;
        }
        buttons[nextIndex].focus();
        this.game.audio.init();
        this.game.audio.playNavigate();
    }

    navigateBack() {
        const dataUi = this.container.getAttribute('data-ui');
        if (dataUi === 'shortcuts') {
            this.hideShortcuts();
            return;
        }
        if (dataUi === 'leaderboard') {
            this.game.audio.playBack();
            this.hideLeaderboard();
            return;
        }
        if (dataUi === 'settings') {
            this.game.audio.playBack();
            this.hideSettings();
            return;
        }

        // No modal open — act on game state
        const state = this.game.state;
        if (state === GameState.PAUSED) {
            this.game.audio.playConfirm();
            this.game.setState(GameState.PLAYING);
            return;
        }
        if (state === GameState.GAMEOVER) {
            this.game.audio.playBack();
            this.game.reset();
            this.game.setState(GameState.MENU);
            return;
        }
        // MENU / PLAYING: no-op
    }

    _handleMenuKeyDown(e) {
        const dataUi = this.container.getAttribute('data-ui');

        // ArrowUp / ArrowDown: cycle focus between buttons
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            // Skip when initials modal is open (has its own arrow handler)
            if (dataUi === 'initials') return;
            e.preventDefault();
            this.navigateMenu(e.key === 'ArrowDown' ? 'down' : 'up');
            return;
        }

        // Backspace / Delete: navigate back
        if (e.key === 'Backspace' || e.key === 'Delete') {
            // Skip when initials modal is open or active element is an input
            if (dataUi === 'initials') return;
            const tag = document.activeElement ? document.activeElement.tagName : '';
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            e.preventDefault();
            this.navigateBack();
        }
    }

    _attachButtonSounds() {
        const buttons = this.overlay.querySelectorAll('.ui-btn, .ui-toggle, .ui-segmented__option, .theme-swatch, .ui-panel__close');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.game.audio.init();
                this.game.audio.playNavigate();
            });
            btn.addEventListener('focus', () => {
                this.game.audio.init();
                this.game.audio.playNavigate();
            });
        });
    }

    syncAudioControls() {
        if (this.volumeSlider) {
            const volumePercent = Math.round(this.game.audio.volume * 100);
            this.volumeSlider.value = volumePercent;
            this.volumeValue.textContent = `${volumePercent}%`;
        }
        if (this.muteToggle) {
            this.muteToggle.setAttribute('aria-checked', String(this.game.audio.muted));
        }
    }

    // Focus trap: returns all focusable elements within a container
    _getFocusableElements(container) {
        const selector = 'button:not([disabled]):not([hidden]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(container.querySelectorAll(selector))
            .filter(el => el.offsetParent !== null); // visible only
    }

    // Sets up focus trapping for a modal container
    _trapFocus(containerSelector) {
        // Release any existing focus trap to prevent stale handlers
        if (this._focusTrapHandler) {
            document.removeEventListener('keydown', this._focusTrapHandler);
            this._focusTrapHandler = null;
        }

        // Store previously focused element
        this._previouslyFocusedElement = document.activeElement;

        // Find the container
        const container = this.container.querySelector(containerSelector);
        if (!container) return;

        this._currentFocusTrapContainer = container;

        // Focus the first focusable element (or close button)
        requestAnimationFrame(() => {
            const focusable = this._getFocusableElements(container);
            if (focusable.length > 0) {
                // Prefer close button if present, otherwise first element
                const closeBtn = container.querySelector('.ui-panel__close');
                const firstFocusable = closeBtn || focusable[0];
                firstFocusable.focus();
            }
        });

        // Set up Tab key trap
        this._focusTrapHandler = (e) => {
            if (e.key !== 'Tab') return;

            const focusable = this._getFocusableElements(container);
            if (focusable.length === 0) return;

            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];

            if (e.shiftKey) {
                // Shift+Tab: if on first element, go to last
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab: if on last element, go to first
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        document.addEventListener('keydown', this._focusTrapHandler);
    }

    // Releases focus trap and restores focus to previous element
    _releaseFocus() {
        if (this._focusTrapHandler) {
            document.removeEventListener('keydown', this._focusTrapHandler);
            this._focusTrapHandler = null;
        }
        this._currentFocusTrapContainer = null;

        // Restore focus to previously focused element
        if (this._previouslyFocusedElement && this._previouslyFocusedElement.focus) {
            this._previouslyFocusedElement.focus();
        }
        this._previouslyFocusedElement = null;
    }

    updateState(newState) {
        this.container.setAttribute('data-state', newState);
        // Settings modal has its own lifecycle (showSettings/hideSettings)
        // — don't touch data-ui here

        // Auto-focus first button when transitioning to a menu screen
        if (newState === GameState.MENU || newState === GameState.PAUSED || newState === GameState.GAMEOVER) {
            requestAnimationFrame(() => {
                // Skip if a modal (data-ui) is active (e.g., initials entry after gameover)
                if (this.container.hasAttribute('data-ui')) return;
                const buttons = this._getNavigableButtons();
                if (buttons.length > 0) {
                    buttons[0].focus();
                }
            });
        }
    }

    showSettings() {
        // Sync toggles with current values
        this.animationToggle.setAttribute('aria-checked',
            String(this.game.animationStyle === 'smooth'));
        if (this.game.reducedMotion) {
            this.animationToggle.setAttribute('aria-disabled', 'true');
        } else {
            this.animationToggle.removeAttribute('aria-disabled');
        }
        if (this.animationHint) {
            this.animationHint.hidden = !this.game.reducedMotion;
        }
        if (this.reduceMotionToggle) {
            this.reduceMotionToggle.setAttribute('aria-checked',
                String(this.game.reducedMotion || false));
        }
        if (this.colorblindModeToggle) {
            this.colorblindModeToggle.setAttribute('aria-checked',
                String(this.game.colorblindMode || false));
        }
        if (this.accessibilityModeToggle) {
            this.accessibilityModeToggle.setAttribute('aria-checked',
                String(this.game.accessibilityMode || false));
        }
        this.syncDifficultySelector();
        this.syncAudioControls();

        // Start preview animations before renderThemePicker so swatches can register
        this._startPreviews();
        this.renderThemePicker();
        this.container.setAttribute('data-ui', 'settings');

        // Scroll settings screen to top after layout renders
        requestAnimationFrame(() => {
            const settingsScreen = this.container.querySelector('.screen-settings');
            if (settingsScreen) {
                settingsScreen.scrollTop = 0;
                const panel = settingsScreen.querySelector('.ui-panel');
                if (panel) panel.scrollTop = 0;
            }
        });

        // Set up focus trap for settings modal
        this._trapFocus('.screen-settings');
    }

    _startPreviews() {
        this._stopPreviews();
        const theme = THEMES[this.game.currentTheme] || THEMES.classic;
        this._previewManager = new PreviewManager(theme);

        // Difficulty preview
        this._difficultyPreview = createDifficultyPreview(theme, this.game.difficulty);
        const diffGroup = this.difficultySelector?.closest('.ui-setting-group');
        if (diffGroup) {
            diffGroup.appendChild(this._difficultyPreview.canvas);
        }
        this._previewManager.addPreview(this._difficultyPreview);

        // Smooth Animation preview (hidden if reduce motion is on)
        this._smoothPreview = createSmoothAnimationPreview(theme);
        const animRow = this.animationToggle?.closest('.ui-setting-row');
        const hint = this.animationHint;
        const insertAfter = hint || animRow;
        if (insertAfter && insertAfter.parentNode) {
            insertAfter.parentNode.insertBefore(
                this._smoothPreview.canvas, insertAfter.nextSibling
            );
        }
        if (this.game.reducedMotion) {
            this._smoothPreview.canvas.hidden = true;
        }
        this._previewManager.addPreview(this._smoothPreview);

        this._previewManager.start();
    }

    _stopPreviews() {
        if (this._previewManager) {
            this._previewManager.stop();
            this._previewManager = null;
        }
        this._difficultyPreview = null;
        this._smoothPreview = null;
    }

    renderThemePicker() {
        const grid = document.getElementById('theme-picker-grid');
        if (!grid) return;

        // Remove old swatch previews from manager
        if (this._previewManager) {
            this._previewManager.previews = this._previewManager.previews.filter(
                p => !p._isSwatch
            );
        }
        grid.replaceChildren();

        const unlocked = this.game.storage.getUnlockedThemes();
        const currentTheme = this.game.currentTheme;

        for (const [key, theme] of Object.entries(THEMES)) {
            const isUnlocked = unlocked.includes(key);
            const isActive = key === currentTheme;

            const swatch = document.createElement('button');
            swatch.className = 'theme-swatch' +
                (isActive ? ' theme-swatch--active' : '') +
                (!isUnlocked ? ' theme-swatch--locked' : '');
            swatch.setAttribute('aria-label', theme.name + (isUnlocked ? '' : ' (locked)'));
            swatch.dataset.theme = key;

            // Animated swatch preview canvas
            const swatchPreview = createSwatchPreview(theme);
            swatchPreview._isSwatch = true;
            const previewContainer = document.createElement('div');
            previewContainer.className = 'theme-swatch__preview';
            previewContainer.appendChild(swatchPreview.canvas);
            if (this._previewManager) {
                this._previewManager.addPreview(swatchPreview);
            }

            const name = document.createElement('span');
            name.className = 'theme-swatch__name';
            name.textContent = theme.name;

            swatch.appendChild(previewContainer);
            swatch.appendChild(name);

            if (!isUnlocked) {
                const lock = document.createElement('span');
                lock.className = 'theme-swatch__lock';
                const cond = theme.unlockCondition;
                if (cond.type === 'score') {
                    lock.textContent = `Score ${cond.threshold}`;
                } else if (cond.type === 'scoreWithDifficulty') {
                    lock.textContent = `Score ${cond.threshold} (${cond.minDifficulty}+)`;
                }
                swatch.appendChild(lock);
            }

            if (isActive) {
                const check = document.createElement('span');
                check.className = 'theme-swatch__check';
                check.textContent = '\u2713';
                swatch.appendChild(check);
            }

            swatch.addEventListener('click', () => {
                if (!isUnlocked) return;
                this.game.applyTheme(key);
                this.game.audio.playConfirm();
                this._startPreviews();
                this.renderThemePicker();
            });

            grid.appendChild(swatch);
        }
    }

    syncDifficultySelector() {
        if (!this.difficultySelector) return;
        const midGame = this.game.state === GameState.PLAYING || this.game.state === GameState.PAUSED;
        const options = this.difficultySelector.querySelectorAll('.ui-segmented__option');
        options.forEach(opt => {
            opt.setAttribute('aria-checked',
                String(opt.dataset.difficulty === this.game.difficulty));
            opt.classList.toggle('ui-segmented__option--disabled', midGame);
            opt.setAttribute('aria-disabled', String(midGame));
        });
    }

    showThemeUnlockNotification(themeNames) {
        const names = themeNames.map(k => THEMES[k]?.name || k).join(', ');
        this._pendingThemeUnlock = names;
    }

    hideSettings() {
        this._stopPreviews();
        this._releaseFocus();
        this.container.removeAttribute('data-ui');
    }

    showShortcuts() {
        this._shortcutsPrevUi = this.container.getAttribute('data-ui');
        this.container.setAttribute('data-ui', 'shortcuts');
        this._trapFocus('.screen-shortcuts');
    }

    hideShortcuts() {
        this._releaseFocus();
        if (this._shortcutsPrevUi) {
            this.container.setAttribute('data-ui', this._shortcutsPrevUi);
        } else {
            this.container.removeAttribute('data-ui');
        }
        this._shortcutsPrevUi = null;
    }

    updateScore(score) {
        this.finalScoreEl.textContent = score;

        // Update best score label (filtered by current difficulty)
        const board = this.game.storage.getLeaderboard(this.game.difficulty);
        if (board.length > 0) {
            this.bestScoreEl.textContent = `Best: ${board[0].score}`;
        } else {
            this.bestScoreEl.textContent = '';
        }

        // Reset celebration and status (applied after initials submit)
        this.gameoverHeading.textContent = 'Game Over';
        this.gameoverHeading.classList.remove('new-high-score');
        this.leaderboardStatusEl.textContent = '';

        // Show theme unlock notification if pending
        const themeUnlockEl = document.getElementById('theme-unlock-status');
        if (themeUnlockEl) {
            if (this._pendingThemeUnlock) {
                themeUnlockEl.textContent = `Theme unlocked: ${this._pendingThemeUnlock}!`;
                this._pendingThemeUnlock = null;
            } else {
                themeUnlockEl.textContent = '';
            }
        }
    }

    showInitials(score, storage) {
        // Store previously focused element for restoration
        this._initialsPrevFocus = document.activeElement;

        this._initialsScore = score;
        this._initialsStorage = storage;
        this._initialsChars = [0, 0, 0];
        this._initialsIndex = 0;

        this.initialsScoreEl.textContent = score;
        this._renderInitialsSlots();

        this.container.setAttribute('data-ui', 'initials');

        // Focus first slot for accessibility
        requestAnimationFrame(() => {
            const firstSlot = this.initialsSlots[0];
            if (firstSlot) firstSlot.focus();
        });

        this._initialsKeyHandler = (e) => this._handleInitialsKey(e);
        document.addEventListener('keydown', this._initialsKeyHandler);

        // Mobile keyboard support: focus hidden input on slot tap
        if (this.initialsMobileInput) {
            this._initialsMobileInputHandler = (e) => {
                const val = e.target.value;
                if (val && /^[a-zA-Z]$/.test(val)) {
                    this._initialsChars[this._initialsIndex] = val.toUpperCase().charCodeAt(0) - 65;
                    if (this._initialsIndex < 2) {
                        this._initialsIndex++;
                    }
                    this._renderInitialsSlots();
                }
                e.target.value = '';
            };
            this._initialsMobileKeydownHandler = (e) => {
                if (e.key === 'Backspace') {
                    e.preventDefault();
                    this._initialsChars[this._initialsIndex] = 0;
                    if (this._initialsIndex > 0) {
                        this._initialsIndex--;
                    }
                    this._renderInitialsSlots();
                }
            };
            this.initialsMobileInput.addEventListener('keydown', this._initialsMobileKeydownHandler);
            this._initialsSlotTapHandler = (e) => {
                const slot = e.currentTarget;
                const index = Array.from(this.initialsSlots).indexOf(slot);
                if (index !== -1) {
                    this._initialsIndex = index;
                    this._renderInitialsSlots();
                }
                this.initialsMobileInput.focus();
            };
            this.initialsMobileInput.addEventListener('input', this._initialsMobileInputHandler);
            this.initialsSlots.forEach(slot => {
                slot.addEventListener('click', this._initialsSlotTapHandler);
            });
            this.initialsMobileInput.value = '';
        }
    }

    hideInitials() {
        this.container.removeAttribute('data-ui');
        if (this._initialsKeyHandler) {
            document.removeEventListener('keydown', this._initialsKeyHandler);
            this._initialsKeyHandler = null;
        }
        if (this.initialsMobileInput && this._initialsMobileInputHandler) {
            this.initialsMobileInput.removeEventListener('input', this._initialsMobileInputHandler);
            this._initialsMobileInputHandler = null;
            if (this._initialsMobileKeydownHandler) {
                this.initialsMobileInput.removeEventListener('keydown', this._initialsMobileKeydownHandler);
                this._initialsMobileKeydownHandler = null;
            }
            this.initialsMobileInput.blur();
        }
        if (this._initialsSlotTapHandler) {
            this.initialsSlots.forEach(slot => {
                slot.removeEventListener('click', this._initialsSlotTapHandler);
            });
            this._initialsSlotTapHandler = null;
        }

        // Focus first navigable button on the gameover screen
        this._initialsPrevFocus = null;
        requestAnimationFrame(() => {
            const buttons = this._getNavigableButtons();
            if (buttons.length > 0) {
                buttons[0].focus();
            }
        });
    }

    _renderInitialsSlots() {
        this.initialsSlots.forEach((slot, i) => {
            slot.textContent = String.fromCharCode(65 + this._initialsChars[i]);
            slot.classList.toggle('initials-slot--active', i === this._initialsIndex);
        });
    }

    _cycleInitialsChar(delta) {
        this._initialsChars[this._initialsIndex] = (this._initialsChars[this._initialsIndex] + (delta > 0 ? 1 : 25)) % 26;
        this._renderInitialsSlots();
    }

    _moveInitialsSlot(delta) {
        this._initialsIndex = Math.max(0, Math.min(2, this._initialsIndex + delta));
        this._renderInitialsSlots();
    }

    _handleInitialsKey(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const key = e.key;

        if (key === 'ArrowUp') {
            this._cycleInitialsChar(1);
        } else if (key === 'ArrowDown') {
            this._cycleInitialsChar(-1);
        } else if (key === 'ArrowRight') {
            this._moveInitialsSlot(1);
        } else if (key === 'ArrowLeft') {
            this._moveInitialsSlot(-1);
        } else if (key === 'Enter') {
            this._submitInitials();
        } else if (key === 'Escape') {
            this.hideInitials();
        } else if (key === 'Backspace') {
            this._initialsChars[this._initialsIndex] = 0;
            if (this._initialsIndex > 0) {
                this._initialsIndex--;
            }
            this._renderInitialsSlots();
        } else if (/^[a-zA-Z]$/.test(key)) {
            this._initialsChars[this._initialsIndex] = key.toUpperCase().charCodeAt(0) - 65;
            if (this._initialsIndex < 2) {
                this._initialsIndex++;
            }
            this._renderInitialsSlots();
        }
    }

    _submitInitials() {
        const initials = this._initialsChars.map(c => String.fromCharCode(65 + c)).join('');
        const difficulty = this.game.difficulty;
        const assisted = this.game.accessibilityMode || false;
        const wasTopScore = this._initialsStorage.isNewTopScore(this._initialsScore, difficulty, assisted);
        this._initialsStorage.addScore(initials, this._initialsScore, difficulty, assisted);
        this.hideInitials();
        // Refresh game-over screen with updated best score
        this.updateScore(this._initialsScore);

        // Apply celebration/status now that game over screen is visible
        if (wasTopScore) {
            this.gameoverHeading.textContent = 'New High Score!';
            // Force animation restart by triggering reflow
            this.gameoverHeading.classList.remove('new-high-score');
            void this.gameoverHeading.offsetWidth;
            this.gameoverHeading.classList.add('new-high-score');
        }
        this.leaderboardStatusEl.textContent = 'You made the leaderboard!';
    }

    _renderLeaderboardRows(board, container) {
        board.forEach((entry, i) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';

            const rankSpan = document.createElement('span');
            rankSpan.className = 'leaderboard-rank';
            rankSpan.textContent = i + 1;
            const initialsSpan = document.createElement('span');
            initialsSpan.className = 'leaderboard-initials';
            initialsSpan.textContent = entry.initials;
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'leaderboard-score';
            scoreSpan.textContent = entry.score;
            const dateSpan = document.createElement('span');
            dateSpan.className = 'leaderboard-date';
            dateSpan.textContent = this.game.storage.formatLeaderboardDate(entry.timestamp);

            row.appendChild(rankSpan);
            row.appendChild(initialsSpan);
            row.appendChild(scoreSpan);
            row.appendChild(dateSpan);
            container.appendChild(row);
        });
    }

    showLeaderboard() {
        const midGame = this.game.state === GameState.PLAYING || this.game.state === GameState.PAUSED;
        this.leaderboardBody.replaceChildren();

        // Update heading
        const heading = this.leaderboardBody.closest('.ui-panel')?.querySelector('.ui-heading');
        const assisted = this.game.accessibilityMode || false;

        if (midGame) {
            // Filtered view: single list for current difficulty
            const diffName = (DIFFICULTY_LEVELS[this.game.difficulty] || {}).name || this.game.difficulty;
            const suffix = assisted ? ' (Extended Time)' : '';
            if (heading) heading.textContent = `High Scores \u2014 ${diffName}${suffix}`;

            const board = this.game.storage.getLeaderboard(this.game.difficulty, assisted).slice(0, 10);
            if (board.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'leaderboard-empty';
                empty.textContent = 'No scores yet for this difficulty. Play to set the first record!';
                this.leaderboardBody.appendChild(empty);
            } else {
                this._renderLeaderboardRows(board, this.leaderboardBody);
            }
        } else {
            // Grouped view: sections for Hard, Medium, Easy, then Unranked
            if (heading) heading.textContent = 'High Scores';

            const standardEntries = this.game.storage.getLeaderboard(null, false);
            const groups = [
                { key: 'hard', name: 'Hard' },
                { key: 'medium', name: 'Medium' },
                { key: 'easy', name: 'Easy' }
            ];

            let hasAny = false;
            for (const group of groups) {
                const entries = standardEntries
                    .filter(e => e.difficulty === group.key)
                    .slice(0, 10);
                if (entries.length === 0) continue;
                hasAny = true;

                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'leaderboard-section-header';
                sectionHeader.textContent = group.name;
                this.leaderboardBody.appendChild(sectionHeader);

                this._renderLeaderboardRows(entries, this.leaderboardBody);
            }

            // Legacy entries (no difficulty)
            const legacy = standardEntries.filter(e => !e.difficulty).slice(0, 10);
            if (legacy.length > 0) {
                hasAny = true;
                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'leaderboard-section-header';
                sectionHeader.textContent = 'Unranked';
                this.leaderboardBody.appendChild(sectionHeader);

                this._renderLeaderboardRows(legacy, this.leaderboardBody);
            }

            // Extended Time Mode sections (separate from standard)
            const assistedEntries = this.game.storage.getLeaderboard(null, true);
            for (const group of groups) {
                const entries = assistedEntries
                    .filter(e => e.difficulty === group.key)
                    .slice(0, 10);
                if (entries.length === 0) continue;
                hasAny = true;

                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'leaderboard-section-header';
                sectionHeader.textContent = `${group.name} (Extended Time)`;
                this.leaderboardBody.appendChild(sectionHeader);

                this._renderLeaderboardRows(entries, this.leaderboardBody);
            }

            if (!hasAny) {
                const empty = document.createElement('p');
                empty.className = 'leaderboard-empty';
                empty.textContent = 'No scores yet. Play to set the first record!';
                this.leaderboardBody.appendChild(empty);
            }
        }

        this._leaderboardPrevUi = this.container.getAttribute('data-ui');
        this.container.setAttribute('data-ui', 'leaderboard');

        // Set up focus trap for leaderboard modal
        this._trapFocus('.screen-leaderboard');
    }

    hideLeaderboard() {
        this._releaseFocus();
        if (this._leaderboardPrevUi) {
            this.container.setAttribute('data-ui', this._leaderboardPrevUi);
        } else {
            this.container.removeAttribute('data-ui');
        }
        this._leaderboardPrevUi = null;
    }

    handleOverlayClick(event) {
        // Initialize audio on any user interaction
        this.game.audio.init();

        // Check for difficulty selector click (no data-action)
        const diffOption = event.target.closest('.ui-segmented__option[data-difficulty]');
        if (diffOption && diffOption.dataset.difficulty) {
            // Block difficulty changes mid-game
            if (this.game.state === GameState.PLAYING || this.game.state === GameState.PAUSED) return;
            this.game.setDifficulty(diffOption.dataset.difficulty);
            this.syncDifficultySelector();
            this.game.audio.playConfirm();
            // Update difficulty preview
            if (this._difficultyPreview) {
                this._difficultyPreview.setDifficulty(diffOption.dataset.difficulty);
            }
            return;
        }

        const action = event.target.closest('[data-action]');
        if (!action) return;

        switch (action.dataset.action) {
            case 'play':
                this.game.audio.playConfirm();
                this.game.reset();
                this.game.setState(GameState.PLAYING);
                break;
            case 'settings':
                this.game.audio.playConfirm();
                this.showSettings();
                break;
            case 'highscores':
                this.game.audio.playConfirm();
                this.showLeaderboard();
                break;
            case 'resume':
                this.game.audio.playConfirm();
                this.game.setState(GameState.PLAYING);
                break;
            case 'quit':
                this.game.audio.playBack();
                this.game.reset();
                this.game.setState(GameState.MENU);
                break;
            case 'restart':
                this.game.audio.playConfirm();
                this.game.reset();
                this.game.setState(GameState.PLAYING);
                break;
            case 'menu':
                this.game.audio.playBack();
                this.game.reset();
                this.game.setState(GameState.MENU);
                break;
            case 'toggle-animation-style': {
                if (this.game.reducedMotion) break;
                const newStyle = this.game.animationStyle === 'smooth' ? 'classic' : 'smooth';
                this.game.setAnimationStyle(newStyle);
                this.animationToggle.setAttribute('aria-checked', String(newStyle === 'smooth'));
                this.game.audio.playConfirm();
                break;
            }
            case 'toggle-mute': {
                const newMuted = !this.game.audio.muted;
                this.game.setMuted(newMuted);
                this.muteToggle.setAttribute('aria-checked', String(newMuted));
                if (!newMuted) this.game.audio.playConfirm();
                break;
            }
            case 'toggle-reduce-motion': {
                const newReducedMotion = !this.game.reducedMotion;
                this.game.setReducedMotion(newReducedMotion);
                this.reduceMotionToggle.setAttribute('aria-checked', String(newReducedMotion));
                if (newReducedMotion) {
                    this.animationToggle.setAttribute('aria-checked', 'false');
                    this.animationToggle.setAttribute('aria-disabled', 'true');
                } else {
                    this.animationToggle.removeAttribute('aria-disabled');
                }
                if (this.animationHint) {
                    this.animationHint.hidden = !newReducedMotion;
                }
                // Show/hide Smooth Animation preview
                if (this._smoothPreview) {
                    this._smoothPreview.canvas.hidden = newReducedMotion;
                }
                break;
            }
            case 'toggle-colorblind-mode': {
                const newColorblindMode = !this.game.colorblindMode;
                this.game.setColorblindMode(newColorblindMode);
                this.colorblindModeToggle.setAttribute('aria-checked', String(newColorblindMode));
                break;
            }
            case 'toggle-accessibility-mode': {
                const newAccessibilityMode = !this.game.accessibilityMode;
                this.game.setAccessibilityMode(newAccessibilityMode);
                this.accessibilityModeToggle.setAttribute('aria-checked', String(newAccessibilityMode));
                break;
            }
            case 'settings-back':
                this.game.audio.playBack();
                this.hideSettings();
                break;
            case 'shortcuts-back':
                this.hideShortcuts();
                break;
            case 'submit-initials':
                this.game.audio.playConfirm();
                this._submitInitials();
                break;
            case 'skip-initials':
                this.game.audio.playBack();
                this.hideInitials();
                break;
            case 'leaderboard-back':
                this.game.audio.playBack();
                this.hideLeaderboard();
                break;
        }
    }

    destroy() {
        this.overlay.removeEventListener('click', this.handleOverlayClick);
        document.removeEventListener('keydown', this._handleMenuKeyDown);
    }
}

// =============================================================================
// GAME CLASS
// =============================================================================

class Game {
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.config = {
            gridWidth: GRID_WIDTH,
            gridHeight: GRID_HEIGHT,
            cellSize: CELL_SIZE,
            tickRate: TICK_RATE,
            ...config
        };

        this.renderer = new Renderer(canvas);
        this.state = GameState.MENU;
        this.animationFrameId = null;
        this.lastTime = 0;
        this.tickAccumulator = 0;
        this.tickInterval = 1000 / this.config.tickRate;

        // Initialize storage manager
        this.storage = new StorageManager();

        // Initialize snake at center of grid
        const centerX = Math.floor(this.config.gridWidth / 2);
        const centerY = Math.floor(this.config.gridHeight / 2);
        this.snake = new Snake(centerX, centerY, this.config.initialSnakeLength || 3);

        // Initialize food (regular + special slot)
        this.food = new Food(this.config.gridWidth, this.config.gridHeight);
        this.specialFood = new Food(this.config.gridWidth, this.config.gridHeight);
        this.score = 0;
        this.tickCount = 0;

        // Difficulty setting
        this.difficulty = this.storage.get('difficulty', 'medium');

        // Wall collision derived from difficulty
        this.wallCollisionEnabled = this.getDifficultyConfig().wallCollision;

        // Animation style setting - respect prefers-reduced-motion
        const prefersReducedMotion = typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const savedAnimationStyle = this.storage.get('animationStyle', 'smooth');
        this.animationStyle = prefersReducedMotion ? 'classic' : savedAnimationStyle;
        this.reducedMotion = this.storage.get('reducedMotion', prefersReducedMotion);
        this.colorblindMode = this.storage.get('colorblindMode', false);
        this.accessibilityMode = this.storage.get('accessibilityMode', false);

        // Load saved theme
        this.currentTheme = this.storage.get('theme', 'classic');
        this.applyTheme(this.currentTheme);

        // Initialize audio manager with saved settings
        this.audio = new AudioManager();
        this.audio.volume = this.storage.get('audioVolume', 0.5);
        this.audio.muted = this.storage.get('audioMuted', false);

        // Initialize input handler
        this.inputHandler = new InputHandler(canvas, () => this.snake.direction);

        // Accessibility: screen reader announcer elements
        this._srAnnouncer = null;
        this._srScore = null;

        // Bind methods
        this.loop = this.loop.bind(this);
    }

    setState(newState) {
        const validStates = Object.values(GameState);
        if (!validStates.includes(newState)) {
            console.error(`Invalid state: ${newState}`);
            return;
        }

        const oldState = this.state;
        this.state = newState;
        this.onStateChange(oldState, newState);
    }

    onStateChange(oldState, newState) {
        if (this.ui) {
            this.ui.updateState(newState);
            if (newState === GameState.GAMEOVER) {
                this.ui.updateScore(this.score);
            }
        }

        // Screen reader announcements for state changes
        if (newState === GameState.PLAYING && oldState === GameState.MENU) {
            this.announce('Game started. Use arrow keys or WASD to move.');
        } else if (newState === GameState.PLAYING && oldState === GameState.PAUSED) {
            this.announce('Game resumed.');
        } else if (newState === GameState.PAUSED) {
            this.announce('Game paused.');
        }
    }

    handleGameOver() {
        if (this.state === GameState.GAMEOVER) {
            return; // Re-entry guard
        }

        // Check theme unlocks before setState, which triggers updateScore
        const newThemes = this.storage.checkThemeUnlocks(this.score, this.difficulty);
        if (this.ui && newThemes.length > 0) {
            this.ui.showThemeUnlockNotification(newThemes);
            this.audio.playThemeUnlock();
        }

        // Play high score or game over sound
        const assisted = this.accessibilityMode || false;
        const isNewTopScore = this.storage.isNewTopScore(this.score, this.difficulty, assisted);
        if (isNewTopScore && this.score > 0) {
            this.audio.playHighScore();
        } else {
            this.audio.playGameOver();
        }

        // Screen reader announcement
        const isNewHighScore = this.storage.isHighScore(this.score, this.difficulty, assisted);
        if (isNewTopScore && this.score > 0) {
            this.announce(`Game over! New high score: ${this.score} points!`, 'assertive');
        } else if (isNewHighScore && this.score > 0) {
            this.announce(`Game over! You made the leaderboard with ${this.score} points!`, 'assertive');
        } else {
            this.announce(`Game over! Final score: ${this.score} points`, 'assertive');
        }

        this.setState(GameState.GAMEOVER);

        if (this.ui && this.score > 0 && this.storage.isHighScore(this.score, this.difficulty, assisted)) {
            this.ui.showInitials(this.score, this.storage);
        }
    }

    checkWallCollision(head) {
        return head.x < 0 || head.x >= this.config.gridWidth ||
               head.y < 0 || head.y >= this.config.gridHeight;
    }

    wrapPosition(pos) {
        const w = this.config.gridWidth;
        const h = this.config.gridHeight;
        // Double modulo handles negative values: (-1 % 20) = -1, ((-1 % 20) + 20) % 20 = 19
        return {
            x: ((pos.x % w) + w) % w,
            y: ((pos.y % h) + h) % h
        };
    }

    setAnimationStyle(style) {
        this.animationStyle = style;
        this.storage.set('animationStyle', style);
    }

    setVolume(value) {
        this.audio.setVolume(value);
        this.storage.set('audioVolume', this.audio.volume);
    }

    setMuted(muted) {
        this.audio.setMuted(muted);
        this.storage.set('audioMuted', muted);
    }

    setReducedMotion(enabled) {
        this.reducedMotion = enabled;
        this.storage.set('reducedMotion', enabled);
        if (enabled) {
            this.animationStyle = 'classic';
            this.storage.set('animationStyle', 'classic');
        }
    }

    setColorblindMode(enabled) {
        this.colorblindMode = enabled;
        this.storage.set('colorblindMode', enabled);
    }

    setAccessibilityMode(enabled) {
        this.accessibilityMode = enabled;
        this.storage.set('accessibilityMode', enabled);
        // Recalculate tick rate if needed (slower in accessibility mode)
        this.updateTickRate();
    }

    // Screen reader announcements
    announce(message, priority = 'polite') {
        if (!this._srAnnouncer) {
            this._srAnnouncer = document.getElementById('sr-announcer');
        }
        if (this._srAnnouncer) {
            this._srAnnouncer.setAttribute('aria-live', priority);
            this._srAnnouncer.textContent = message;
        }
    }

    announceScore(score) {
        if (!this._srScore) {
            this._srScore = document.getElementById('sr-score');
        }
        if (this._srScore) {
            this._srScore.textContent = `Score: ${score}`;
        }
    }

    applyTheme(themeName) {
        const theme = THEMES[themeName];
        if (!theme) return;

        this.currentTheme = themeName;
        this.renderer.setTheme(theme);
        this.storage.set('theme', themeName);

        // Update CSS custom properties for UI theming
        if (typeof document !== 'undefined' && document.documentElement) {
            const root = document.documentElement.style;
            const ui = theme.ui;
            root.setProperty('--ui-accent', ui.accent);
            root.setProperty('--ui-accent-glow', ui.accentGlow);
            root.setProperty('--ui-accent-hover', ui.accentHover);
            root.setProperty('--ui-danger', ui.danger);
            root.setProperty('--ui-danger-glow', ui.dangerGlow);
            root.setProperty('--ui-glass-bg', ui.glass);
            root.setProperty('--ui-glass-border', ui.glassBorder);
            root.setProperty('--ui-glass-highlight', ui.glassHighlight);
            root.setProperty('--ui-text-primary', ui.textPrimary);
            root.setProperty('--ui-text-secondary', ui.textSecondary);
            root.setProperty('--ui-text-muted', ui.textMuted);
            root.setProperty('--ui-gold', ui.gold);
            root.setProperty('--ui-gold-glow', ui.goldGlow);
            root.setProperty('--theme-bg', theme.colors.background);
            root.setProperty('--theme-overlay-bg', theme.colors.background + 'd9');

            // Body background for light theme
            document.body.style.backgroundColor = theme.colors.background;
        }
    }

    start() {
        if (this.animationFrameId !== null) {
            return; // Already running
        }
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    stop() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    loop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Poll gamepad every frame (before tick so directions are queued in time)
        this.inputHandler.pollGamepad();

        // Accumulate time for fixed-step game logic
        // Cap delta to avoid spiral of death after tab-away or GC pause
        this.tickAccumulator += Math.min(deltaTime, this.tickInterval);

        // Run game tick when interval elapsed, reset accumulator for clean 0→1 alpha
        if (this.tickAccumulator >= this.tickInterval) {
            this.tick();
            this.tickAccumulator = 0;
        }

        // Render every frame
        this.render();

        // Continue loop
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    getDifficultyConfig() {
        return DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;
    }

    updateTickRate() {
        const config = this.getDifficultyConfig();
        const speedUps = Math.floor(this.score / config.speedScoreStep);
        let newRate = Math.min(config.baseTickRate + speedUps, config.maxTickRate);

        // Extended Time Mode: cap speed at Easy base rate (8 ticks/s)
        if (this.accessibilityMode) {
            newRate = Math.min(newRate, DIFFICULTY_LEVELS.easy.baseTickRate);
        }

        this.tickInterval = 1000 / newRate;
    }

    _getRegularDecay() {
        return this.accessibilityMode ? FOOD_DECAY_TICKS_ACCESSIBLE : FOOD_DECAY_TICKS;
    }

    _getSpecialDecay() {
        return this.accessibilityMode ? SPECIAL_FOOD_TICKS_ACCESSIBLE : SPECIAL_FOOD_TICKS;
    }

    calculateToxicPenalty() {
        // Base -5, scales: penalty = -5 * ceil(score / 50)
        const multiplier = Math.max(1, Math.ceil(this.score / 50));
        return -5 * multiplier;
    }

    calculateToxicSegments() {
        const config = this.getDifficultyConfig();
        if (!config.toxicSegmentDivisor) return 0;
        return Math.max(config.toxicSegmentBase, Math.floor(this.snake.body.length / config.toxicSegmentDivisor));
    }

    setDifficulty(difficulty) {
        if (!DIFFICULTY_LEVELS[difficulty]) return;
        this.difficulty = difficulty;
        this.storage.set('difficulty', difficulty);
        this.wallCollisionEnabled = DIFFICULTY_LEVELS[difficulty].wallCollision;
        this.updateTickRate();
        this.updateHUD();
    }

    updateHUD() {
        if (!this._hudScore) return;
        this._hudScore.textContent = this.score;
        this._hudLength.textContent = this.snake.body.length;
        this._hudDifficulty.textContent = this.getDifficultyConfig().name;

        // Toxic penalty info (only when difficulty has toxic food)
        const config = this.getDifficultyConfig();
        if (config.toxicFoodChance > 0) {
            const penalty = this.calculateToxicPenalty();
            const segments = this.calculateToxicSegments();
            this._hudToxicPoints.textContent = `${penalty} pts`;
            this._hudToxicSegments.textContent = `-${segments} seg`;
            this._hudToxic.hidden = false;
        } else {
            this._hudToxic.hidden = true;
        }
    }

    tick() {
        // Game logic updates (only when playing)
        if (this.state !== GameState.PLAYING) {
            return;
        }

        // Process queued input
        const nextDirection = this.inputHandler.getNextDirection();
        if (nextDirection) {
            this.snake.setDirection(nextDirection);
        }

        // Move snake
        this.snake.move();

        // Increment tick count
        this.tickCount++;

        // Get current head position
        const head = this.snake.getHead();

        // Apply wrap-around if wall collision is disabled
        if (!this.wallCollisionEnabled) {
            const wrapped = this.wrapPosition(head);
            this.snake.setHeadPosition(wrapped);
        }

        // Check wall collision (only if enabled)
        if (this.wallCollisionEnabled && this.checkWallCollision(head)) {
            this.handleGameOver();
            return;
        }

        // Check self-collision (AFTER wrap is applied)
        if (this.snake.checkSelfCollision()) {
            this.handleGameOver();
            return;
        }

        // Spawn initial food if none exists
        if (!this.food.position) {
            this.food.spawn(this.snake.body, this.tickCount, FoodType.REGULAR, this._getRegularDecay());
        }

        // Check regular food collision
        if (this.food.checkCollision(this.snake.getHead())) {
            this.score += this.food.points;
            this.snake.grow();
            this.updateTickRate();
            this.audio.playEat();
            this.announceScore(this.score);
            this.food.spawn(this.snake.body, this.tickCount, FoodType.REGULAR, this._getRegularDecay());
        }

        // Check food decay (Extended Time Mode uses doubled timers)
        if (this.food.isExpired(this.tickCount)) {
            this.food.spawn(this.snake.body, this.tickCount, FoodType.REGULAR, this._getRegularDecay());
        }

        // Special food logic
        const diffConfig = this.getDifficultyConfig();

        // Check special food collision
        if (this.specialFood.position && this.specialFood.checkCollision(this.snake.getHead())) {
            switch (this.specialFood.foodType) {
                case FoodType.BONUS:
                    this.score += 25;
                    this.snake.grow();
                    this.updateTickRate();
                    this.audio.playBonusEat();
                    this.announceScore(this.score);
                    break;
                case FoodType.TOXIC: {
                    // Deduct points (never go negative)
                    this.score = Math.max(0, this.score + this.calculateToxicPenalty());
                    // Remove segments
                    const segmentsToRemove = this.calculateToxicSegments();
                    this.snake.removeSegments(segmentsToRemove);
                    this.audio.playToxicEat();
                    // Game over if only head remains
                    if (this.snake.body.length <= 1) {
                        this.specialFood.reset();
                        this.handleGameOver();
                        return;
                    }
                    this.updateTickRate();
                    break;
                }
                case FoodType.LETHAL:
                    this.specialFood.reset();
                    this.handleGameOver();
                    return;
            }
            this.specialFood.reset();
        }

        // Check special food expiry (Extended Time Mode uses doubled timers)
        if (this.specialFood.position && this.specialFood.isExpired(this.tickCount)) {
            // Play relief sound when hazard food expires
            if (this.specialFood.foodType === FoodType.TOXIC || this.specialFood.foodType === FoodType.LETHAL) {
                this.audio.playPoisonDisappear();
            }
            this.specialFood.reset();
        }

        // Maybe spawn special food (only if none active)
        if (!this.specialFood.position && this.tickCount % 10 === 0) {
            const roll = Math.random();
            const excludePositions = [...this.snake.body];
            if (this.food.position) excludePositions.push(this.food.position);
            const goodFoodPos = this.food.position;
            const prox = diffConfig.hazardProximity;

            const specialDecay = this._getSpecialDecay();
            if (roll < diffConfig.lethalFoodChance) {
                // Try proximity spawn first, fall back to random if it fails
                let spawned = goodFoodPos && prox && this.specialFood.spawnNearTarget(goodFoodPos, prox.min, prox.max, excludePositions, this.tickCount, FoodType.LETHAL, specialDecay);
                if (!spawned) {
                    spawned = this.specialFood.spawn(excludePositions, this.tickCount, FoodType.LETHAL, specialDecay);
                }
                if (spawned) this.audio.playPoisonAppear();
            } else if (roll < diffConfig.lethalFoodChance + diffConfig.toxicFoodChance) {
                // Try proximity spawn first, fall back to random if it fails
                let spawned = goodFoodPos && prox && this.specialFood.spawnNearTarget(goodFoodPos, prox.min, prox.max, excludePositions, this.tickCount, FoodType.TOXIC, specialDecay);
                if (!spawned) {
                    spawned = this.specialFood.spawn(excludePositions, this.tickCount, FoodType.TOXIC, specialDecay);
                }
                if (spawned) this.audio.playPoisonAppear();
            } else if (roll < diffConfig.lethalFoodChance + diffConfig.toxicFoodChance + diffConfig.bonusFoodChance) {
                this.specialFood.spawn(excludePositions, this.tickCount, FoodType.BONUS, specialDecay);
            }
        }
    }

    render() {
        this.renderer.clear();

        // Draw game elements when playing, paused, or game over
        if (this.state === GameState.PLAYING || this.state === GameState.PAUSED || this.state === GameState.GAMEOVER) {
            this.renderer.drawGrid();

            // Calculate interpolation factor for smooth animation
            const interpFactor = this.animationStyle === 'smooth'
                ? Math.min(this.tickAccumulator / this.tickInterval, 1.0)
                : 0;
            this.renderer.drawSnake(this.snake, interpFactor);

            // Draw food (only when playing or paused)
            if (this.state !== GameState.GAMEOVER) {
                const isDecayWarning = this.food.isDecayWarning(this.tickCount);
                this.renderer.drawFood(this.food, isDecayWarning, this.tickCount, this.colorblindMode, this.reducedMotion);

                // Draw special food
                if (this.specialFood.position) {
                    const specialDecayWarning = this.specialFood.isDecayWarning(this.tickCount);
                    this.renderer.drawFood(this.specialFood, specialDecayWarning, this.tickCount, this.colorblindMode, this.reducedMotion);
                }
            }

            // Update HUD
            this.updateHUD();
        }
    }

    reset() {
        this.tickAccumulator = 0;
        this.score = 0;
        this.tickCount = 0;

        // Sync settings from current difficulty
        this.updateTickRate();
        this.wallCollisionEnabled = this.getDifficultyConfig().wallCollision;

        // Reset snake to center
        const centerX = Math.floor(this.config.gridWidth / 2);
        const centerY = Math.floor(this.config.gridHeight / 2);
        this.snake.reset(centerX, centerY, this.config.initialSnakeLength || 3);

        // Reset food
        this.food.reset();
        this.specialFood.reset();

        // Clear input queue
        this.inputHandler.clearQueue();
    }

    destroy() {
        this.stop();
        this.inputHandler.detachListeners();
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Only run in browser environment
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('game-canvas');

        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        const game = new Game(canvas);

        // Initialize UI manager
        const container = document.querySelector('.game-container');
        const overlay = document.getElementById('overlay');
        game.ui = new UIManager(container, overlay, game);

        // Cache HUD elements
        game._hudScore = document.getElementById('hud-score');
        game._hudLength = document.getElementById('hud-length');
        game._hudDifficulty = document.getElementById('hud-difficulty');
        game._hudToxicPoints = document.getElementById('hud-toxic-points');
        game._hudToxicSegments = document.getElementById('hud-toxic-segments');
        game._hudToxic = document.getElementById('hud-toxic');

        // Block all input while settings modal is open
        game.inputHandler.inputGate = () => container.hasAttribute('data-ui');

        // Wire gamepad context so pollGamepad() knows game state and can navigate menus
        game.inputHandler.getGameState = () => game.state;
        game.inputHandler.uiManager = game.ui;

        // Wire action keys
        game.inputHandler.onAction('pause', () => {
            if (game.state === GameState.PLAYING) {
                game.setState(GameState.PAUSED);
            } else if (game.state === GameState.PAUSED) {
                game.setState(GameState.PLAYING);
            }
        });

        game.inputHandler.onAction('escape', () => {
            // Close modal overlays first
            const activeUi = container.getAttribute('data-ui');
            if (activeUi === 'leaderboard') {
                game.ui.hideLeaderboard();
                return;
            }
            if (activeUi === 'settings') {
                game.ui.hideSettings();
                return;
            }
            if (activeUi === 'shortcuts') {
                game.ui.hideShortcuts();
                return;
            }
            if (activeUi === 'initials') {
                return; // Handled by its own keydown listener
            }

            if (game.state === GameState.PAUSED || game.state === GameState.GAMEOVER) {
                game.reset();
                game.setState(GameState.MENU);
            }
        });

        // Show keyboard shortcuts with ? key
        document.addEventListener('keydown', (e) => {
            // Only trigger on ? (Shift + / or ?) key, not when typing in inputs
            if ((e.key === '?' || (e.key === '/' && e.shiftKey)) &&
                !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                const activeUi = container.getAttribute('data-ui');
                if (activeUi === 'shortcuts') {
                    game.ui.hideShortcuts();
                } else if (activeUi !== 'initials') {
                    game.ui.showShortcuts();
                }
            }
        });

        // Wire mobile pause button
        const mobilePauseBtn = document.querySelector('.mobile-pause-btn');
        if (mobilePauseBtn) {
            mobilePauseBtn.addEventListener('click', () => {
                if (game.state === GameState.PLAYING) {
                    game.setState(GameState.PAUSED);
                }
            });
        }

        // Wire virtual D-pad
        const dpad = document.getElementById('dpad');
        if (dpad) {
            const dirMap = { up: Direction.UP, down: Direction.DOWN, left: Direction.LEFT, right: Direction.RIGHT };
            dpad.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const btn = e.target.closest('.dpad__btn');
                if (btn && game.state === GameState.PLAYING) {
                    const dir = dirMap[btn.dataset.dir];
                    if (dir) game.inputHandler.queueDirection(dir);
                }
            }, { passive: false });
            dpad.addEventListener('touchend', (e) => {
                e.stopPropagation();
                e.preventDefault();
            }, { passive: false });
        }

        // Wire mobile input method selector
        const mobileInputSelector = document.getElementById('mobile-input-selector');
        const savedMobileInput = game.storage.get('mobileInput', 'swipe');
        game.inputHandler.mobileInputMethod = savedMobileInput;

        // Show/hide D-pad based on input method
        const updateDpadVisibility = () => {
            if (dpad) {
                dpad.hidden = game.inputHandler.mobileInputMethod !== 'dpad';
            }
        };
        updateDpadVisibility();

        if (mobileInputSelector) {
            // Sync initial state
            mobileInputSelector.querySelectorAll('[data-input]').forEach(opt => {
                opt.setAttribute('aria-checked', String(opt.dataset.input === savedMobileInput));
            });

            mobileInputSelector.addEventListener('click', (e) => {
                const option = e.target.closest('[data-input]');
                if (!option) return;
                const method = option.dataset.input;
                game.inputHandler.mobileInputMethod = method;
                game.storage.set('mobileInput', method);
                mobileInputSelector.querySelectorAll('[data-input]').forEach(opt => {
                    opt.setAttribute('aria-checked', String(opt.dataset.input === method));
                });
                updateDpadVisibility();
                game.audio.init();
                game.audio.playConfirm();
            });
        }

        // Start the game loop and show menu
        game.start();
        game.setState(GameState.MENU);

        // Expose game instance for debugging
        window.game = game;

        // Dev tools (console API for manual testing)
        window.dev = {
            spawnFood(type = 'bonus') {
                if (!FoodType[type.toUpperCase()]) {
                    console.error(`Unknown food type: ${type}. Use: ${Object.values(FoodType).join(', ')}`);
                    return;
                }
                const foodType = FoodType[type.toUpperCase()];
                const excludePositions = [...game.snake.body];
                if (game.food.position) excludePositions.push(game.food.position);

                if (foodType === FoodType.REGULAR) {
                    game.food.spawn(excludePositions, game.tickCount);
                } else if ((foodType === FoodType.TOXIC || foodType === FoodType.LETHAL) && game.food.position) {
                    const prox = game.getDifficultyConfig().hazardProximity;
                    if (prox) {
                        game.specialFood.spawnNearTarget(game.food.position, prox.min, prox.max, excludePositions, game.tickCount, foodType, SPECIAL_FOOD_TICKS);
                    } else {
                        game.specialFood.spawn(excludePositions, game.tickCount, foodType, SPECIAL_FOOD_TICKS);
                    }
                } else {
                    game.specialFood.spawn(excludePositions, game.tickCount, foodType, SPECIAL_FOOD_TICKS);
                }
                const pos = foodType === FoodType.REGULAR ? game.food.position : game.specialFood.position;
                console.log(`Spawned ${type} food at (${pos ? pos.x : '?'}, ${pos ? pos.y : '?'})`);
            },
            setScore(score) {
                game.score = Math.max(0, score);
                game.updateTickRate();
                console.log(`Score set to ${game.score} (tick rate: ${(1000 / game.tickInterval).toFixed(1)} Hz)`);
            },
            setDifficulty(level) {
                game.setDifficulty(level);
                if (game.ui) game.ui.syncDifficultySelector();
                console.log(`Difficulty set to ${level} (walls ${game.wallCollisionEnabled ? 'kill' : 'wrap'})`);
            },
            setSpeed(tickRate) {
                game.tickInterval = 1000 / tickRate;
                console.log(`Tick rate set to ${tickRate} Hz`);
            },
            grow(segments = 5) {
                for (let i = 0; i < segments; i++) game.snake.grow();
                console.log(`Snake length: ${game.snake.body.length}`);
            },
            kill() {
                game.setState(GameState.GAMEOVER);
                console.log('Game over triggered');
            },
            status() {
                const config = game.getDifficultyConfig();
                console.table({
                    state: game.state,
                    difficulty: `${config.name} (${game.difficulty})`,
                    score: game.score,
                    length: game.snake.body.length,
                    tickRate: `${(1000 / game.tickInterval).toFixed(1)} Hz`,
                    wallCollision: game.wallCollisionEnabled,
                    tickCount: game.tickCount,
                    food: game.food.active ? `${game.food.foodType} at (${game.food.x},${game.food.y})` : 'none',
                    specialFood: game.specialFood.active ? `${game.specialFood.foodType} at (${game.specialFood.x},${game.specialFood.y})` : 'none'
                });
            },
            help() {
                console.log([
                    'dev.spawnFood(type)  - Spawn food: regular, bonus, toxic, lethal',
                    'dev.setScore(n)      - Set score and update speed',
                    'dev.setDifficulty(d) - Set difficulty: easy, medium, hard',
                    'dev.setSpeed(hz)     - Override tick rate',
                    'dev.grow(n)          - Grow snake by n segments (default 5)',
                    'dev.kill()           - Trigger game over',
                    'dev.status()         - Show current game state',
                ].join('\n'));
            }
        };
    });
}

// =============================================================================
// EXPORTS (for testing)
// =============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Game, Renderer, Snake, Food, InputHandler, StorageManager, UIManager, AudioManager,
        GameState, Direction, FoodType,
        GRID_WIDTH, GRID_HEIGHT, CELL_SIZE,
        FOOD_POINTS, FOOD_DECAY_TICKS, FOOD_DECAY_TICKS_ACCESSIBLE, FOOD_MAX_SPAWN_ATTEMPTS,
        SPECIAL_FOOD_TICKS, SPECIAL_FOOD_TICKS_ACCESSIBLE, DIFFICULTY_LEVELS
    };
}
