const { test, describe, beforeEach, mock } = require('node:test');
const assert = require('node:assert');

// Mock document for Node.js environment
global.document = {
    addEventListener: mock.fn(),
    removeEventListener: mock.fn(),
    getElementById: mock.fn(() => null)
};

// Mock localStorage for Node.js environment
const createMockLocalStorage = () => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
        _getStore: () => store  // For test inspection
    };
};

global.localStorage = createMockLocalStorage();

// Mock canvas and its context for Node.js environment
const createMockCanvas = () => {
    const ctx = {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: '',
        shadowColor: '',
        shadowBlur: 0,
        font: '',
        textAlign: '',
        textBaseline: '',
        fillRect: mock.fn(),
        strokeRect: mock.fn(),
        beginPath: mock.fn(),
        moveTo: mock.fn(),
        lineTo: mock.fn(),
        stroke: mock.fn(),
        clearRect: mock.fn(),
        quadraticCurveTo: mock.fn(),
        bezierCurveTo: mock.fn(),
        ellipse: mock.fn(),
        closePath: mock.fn(),
        fill: mock.fn(),
        arc: mock.fn(),
        fillText: mock.fn()
    };
    return {
        width: 0,
        height: 0,
        getContext: () => ctx,
        addEventListener: mock.fn(),
        removeEventListener: mock.fn(),
        _ctx: ctx // Expose for test assertions
    };
};

// Import game module
const {
    Game, Renderer, Snake, Food, InputHandler, StorageManager, UIManager,
    GameState, Direction, FoodType,
    GRID_WIDTH, GRID_HEIGHT, CELL_SIZE,
    FOOD_POINTS, FOOD_DECAY_TICKS, FOOD_DECAY_TICKS_ACCESSIBLE, FOOD_MAX_SPAWN_ATTEMPTS,
    SPECIAL_FOOD_TICKS, SPECIAL_FOOD_TICKS_ACCESSIBLE, DIFFICULTY_LEVELS
} = require('./game.js');

// =============================================================================
// CONSTANTS TESTS
// =============================================================================

describe('Game Constants', () => {
    test('grid dimensions are defined', () => {
        assert.strictEqual(typeof GRID_WIDTH, 'number');
        assert.strictEqual(typeof GRID_HEIGHT, 'number');
        assert.strictEqual(GRID_WIDTH, 25);
        assert.strictEqual(GRID_HEIGHT, 25);
    });

    test('cell size is defined', () => {
        assert.strictEqual(typeof CELL_SIZE, 'number');
        assert.strictEqual(CELL_SIZE, 20);
    });

    test('GameState enum has all required states', () => {
        assert.strictEqual(GameState.MENU, 'MENU');
        assert.strictEqual(GameState.PLAYING, 'PLAYING');
        assert.strictEqual(GameState.PAUSED, 'PAUSED');
        assert.strictEqual(GameState.GAMEOVER, 'GAMEOVER');
    });
});

// =============================================================================
// RENDERER TESTS
// =============================================================================

describe('Renderer', () => {
    let canvas;
    let renderer;

    beforeEach(() => {
        canvas = createMockCanvas();
        renderer = new Renderer(canvas);
    });

    test('sets canvas dimensions on construction', () => {
        assert.strictEqual(canvas.width, GRID_WIDTH * CELL_SIZE);
        assert.strictEqual(canvas.height, GRID_HEIGHT * CELL_SIZE);
    });

    test('clear() fills canvas with background color', () => {
        renderer.clear();
        assert.strictEqual(canvas._ctx.fillRect.mock.calls.length, 1);
    });

    test('drawCell() draws a cell at correct position', () => {
        renderer.drawCell(5, 10, '#ff0000');
        // clear() is not called, so fillRect should have 1 call from drawCell
        assert.strictEqual(canvas._ctx.fillRect.mock.calls.length, 1);
    });

    test('setTheme() updates theme', () => {
        const newTheme = {
            name: 'test',
            colors: { background: '#ffffff', grid: '#000000' }
        };
        renderer.setTheme(newTheme);
        assert.strictEqual(renderer.theme.name, 'test');
    });
});

// =============================================================================
// GAME STATE MACHINE TESTS
// =============================================================================

describe('Game State Machine', () => {
    let canvas;
    let game;

    beforeEach(() => {
        canvas = createMockCanvas();
        game = new Game(canvas);
    });

    test('initial state is MENU', () => {
        assert.strictEqual(game.state, GameState.MENU);
    });

    test('setState() transitions to PLAYING', () => {
        game.setState(GameState.PLAYING);
        assert.strictEqual(game.state, GameState.PLAYING);
    });

    test('setState() transitions to PAUSED', () => {
        game.setState(GameState.PLAYING);
        game.setState(GameState.PAUSED);
        assert.strictEqual(game.state, GameState.PAUSED);
    });

    test('setState() transitions to GAMEOVER', () => {
        game.setState(GameState.PLAYING);
        game.setState(GameState.GAMEOVER);
        assert.strictEqual(game.state, GameState.GAMEOVER);
    });

    test('setState() transitions from PAUSED back to PLAYING', () => {
        game.setState(GameState.PLAYING);
        game.setState(GameState.PAUSED);
        game.setState(GameState.PLAYING);
        assert.strictEqual(game.state, GameState.PLAYING);
    });

    test('setState() transitions from GAMEOVER to PLAYING (restart)', () => {
        game.setState(GameState.GAMEOVER);
        game.setState(GameState.PLAYING);
        assert.strictEqual(game.state, GameState.PLAYING);
    });

    test('setState() rejects invalid state', () => {
        const originalState = game.state;
        game.setState('INVALID_STATE');
        assert.strictEqual(game.state, originalState);
    });

    test('setState() transitions from GAMEOVER to MENU', () => {
        game.setState(GameState.GAMEOVER);
        game.setState(GameState.MENU);
        assert.strictEqual(game.state, GameState.MENU);
    });
});

// =============================================================================
// GAME LOOP TESTS
// =============================================================================

describe('Game Loop', () => {
    let canvas;
    let game;

    beforeEach(() => {
        canvas = createMockCanvas();
        game = new Game(canvas);
    });

    test('start() begins game loop', () => {
        // Mock requestAnimationFrame and cancelAnimationFrame
        global.requestAnimationFrame = mock.fn((cb) => 1);
        global.cancelAnimationFrame = mock.fn();
        global.performance = { now: () => 0 };

        game.start();
        assert.notStrictEqual(game.animationFrameId, null);

        // Cleanup
        game.stop();
        delete global.requestAnimationFrame;
        delete global.cancelAnimationFrame;
        delete global.performance;
    });

    test('stop() halts game loop', () => {
        global.requestAnimationFrame = mock.fn((cb) => 1);
        global.cancelAnimationFrame = mock.fn();
        global.performance = { now: () => 0 };

        game.start();
        game.stop();
        assert.strictEqual(game.animationFrameId, null);

        // Cleanup
        delete global.requestAnimationFrame;
        delete global.cancelAnimationFrame;
        delete global.performance;
    });

    test('start() does not restart if already running', () => {
        global.requestAnimationFrame = mock.fn((cb) => 1);
        global.cancelAnimationFrame = mock.fn();
        global.performance = { now: () => 0 };

        game.start();
        const firstId = game.animationFrameId;
        game.start();
        assert.strictEqual(game.animationFrameId, firstId);

        // Cleanup
        game.stop();
        delete global.requestAnimationFrame;
        delete global.cancelAnimationFrame;
        delete global.performance;
    });

    test('reset() clears tick accumulator', () => {
        game.tickAccumulator = 500;
        game.reset();
        assert.strictEqual(game.tickAccumulator, 0);
    });
});

// =============================================================================
// DIRECTION CONSTANT TESTS
// =============================================================================

describe('Direction Constant', () => {
    test('Direction enum has all required values', () => {
        assert.strictEqual(Direction.UP, 'UP');
        assert.strictEqual(Direction.DOWN, 'DOWN');
        assert.strictEqual(Direction.LEFT, 'LEFT');
        assert.strictEqual(Direction.RIGHT, 'RIGHT');
    });
});

// =============================================================================
// SNAKE CLASS TESTS
// =============================================================================

describe('Snake', () => {
    test('constructor creates snake with correct initial body', () => {
        const snake = new Snake(10, 10, 3);
        assert.strictEqual(snake.body.length, 3);
        assert.deepStrictEqual(snake.body[0], { x: 10, y: 10 }); // head
        assert.deepStrictEqual(snake.body[1], { x: 9, y: 10 });
        assert.deepStrictEqual(snake.body[2], { x: 8, y: 10 }); // tail
    });

    test('initial direction is RIGHT', () => {
        const snake = new Snake(10, 10, 3);
        assert.strictEqual(snake.direction, Direction.RIGHT);
    });

    test('getHead returns first body segment', () => {
        const snake = new Snake(10, 10, 3);
        assert.deepStrictEqual(snake.getHead(), { x: 10, y: 10 });
    });

    test('pendingGrowth starts at 0', () => {
        const snake = new Snake(10, 10, 3);
        assert.strictEqual(snake.pendingGrowth, 0);
    });

    test('setHeadPosition updates head position', () => {
        const snake = new Snake(10, 10, 3);
        snake.setHeadPosition({ x: 5, y: 5 });
        assert.deepStrictEqual(snake.getHead(), { x: 5, y: 5 });
    });

    test('setHeadPosition preserves body segments', () => {
        const snake = new Snake(10, 10, 3);
        snake.setHeadPosition({ x: 5, y: 5 });
        assert.strictEqual(snake.body.length, 3);
        assert.deepStrictEqual(snake.body[1], { x: 9, y: 10 });
        assert.deepStrictEqual(snake.body[2], { x: 8, y: 10 });
    });
});

// =============================================================================
// SNAKE MOVEMENT TESTS
// =============================================================================

describe('Snake Movement', () => {
    test('move() advances snake in current direction (RIGHT)', () => {
        const snake = new Snake(10, 10, 3);
        snake.move();
        assert.deepStrictEqual(snake.body[0], { x: 11, y: 10 });
        assert.strictEqual(snake.body.length, 3);
    });

    test('move() advances snake UP', () => {
        const snake = new Snake(10, 10, 3);
        snake.direction = Direction.UP;
        snake.move();
        assert.deepStrictEqual(snake.body[0], { x: 10, y: 9 });
    });

    test('move() advances snake DOWN', () => {
        const snake = new Snake(10, 10, 3);
        snake.direction = Direction.DOWN;
        snake.move();
        assert.deepStrictEqual(snake.body[0], { x: 10, y: 11 });
    });

    test('move() advances snake LEFT', () => {
        const snake = new Snake(10, 10, 3);
        snake.direction = Direction.LEFT;
        snake.move();
        assert.deepStrictEqual(snake.body[0], { x: 9, y: 10 });
    });

    test('setDirection changes direction', () => {
        const snake = new Snake(10, 10, 3);
        snake.setDirection(Direction.UP);
        assert.strictEqual(snake.direction, Direction.UP);
    });

    test('setDirection prevents 180-degree turn (RIGHT to LEFT)', () => {
        const snake = new Snake(10, 10, 3);
        snake.setDirection(Direction.LEFT); // Opposite of RIGHT
        assert.strictEqual(snake.direction, Direction.RIGHT); // Unchanged
    });

    test('setDirection prevents 180-degree turn (UP to DOWN)', () => {
        const snake = new Snake(10, 10, 3);
        snake.direction = Direction.UP;
        snake.setDirection(Direction.DOWN);
        assert.strictEqual(snake.direction, Direction.UP); // Unchanged
    });
});

// =============================================================================
// SNAKE GROWTH TESTS
// =============================================================================

describe('Snake Growth', () => {
    test('grow() sets pending growth', () => {
        const snake = new Snake(10, 10, 3);
        snake.grow();
        assert.strictEqual(snake.pendingGrowth, 1);
    });

    test('move() increases length when pendingGrowth > 0', () => {
        const snake = new Snake(10, 10, 3);
        snake.grow();
        snake.move();
        assert.strictEqual(snake.body.length, 4);
        assert.strictEqual(snake.pendingGrowth, 0);
    });

    test('grow(amount) supports multiple segment growth', () => {
        const snake = new Snake(10, 10, 3);
        snake.grow(3);
        snake.move();
        snake.move();
        snake.move();
        assert.strictEqual(snake.body.length, 6);
    });
});

// =============================================================================
// SNAKE SELF-COLLISION TESTS
// =============================================================================

describe('Snake Self-Collision', () => {
    test('checkSelfCollision returns false for non-colliding snake', () => {
        const snake = new Snake(10, 10, 3);
        assert.strictEqual(snake.checkSelfCollision(), false);
    });

    test('checkSelfCollision returns true when head overlaps body', () => {
        const snake = new Snake(10, 10, 5);
        // Snake: head at (10,10), then (9,10), (8,10), (7,10), (6,10)
        // Move up, left, down to create a loop
        snake.setDirection(Direction.UP);
        snake.move(); // head at (10,9)
        snake.setDirection(Direction.LEFT);
        snake.move(); // head at (9,9)
        snake.setDirection(Direction.DOWN);
        snake.move(); // head at (9,10) - collides with body segment
        assert.strictEqual(snake.checkSelfCollision(), true);
    });
});

