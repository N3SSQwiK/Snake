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

const TARGET_FPS = 60;
const TICK_RATE = 10; // Game logic updates per second

// Default theme colors (Classic)
const DEFAULT_THEME = {
    name: 'classic',
    colors: {
        background: '#000000',
        grid: '#111111',
        snake: '#00ff00',
        snakeHead: '#00aa00',
        food: '#ff0000',
        bonusFood: '#ffff00',
        poisonFood: '#ff00ff'
    }
};

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
        this.ctx.lineWidth = 0.5;

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

        // Placeholder for future game logic
        // - Move snake
        // - Check collisions
        // - Update score
    }

    render() {
        this.renderer.clear();

        // Always draw grid when playing or paused
        if (this.state === GameState.PLAYING || this.state === GameState.PAUSED) {
            this.renderer.drawGrid();
        }

        // Placeholder for future rendering
        // - Draw snake
        // - Draw food
        // - Draw UI elements
    }

    reset() {
        this.tickAccumulator = 0;
        // Placeholder for future reset logic
        // - Reset snake position
        // - Reset score
        // - Spawn initial food
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
    module.exports = { Game, Renderer, GameState, GRID_WIDTH, GRID_HEIGHT, CELL_SIZE };
}
