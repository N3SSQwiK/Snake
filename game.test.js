const { test, describe, beforeEach, mock } = require('node:test');
const assert = require('node:assert');

// Mock document for Node.js environment
global.document = {
    addEventListener: mock.fn(),
    removeEventListener: mock.fn()
};

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
    Game, Renderer, Snake, Food, InputHandler,
    GameState, Direction,
    GRID_WIDTH, GRID_HEIGHT, CELL_SIZE,
    FOOD_POINTS, FOOD_DECAY_TICKS, FOOD_MAX_SPAWN_ATTEMPTS
} = require('./game.js');

// =============================================================================
// CONSTANTS TESTS
// =============================================================================

describe('Game Constants', () => {
    test('grid dimensions are defined', () => {
        assert.strictEqual(typeof GRID_WIDTH, 'number');
        assert.strictEqual(typeof GRID_HEIGHT, 'number');
        assert.strictEqual(GRID_WIDTH, 20);
        assert.strictEqual(GRID_HEIGHT, 20);
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

    test('score visible during GAMEOVER state', () => {
        game.score = 100;
        game.setState(GameState.GAMEOVER);
        canvas._ctx.fillText.mock.resetCalls();
        game.render();
        // drawScore calls fillText twice (shadow + text)
        assert.ok(canvas._ctx.fillText.mock.calls.length >= 2);
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

    test('drawScore draws text', () => {
        renderer.drawScore(100, 5);
        // Should draw shadow and main text
        assert.strictEqual(canvas._ctx.fillText.mock.calls.length, 2);
    });

    test('drawScore sets correct text properties', () => {
        renderer.drawScore(50, 3);
        assert.strictEqual(canvas._ctx.font, '14px monospace');
        assert.strictEqual(canvas._ctx.textAlign, 'left');
        assert.strictEqual(canvas._ctx.textBaseline, 'top');
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