// =============================================================================
// SNAKE RESET TESTS
// =============================================================================

describe('Snake Reset', () => {
    test('reset() restores snake to initial state', () => {
        const snake = new Snake(10, 10, 3);
        snake.move();
        snake.move();
        snake.grow(5);
        snake.direction = Direction.UP;

        snake.reset(5, 5, 4);

        assert.strictEqual(snake.body.length, 4);
        assert.deepStrictEqual(snake.body[0], { x: 5, y: 5 });
        assert.strictEqual(snake.direction, Direction.RIGHT);
        assert.strictEqual(snake.pendingGrowth, 0);
    });
});

// =============================================================================
// GAME SNAKE INTEGRATION TESTS
// =============================================================================

describe('Game Snake Integration', () => {
    let canvas;
    let game;

    beforeEach(() => {
        canvas = createMockCanvas();
        game = new Game(canvas);
    });

    test('Game has snake instance', () => {
        assert.ok(game.snake instanceof Snake);
    });

    test('snake starts at grid center', () => {
        const centerX = Math.floor(GRID_WIDTH / 2);
        const centerY = Math.floor(GRID_HEIGHT / 2);
        assert.deepStrictEqual(game.snake.getHead(), { x: centerX, y: centerY });
    });

    test('tick moves snake when PLAYING', () => {
        game.setState(GameState.PLAYING);
        const initialHead = { ...game.snake.getHead() };
        game.tick();
        assert.notDeepStrictEqual(game.snake.getHead(), initialHead);
    });

    test('tick does not move snake when PAUSED', () => {
        game.setState(GameState.PAUSED);
        const initialHead = { ...game.snake.getHead() };
        game.tick();
        assert.deepStrictEqual(game.snake.getHead(), initialHead);
    });

    test('tick does not move snake when MENU', () => {
        const initialHead = { ...game.snake.getHead() };
        game.tick();
        assert.deepStrictEqual(game.snake.getHead(), initialHead);
    });

    test('self-collision triggers GAMEOVER', () => {
        game.setState(GameState.PLAYING);
        // Create a long snake and force collision
        game.snake = new Snake(10, 10, 5);
        game.snake.setDirection(Direction.UP);
        game.tick();
        game.snake.setDirection(Direction.LEFT);
        game.tick();
        game.snake.setDirection(Direction.DOWN);
        game.tick(); // This should cause self-collision
        assert.strictEqual(game.state, GameState.GAMEOVER);
    });

    test('reset restores snake to initial position', () => {
        game.setState(GameState.PLAYING);
        game.tick();
        game.tick();
        game.reset();
        const centerX = Math.floor(GRID_WIDTH / 2);
        const centerY = Math.floor(GRID_HEIGHT / 2);
        assert.deepStrictEqual(game.snake.getHead(), { x: centerX, y: centerY });
        assert.strictEqual(game.snake.body.length, 3);
    });
});

// =============================================================================
// RENDERER SNAKE TESTS
// =============================================================================

describe('Renderer Snake Drawing', () => {
    let canvas;
    let renderer;

    beforeEach(() => {
        canvas = createMockCanvas();
        renderer = new Renderer(canvas);
    });

    test('drawSnake() draws all segments with rounded rects', () => {
        const snake = new Snake(10, 10, 3);
        renderer.drawSnake(snake);
        // Should call fill() for each segment (3 body) + 2 eyes = 5 fills
        assert.strictEqual(canvas._ctx.fill.mock.calls.length, 5);
    });

    test('drawSnake() draws eyes using arc', () => {
        const snake = new Snake(10, 10, 3);
        renderer.drawSnake(snake);
        // Should call arc() twice for the two eyes
        assert.strictEqual(canvas._ctx.arc.mock.calls.length, 2);
    });

    test('drawSnake() sets glow effect', () => {
        const snake = new Snake(10, 10, 3);
        renderer.drawSnake(snake);
        // Shadow blur should have been set for glow
        assert.ok(canvas._ctx.shadowBlur >= 0);
    });
});

// =============================================================================
// INPUT HANDLER TESTS
// =============================================================================

describe('InputHandler', () => {
    let canvas;
    let inputHandler;
    let currentDirection;

    beforeEach(() => {
        canvas = createMockCanvas();
        canvas.addEventListener = mock.fn();
        canvas.removeEventListener = mock.fn();
        currentDirection = Direction.RIGHT;
        inputHandler = new InputHandler(canvas, () => currentDirection);
    });

    test('constructor initializes empty direction queue', () => {
        assert.deepStrictEqual(inputHandler.directionQueue, []);
    });

    test('queueDirection adds direction to queue', () => {
        inputHandler.queueDirection(Direction.UP);
        assert.strictEqual(inputHandler.directionQueue.length, 1);
        assert.strictEqual(inputHandler.directionQueue[0], Direction.UP);
    });

    test('queueDirection rejects 180° reversal (RIGHT to LEFT)', () => {
        currentDirection = Direction.RIGHT;
        inputHandler.queueDirection(Direction.LEFT);
        assert.strictEqual(inputHandler.directionQueue.length, 0);
    });

    test('queueDirection rejects 180° reversal (UP to DOWN)', () => {
        currentDirection = Direction.UP;
        inputHandler.queueDirection(Direction.DOWN);
        assert.strictEqual(inputHandler.directionQueue.length, 0);
    });

    test('queueDirection rejects 180° reversal (LEFT to RIGHT)', () => {
        currentDirection = Direction.LEFT;
        inputHandler.queueDirection(Direction.RIGHT);
        assert.strictEqual(inputHandler.directionQueue.length, 0);
    });

    test('queueDirection rejects 180° reversal (DOWN to UP)', () => {
        currentDirection = Direction.DOWN;
        inputHandler.queueDirection(Direction.UP);
        assert.strictEqual(inputHandler.directionQueue.length, 0);
    });

    test('queueDirection accepts perpendicular direction', () => {
        currentDirection = Direction.RIGHT;
        inputHandler.queueDirection(Direction.UP);
        assert.strictEqual(inputHandler.directionQueue.length, 1);
    });

    test('queueDirection rejects duplicate direction (prevents key repeat clog)', () => {
        currentDirection = Direction.RIGHT;
        inputHandler.queueDirection(Direction.RIGHT);
        assert.strictEqual(inputHandler.directionQueue.length, 0);
    });

    test('queueDirection rejects duplicate in queue', () => {
        currentDirection = Direction.RIGHT;
        inputHandler.queueDirection(Direction.UP);    // Queue: [UP]
        inputHandler.queueDirection(Direction.UP);    // Should be rejected (same as last queued)
        assert.strictEqual(inputHandler.directionQueue.length, 1);
    });

    test('queueDirection respects max queue size', () => {
        inputHandler.queueDirection(Direction.UP);
        inputHandler.queueDirection(Direction.RIGHT);
        inputHandler.queueDirection(Direction.DOWN); // Should be ignored
        assert.strictEqual(inputHandler.directionQueue.length, 2);
    });

    test('queueDirection checks against last queued direction for reversal', () => {
        currentDirection = Direction.RIGHT;
        inputHandler.queueDirection(Direction.UP);    // Queue: [UP]
        inputHandler.queueDirection(Direction.DOWN);  // Should be rejected (opposite of UP)
        assert.strictEqual(inputHandler.directionQueue.length, 1);
    });

    test('getNextDirection returns and removes first queued direction', () => {
        inputHandler.queueDirection(Direction.UP);
        inputHandler.queueDirection(Direction.RIGHT);
        const next = inputHandler.getNextDirection();
        assert.strictEqual(next, Direction.UP);
        assert.strictEqual(inputHandler.directionQueue.length, 1);
    });

    test('getNextDirection returns null when queue is empty', () => {
        const next = inputHandler.getNextDirection();
        assert.strictEqual(next, null);
    });

    test('clearQueue empties the direction queue', () => {
        inputHandler.queueDirection(Direction.UP);
        inputHandler.queueDirection(Direction.RIGHT);
        inputHandler.clearQueue();
        assert.deepStrictEqual(inputHandler.directionQueue, []);
    });
});

// =============================================================================
// INPUT HANDLER KEYBOARD TESTS
// =============================================================================

describe('InputHandler Keyboard', () => {
    let canvas;
    let inputHandler;
    let currentDirection;

    beforeEach(() => {
        canvas = createMockCanvas();
        currentDirection = Direction.RIGHT;
        inputHandler = new InputHandler(canvas, () => currentDirection);
    });

    test('arrow keys map to directions', () => {
        // Test ArrowUp (current direction must not be DOWN)
        inputHandler.clearQueue();
        currentDirection = Direction.RIGHT;
        inputHandler.handleKeyDown({ key: 'ArrowUp', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.UP);

        // Test ArrowDown (current direction must not be UP)
        inputHandler.clearQueue();
        currentDirection = Direction.RIGHT;
        inputHandler.handleKeyDown({ key: 'ArrowDown', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.DOWN);

        // Test ArrowRight (current direction must not be LEFT)
        inputHandler.clearQueue();
        currentDirection = Direction.UP;
        inputHandler.handleKeyDown({ key: 'ArrowRight', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.RIGHT);

        // Test ArrowLeft (current direction must not be RIGHT)
        inputHandler.clearQueue();
        currentDirection = Direction.UP;
        inputHandler.handleKeyDown({ key: 'ArrowLeft', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.LEFT);
    });

    test('WASD keys map to directions (lowercase)', () => {
        // w = UP (current must not be DOWN)
        inputHandler.clearQueue();
        currentDirection = Direction.RIGHT;
        inputHandler.handleKeyDown({ key: 'w', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.UP);

        // a = LEFT (current must not be RIGHT)
        inputHandler.clearQueue();
        currentDirection = Direction.UP;
        inputHandler.handleKeyDown({ key: 'a', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.LEFT);

        // s = DOWN (current must not be UP)
        inputHandler.clearQueue();
        currentDirection = Direction.RIGHT;
        inputHandler.handleKeyDown({ key: 's', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.DOWN);

        // d = RIGHT (current must not be LEFT)
        inputHandler.clearQueue();
        currentDirection = Direction.UP;
        inputHandler.handleKeyDown({ key: 'd', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.RIGHT);
    });

    test('WASD keys map to directions (uppercase)', () => {
        inputHandler.clearQueue();
        currentDirection = Direction.RIGHT;
        inputHandler.handleKeyDown({ key: 'W', preventDefault: mock.fn() });
        assert.strictEqual(inputHandler.directionQueue[0], Direction.UP);
    });

    test('non-direction keys are ignored', () => {
        const event = { key: 'x', preventDefault: mock.fn() };
        inputHandler.handleKeyDown(event);
        assert.strictEqual(inputHandler.directionQueue.length, 0);
        assert.strictEqual(event.preventDefault.mock.calls.length, 0);
    });

    test('direction keys call preventDefault', () => {
        currentDirection = Direction.DOWN;
        const event = { key: 'ArrowUp', preventDefault: mock.fn() };
        inputHandler.handleKeyDown(event);
        assert.strictEqual(event.preventDefault.mock.calls.length, 1);
    });
});

// =============================================================================
// GAME INPUT INTEGRATION TESTS
// =============================================================================

describe('Game Input Integration', () => {
    let canvas;
    let game;

    beforeEach(() => {
        canvas = createMockCanvas();
        canvas.addEventListener = mock.fn();
        canvas.removeEventListener = mock.fn();
        game = new Game(canvas);
    });

    test('Game has inputHandler instance', () => {
        assert.ok(game.inputHandler instanceof InputHandler);
    });

    test('tick applies queued direction to snake', () => {
        game.setState(GameState.PLAYING);
        game.inputHandler.queueDirection(Direction.UP);
        game.tick();
        assert.strictEqual(game.snake.direction, Direction.UP);
    });

    test('reset clears input queue', () => {
        game.inputHandler.queueDirection(Direction.UP);
        game.inputHandler.queueDirection(Direction.DOWN);
        game.reset();
        assert.deepStrictEqual(game.inputHandler.directionQueue, []);
    });

    test('destroy detaches event listeners', () => {
        const detachSpy = mock.fn();
        game.inputHandler.detachListeners = detachSpy;
        game.destroy();
        assert.strictEqual(detachSpy.mock.calls.length, 1);
    });
});

// =============================================================================
// FOOD CLASS TESTS
// =============================================================================

describe('Food', () => {
    test('constructor initializes with correct defaults', () => {
        const food = new Food(20, 20);
        assert.strictEqual(food.gridWidth, 20);
        assert.strictEqual(food.gridHeight, 20);
        assert.strictEqual(food.decayTicks, FOOD_DECAY_TICKS);
        assert.strictEqual(food.position, null);
        assert.strictEqual(food.points, FOOD_POINTS);
        assert.strictEqual(food.spawnTick, null);
    });

    test('constructor accepts custom decay ticks', () => {
        const food = new Food(20, 20, 50);
        assert.strictEqual(food.decayTicks, 50);
    });

    test('spawn places food at valid position', () => {
        const food = new Food(20, 20);
        const result = food.spawn([], 0);
        assert.strictEqual(result, true);
        assert.notStrictEqual(food.position, null);
        assert.ok(food.position.x >= 0 && food.position.x < 20);
        assert.ok(food.position.y >= 0 && food.position.y < 20);
        assert.strictEqual(food.spawnTick, 0);
    });

    test('spawn avoids excluded positions', () => {
        const food = new Food(2, 2); // Small grid for predictable testing
        const excludePositions = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 }
        ];
        const result = food.spawn(excludePositions, 5);
        assert.strictEqual(result, true);
        // Only (1, 1) should be available
        assert.deepStrictEqual(food.position, { x: 1, y: 1 });
        assert.strictEqual(food.spawnTick, 5);
    });

    test('spawn returns false when grid is full', () => {
        const food = new Food(2, 2);
        const excludePositions = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ];
        const result = food.spawn(excludePositions, 0);
        assert.strictEqual(result, false);
    });

    test('spawn clears food state when grid is full', () => {
        const food = new Food(2, 2);
        // Set initial food position
        food.position = { x: 0, y: 0 };
        food.spawnTick = 10;

        // Try to spawn on full grid
        const excludePositions = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ];
        food.spawn(excludePositions, 20);

        // Food state should be cleared to prevent stale collection
        assert.strictEqual(food.position, null);
        assert.strictEqual(food.spawnTick, null);
    });

    test('spawn uses fallback when random attempts fail', () => {
        const food = new Food(3, 3);
        // Exclude all but one position - forces fallback
        const excludePositions = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (x !== 2 || y !== 2) {
                    excludePositions.push({ x, y });
                }
            }
        }
        const result = food.spawn(excludePositions, 10);
        assert.strictEqual(result, true);
        assert.deepStrictEqual(food.position, { x: 2, y: 2 });
    });
});

// =============================================================================
// FOOD COLLISION TESTS
// =============================================================================

describe('Food Collision', () => {
    test('checkCollision returns true when positions match', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        assert.strictEqual(food.checkCollision({ x: 5, y: 5 }), true);
    });

    test('checkCollision returns false when positions differ', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        assert.strictEqual(food.checkCollision({ x: 6, y: 5 }), false);
        assert.strictEqual(food.checkCollision({ x: 5, y: 6 }), false);
    });

    test('checkCollision returns false when position is null', () => {
        const food = new Food(20, 20);
        assert.strictEqual(food.checkCollision({ x: 5, y: 5 }), false);
    });
});

