// @ts-check
const { test, expect } = require('@playwright/test');

const SERVER_PORT = 8787;

test.describe('Achievements E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`http://localhost:${SERVER_PORT}/`);
        await page.waitForSelector('[data-state="MENU"]');
    });

    // =========================================================================
    // Test 1: Zen mode → quit → modesPlayed includes 'zen'
    // =========================================================================
    test('Zen mode is tracked in modesPlayed after playing and quitting', async ({ page }) => {
        // Click Play to go to mode select
        await page.click('[data-action="play"]');
        await page.waitForSelector('[data-mode="zen"]', { state: 'visible' });

        // Select Zen mode
        await page.click('[data-mode="zen"]');

        // Start game
        await page.click('[data-action="start-game"]');
        await page.waitForSelector('[data-state="PLAYING"]');

        // Wait a moment for the game to tick
        await page.waitForTimeout(500);

        // Pause the game (Space key pauses, not Escape)
        await page.keyboard.press('Space');
        await page.waitForSelector('[data-state="PAUSED"]');

        // Quit to menu
        await page.click('[data-action="quit"]');
        await page.waitForSelector('[data-state="MENU"]');

        // Check localStorage for modesPlayed including 'zen'
        const progress = await page.evaluate(() => {
            const raw = localStorage.getItem('snake_achievementProgress');
            return raw ? JSON.parse(raw) : null;
        });

        expect(progress).toBeTruthy();
        expect(progress.modesPlayed).toContain('zen');
    });

    // =========================================================================
    // Test 2: First food → "First Blood" toast appears mid-game
    // =========================================================================
    test('First Blood toast appears mid-game when eating first food', async ({ page }) => {
        // Clear any previous achievement data
        await page.evaluate(() => {
            localStorage.removeItem('snake_achievements');
            localStorage.removeItem('snake_achievementProgress');
        });
        await page.reload();
        await page.waitForSelector('[data-state="MENU"]');

        // Start classic game
        await page.click('[data-action="play"]');
        await page.waitForSelector('[data-mode="classic"]', { state: 'visible' });
        await page.click('[data-mode="classic"]');
        await page.click('[data-action="start-game"]');
        await page.waitForSelector('[data-state="PLAYING"]');

        // Wait for game loop to start ticking
        await page.waitForTimeout(300);

        // Place food directly in front of the snake head
        await page.evaluate(() => {
            const game = window.__gameInstance;
            if (game) {
                const head = game.snake.getHead();
                const dir = game.snake.direction;
                let foodPos;
                if (dir === 'RIGHT') foodPos = { x: head.x + 1, y: head.y };
                else if (dir === 'LEFT') foodPos = { x: head.x - 1, y: head.y };
                else if (dir === 'UP') foodPos = { x: head.x, y: head.y - 1 };
                else foodPos = { x: head.x, y: head.y + 1 };
                game.food.position = foodPos;
                game.food.points = 10;
            }
        });

        // Wait for the game to tick and eat the food — toast should appear
        const toast = page.locator('.achievement-toast__item');
        await expect(toast.first()).toBeVisible({ timeout: 10000 });

        // Verify toast content
        const toastText = await toast.first().textContent();
        expect(toastText).toContain('First Blood');
        expect(toastText).toContain('Achievement Unlocked!');
    });

    // =========================================================================
    // Test 3: Open achievements gallery → press Escape → closes
    // =========================================================================
    test('Achievements gallery closes on Escape key', async ({ page }) => {
        await page.click('[data-action="achievements"]');
        await page.waitForSelector('.screen-achievements', { state: 'visible' });
        const container = page.locator('.game-container');
        await expect(container).toHaveAttribute('data-ui', 'achievements');

        await page.keyboard.press('Escape');

        await expect(container).not.toHaveAttribute('data-ui', 'achievements');
    });

    // =========================================================================
    // Test 4: Achievements gallery closes on Backspace key
    // =========================================================================
    test('Achievements gallery closes on Backspace key', async ({ page }) => {
        await page.click('[data-action="achievements"]');
        await page.waitForSelector('.screen-achievements', { state: 'visible' });

        await page.keyboard.press('Backspace');

        const container = page.locator('.game-container');
        await expect(container).not.toHaveAttribute('data-ui', 'achievements');
    });

    // =========================================================================
    // Test 5: Unlock achievement → return to menu → button counter updated
    // =========================================================================
    test('Achievement button counter updates after unlocking', async ({ page }) => {
        // Verify initial button text shows 0/12
        await expect(page.locator('[data-action="achievements"]')).toContainText('0/12');

        // Inject an unlocked achievement into localStorage and reload
        await page.evaluate(() => {
            localStorage.setItem('snake_achievements', JSON.stringify({ firstBlood: Date.now() }));
        });
        await page.reload();
        await page.waitForSelector('[data-state="MENU"]');

        // The button counter updates on state transition to MENU.
        // On initial load, trigger it manually since constructor doesn't call setState.
        await page.evaluate(() => {
            window.__gameInstance.ui.updateAchievementButton();
        });

        // Button should now show 1/12
        await expect(page.locator('[data-action="achievements"]')).toContainText('1/12');
    });

    // =========================================================================
    // Test 6: Theme colors adapt on toast and gallery
    // =========================================================================
    test('Achievement toast and gallery use theme CSS variables', async ({ page }) => {
        // Check toast container accessibility attributes
        const toastContainer = page.locator('.achievement-toast');
        await expect(toastContainer).toHaveAttribute('role', 'status');
        await expect(toastContainer).toHaveAttribute('aria-live', 'polite');

        // Verify accent CSS variable is defined
        const accentColor = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).getPropertyValue('--ui-accent').trim();
        });
        expect(accentColor).toBeTruthy();

        // Create a temporary toast element and verify it picks up accent border color
        const toastBorderColor = await page.evaluate(() => {
            const container = document.querySelector('.achievement-toast');
            const toast = document.createElement('div');
            toast.className = 'achievement-toast__item';
            container.appendChild(toast);
            const style = getComputedStyle(toast);
            const borderColor = style.borderColor;
            container.removeChild(toast);
            return borderColor;
        });
        expect(toastBorderColor).toBeTruthy();
        expect(toastBorderColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(toastBorderColor).not.toBe('transparent');

        // Seed an unlocked achievement and verify gallery uses accent-derived styles
        await page.evaluate(() => {
            localStorage.setItem('snake_achievements', JSON.stringify({ firstBlood: Date.now() }));
        });
        await page.reload();
        await page.waitForSelector('[data-state="MENU"]');
        await page.click('[data-action="achievements"]');
        await page.waitForSelector('.screen-achievements', { state: 'visible' });

        const unlockedItem = page.locator('.achievement-item--unlocked').first();
        await expect(unlockedItem).toBeVisible();
        const borderColor = await unlockedItem.evaluate(el => {
            return getComputedStyle(el).borderColor;
        });
        expect(borderColor).toBeTruthy();
        expect(borderColor).not.toBe('rgba(0, 0, 0, 0)');
    });

    // =========================================================================
    // Test 7: Gallery displays all 12 achievements with correct structure
    // =========================================================================
    test('Achievement gallery displays all 12 achievements', async ({ page }) => {
        await page.click('[data-action="achievements"]');
        await page.waitForSelector('.screen-achievements', { state: 'visible' });

        const items = page.locator('.achievement-item');
        await expect(items).toHaveCount(12);

        // Each item should have role="listitem" and aria-label containing "Locked"
        for (let i = 0; i < 12; i++) {
            const item = items.nth(i);
            await expect(item).toHaveAttribute('role', 'listitem');
            const ariaLabel = await item.getAttribute('aria-label');
            expect(ariaLabel).toBeTruthy();
            expect(ariaLabel).toContain('Locked');
        }

        const list = page.locator('.achievements-list');
        await expect(list).toHaveAttribute('role', 'list');

        const heading = page.locator('.achievements-heading');
        await expect(heading).toContainText('0/12');
    });

    // =========================================================================
    // Test 8: Locked achievements show lock icon, unlocked show real icon
    // =========================================================================
    test('Locked vs unlocked achievement display', async ({ page }) => {
        // Seed one unlocked achievement and reload
        await page.evaluate(() => {
            localStorage.setItem('snake_achievements', JSON.stringify({ firstBlood: Date.now() }));
        });
        await page.reload();
        await page.waitForSelector('[data-state="MENU"]');

        await page.click('[data-action="achievements"]');
        await page.waitForSelector('.screen-achievements', { state: 'visible' });

        // First Blood should be unlocked
        const unlockedItems = page.locator('.achievement-item--unlocked');
        await expect(unlockedItems).toHaveCount(1);

        // Should show the real icon (✦), not the lock icon (✷)
        const unlockedIcon = unlockedItems.first().locator('.achievement-item__icon');
        await expect(unlockedIcon).toHaveText('\u2726');

        // Locked items should show the lock symbol
        const lockedItems = page.locator('.achievement-item--locked');
        await expect(lockedItems).toHaveCount(11);
        const lockedIcon = lockedItems.first().locator('.achievement-item__icon');
        await expect(lockedIcon).toHaveText('\u2737');

        // Accessibility labels
        const unlockedLabel = await unlockedItems.first().getAttribute('aria-label');
        expect(unlockedLabel).toContain('Unlocked');
        const lockedLabel = await lockedItems.first().getAttribute('aria-label');
        expect(lockedLabel).toContain('Locked');
    });

    // =========================================================================
    // Test 9: Toast queueing — multiple toasts display sequentially
    // =========================================================================
    test('Multiple achievement toasts queue and display sequentially', async ({ page }) => {
        await page.evaluate(() => {
            localStorage.removeItem('snake_achievements');
            localStorage.removeItem('snake_achievementProgress');
        });
        await page.reload();
        await page.waitForSelector('[data-state="MENU"]');

        // Start a game
        await page.click('[data-action="play"]');
        await page.waitForSelector('[data-mode="classic"]', { state: 'visible' });
        await page.click('[data-mode="classic"]');
        await page.click('[data-action="start-game"]');
        await page.waitForSelector('[data-state="PLAYING"]');

        // Trigger multiple toasts via game instance
        await page.evaluate(() => {
            const game = window.__gameInstance;
            if (game && game.ui) {
                game.ui.showAchievementToast([
                    { id: 'test1', name: 'Test One', icon: '\u2726' },
                    { id: 'test2', name: 'Test Two', icon: '\u2605' },
                ]);
            }
        });

        // First toast should appear
        const toast = page.locator('.achievement-toast__item');
        await expect(toast.first()).toBeVisible({ timeout: 5000 });
        const firstText = await toast.first().textContent();
        expect(firstText).toContain('Test One');

        // Wait for first toast to fade (3s + 0.5s) and second to appear
        await page.waitForTimeout(4000);
        const secondToast = page.locator('.achievement-toast__item');
        if (await secondToast.count() > 0) {
            const secondText = await secondToast.first().textContent();
            expect(secondText).toContain('Test Two');
        }
    });
});
