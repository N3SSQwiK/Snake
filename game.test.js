const { test, describe, beforeEach, mock } = require('node:test');
const assert = require('node:assert');

// Mock canvas and its context for Node.js environment
const createMockCanvas = () => {
    const ctx = {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 0,
        fillRect: mock.fn(),
        strokeRect: mock.fn(),
        beginPath: mock.fn(),
        moveTo: mock.fn(),
        lineTo: mock.fn(),
        stroke: mock.fn(),
        clearRect: mock.fn()
    };
    return {
        width: 0,
        height: 0,
        getContext: () => ctx,
        _ctx: ctx // Expose for test assertions
    };
};

// Import game module
const { Game, Renderer, GameState, GRID_WIDTH, GRID_HEIGHT, CELL_SIZE } = require('./game.js');

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