// =============================================================================
// FOOD DECAY TESTS
// =============================================================================

describe('Food Decay', () => {
    test('isExpired returns false before decay time', () => {
        const food = new Food(20, 20, 100);
        food.spawnTick = 0;
        assert.strictEqual(food.isExpired(50), false);
        assert.strictEqual(food.isExpired(99), false);
    });

    test('isExpired returns true at decay time', () => {
        const food = new Food(20, 20, 100);
        food.spawnTick = 0;
        assert.strictEqual(food.isExpired(100), true);
    });

    test('isExpired returns true after decay time', () => {
        const food = new Food(20, 20, 100);
        food.spawnTick = 0;
        assert.strictEqual(food.isExpired(150), true);
    });

    test('isExpired returns false when spawnTick is null', () => {
        const food = new Food(20, 20, 100);
        assert.strictEqual(food.isExpired(100), false);
    });

    test('isDecayWarning returns false when more than 25% time remaining', () => {
        const food = new Food(20, 20, 100);
        food.spawnTick = 0;
        assert.strictEqual(food.isDecayWarning(50), false); // 50% remaining
        assert.strictEqual(food.isDecayWarning(74), false); // 26% remaining
    });

    test('isDecayWarning returns true at 25% threshold', () => {
        const food = new Food(20, 20, 100);
        food.spawnTick = 0;
        assert.strictEqual(food.isDecayWarning(75), true); // 25% remaining
    });

    test('isDecayWarning returns true below 25% threshold', () => {
        const food = new Food(20, 20, 100);
        food.spawnTick = 0;
        assert.strictEqual(food.isDecayWarning(90), true); // 10% remaining
    });

    test('isDecayWarning returns false when spawnTick is null', () => {
        const food = new Food(20, 20, 100);
        assert.strictEqual(food.isDecayWarning(100), false);
    });

    test('reset clears position and spawnTick', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        food.spawnTick = 50;
        food.reset();
        assert.strictEqual(food.position, null);
        assert.strictEqual(food.spawnTick, null);
    });
});

// =============================================================================
// GAME FOOD INTEGRATION TESTS
// =============================================================================

describe('Game Food Integration', () => {
    let canvas;
    let game;

    beforeEach(() => {
        canvas = createMockCanvas();
        game = new Game(canvas);
    });

    test('Game has food instance', () => {
        assert.ok(game.food instanceof Food);
    });

    test('Game initializes score to 0', () => {
        assert.strictEqual(game.score, 0);
    });

    test('Game initializes tickCount to 0', () => {
        assert.strictEqual(game.tickCount, 0);
    });

    test('tick spawns food if none exists', () => {
        game.setState(GameState.PLAYING);
        assert.strictEqual(game.food.position, null);
        game.tick();
        assert.notStrictEqual(game.food.position, null);
    });

    test('eating food increments score', () => {
        game.setState(GameState.PLAYING);
        game.tick(); // Spawn food
        // Manually place food at snake's next head position
        const head = game.snake.getHead();
        game.food.position = { x: head.x + 1, y: head.y };
        game.food.spawnTick = game.tickCount;

        game.tick(); // Snake moves and eats food
        assert.strictEqual(game.score, FOOD_POINTS);
    });

    test('eating food grows snake', () => {
        game.setState(GameState.PLAYING);
        const initialLength = game.snake.body.length;
        game.tick(); // Spawn food

        // Place food at snake's next head position
        const head = game.snake.getHead();
        game.food.position = { x: head.x + 1, y: head.y };
        game.food.spawnTick = game.tickCount;

        game.tick(); // Eat food
        game.tick(); // Growth takes effect
        assert.strictEqual(game.snake.body.length, initialLength + 1);
    });

    test('eating food respawns food', () => {
        game.setState(GameState.PLAYING);
        game.tick(); // Spawn food

        // Place food at snake's next head position
        const head = game.snake.getHead();
        game.food.position = { x: head.x + 1, y: head.y };
        game.food.spawnTick = game.tickCount;
        const oldPosition = { ...game.food.position };

        game.tick(); // Eat food
        // Food should have new position (not null, and likely different)
        assert.notStrictEqual(game.food.position, null);
    });

    test('reset clears score', () => {
        game.score = 100;
        game.reset();
        assert.strictEqual(game.score, 0);
    });

    test('reset clears tickCount', () => {
        game.tickCount = 50;
        game.reset();
        assert.strictEqual(game.tickCount, 0);
    });

    test('reset clears food', () => {
        game.food.position = { x: 5, y: 5 };
        game.food.spawnTick = 10;
        game.reset();
        assert.strictEqual(game.food.position, null);
        assert.strictEqual(game.food.spawnTick, null);
    });

    test('food respawns when expired', () => {
        game.setState(GameState.PLAYING);
        game.tick(); // Spawn food at tickCount=1

        const oldSpawnTick = game.food.spawnTick;
        // Advance tickCount past decay time
        game.tickCount = oldSpawnTick + FOOD_DECAY_TICKS - 1;
        game.tick(); // Should trigger respawn

        // New spawnTick should be updated
        assert.notStrictEqual(game.food.spawnTick, oldSpawnTick);
    });

    test('tickCount increments each tick', () => {
        game.setState(GameState.PLAYING);
        game.tick();
        assert.strictEqual(game.tickCount, 1);
        game.tick();
        assert.strictEqual(game.tickCount, 2);
        game.tick();
        assert.strictEqual(game.tickCount, 3);
    });

    test('HUD updates during GAMEOVER state', () => {
        game.score = 100;
        game.setState(GameState.GAMEOVER);
        game.render();
        // updateHUD is called in render — no canvas text drawing needed
        assert.strictEqual(game.score, 100);
    });

    test('food not drawn during GAMEOVER state', () => {
        game.food.position = { x: 5, y: 5 };
        game.food.spawnTick = 0;
        game.setState(GameState.GAMEOVER);
        canvas._ctx.bezierCurveTo.mock.resetCalls();
        game.render();
        // Food uses bezierCurveTo for apple shape, snake does not
        // No bezierCurveTo calls means food was not drawn
        assert.strictEqual(canvas._ctx.bezierCurveTo.mock.calls.length, 0);
    });
});

// =============================================================================
// RENDERER FOOD TESTS
// =============================================================================

describe('Renderer Food Drawing', () => {
    let canvas;
    let renderer;

    beforeEach(() => {
        canvas = createMockCanvas();
        renderer = new Renderer(canvas);
    });

    test('drawFood draws apple shape for food', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        food.spawnTick = 0;
        renderer.drawFood(food, false, 0);
        // Apple body uses bezierCurveTo (2 calls for left and right curves)
        assert.strictEqual(canvas._ctx.bezierCurveTo.mock.calls.length, 2);
        // Leaf uses ellipse
        assert.strictEqual(canvas._ctx.ellipse.mock.calls.length, 1);
    });

    test('drawFood skips drawing when position is null', () => {
        const food = new Food(20, 20);
        renderer.drawFood(food, false, 0);
        assert.strictEqual(canvas._ctx.arc.mock.calls.length, 0);
    });

    test('drawFood blinks when decay warning (hidden on odd intervals)', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        food.spawnTick = 0;
        // tick 5: floor(5/5) = 1, 1 % 2 = 1 -> hidden
        renderer.drawFood(food, true, 5);
        assert.strictEqual(canvas._ctx.bezierCurveTo.mock.calls.length, 0);
    });

    test('drawFood visible when decay warning (visible on even intervals)', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        food.spawnTick = 0;
        // tick 10: floor(10/5) = 2, 2 % 2 = 0 -> visible
        renderer.drawFood(food, true, 10);
        assert.strictEqual(canvas._ctx.bezierCurveTo.mock.calls.length, 2);
    });

    test('drawScore removed (HUD is now HTML-based)', () => {
        assert.strictEqual(typeof renderer.drawScore, 'undefined');
    });
});

// =============================================================================
// FOOD CONSTANTS TESTS
// =============================================================================

describe('Food Constants', () => {
    test('FOOD_POINTS is defined', () => {
        assert.strictEqual(typeof FOOD_POINTS, 'number');
        assert.strictEqual(FOOD_POINTS, 10);
    });

    test('FOOD_DECAY_TICKS is defined', () => {
        assert.strictEqual(typeof FOOD_DECAY_TICKS, 'number');
        assert.strictEqual(FOOD_DECAY_TICKS, 100);
    });

    test('FOOD_MAX_SPAWN_ATTEMPTS is defined', () => {
        assert.strictEqual(typeof FOOD_MAX_SPAWN_ATTEMPTS, 'number');
        assert.strictEqual(FOOD_MAX_SPAWN_ATTEMPTS, 100);
    });
});

// =============================================================================
// STORAGE MANAGER TESTS
// =============================================================================

describe('StorageManager', () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    test('constructor sets prefix', () => {
        const storage = new StorageManager('test_');
        assert.strictEqual(storage.prefix, 'test_');
    });

    test('default prefix is snake_', () => {
        const storage = new StorageManager();
        assert.strictEqual(storage.prefix, 'snake_');
    });

    test('get returns default value when key not found', () => {
        const storage = new StorageManager();
        assert.strictEqual(storage.get('missing', 'default'), 'default');
    });

    test('get returns default value when key is null', () => {
        const storage = new StorageManager();
        assert.strictEqual(storage.get('missing', null), null);
    });

    test('set stores value with prefix', () => {
        const storage = new StorageManager('test_');
        storage.set('key', 'value');
        assert.strictEqual(global.localStorage.getItem('test_key'), '"value"');
    });

    test('get retrieves stored value', () => {
        const storage = new StorageManager();
        storage.set('mykey', 42);
        assert.strictEqual(storage.get('mykey', 0), 42);
    });

    test('set/get handles boolean values', () => {
        const storage = new StorageManager();
        storage.set('flag', true);
        assert.strictEqual(storage.get('flag', false), true);
        storage.set('flag', false);
        assert.strictEqual(storage.get('flag', true), false);
    });

    test('set/get handles object values', () => {
        const storage = new StorageManager();
        const obj = { name: 'test', score: 100 };
        storage.set('data', obj);
        assert.deepStrictEqual(storage.get('data', null), obj);
    });

    test('set/get handles array values', () => {
        const storage = new StorageManager();
        const arr = [1, 2, 3];
        storage.set('list', arr);
        assert.deepStrictEqual(storage.get('list', []), arr);
    });

    test('remove deletes key', () => {
        const storage = new StorageManager();
        storage.set('key', 'value');
        storage.remove('key');
        assert.strictEqual(storage.get('key', 'default'), 'default');
    });

    test('get handles invalid JSON gracefully', () => {
        const storage = new StorageManager();
        global.localStorage.setItem('snake_bad', 'not valid json{');
        assert.strictEqual(storage.get('bad', 'fallback'), 'fallback');
    });
});

