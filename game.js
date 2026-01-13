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

// Default theme colors (Classic)
const DEFAULT_THEME = {
    name: 'classic',
    colors: {
        background: '#000000',
        grid: '#1a3a1a',
        snake: '#00ff00',
        snakeHead: '#00aa00',
        food: '#ff0000',
        bonusFood: '#ffff00',
        poisonFood: '#ff00ff'
    }
};

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

    drawSnake(snake) {
        // Draw body segments (tail to head-1) with snake color
        for (let i = snake.body.length - 1; i > 0; i--) {
            const segment = snake.body[i];
            this.drawCell(segment.x, segment.y, this.theme.colors.snake);
        }

        // Draw head with distinct color
        const head = snake.body[0];
        this.drawCell(head.x, head.y, this.theme.colors.snakeHead);
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

        // Initialize snake at center of grid
        const centerX = Math.floor(this.config.gridWidth / 2);
        const centerY = Math.floor(this.config.gridHeight / 2);
        this.snake = new Snake(centerX, centerY, this.config.initialSnakeLength || 3);

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
        // Hook for state change side effects
        console.log(`State changed: ${oldState} -> ${newState}`);
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

        // Move snake
        this.snake.move();

        // Check self-collision
        if (this.snake.checkSelfCollision()) {
            this.setState(GameState.GAMEOVER);
            return;
        }

        // Future: check wall collision, food collision, update score
    }

    render() {
        this.renderer.clear();

        // Always draw grid when playing or paused
        if (this.state === GameState.PLAYING || this.state === GameState.PAUSED) {
            this.renderer.drawGrid();
            this.renderer.drawSnake(this.snake);
        }

        // Future: draw food, UI elements
    }

    reset() {
        this.tickAccumulator = 0;

        // Reset snake to center
        const centerX = Math.floor(this.config.gridWidth / 2);
        const centerY = Math.floor(this.config.gridHeight / 2);
        this.snake.reset(centerX, centerY, this.config.initialSnakeLength || 3);

        // Future: reset score, spawn initial food
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

        // Start the game loop
        game.start();

        // Set initial state to MENU
        game.setState(GameState.MENU);

        // Temporary: Start playing immediately for testing
        // Remove this once UI screens are implemented
        game.setState(GameState.PLAYING);

        // Expose game instance for debugging
        window.game = game;
    });
}

// =============================================================================
// EXPORTS (for testing)
// =============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Game, Renderer, Snake, GameState, Direction, GRID_WIDTH, GRID_HEIGHT, CELL_SIZE };
}
