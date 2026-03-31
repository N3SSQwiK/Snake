// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './e2e',
    timeout: 30000,
    retries: 0,
    use: {
        headless: true,
        viewport: { width: 800, height: 600 },
    },
    webServer: {
        command: 'python3 -m http.server 8787',
        port: 8787,
        reuseExistingServer: true,
    },
});