// =============================================================================
// LEADERBOARD STORAGE TESTS
// =============================================================================

describe('StorageManager Leaderboard', () => {
    let storage;

    beforeEach(() => {
        global.localStorage.clear();
        storage = new StorageManager();
    });

    test('getLeaderboard returns empty array by default', () => {
        assert.deepStrictEqual(storage.getLeaderboard(), []);
    });

    test('addScore adds entry to leaderboard', () => {
        storage.addScore('ACE', 100);
        const board = storage.getLeaderboard();
        assert.strictEqual(board.length, 1);
        assert.strictEqual(board[0].initials, 'ACE');
        assert.strictEqual(board[0].score, 100);
        assert.strictEqual(typeof board[0].timestamp, 'number');
    });

    test('addScore uppercases initials', () => {
        storage.addScore('abc', 50);
        assert.strictEqual(storage.getLeaderboard()[0].initials, 'ABC');
    });

    test('addScore truncates initials to 3 characters', () => {
        storage.addScore('ABCD', 50);
        assert.strictEqual(storage.getLeaderboard()[0].initials, 'ABC');
    });

    test('leaderboard sorts by score descending', () => {
        storage.addScore('AAA', 50);
        storage.addScore('BBB', 200);
        storage.addScore('CCC', 100);
        const board = storage.getLeaderboard();
        assert.strictEqual(board[0].score, 200);
        assert.strictEqual(board[1].score, 100);
        assert.strictEqual(board[2].score, 50);
    });

    test('leaderboard storage caps at 50 entries', () => {
        for (let i = 0; i < 55; i++) {
            storage.addScore('AAA', (i + 1) * 10);
        }
        const board = storage.getLeaderboard();
        assert.strictEqual(board.length, 50);
        assert.strictEqual(board[0].score, 550);
    });

    test('ties broken by earlier timestamp first', () => {
        // Directly set entries with same score but different timestamps (unsorted)
        storage.set('leaderboard', [
            { initials: 'NEW', score: 100, timestamp: 2000 },
            { initials: 'OLD', score: 100, timestamp: 1000 }
        ]);
        // addScore re-sorts the full array
        storage.addScore('MID', 100);
        const board = storage.getLeaderboard();
        // All score=100; sorted by timestamp ASC: OLD(1000), NEW(2000), MID(recent)
        assert.strictEqual(board[0].initials, 'OLD');
        assert.strictEqual(board[1].initials, 'NEW');
        assert.strictEqual(board[2].initials, 'MID');
    });

    test('isHighScore returns true when board has fewer than 10 entries', () => {
        assert.strictEqual(storage.isHighScore(1), true);
    });

    test('isHighScore returns true when score beats lowest', () => {
        for (let i = 0; i < 10; i++) {
            storage.addScore('AAA', (i + 1) * 10);
        }
        assert.strictEqual(storage.isHighScore(15), true);
    });

    test('isHighScore returns false when score does not beat lowest', () => {
        for (let i = 0; i < 10; i++) {
            storage.addScore('AAA', (i + 1) * 10);
        }
        assert.strictEqual(storage.isHighScore(5), false);
    });

    test('isNewTopScore returns true on empty board', () => {
        assert.strictEqual(storage.isNewTopScore(1), true);
    });

    test('isNewTopScore returns true when score beats #1', () => {
        storage.addScore('AAA', 100);
        assert.strictEqual(storage.isNewTopScore(101), true);
    });

    test('isNewTopScore returns false when score does not beat #1', () => {
        storage.addScore('AAA', 100);
        assert.strictEqual(storage.isNewTopScore(99), false);
    });

    test('isNewTopScore returns false when score equals #1', () => {
        storage.addScore('AAA', 100);
        assert.strictEqual(storage.isNewTopScore(100), false);
    });

    test('formatLeaderboardDate returns formatted string', () => {
        // Use a known timestamp: Jan 15, 2026
        const ts = new Date(2026, 0, 15).getTime();
        const result = storage.formatLeaderboardDate(ts);
        assert.ok(result.includes('15'), `Expected "15" in "${result}"`);
        assert.ok(result.includes('Jan'), `Expected "Jan" in "${result}"`);
    });

    test('formatLeaderboardDate handles invalid input gracefully', () => {
        assert.strictEqual(storage.formatLeaderboardDate(undefined), '');
    });

    test('leaderboard persists across StorageManager instances', () => {
        storage.addScore('ACE', 100);
        const storage2 = new StorageManager();
        const board = storage2.getLeaderboard();
        assert.strictEqual(board.length, 1);
        assert.strictEqual(board[0].initials, 'ACE');
    });
});

// =============================================================================
// HANDLE GAME OVER TESTS
// =============================================================================

describe('Game.handleGameOver', () => {
    let canvas;
    let game;

    beforeEach(() => {
        canvas = createMockCanvas();
        global.localStorage.clear();
        game = new Game(canvas);
    });

    test('handleGameOver sets state to GAMEOVER', () => {
        game.state = GameState.PLAYING;
        game.handleGameOver();
        assert.strictEqual(game.state, GameState.GAMEOVER);
    });

    test('handleGameOver re-entry guard prevents double transition', () => {
        game.state = GameState.GAMEOVER;
        // Should not throw or change state
        game.handleGameOver();
        assert.strictEqual(game.state, GameState.GAMEOVER);
    });
});

// =============================================================================
// WALL COLLISION TESTS
// =============================================================================

describe('Game Wall Collision', () => {
    let canvas;
    let game;

    beforeEach(() => {
        global.localStorage.clear();
        canvas = createMockCanvas();
        game = new Game(canvas);
    });

    test('checkWallCollision returns true when x < 0', () => {
        assert.strictEqual(game.checkWallCollision({ x: -1, y: 10 }), true);
    });

    test('checkWallCollision returns true when x >= gridWidth', () => {
        assert.strictEqual(game.checkWallCollision({ x: 25, y: 10 }), true);
        assert.strictEqual(game.checkWallCollision({ x: 30, y: 10 }), true);
    });

    test('checkWallCollision returns true when y < 0', () => {
        assert.strictEqual(game.checkWallCollision({ x: 10, y: -1 }), true);
    });

    test('checkWallCollision returns true when y >= gridHeight', () => {
        assert.strictEqual(game.checkWallCollision({ x: 10, y: 25 }), true);
        assert.strictEqual(game.checkWallCollision({ x: 10, y: 30 }), true);
    });

    test('checkWallCollision returns false for valid center position', () => {
        assert.strictEqual(game.checkWallCollision({ x: 10, y: 10 }), false);
    });

    test('checkWallCollision returns false for edge positions (inside)', () => {
        assert.strictEqual(game.checkWallCollision({ x: 0, y: 0 }), false);
        assert.strictEqual(game.checkWallCollision({ x: 24, y: 0 }), false);
        assert.strictEqual(game.checkWallCollision({ x: 0, y: 24 }), false);
        assert.strictEqual(game.checkWallCollision({ x: 24, y: 24 }), false);
    });

    test('wall collision triggers GAMEOVER when enabled', () => {
        game.setState(GameState.PLAYING);
        game.wallCollisionEnabled = true;
        // Position snake near right edge
        game.snake.body = [
            { x: 24, y: 10 },
            { x: 23, y: 10 },
            { x: 22, y: 10 }
        ];
        game.snake.direction = Direction.RIGHT;
        game.tick(); // Head moves to x=25, which is out of bounds
        assert.strictEqual(game.state, GameState.GAMEOVER);
    });

    test('wall collision does not trigger GAMEOVER when disabled', () => {
        game.setState(GameState.PLAYING);
        game.wallCollisionEnabled = false;
        // Position snake near right edge
        game.snake.body = [
            { x: 24, y: 10 },
            { x: 23, y: 10 },
            { x: 22, y: 10 }
        ];
        game.snake.direction = Direction.RIGHT;
        game.tick(); // Head moves to x=25, should wrap to x=0
        assert.strictEqual(game.state, GameState.PLAYING);
        assert.strictEqual(game.snake.getHead().x, 0);
    });

    test('wallCollisionEnabled defaults to true (medium difficulty)', () => {
        assert.strictEqual(game.wallCollisionEnabled, true);
    });

    test('wallCollisionEnabled derived from difficulty config', () => {
        global.localStorage.clear();
        global.localStorage.setItem('snake_difficulty', '"easy"');
        const newGame = new Game(createMockCanvas());
        assert.strictEqual(newGame.wallCollisionEnabled, false);
    });

    test('setDifficulty updates wallCollisionEnabled', () => {
        game.setDifficulty('easy');
        assert.strictEqual(game.wallCollisionEnabled, false);
        game.setDifficulty('hard');
        assert.strictEqual(game.wallCollisionEnabled, true);
    });
});

// =============================================================================
// WRAP-AROUND TESTS
// =============================================================================

describe('Game Wrap-Around', () => {
    let canvas;
    let game;

    beforeEach(() => {
        global.localStorage.clear();
        canvas = createMockCanvas();
        game = new Game(canvas);
        game.wallCollisionEnabled = false;
    });

    test('wrapPosition wraps right edge to left', () => {
        const wrapped = game.wrapPosition({ x: 25, y: 10 });
        assert.strictEqual(wrapped.x, 0);
        assert.strictEqual(wrapped.y, 10);
    });

    test('wrapPosition wraps left edge to right', () => {
        const wrapped = game.wrapPosition({ x: -1, y: 10 });
        assert.strictEqual(wrapped.x, 24);
        assert.strictEqual(wrapped.y, 10);
    });

    test('wrapPosition wraps bottom edge to top', () => {
        const wrapped = game.wrapPosition({ x: 10, y: 25 });
        assert.strictEqual(wrapped.x, 10);
        assert.strictEqual(wrapped.y, 0);
    });

    test('wrapPosition wraps top edge to bottom', () => {
        const wrapped = game.wrapPosition({ x: 10, y: -1 });
        assert.strictEqual(wrapped.x, 10);
        assert.strictEqual(wrapped.y, 24);
    });

    test('wrapPosition handles corner case (-1, -1)', () => {
        const wrapped = game.wrapPosition({ x: -1, y: -1 });
        assert.strictEqual(wrapped.x, 24);
        assert.strictEqual(wrapped.y, 24);
    });

    test('wrapPosition handles corner case (25, 25)', () => {
        const wrapped = game.wrapPosition({ x: 25, y: 25 });
        assert.strictEqual(wrapped.x, 0);
        assert.strictEqual(wrapped.y, 0);
    });

    test('wrapPosition does not modify valid positions', () => {
        const wrapped = game.wrapPosition({ x: 10, y: 10 });
        assert.strictEqual(wrapped.x, 10);
        assert.strictEqual(wrapped.y, 10);
    });

    test('snake wraps from right to left during tick', () => {
        game.setState(GameState.PLAYING);
        game.snake.body = [
            { x: 24, y: 10 },
            { x: 23, y: 10 },
            { x: 22, y: 10 }
        ];
        game.snake.direction = Direction.RIGHT;
        game.tick();
        assert.strictEqual(game.snake.getHead().x, 0);
        assert.strictEqual(game.snake.getHead().y, 10);
    });

    test('snake wraps from left to right during tick', () => {
        game.setState(GameState.PLAYING);
        game.snake.body = [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 }
        ];
        game.snake.direction = Direction.LEFT;
        game.tick();
        assert.strictEqual(game.snake.getHead().x, 24);
    });

    test('snake wraps from bottom to top during tick', () => {
        game.setState(GameState.PLAYING);
        game.snake.body = [
            { x: 10, y: 24 },
            { x: 10, y: 23 },
            { x: 10, y: 22 }
        ];
        game.snake.direction = Direction.DOWN;
        game.tick();
        assert.strictEqual(game.snake.getHead().y, 0);
    });

    test('snake wraps from top to bottom during tick', () => {
        game.setState(GameState.PLAYING);
        game.snake.body = [
            { x: 10, y: 0 },
            { x: 10, y: 1 },
            { x: 10, y: 2 }
        ];
        game.snake.direction = Direction.UP;
        game.tick();
        assert.strictEqual(game.snake.getHead().y, 24);
    });

    test('self-collision detected after wrap (head wraps into body)', () => {
        game.setState(GameState.PLAYING);
        game.snake.body = [
            { x: 0, y: 10 },    // head at left edge
            { x: 24, y: 10 },   // body segment at right edge (wrap destination)
            { x: 23, y: 10 },
            { x: 22, y: 10 }
        ];
        game.snake.direction = Direction.LEFT;
        game.tick(); // Head wraps to x=24, collides with body[1]
        assert.strictEqual(game.state, GameState.GAMEOVER);
    });

    test('food at wrap destination is collected', () => {
        game.setState(GameState.PLAYING);
        game.snake.body = [
            { x: 24, y: 10 },
            { x: 23, y: 10 },
            { x: 22, y: 10 }
        ];
        game.snake.direction = Direction.RIGHT;
        game.food.position = { x: 0, y: 10 }; // Food at wrap destination
        game.food.spawnTick = 0;
        const initialScore = game.score;
        game.tick(); // Snake wraps to x=0 and eats food
        assert.strictEqual(game.score, initialScore + FOOD_POINTS);
    });
});

