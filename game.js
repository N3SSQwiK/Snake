// =============================================================================
// CONSTANTS
// =============================================================================

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
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

// Default theme colors (Neo-Arcade Emerald)
const DEFAULT_THEME = {
    name: 'classic',
    colors: {
        background: '#0a0a0f',
        grid: '#1a1a24',
        snake: '#10b981',
        snakeHead: '#059669',
        snakeTail: '#34d399',
        snakeGlow: 'rgba(16, 185, 129, 0.4)',
        snakeEyes: 'rgba(255, 255, 255, 0.9)',
        food: '#ef4444',
        bonusFood: '#f59e0b',
        poisonFood: '#a855f7'
    }
};

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
}

// =============================================================================
// SNAKE CLASS
// =============================================================================

class Snake {
    constructor(startX, startY, initialLength = 3) {
        this.body = [];
        this.direction = Direction.RIGHT;
        this.pendingGrowth = 0;

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
    }

    spawn(excludePositions, currentTick) {
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

    drawSnake(snake) {
        const colors = this.theme.colors;
        const bodyLength = snake.body.length;

        // Enable glow effect for the entire snake
        this.ctx.shadowColor = colors.snakeGlow || 'rgba(16, 185, 129, 0.4)';
        this.ctx.shadowBlur = 8;

        // Draw body segments (tail to head) with gradient coloring
        for (let i = bodyLength - 1; i > 0; i--) {
            const segment = snake.body[i];

            // Calculate gradient: head color (0) -> tail color (1)
            const t = i / (bodyLength - 1);
            const tailColor = colors.snakeTail || colors.snake;
            const segmentColor = this.lerpColor(colors.snakeHead, tailColor, t);

            // Draw rounded segment with slight overlap for connected look
            const padding = 1;
            const radius = 4;
            this.drawRoundedRect(
                segment.x * CELL_SIZE + padding,
                segment.y * CELL_SIZE + padding,
                CELL_SIZE - padding * 2,
                CELL_SIZE - padding * 2,
                radius,
                segmentColor
            );
        }

        // Draw head with more prominent rounding
        const head = snake.body[0];
        const headPadding = 1;
        const headRadius = 6;

        this.drawRoundedRect(
            head.x * CELL_SIZE + headPadding,
            head.y * CELL_SIZE + headPadding,
            CELL_SIZE - headPadding * 2,
            CELL_SIZE - headPadding * 2,
            headRadius,
            colors.snakeHead
        );

        // Disable shadow for eyes (crisp rendering)
        this.ctx.shadowBlur = 0;

        // Draw eyes based on direction
        this.drawSnakeEyes(head, snake.direction, colors.snakeEyes || 'rgba(255, 255, 255, 0.9)');
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

    drawFood(food, isDecayWarning, currentTick) {
        if (!food.position) {
            return;
        }

        // Blink effect: toggle visibility every 5 ticks when decay warning
        if (isDecayWarning && Math.floor(currentTick / 5) % 2 === 1) {
            return;
        }

        const x = food.position.x * CELL_SIZE;
        const y = food.position.y * CELL_SIZE;
        const size = CELL_SIZE;

        // Draw glow effect
        this.ctx.shadowColor = this.theme.colors.food;
        this.ctx.shadowBlur = 8;

        // Draw apple body
        this.ctx.fillStyle = this.theme.colors.food;
        this.ctx.beginPath();

        // Apple shape using bezier curves
        // Start at top center indent
        const centerX = x + size / 2;
        const topY = y + 4;
        const bottomY = y + size - 2;
        const leftX = x + 2;
        const rightX = x + size - 2;

        // Top indent
        this.ctx.moveTo(centerX, topY + 2);

        // Left curve (top to bottom)
        this.ctx.bezierCurveTo(
            leftX - 1, topY + 2,      // control point 1
            leftX, bottomY - 4,        // control point 2
            centerX, bottomY           // end point (bottom center)
        );

        // Right curve (bottom to top)
        this.ctx.bezierCurveTo(
            rightX, bottomY - 4,       // control point 1
            rightX + 1, topY + 2,      // control point 2
            centerX, topY + 2          // end point (back to top)
        );

        this.ctx.closePath();
        this.ctx.fill();

        // Reset shadow for stem and leaf
        this.ctx.shadowBlur = 0;

        // Draw stem
        this.ctx.strokeStyle = '#5d4037';  // Brown
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, topY + 2);
        this.ctx.lineTo(centerX + 1, topY - 2);
        this.ctx.stroke();

        // Draw leaf
        this.ctx.fillStyle = '#4caf50';  // Green
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 4, topY, 3, 1.5, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawScore(score, length) {
        // Set text properties
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // Draw shadow for readability
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillText(`Score: ${score}  Length: ${length}`, 11, 11);

        // Draw text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`Score: ${score}  Length: ${length}`, 10, 10);
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

        // Touch tracking
        this.touchStartX = null;
        this.touchStartY = null;
        this.minSwipeDistance = 30;

        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        // Attach listeners
        this.attachListeners();
    }

    attachListeners() {
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', this.handleKeyDown);
        }
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    }

    detachListeners() {
        if (typeof document !== 'undefined') {
            document.removeEventListener('keydown', this.handleKeyDown);
        }
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    }

    onAction(actionName, callback) {
        this.actionCallbacks[actionName] = callback;
    }

    handleKeyDown(event) {
        // Action keys (filter event.repeat to prevent held-key spam)
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

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        // Reset touch tracking
        this.touchStartX = null;
        this.touchStartY = null;

        // Check minimum swipe distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
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
// UI MANAGER CLASS
// =============================================================================

class UIManager {
    constructor(container, overlay, game) {
        this.container = container;
        this.overlay = overlay;
        this.game = game;
        this.previousState = null;

        // DOM cache
        this.finalScoreEl = document.getElementById('final-score');
        this.wallToggle = document.getElementById('wall-collision-toggle');

        // Event delegation on overlay
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.overlay.addEventListener('click', this.handleOverlayClick);
    }

    updateState(newState) {
        this.container.setAttribute('data-state', newState);

        // Clear settings modal when state changes (unless we're opening settings)
        if (!this._settingsOpen) {
            this.container.removeAttribute('data-ui');
        }
        this._settingsOpen = false;
    }

    showSettings() {
        this.previousState = this.game.state;
        this._settingsOpen = true;

        // Sync toggle with current value
        this.wallToggle.setAttribute('aria-checked',
            String(this.game.wallCollisionEnabled));

        this.container.setAttribute('data-ui', 'settings');
    }

    hideSettings() {
        this.container.removeAttribute('data-ui');
    }

    updateScore(score) {
        this.finalScoreEl.textContent = score;
    }

    handleOverlayClick(event) {
        const action = event.target.closest('[data-action]');
        if (!action) return;

        switch (action.dataset.action) {
            case 'play':
                this.game.reset();
                this.game.setState(GameState.PLAYING);
                break;
            case 'settings':
                this.showSettings();
                break;
            case 'highscores':
                // Placeholder — leaderboard feature not yet implemented
                break;
            case 'resume':
                this.game.setState(GameState.PLAYING);
                break;
            case 'quit':
                this.game.reset();
                this.game.setState(GameState.MENU);
                break;
            case 'restart':
                this.game.reset();
                this.game.setState(GameState.PLAYING);
                break;
            case 'menu':
                this.game.reset();
                this.game.setState(GameState.MENU);
                break;
            case 'toggle-wall-collision': {
                const newVal = !this.game.wallCollisionEnabled;
                this.game.setWallCollision(newVal);
                this.wallToggle.setAttribute('aria-checked', String(newVal));
                break;
            }
            case 'settings-back':
                this.hideSettings();
                break;
        }
    }

    destroy() {
        this.overlay.removeEventListener('click', this.handleOverlayClick);
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

        // Initialize food
        this.food = new Food(this.config.gridWidth, this.config.gridHeight);
        this.score = 0;
        this.tickCount = 0;

        // Wall collision setting (true = GAMEOVER on wall hit, false = wrap-around)
        this.wallCollisionEnabled = this.storage.get('wallCollision', true);

        // Initialize input handler
        this.inputHandler = new InputHandler(canvas, () => this.snake.direction);

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

    setWallCollision(enabled) {
        this.wallCollisionEnabled = enabled;
        this.storage.set('wallCollision', enabled);
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

        // Accumulate time for fixed-step game logic
        this.tickAccumulator += deltaTime;

        // Run game ticks at fixed rate
        while (this.tickAccumulator >= this.tickInterval) {
            this.tick();
            this.tickAccumulator -= this.tickInterval;
        }

        // Render every frame
        this.render();

        // Continue loop
        this.animationFrameId = requestAnimationFrame(this.loop);
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
            this.setState(GameState.GAMEOVER);
            return;
        }

        // Check self-collision (AFTER wrap is applied)
        if (this.snake.checkSelfCollision()) {
            this.setState(GameState.GAMEOVER);
            return;
        }

        // Spawn initial food if none exists
        if (!this.food.position) {
            this.food.spawn(this.snake.body, this.tickCount);
        }

        // Check food collision
        if (this.food.checkCollision(this.snake.getHead())) {
            this.score += this.food.points;
            this.snake.grow();
            this.food.spawn(this.snake.body, this.tickCount);
        }

        // Check food decay
        if (this.food.isExpired(this.tickCount)) {
            this.food.spawn(this.snake.body, this.tickCount);
        }
    }

    render() {
        this.renderer.clear();

        // Draw game elements when playing, paused, or game over
        if (this.state === GameState.PLAYING || this.state === GameState.PAUSED || this.state === GameState.GAMEOVER) {
            this.renderer.drawGrid();
            this.renderer.drawSnake(this.snake);

            // Draw food (only when playing or paused)
            if (this.state !== GameState.GAMEOVER) {
                const isDecayWarning = this.food.isDecayWarning(this.tickCount);
                this.renderer.drawFood(this.food, isDecayWarning, this.tickCount);
            }

            // Draw score (always visible so player sees final score)
            this.renderer.drawScore(this.score, this.snake.body.length);
        }
    }

    reset() {
        this.tickAccumulator = 0;
        this.score = 0;
        this.tickCount = 0;

        // Reset snake to center
        const centerX = Math.floor(this.config.gridWidth / 2);
        const centerY = Math.floor(this.config.gridHeight / 2);
        this.snake.reset(centerX, centerY, this.config.initialSnakeLength || 3);

        // Reset food
        this.food.reset();

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

        // Wire action keys (blocked while settings modal is open)
        game.inputHandler.onAction('pause', () => {
            if (container.hasAttribute('data-ui')) return;
            if (game.state === GameState.PLAYING) {
                game.setState(GameState.PAUSED);
            } else if (game.state === GameState.PAUSED) {
                game.setState(GameState.PLAYING);
            }
        });

        game.inputHandler.onAction('escape', () => {
            if (container.hasAttribute('data-ui')) return;
            if (game.state === GameState.PLAYING || game.state === GameState.PAUSED) {
                game.reset();
                game.setState(GameState.MENU);
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

        // Start the game loop and show menu
        game.start();
        game.setState(GameState.MENU);

        // Expose game instance for debugging
        window.game = game;
    });
}

// =============================================================================
// EXPORTS (for testing)
// =============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Game, Renderer, Snake, Food, InputHandler, StorageManager, UIManager,
        GameState, Direction,
        GRID_WIDTH, GRID_HEIGHT, CELL_SIZE,
        FOOD_POINTS, FOOD_DECAY_TICKS, FOOD_MAX_SPAWN_ATTEMPTS
    };
}