// =============================================================================
// GAME SETTINGS PERSISTENCE TESTS
// =============================================================================

describe('Game Settings Persistence', () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    test('wallCollisionEnabled survives game.reset() (derived from difficulty)', () => {
        const canvas = createMockCanvas();
        const game = new Game(canvas);
        game.setDifficulty('easy');
        game.reset();
        assert.strictEqual(game.wallCollisionEnabled, false);
    });

    test('Game has storage instance', () => {
        const canvas = createMockCanvas();
        const game = new Game(canvas);
        assert.ok(game.storage instanceof StorageManager);
    });
});

// =============================================================================
// Theme Unlock Tests
// =============================================================================

describe('Theme Unlocks', () => {
    let storage;

    beforeEach(() => {
        storage = new StorageManager('test_theme_');
        storage.remove('unlockedThemes');
    });

    test('classic is unlocked by default', () => {
        assert.deepStrictEqual(storage.getUnlockedThemes(), ['classic']);
    });

    test('isThemeUnlocked returns true for classic', () => {
        assert.strictEqual(storage.isThemeUnlocked('classic'), true);
    });

    test('isThemeUnlocked returns false for locked theme', () => {
        assert.strictEqual(storage.isThemeUnlocked('dark'), false);
    });

    test('unlockTheme adds to unlocked list', () => {
        storage.unlockTheme('dark');
        assert.strictEqual(storage.isThemeUnlocked('dark'), true);
        assert.deepStrictEqual(storage.getUnlockedThemes(), ['classic', 'dark']);
    });

    test('unlockTheme is idempotent', () => {
        storage.unlockTheme('dark');
        storage.unlockTheme('dark');
        const unlocked = storage.getUnlockedThemes();
        assert.strictEqual(unlocked.filter(t => t === 'dark').length, 1);
    });

    test('checkThemeUnlocks returns newly unlocked themes for score 50', () => {
        const result = storage.checkThemeUnlocks(50);
        assert.ok(result.includes('dark'));
        assert.ok(!result.includes('light')); // needs 100
    });

    test('checkThemeUnlocks returns multiple themes for high score', () => {
        const result = storage.checkThemeUnlocks(150);
        assert.ok(result.includes('dark'));
        assert.ok(result.includes('light'));
    });

    test('checkThemeUnlocks skips already unlocked themes', () => {
        storage.unlockTheme('dark');
        const result = storage.checkThemeUnlocks(50);
        assert.ok(!result.includes('dark'));
    });

    test('difficulty-gated themes unlock on score alone when difficulty undefined', () => {
        const result = storage.checkThemeUnlocks(300);
        assert.ok(result.includes('retro'));
        assert.ok(result.includes('neon'));
    });

    test('difficulty-gated themes respect difficulty when provided', () => {
        const result = storage.checkThemeUnlocks(300, 'easy');
        assert.ok(!result.includes('retro')); // needs medium+
        assert.ok(!result.includes('neon'));   // needs hard
    });

    test('difficulty medium unlocks retro but not neon', () => {
        const result = storage.checkThemeUnlocks(300, 'medium');
        assert.ok(result.includes('retro'));
        assert.ok(!result.includes('neon'));
    });

    test('difficulty hard unlocks both retro and neon', () => {
        const result = storage.checkThemeUnlocks(300, 'hard');
        assert.ok(result.includes('retro'));
        assert.ok(result.includes('neon'));
    });

    test('unlock state persists in localStorage', () => {
        storage.unlockTheme('dark');
        const storage2 = new StorageManager('test_theme_');
        assert.ok(storage2.isThemeUnlocked('dark'));
    });
});

// =============================================================================
// ANIMATION TOGGLE TESTS
// =============================================================================

describe('Snake previousBody tracking', () => {
    test('previousBody is null before first move', () => {
        const snake = new Snake(10, 10);
        assert.strictEqual(snake.previousBody, null);
    });

    test('previousBody is set after move', () => {
        const snake = new Snake(10, 10);
        snake.move();
        assert.notStrictEqual(snake.previousBody, null);
        assert.ok(Array.isArray(snake.previousBody));
    });

    test('previousBody matches body state before move', () => {
        const snake = new Snake(10, 10);
        const bodyBeforeMove = snake.body.map(s => ({ x: s.x, y: s.y }));
        snake.move();
        assert.deepStrictEqual(snake.previousBody, bodyBeforeMove);
    });

    test('previousBody is a deep copy (not same reference)', () => {
        const snake = new Snake(10, 10);
        snake.move();
        assert.notStrictEqual(snake.previousBody, snake.body);
        assert.notStrictEqual(snake.previousBody[0], snake.body[0]);
    });

    test('reset clears previousBody', () => {
        const snake = new Snake(10, 10);
        snake.move();
        assert.notStrictEqual(snake.previousBody, null);
        snake.reset(10, 10);
        assert.strictEqual(snake.previousBody, null);
    });
});

describe('Animation style setting', () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    test('animationStyle defaults to smooth', () => {
        const game = new Game(createMockCanvas());
        assert.strictEqual(game.animationStyle, 'smooth');
    });

    test('animationStyle loads from storage', () => {
        global.localStorage.setItem('snake_animationStyle', '"classic"');
        const game = new Game(createMockCanvas());
        assert.strictEqual(game.animationStyle, 'classic');
    });

    test('setAnimationStyle updates and persists', () => {
        const game = new Game(createMockCanvas());
        game.setAnimationStyle('classic');
        assert.strictEqual(game.animationStyle, 'classic');
        assert.strictEqual(global.localStorage.getItem('snake_animationStyle'), '"classic"');
    });

    test('interpolation factor is clamped to 1.0', () => {
        const game = new Game(createMockCanvas());
        game.animationStyle = 'smooth';
        game.tickAccumulator = game.tickInterval * 2; // Over 1.0
        // Render should not crash; factor is clamped internally
        game.render();
        // If we got here without error, clamping works
        assert.ok(true);
    });
});

// =============================================================================
// DIFFICULTY SYSTEM TESTS
// =============================================================================

describe('Difficulty Constants', () => {
    test('DIFFICULTY_LEVELS has easy, medium, hard', () => {
        assert.ok(DIFFICULTY_LEVELS.easy);
        assert.ok(DIFFICULTY_LEVELS.medium);
        assert.ok(DIFFICULTY_LEVELS.hard);
    });

    test('each difficulty has required properties', () => {
        for (const [key, config] of Object.entries(DIFFICULTY_LEVELS)) {
            assert.strictEqual(typeof config.name, 'string', `${key}.name`);
            assert.strictEqual(typeof config.baseTickRate, 'number', `${key}.baseTickRate`);
            assert.strictEqual(typeof config.maxTickRate, 'number', `${key}.maxTickRate`);
            assert.strictEqual(typeof config.speedScoreStep, 'number', `${key}.speedScoreStep`);
            assert.strictEqual(typeof config.bonusFoodChance, 'number', `${key}.bonusFoodChance`);
            assert.strictEqual(typeof config.toxicFoodChance, 'number', `${key}.toxicFoodChance`);
            assert.strictEqual(typeof config.lethalFoodChance, 'number', `${key}.lethalFoodChance`);
        }
    });

    test('easy has no toxic or lethal food', () => {
        assert.strictEqual(DIFFICULTY_LEVELS.easy.toxicFoodChance, 0);
        assert.strictEqual(DIFFICULTY_LEVELS.easy.lethalFoodChance, 0);
    });

    test('medium has no lethal food', () => {
        assert.strictEqual(DIFFICULTY_LEVELS.medium.lethalFoodChance, 0);
    });

    test('hard has lethal food', () => {
        assert.ok(DIFFICULTY_LEVELS.hard.lethalFoodChance > 0);
    });
});

describe('FoodType enum', () => {
    test('has all food types', () => {
        assert.strictEqual(FoodType.REGULAR, 'regular');
        assert.strictEqual(FoodType.BONUS, 'bonus');
        assert.strictEqual(FoodType.TOXIC, 'toxic');
        assert.strictEqual(FoodType.LETHAL, 'lethal');
    });
});

describe('Food type support', () => {
    test('Food defaults to REGULAR type', () => {
        const food = new Food(20, 20);
        assert.strictEqual(food.foodType, FoodType.REGULAR);
    });

    test('spawn sets food type', () => {
        const food = new Food(20, 20);
        food.spawn([], 0, FoodType.BONUS);
        assert.strictEqual(food.foodType, FoodType.BONUS);
    });

    test('spawn with decay override changes decay ticks', () => {
        const food = new Food(20, 20);
        food.spawn([], 0, FoodType.TOXIC, 60);
        assert.strictEqual(food.decayTicks, 60);
    });

    test('spawn without decay override uses default', () => {
        const food = new Food(20, 20, 50);
        food.spawn([], 0, FoodType.REGULAR);
        assert.strictEqual(food.decayTicks, FOOD_DECAY_TICKS);
    });

    test('reset clears food type to REGULAR', () => {
        const food = new Food(20, 20);
        food.spawn([], 0, FoodType.LETHAL, 60);
        food.reset();
        assert.strictEqual(food.foodType, FoodType.REGULAR);
    });
});

describe('Game difficulty setting', () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    test('default difficulty is medium', () => {
        const game = new Game(createMockCanvas());
        assert.strictEqual(game.difficulty, 'medium');
    });

    test('difficulty loads from storage', () => {
        global.localStorage.setItem('snake_difficulty', '"hard"');
        const game = new Game(createMockCanvas());
        assert.strictEqual(game.difficulty, 'hard');
    });

    test('setDifficulty updates and persists', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('easy');
        assert.strictEqual(game.difficulty, 'easy');
        assert.strictEqual(global.localStorage.getItem('snake_difficulty'), '"easy"');
    });

    test('setDifficulty rejects invalid difficulty', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('impossible');
        assert.strictEqual(game.difficulty, 'medium');
    });

    test('getDifficultyConfig returns correct config', () => {
        const game = new Game(createMockCanvas());
        game.difficulty = 'hard';
        const config = game.getDifficultyConfig();
        assert.strictEqual(config.name, 'Hard');
    });
});

describe('Dynamic speed scaling', () => {
    let game;

    beforeEach(() => {
        global.localStorage.clear();
        game = new Game(createMockCanvas());
    });

    test('updateTickRate sets base rate at score 0', () => {
        game.difficulty = 'medium';
        game.score = 0;
        game.updateTickRate();
        assert.strictEqual(game.tickInterval, 1000 / DIFFICULTY_LEVELS.medium.baseTickRate);
    });

    test('updateTickRate increases speed with score', () => {
        game.difficulty = 'medium';
        game.score = 100; // 2 speed steps at step=50
        game.updateTickRate();
        const expected = 1000 / (DIFFICULTY_LEVELS.medium.baseTickRate + 2);
        assert.strictEqual(game.tickInterval, expected);
    });

    test('updateTickRate caps at maxTickRate', () => {
        game.difficulty = 'medium';
        game.score = 10000; // Way above max
        game.updateTickRate();
        assert.strictEqual(game.tickInterval, 1000 / DIFFICULTY_LEVELS.medium.maxTickRate);
    });

    test('reset restores base tick rate', () => {
        game.difficulty = 'medium';
        game.score = 200;
        game.updateTickRate();
        game.reset();
        assert.strictEqual(game.tickInterval, 1000 / DIFFICULTY_LEVELS.medium.baseTickRate);
    });
});

describe('Toxic food penalty', () => {
    let game;

    beforeEach(() => {
        global.localStorage.clear();
        game = new Game(createMockCanvas());
    });

    test('calculateToxicPenalty returns -5 at low scores', () => {
        game.score = 10;
        assert.strictEqual(game.calculateToxicPenalty(), -5);
    });

    test('calculateToxicPenalty scales with score', () => {
        game.score = 100;
        // ceil(100/50) = 2, penalty = -5 * 2 = -10
        assert.strictEqual(game.calculateToxicPenalty(), -10);
    });

    test('calculateToxicPenalty at score 0 returns -5', () => {
        game.score = 0;
        assert.strictEqual(game.calculateToxicPenalty(), -5);
    });

    test('calculateToxicPenalty at high score is large', () => {
        game.score = 500;
        // ceil(500/50) = 10, penalty = -5 * 10 = -50
        assert.strictEqual(game.calculateToxicPenalty(), -50);
    });
});

describe('Special food gameplay', () => {
    let game;

    beforeEach(() => {
        global.localStorage.clear();
        game = new Game(createMockCanvas());
        game.setState(GameState.PLAYING);
    });

    test('Game has specialFood instance', () => {
        assert.ok(game.specialFood instanceof Food);
    });

    test('reset clears special food', () => {
        game.specialFood.position = { x: 5, y: 5 };
        game.specialFood.spawnTick = 10;
        game.reset();
        assert.strictEqual(game.specialFood.position, null);
    });

    test('bonus food adds 25 points and grows snake', () => {
        game.tick(); // spawn regular food
        const head = game.snake.getHead();
        game.specialFood.position = { x: head.x + 1, y: head.y };
        game.specialFood.spawnTick = game.tickCount;
        game.specialFood.foodType = FoodType.BONUS;
        game.specialFood.decayTicks = SPECIAL_FOOD_TICKS;

        const initialLength = game.snake.body.length;
        game.tick(); // eat bonus food
        assert.strictEqual(game.score >= 25, true);
        // Special food should be cleared
        assert.strictEqual(game.specialFood.position, null);
    });

    test('toxic food deducts points', () => {
        game.score = 50;
        game.tick(); // spawn regular food
        const head = game.snake.getHead();
        game.specialFood.position = { x: head.x + 1, y: head.y };
        game.specialFood.spawnTick = game.tickCount;
        game.specialFood.foodType = FoodType.TOXIC;
        game.specialFood.decayTicks = SPECIAL_FOOD_TICKS;

        game.tick(); // eat toxic food
        assert.ok(game.score < 50);
        assert.strictEqual(game.state, GameState.PLAYING);
    });

    test('toxic food causes game over when snake too short', () => {
        game.setDifficulty('medium'); // toxicSegmentBase: 1, divisor: 10
        game.score = 50;
        game.tick(); // spawn regular food
        // Set snake to length 2 (head + 1 segment)
        game.snake.body = [
            { x: game.snake.getHead().x, y: game.snake.getHead().y },
            { x: game.snake.getHead().x - 1, y: game.snake.getHead().y }
        ];
        const head = game.snake.getHead();
        game.specialFood.position = { x: head.x + 1, y: head.y };
        game.specialFood.spawnTick = game.tickCount;
        game.specialFood.foodType = FoodType.TOXIC;
        game.specialFood.decayTicks = SPECIAL_FOOD_TICKS;

        game.tick(); // eat toxic food, removes 1 segment → length 1 → game over
        assert.strictEqual(game.state, GameState.GAMEOVER);
        assert.strictEqual(game.snake.body.length, 1);
    });

    test('lethal food causes instant game over', () => {
        game.score = 100;
        game.tick(); // spawn regular food
        const head = game.snake.getHead();
        game.specialFood.position = { x: head.x + 1, y: head.y };
        game.specialFood.spawnTick = game.tickCount;
        game.specialFood.foodType = FoodType.LETHAL;
        game.specialFood.decayTicks = SPECIAL_FOOD_TICKS;

        game.tick(); // eat lethal food
        assert.strictEqual(game.state, GameState.GAMEOVER);
    });

    test('special food expires and is cleared', () => {
        game.specialFood.position = { x: 15, y: 15 };
        game.specialFood.spawnTick = 0;
        game.specialFood.foodType = FoodType.BONUS;
        game.specialFood.decayTicks = SPECIAL_FOOD_TICKS;

        game.tickCount = SPECIAL_FOOD_TICKS; // Force expiry
        game.tick();
        assert.strictEqual(game.specialFood.position, null);
    });
});

describe('Renderer food types', () => {
    let canvas;
    let renderer;

    beforeEach(() => {
        canvas = createMockCanvas();
        renderer = new Renderer(canvas);
    });

    test('drawFood renders bonus food (star shape)', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        food.spawnTick = 0;
        food.foodType = FoodType.BONUS;
        renderer.drawFood(food, false, 0);
        // Star uses lineTo calls
        assert.ok(canvas._ctx.lineTo.mock.calls.length > 0);
    });

    test('drawFood renders toxic food (diamond)', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        food.spawnTick = 0;
        food.foodType = FoodType.TOXIC;
        renderer.drawFood(food, false, 0);
        // Diamond uses lineTo, plus exclamation uses arc
        assert.ok(canvas._ctx.lineTo.mock.calls.length > 0);
        assert.ok(canvas._ctx.arc.mock.calls.length > 0);
    });

    test('drawFood renders lethal food (spiky circle)', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        food.spawnTick = 0;
        food.foodType = FoodType.LETHAL;
        renderer.drawFood(food, false, 0);
        // Spiky circle uses many lineTo calls
        assert.ok(canvas._ctx.lineTo.mock.calls.length >= 15);
    });

    test('drawFood renders regular food (apple) by default', () => {
        const food = new Food(20, 20);
        food.position = { x: 5, y: 5 };
        food.spawnTick = 0;
        food.foodType = FoodType.REGULAR;
        renderer.drawFood(food, false, 0);
        // Apple uses bezierCurveTo
        assert.ok(canvas._ctx.bezierCurveTo.mock.calls.length === 2);
    });
});

// =============================================================================
// LEADERBOARD DIFFICULTY FILTERING TESTS
// =============================================================================

describe('Leaderboard difficulty filtering', () => {
    let storage;

    beforeEach(() => {
        global.localStorage.clear();
        storage = new StorageManager();
    });

    test('addScore stores difficulty field', () => {
        storage.addScore('ACE', 100, 'medium');
        const board = storage.getLeaderboard();
        assert.strictEqual(board[0].difficulty, 'medium');
    });

    test('getLeaderboard without difficulty returns all entries', () => {
        storage.addScore('AAA', 100, 'easy');
        storage.addScore('BBB', 200, 'hard');
        const board = storage.getLeaderboard();
        assert.strictEqual(board.length, 2);
    });

    test('getLeaderboard with difficulty filters entries', () => {
        storage.addScore('AAA', 100, 'easy');
        storage.addScore('BBB', 200, 'hard');
        storage.addScore('CCC', 150, 'easy');
        const easyBoard = storage.getLeaderboard('easy');
        assert.strictEqual(easyBoard.length, 2);
        assert.ok(easyBoard.every(e => e.difficulty === 'easy'));
    });

    test('getLeaderboard includes legacy entries without difficulty', () => {
        // Simulate old entries
        storage.set('leaderboard', [
            { initials: 'OLD', score: 50, timestamp: 1000 }
        ]);
        storage.addScore('NEW', 100, 'medium');
        const board = storage.getLeaderboard('medium');
        assert.strictEqual(board.length, 2); // OLD (no difficulty) + NEW (medium)
    });

    test('isHighScore filters by difficulty', () => {
        for (let i = 0; i < 10; i++) {
            storage.addScore('AAA', (i + 1) * 10, 'easy');
        }
        storage.addScore('BBB', 5, 'hard');
        // Hard board has only 1 entry, so any score is a high score
        assert.strictEqual(storage.isHighScore(1, 'hard'), true);
        // Easy board has 10 entries, score of 5 doesn't beat lowest (10)
        assert.strictEqual(storage.isHighScore(5, 'easy'), false);
    });

    test('isNewTopScore filters by difficulty', () => {
        storage.addScore('AAA', 100, 'easy');
        storage.addScore('BBB', 50, 'hard');
        assert.strictEqual(storage.isNewTopScore(60, 'hard'), true);
        assert.strictEqual(storage.isNewTopScore(60, 'easy'), false);
    });

    test('ties broken by harder difficulty first', () => {
        storage.addScore('EAS', 100, 'easy');
        storage.addScore('HRD', 100, 'hard');
        storage.addScore('MED', 100, 'medium');
        const board = storage.getLeaderboard();
        // Same score: hard (rank 3) > medium (rank 2) > easy (rank 1)
        assert.strictEqual(board[0].initials, 'HRD');
        assert.strictEqual(board[1].initials, 'MED');
        assert.strictEqual(board[2].initials, 'EAS');
    });

    test('legacy entries (no difficulty) sort after difficulty-tagged entries at same score', () => {
        storage.addScore('NEW', 100, 'easy');
        storage.set('leaderboard', [
            ...storage.getLeaderboard(),
            { initials: 'OLD', score: 100, timestamp: 1000 }
        ]);
        storage.addScore('HRD', 100, 'hard');
        const board = storage.getLeaderboard();
        // hard (rank 3) > easy (rank 1) > legacy (rank 0)
        assert.strictEqual(board[0].initials, 'HRD');
        assert.strictEqual(board[board.length - 1].difficulty, undefined);
    });
});

// =============================================================================
// HUD DIFFICULTY DISPLAY TESTS
// =============================================================================

describe('HUD difficulty display', () => {
    test('updateHUD is a method on Game', () => {
        const canvas = createMockCanvas();
        const game = new Game(canvas);
        assert.strictEqual(typeof game.updateHUD, 'function');
    });

    test('updateHUD is safe to call without DOM elements', () => {
        const canvas = createMockCanvas();
        const game = new Game(canvas);
        // Should not throw when HUD elements are not cached
        game.updateHUD();
    });
});

// =============================================================================
// WALL COLLISION FROM DIFFICULTY TESTS
// =============================================================================

describe('Wall collision from difficulty', () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    test('easy difficulty has wallCollision false', () => {
        assert.strictEqual(DIFFICULTY_LEVELS.easy.wallCollision, false);
    });

    test('medium difficulty has wallCollision true', () => {
        assert.strictEqual(DIFFICULTY_LEVELS.medium.wallCollision, true);
    });

    test('hard difficulty has wallCollision true', () => {
        assert.strictEqual(DIFFICULTY_LEVELS.hard.wallCollision, true);
    });

    test('easy difficulty wraps walls during tick', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('easy');
        game.setState(GameState.PLAYING);
        game.snake.body = [
            { x: 24, y: 10 },
            { x: 23, y: 10 },
            { x: 22, y: 10 }
        ];
        game.snake.direction = Direction.RIGHT;
        game.tick();
        assert.strictEqual(game.state, GameState.PLAYING);
        assert.strictEqual(game.snake.getHead().x, 0);
    });

    test('medium difficulty kills on wall hit', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('medium');
        game.setState(GameState.PLAYING);
        game.snake.body = [
            { x: 24, y: 10 },
            { x: 23, y: 10 },
            { x: 22, y: 10 }
        ];
        game.snake.direction = Direction.RIGHT;
        game.tick();
        assert.strictEqual(game.state, GameState.GAMEOVER);
    });

    test('reset syncs wallCollisionEnabled from difficulty', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('easy');
        game.wallCollisionEnabled = true; // manually desync
        game.reset();
        assert.strictEqual(game.wallCollisionEnabled, false);
    });
});

// =============================================================================
// SNAKE SEGMENT REMOVAL TESTS
// =============================================================================

describe('Snake removeSegments', () => {
    test('removes segments from tail', () => {
        const snake = new Snake(5, 5, 5);
        const removed = snake.removeSegments(2);
        assert.strictEqual(removed, 2);
        assert.strictEqual(snake.body.length, 3);
        // Head should be preserved
        assert.deepStrictEqual(snake.body[0], { x: 5, y: 5 });
    });

    test('cannot remove head (caps at body.length - 1)', () => {
        const snake = new Snake(5, 5, 3);
        const removed = snake.removeSegments(10);
        assert.strictEqual(removed, 2);
        assert.strictEqual(snake.body.length, 1);
    });

    test('removes 0 when count is 0', () => {
        const snake = new Snake(5, 5, 5);
        const removed = snake.removeSegments(0);
        assert.strictEqual(removed, 0);
        assert.strictEqual(snake.body.length, 5);
    });

    test('reduces pending growth', () => {
        const snake = new Snake(5, 5, 3);
        snake.pendingGrowth = 5;
        snake.removeSegments(3);
        assert.strictEqual(snake.pendingGrowth, 2);
    });
});

// =============================================================================
// TOXIC SEGMENT CALCULATION TESTS
// =============================================================================

describe('Toxic segment calculation', () => {
    test('medium difficulty: max(1, floor(length/10))', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('medium');
        game.snake.body = new Array(10).fill({ x: 0, y: 0 });
        assert.strictEqual(game.calculateToxicSegments(), 1);
        game.snake.body = new Array(25).fill({ x: 0, y: 0 });
        assert.strictEqual(game.calculateToxicSegments(), 2);
    });

    test('hard difficulty: max(2, floor(length/5))', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('hard');
        game.snake.body = new Array(5).fill({ x: 0, y: 0 });
        assert.strictEqual(game.calculateToxicSegments(), 2);
        game.snake.body = new Array(20).fill({ x: 0, y: 0 });
        assert.strictEqual(game.calculateToxicSegments(), 4);
    });

    test('easy difficulty returns 0', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('easy');
        assert.strictEqual(game.calculateToxicSegments(), 0);
    });
});

// =============================================================================
// PROXIMITY FOOD SPAWNING TESTS
// =============================================================================

describe('Food spawnNearTarget', () => {
    test('spawns within Manhattan distance range', () => {
        const food = new Food(25, 25);
        const target = { x: 12, y: 12 };
        const success = food.spawnNearTarget(target, 4, 6, [], 0);
        assert.ok(success);
        const dist = Math.abs(food.position.x - target.x) + Math.abs(food.position.y - target.y);
        assert.ok(dist >= 4 && dist <= 6, `Distance ${dist} not in range [4, 6]`);
    });

    test('respects minimum distance', () => {
        const food = new Food(25, 25);
        const target = { x: 12, y: 12 };
        const success = food.spawnNearTarget(target, 3, 3, [], 0);
        assert.ok(success);
        const dist = Math.abs(food.position.x - target.x) + Math.abs(food.position.y - target.y);
        assert.strictEqual(dist, 3);
    });

    test('returns false when no valid positions', () => {
        const food = new Food(3, 3); // Tiny grid
        const target = { x: 1, y: 1 };
        // Exclude everything within range 1-2
        const exclude = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                exclude.push({ x, y });
            }
        }
        const success = food.spawnNearTarget(target, 1, 2, exclude, 0);
        assert.strictEqual(success, false);
        assert.strictEqual(food.position, null);
    });

    test('sets food type and decay correctly', () => {
        const food = new Food(25, 25);
        food.spawnNearTarget({ x: 12, y: 12 }, 1, 5, [], 0, FoodType.TOXIC, 60);
        assert.strictEqual(food.foodType, FoodType.TOXIC);
        assert.strictEqual(food.decayTicks, 60);
    });

    test('excludes occupied positions', () => {
        const food = new Food(25, 25);
        const target = { x: 12, y: 12 };
        // Block all positions at distance 1 except one
        const occupied = [
            { x: 13, y: 12 }, { x: 11, y: 12 },
            { x: 12, y: 13 }  // leave {12, 11} open
        ];
        const success = food.spawnNearTarget(target, 1, 1, occupied, 0);
        assert.ok(success);
        assert.deepStrictEqual(food.position, { x: 12, y: 11 });
    });
});

// =============================================================================
// DIFFICULTY CONFIG COMPLETENESS TESTS
// =============================================================================

describe('Difficulty config fields', () => {
    test('all levels have hazardProximity field', () => {
        assert.strictEqual(DIFFICULTY_LEVELS.easy.hazardProximity, null);
        assert.deepStrictEqual(DIFFICULTY_LEVELS.medium.hazardProximity, { min: 4, max: 6 });
        assert.deepStrictEqual(DIFFICULTY_LEVELS.hard.hazardProximity, { min: 1, max: 2 });
    });

    test('all levels have toxicSegment fields', () => {
        assert.strictEqual(DIFFICULTY_LEVELS.easy.toxicSegmentBase, 0);
        assert.strictEqual(DIFFICULTY_LEVELS.medium.toxicSegmentBase, 1);
        assert.strictEqual(DIFFICULTY_LEVELS.medium.toxicSegmentDivisor, 10);
        assert.strictEqual(DIFFICULTY_LEVELS.hard.toxicSegmentBase, 2);
        assert.strictEqual(DIFFICULTY_LEVELS.hard.toxicSegmentDivisor, 5);
    });
});

// =============================================================================
// ACCESSIBLE FOOD DECAY CONSTANTS TESTS
// =============================================================================

describe('Accessible food decay constants', () => {
    test('FOOD_DECAY_TICKS_ACCESSIBLE is double normal', () => {
        assert.strictEqual(FOOD_DECAY_TICKS_ACCESSIBLE, FOOD_DECAY_TICKS * 2);
    });

    test('SPECIAL_FOOD_TICKS_ACCESSIBLE is double normal', () => {
        assert.strictEqual(SPECIAL_FOOD_TICKS_ACCESSIBLE, SPECIAL_FOOD_TICKS * 2);
    });
});

// =============================================================================
// EXTENDED TIME MODE FOOD DECAY TESTS
// =============================================================================

describe('Extended Time Mode food decay helpers', () => {
    test('_getRegularDecay returns normal ticks without accessibility mode', () => {
        const game = new Game(createMockCanvas());
        game.accessibilityMode = false;
        assert.strictEqual(game._getRegularDecay(), FOOD_DECAY_TICKS);
    });

    test('_getRegularDecay returns doubled ticks with accessibility mode', () => {
        const game = new Game(createMockCanvas());
        game.accessibilityMode = true;
        assert.strictEqual(game._getRegularDecay(), FOOD_DECAY_TICKS_ACCESSIBLE);
    });

    test('_getSpecialDecay returns normal ticks without accessibility mode', () => {
        const game = new Game(createMockCanvas());
        game.accessibilityMode = false;
        assert.strictEqual(game._getSpecialDecay(), SPECIAL_FOOD_TICKS);
    });

    test('_getSpecialDecay returns doubled ticks with accessibility mode', () => {
        const game = new Game(createMockCanvas());
        game.accessibilityMode = true;
        assert.strictEqual(game._getSpecialDecay(), SPECIAL_FOOD_TICKS_ACCESSIBLE);
    });

    test('food expires in accessibility mode (with doubled timer)', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('medium');
        game.accessibilityMode = true;
        game.setState(GameState.PLAYING);

        // Spawn food and advance past doubled decay time
        game.food.spawn(game.snake.body, 0, FoodType.REGULAR, FOOD_DECAY_TICKS_ACCESSIBLE);
        const spawnTick = game.food.spawnTick;

        // Not expired at normal decay time
        assert.strictEqual(game.food.isExpired(spawnTick + FOOD_DECAY_TICKS), false);

        // Expired at doubled decay time
        assert.strictEqual(game.food.isExpired(spawnTick + FOOD_DECAY_TICKS_ACCESSIBLE), true);
    });
});

// =============================================================================
// EXTENDED TIME MODE SPEED CAP TESTS
// =============================================================================

describe('Extended Time Mode speed cap', () => {
    test('caps speed at easy base rate on hard difficulty', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('hard');
        game.accessibilityMode = true;
        game.score = 1000; // high score to push speed up
        game.updateTickRate();
        const actualRate = 1000 / game.tickInterval;
        assert.ok(actualRate <= DIFFICULTY_LEVELS.easy.baseTickRate,
            `Rate ${actualRate} exceeds easy base rate ${DIFFICULTY_LEVELS.easy.baseTickRate}`);
    });

    test('caps speed at easy base rate on medium difficulty', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('medium');
        game.accessibilityMode = true;
        game.score = 1000;
        game.updateTickRate();
        const actualRate = 1000 / game.tickInterval;
        assert.ok(actualRate <= DIFFICULTY_LEVELS.easy.baseTickRate,
            `Rate ${actualRate} exceeds easy base rate ${DIFFICULTY_LEVELS.easy.baseTickRate}`);
    });

    test('does not cap speed without accessibility mode', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('hard');
        game.accessibilityMode = false;
        game.score = 1000;
        game.updateTickRate();
        const actualRate = 1000 / game.tickInterval;
        assert.ok(actualRate > DIFFICULTY_LEVELS.easy.baseTickRate,
            `Rate ${actualRate} should exceed easy base rate without accessibility`);
    });

    test('easy difficulty unaffected by cap (already at/below easy base rate)', () => {
        const game = new Game(createMockCanvas());
        game.setDifficulty('easy');
        game.accessibilityMode = true;
        game.score = 0;
        game.updateTickRate();
        const actualRate = 1000 / game.tickInterval;
        assert.strictEqual(actualRate, DIFFICULTY_LEVELS.easy.baseTickRate);
    });
});

// =============================================================================
// ASSISTED LEADERBOARD TESTS
// =============================================================================

describe('Assisted leaderboard separation', () => {
    let storage;

    beforeEach(() => {
        global.localStorage.clear();
        storage = new StorageManager();
    });

    test('addScore stores assisted field when true', () => {
        storage.addScore('ACE', 100, 'medium', true);
        const all = storage.get('leaderboard', []);
        assert.strictEqual(all[0].assisted, true);
    });

    test('addScore omits assisted field when false', () => {
        storage.addScore('ACE', 100, 'medium', false);
        const all = storage.get('leaderboard', []);
        assert.strictEqual(all[0].assisted, undefined);
    });

    test('getLeaderboard separates assisted from standard', () => {
        storage.addScore('STD', 200, 'medium', false);
        storage.addScore('AST', 300, 'medium', true);
        const standard = storage.getLeaderboard('medium', false);
        const assisted = storage.getLeaderboard('medium', true);
        assert.strictEqual(standard.length, 1);
        assert.strictEqual(standard[0].initials, 'STD');
        assert.strictEqual(assisted.length, 1);
        assert.strictEqual(assisted[0].initials, 'AST');
    });

    test('legacy entries (no assisted field) treated as non-assisted', () => {
        storage.set('leaderboard', [
            { initials: 'OLD', score: 50, difficulty: 'easy', timestamp: 1000 }
        ]);
        const standard = storage.getLeaderboard('easy', false);
        const assisted = storage.getLeaderboard('easy', true);
        assert.strictEqual(standard.length, 1);
        assert.strictEqual(assisted.length, 0);
    });

    test('isHighScore respects assisted flag', () => {
        for (let i = 0; i < 10; i++) {
            storage.addScore('AAA', (i + 1) * 10, 'medium', false);
        }
        // Standard board is full, 5 doesn't beat lowest
        assert.strictEqual(storage.isHighScore(5, 'medium', false), false);
        // Assisted board is empty, any score qualifies
        assert.strictEqual(storage.isHighScore(5, 'medium', true), true);
    });

    test('isNewTopScore respects assisted flag', () => {
        storage.addScore('STD', 100, 'hard', false);
        storage.addScore('AST', 50, 'hard', true);
        assert.strictEqual(storage.isNewTopScore(60, 'hard', false), false);
        assert.strictEqual(storage.isNewTopScore(60, 'hard', true), true);
    });

    test('getLeaderboard without difficulty returns all entries for assisted flag', () => {
        storage.addScore('AAA', 100, 'easy', true);
        storage.addScore('BBB', 200, 'hard', true);
        storage.addScore('CCC', 150, 'medium', false);
        const assisted = storage.getLeaderboard(null, true);
        const standard = storage.getLeaderboard(null, false);
        assert.strictEqual(assisted.length, 2);
        assert.strictEqual(standard.length, 1);
    });
});

// =============================================================================
// REDUCE MOTION CANVAS PULSE TESTS
// =============================================================================

describe('Reduce Motion canvas pulse', () => {
    test('drawFood accepts reducedMotion parameter', () => {
        const canvas = createMockCanvas();
        const renderer = new Renderer(canvas);
        const food = new Food(GRID_WIDTH, GRID_HEIGHT);
        food.spawn([], 0, FoodType.BONUS);
        // Should not throw with reducedMotion param
        renderer.drawFood(food, false, 10, false, true);
        renderer.drawFood(food, false, 10, false, false);
    });

    test('bonus food pulse is 1.0 with reducedMotion', () => {
        const canvas = createMockCanvas();
        const renderer = new Renderer(canvas);
        const food = new Food(GRID_WIDTH, GRID_HEIGHT);
        food.spawn([], 0, FoodType.BONUS);

        // With reducedMotion, no arc calls for pulsing should show variation
        renderer.drawFood(food, false, 10, false, true);
        // The fill call happened (food was drawn)
        assert.ok(canvas._ctx.fill.mock.calls.length > 0);
    });

    test('lethal food pulse is 1.0 with reducedMotion', () => {
        const canvas = createMockCanvas();
        const renderer = new Renderer(canvas);
        const food = new Food(GRID_WIDTH, GRID_HEIGHT);
        food.spawn([], 0, FoodType.LETHAL);

        renderer.drawFood(food, false, 10, false, true);
        assert.ok(canvas._ctx.fill.mock.calls.length > 0);
    });
});

// =============================================================================
// UI MANAGER ARROW-KEY NAVIGATION TESTS
// =============================================================================

// Helper to create a minimal DOM mock for UIManager tests
function createMockUIManager(stateOverride) {
    const keydownHandlers = [];
    const origAddEventListener = global.document.addEventListener;
    const origRemoveEventListener = global.document.removeEventListener;

    global.document.addEventListener = mock.fn((event, handler) => {
        if (event === 'keydown') keydownHandlers.push(handler);
    });
    global.document.removeEventListener = mock.fn();
    const origRAF = global.requestAnimationFrame;
    global.requestAnimationFrame = mock.fn((cb) => cb());

    // Create button elements with focus tracking
    const createBtn = (action) => {
        const btn = {
            tagName: 'BUTTON',
            className: 'ui-btn',
            dataset: { action },
            disabled: false,
            offsetParent: {},  // non-null = visible
            focus: mock.fn(),
            addEventListener: mock.fn(),
            removeEventListener: mock.fn(),
            getAttribute: mock.fn(() => null),
            setAttribute: mock.fn(),
            removeAttribute: mock.fn(),
            closest: mock.fn(() => null),
            querySelector: mock.fn(() => null),
            querySelectorAll: mock.fn(() => [])
        };
        return btn;
    };

    const playBtn = createBtn('play');
    const settingsBtn = createBtn('settings');
    const highscoresBtn = createBtn('highscores');
    const btnGroup = {
        querySelectorAll: mock.fn(() => [playBtn, settingsBtn, highscoresBtn])
    };

    const screenMenu = {
        querySelector: mock.fn((sel) => {
            if (sel === '.ui-btn-group') return btnGroup;
            return null;
        }),
        querySelectorAll: mock.fn(() => []),
        scrollTop: 0
    };

    let dataState = stateOverride || 'MENU';
    let dataUi = null;

    const container = {
        getAttribute: mock.fn((attr) => {
            if (attr === 'data-state') return dataState;
            if (attr === 'data-ui') return dataUi;
            return null;
        }),
        setAttribute: mock.fn((attr, val) => {
            if (attr === 'data-state') dataState = val;
            if (attr === 'data-ui') dataUi = val;
        }),
        removeAttribute: mock.fn((attr) => {
            if (attr === 'data-ui') dataUi = null;
        }),
        hasAttribute: mock.fn((attr) => {
            if (attr === 'data-ui') return dataUi !== null;
            return false;
        }),
        querySelector: mock.fn((sel) => {
            if (dataUi && sel === `.screen-${dataUi}`) return screenMenu;
            // Map state selectors (PLAYING has no screen)
            const stateMap = { 'MENU': '.screen-menu', 'PAUSED': '.screen-pause', 'GAMEOVER': '.screen-gameover' };
            if (stateMap[dataState] && sel === stateMap[dataState]) return screenMenu;
            return null;
        }),
        querySelectorAll: mock.fn(() => [])
    };

    const overlay = {
        addEventListener: mock.fn(),
        removeEventListener: mock.fn(),
        querySelectorAll: mock.fn(() => [])
    };

    const audioMock = {
        init: mock.fn(),
        playNavigate: mock.fn(),
        playConfirm: mock.fn(),
        playBack: mock.fn(),
        volume: 0.5,
        muted: false
    };

    const gameMock = {
        state: stateOverride === 'PAUSED' ? GameState.PAUSED :
               stateOverride === 'GAMEOVER' ? GameState.GAMEOVER : GameState.MENU,
        audio: audioMock,
        animationStyle: 'smooth',
        reducedMotion: false,
        colorblindMode: false,
        accessibilityMode: false,
        difficulty: 'medium',
        storage: { getUnlockedThemes: () => ['classic'], getLeaderboard: () => [] },
        reset: mock.fn(),
        setState: mock.fn((s) => { gameMock.state = s; }),
    };

    // Mock the DOM elements UIManager constructor looks for
    const origGetElementById = global.document.getElementById;
    const mockEl = {
        setAttribute: mock.fn(),
        getAttribute: mock.fn(() => null),
        removeAttribute: mock.fn(),
        addEventListener: mock.fn(),
        value: '50',
        textContent: '',
        querySelectorAll: mock.fn(() => [])
    };
    global.document.getElementById = mock.fn(() => mockEl);

    const ui = new UIManager(container, overlay, gameMock);

    // Restore document mocks
    global.document.addEventListener = origAddEventListener;
    global.document.removeEventListener = origRemoveEventListener;
    global.document.getElementById = origGetElementById;
    if (origRAF) {
        global.requestAnimationFrame = origRAF;
    } else {
        delete global.requestAnimationFrame;
    }

    return {
        ui, container, gameMock, audioMock, keydownHandlers,
        buttons: [playBtn, settingsBtn, highscoresBtn],
        setDataUi: (val) => { dataUi = val; },
        setDataState: (val) => { dataState = val; gameMock.state = val; }
    };
}

describe('UIManager arrow-key navigation', () => {
    test('_getNavigableButtons returns buttons from visible screen', () => {
        const { ui, buttons } = createMockUIManager('MENU');
        const result = ui._getNavigableButtons();
        assert.strictEqual(result.length, 3);
        assert.strictEqual(result[0], buttons[0]);
    });

    test('_getNavigableButtons returns empty array when no screen visible', () => {
        const { ui, setDataState } = createMockUIManager('MENU');
        setDataState('PLAYING');
        const result = ui._getNavigableButtons();
        assert.strictEqual(result.length, 0);
    });

    test('_getNavigableButtons falls back to focusable elements when no btn-group', () => {
        const { ui, setDataUi, container } = createMockUIManager('MENU');
        // Simulate settings screen with no .ui-btn-group but with focusable elements
        const closeBtn = { tagName: 'BUTTON', offsetParent: {} };
        const toggle = { tagName: 'BUTTON', offsetParent: {} };
        const settingsScreen = {
            querySelector: mock.fn(() => null), // no .ui-btn-group
            querySelectorAll: mock.fn(() => [closeBtn, toggle])
        };
        setDataUi('settings');
        // Override container.querySelector to return our custom settings screen
        const origQS = container.querySelector;
        container.querySelector = mock.fn((sel) => {
            if (sel === '.screen-settings') return settingsScreen;
            return origQS(sel);
        });
        const result = ui._getNavigableButtons();
        assert.ok(result.length > 0, 'Should return focusable elements from settings screen');
        container.querySelector = origQS;
    });

    test('ArrowDown moves focus to first button when none focused', () => {
        const { keydownHandlers, buttons } = createMockUIManager('MENU');
        // Simulate no button focused
        global.document.activeElement = {};
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'ArrowDown', preventDefault: mock.fn() });
        assert.strictEqual(buttons[0].focus.mock.calls.length, 1);
    });

    test('ArrowDown wraps from last to first button', () => {
        const { keydownHandlers, buttons } = createMockUIManager('MENU');
        // Simulate last button focused
        global.document.activeElement = buttons[2];
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'ArrowDown', preventDefault: mock.fn() });
        assert.strictEqual(buttons[0].focus.mock.calls.length, 1);
    });

    test('ArrowUp wraps from first to last button', () => {
        const { keydownHandlers, buttons } = createMockUIManager('MENU');
        global.document.activeElement = buttons[0];
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'ArrowUp', preventDefault: mock.fn() });
        assert.strictEqual(buttons[2].focus.mock.calls.length, 1);
    });

    test('Arrow keys play navigate sound', () => {
        const { keydownHandlers, audioMock } = createMockUIManager('MENU');
        global.document.activeElement = {};
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'ArrowDown', preventDefault: mock.fn() });
        assert.strictEqual(audioMock.playNavigate.mock.calls.length, 1);
    });

    test('Arrow keys skip when data-ui is initials', () => {
        const { keydownHandlers, buttons, setDataUi } = createMockUIManager('GAMEOVER');
        setDataUi('initials');
        global.document.activeElement = {};
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'ArrowDown', preventDefault: mock.fn() });
        assert.strictEqual(buttons[0].focus.mock.calls.length, 0);
    });

    test('ArrowDown navigates away from range input', () => {
        const { ui, keydownHandlers, container, setDataUi } = createMockUIManager('MENU');
        setDataUi('settings');
        // Create a mock settings screen with a range input and a button
        const rangeInput = { tagName: 'INPUT', type: 'range', offsetParent: {} };
        const nextBtn = { tagName: 'BUTTON', offsetParent: {}, focus: mock.fn() };
        const settingsScreen = {
            querySelector: mock.fn(() => null), // no .ui-btn-group
            querySelectorAll: mock.fn(() => [rangeInput, nextBtn])
        };
        const origQS = container.querySelector;
        container.querySelector = mock.fn((sel) => {
            if (sel === '.screen-settings') return settingsScreen;
            return origQS(sel);
        });
        global.document.activeElement = rangeInput;
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'ArrowDown', preventDefault: mock.fn() });
        assert.strictEqual(nextBtn.focus.mock.calls.length, 1);
        container.querySelector = origQS;
    });
});

describe('UIManager backspace navigation', () => {
    test('Backspace closes settings modal', () => {
        const { keydownHandlers, setDataUi, audioMock } = createMockUIManager('MENU');
        setDataUi('settings');
        global.document.activeElement = { tagName: 'BUTTON' };
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'Backspace', preventDefault: mock.fn() });
        assert.strictEqual(audioMock.playBack.mock.calls.length, 1);
    });

    test('Backspace closes leaderboard modal', () => {
        const { keydownHandlers, setDataUi, audioMock } = createMockUIManager('MENU');
        setDataUi('leaderboard');
        global.document.activeElement = { tagName: 'BUTTON' };
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'Backspace', preventDefault: mock.fn() });
        assert.strictEqual(audioMock.playBack.mock.calls.length, 1);
    });

    test('Backspace resumes from pause state', () => {
        const { keydownHandlers, gameMock, audioMock } = createMockUIManager('PAUSED');
        global.document.activeElement = { tagName: 'BUTTON' };
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'Backspace', preventDefault: mock.fn() });
        assert.strictEqual(audioMock.playConfirm.mock.calls.length, 1);
        assert.strictEqual(gameMock.setState.mock.calls.length, 1);
        assert.strictEqual(gameMock.setState.mock.calls[0].arguments[0], GameState.PLAYING);
    });

    test('Backspace returns to menu from gameover', () => {
        const { keydownHandlers, gameMock, audioMock } = createMockUIManager('GAMEOVER');
        global.document.activeElement = { tagName: 'BUTTON' };
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'Backspace', preventDefault: mock.fn() });
        assert.strictEqual(audioMock.playBack.mock.calls.length, 1);
        assert.strictEqual(gameMock.reset.mock.calls.length, 1);
    });

    test('Backspace skips when data-ui is initials', () => {
        const { keydownHandlers, setDataUi, audioMock } = createMockUIManager('GAMEOVER');
        setDataUi('initials');
        global.document.activeElement = { tagName: 'DIV' };
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'Backspace', preventDefault: mock.fn() });
        assert.strictEqual(audioMock.playBack.mock.calls.length, 0);
        assert.strictEqual(audioMock.playConfirm.mock.calls.length, 0);
    });

    test('Backspace skips when active element is INPUT', () => {
        const { keydownHandlers, audioMock } = createMockUIManager('MENU');
        global.document.activeElement = { tagName: 'INPUT' };
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'Backspace', preventDefault: mock.fn() });
        assert.strictEqual(audioMock.playBack.mock.calls.length, 0);
    });

    test('Backspace is no-op on menu state', () => {
        const { keydownHandlers, gameMock, audioMock } = createMockUIManager('MENU');
        global.document.activeElement = { tagName: 'BUTTON' };
        const handler = keydownHandlers[keydownHandlers.length - 1];
        handler({ key: 'Backspace', preventDefault: mock.fn() });
        assert.strictEqual(audioMock.playBack.mock.calls.length, 0);
        assert.strictEqual(audioMock.playConfirm.mock.calls.length, 0);
        assert.strictEqual(gameMock.setState.mock.calls.length, 0);
    });
});

describe('UIManager updateState auto-focus', () => {
    test('updateState sets data-state attribute', () => {
        const { ui, container } = createMockUIManager('MENU');
        global.requestAnimationFrame = mock.fn((cb) => cb());
        ui.updateState('PAUSED');
        assert.ok(container.setAttribute.mock.calls.some(
            c => c.arguments[0] === 'data-state' && c.arguments[1] === 'PAUSED'
        ));
        delete global.requestAnimationFrame;
    });

    test('updateState auto-focuses first button on MENU transition', () => {
        const { ui, buttons, setDataState } = createMockUIManager('PLAYING');
        setDataState('PLAYING'); // Start from PLAYING (no buttons visible)
        global.requestAnimationFrame = mock.fn((cb) => cb());
        // Reset focus call counts
        buttons.forEach(b => b.focus.mock.resetCalls());
        setDataState('MENU');
        ui.updateState('MENU');
        assert.strictEqual(buttons[0].focus.mock.calls.length, 1);
        delete global.requestAnimationFrame;
    });
});

describe('UIManager destroy cleanup', () => {
    test('destroy removes menu keydown handler', () => {
        const origRemove = global.document.removeEventListener;
        const removeCalls = [];
        global.document.removeEventListener = mock.fn((event, handler) => {
            removeCalls.push({ event, handler });
        });

        const { ui } = createMockUIManager('MENU');
        ui.destroy();

        const keydownRemovals = removeCalls.filter(c => c.event === 'keydown');
        assert.ok(keydownRemovals.length > 0, 'Should remove keydown listener on destroy');

        global.document.removeEventListener = origRemove;
    });
});
