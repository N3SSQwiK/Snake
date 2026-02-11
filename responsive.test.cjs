/**
 * Playwright verification for responsive layout.
 * Run: node responsive.test.cjs
 */
const { chromium } = require('playwright');
const { createServer } = require('http');
const { readFileSync } = require('fs');
const { join, extname, dirname } = require('path');

const ROOT = dirname(__filename);
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };

let passed = 0, failed = 0;
function check(label, condition, detail = '') {
    if (condition) { passed++; console.log(`  ✓ ${label}`); }
    else { failed++; console.log(`  ✗ ${label}${detail ? ' — ' + detail : ''}`); }
}

async function main() {
    const server = createServer((req, res) => {
        const file = req.url === '/' ? '/index.html' : req.url;
        try {
            const data = readFileSync(join(ROOT, file));
            res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'text/plain', 'Cache-Control': 'no-store' });
            res.end(data);
        } catch { res.writeHead(404); res.end(); }
    });
    await new Promise(r => server.listen(0, r));
    const port = server.address().port;
    const browser = await chromium.launch();

    // =========================================================================
    // Desktop wide viewport — canvas fills height, centered
    // =========================================================================
    console.log('\n=== Desktop wide viewport (1920x1080) ===');
    {
        const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
        await page.goto(`http://localhost:${port}/`);
        await page.waitForTimeout(300);
        await page.evaluate(() => window.game.setState('PLAYING'));
        await page.waitForTimeout(300);

        const r = await page.evaluate(() => {
            const canvas = document.getElementById('game-canvas');
            const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-scale'));
            const rect = canvas.getBoundingClientRect();
            return {
                scale,
                canvasW: parseInt(canvas.style.width),
                canvasH: parseInt(canvas.style.height),
                viewW: window.innerWidth,
                viewH: window.innerHeight,
                canvasLeft: rect.left,
                canvasRight: window.innerWidth - rect.right,
            };
        });

        check('Scale > 1', r.scale > 1, `scale=${r.scale}`);
        check('Canvas fills height (> 80% viewport)', r.canvasH > r.viewH * 0.8, `${r.canvasH} vs ${r.viewH}`);
        check('Canvas is square', r.canvasW === r.canvasH);
        check('Canvas horizontally centered (left ≈ right ±50px)', Math.abs(r.canvasLeft - r.canvasRight) < 50, `left=${r.canvasLeft.toFixed(0)} right=${r.canvasRight.toFixed(0)}`);
        await page.close();
    }

    // =========================================================================
    // Desktop narrow viewport — canvas fills width
    // =========================================================================
    console.log('\n=== Desktop narrow viewport (600x900) ===');
    {
        const page = await browser.newPage({ viewport: { width: 600, height: 900 } });
        await page.goto(`http://localhost:${port}/`);
        await page.waitForTimeout(300);
        await page.evaluate(() => window.game.setState('PLAYING'));
        await page.waitForTimeout(300);

        const r = await page.evaluate(() => {
            const canvas = document.getElementById('game-canvas');
            const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-scale'));
            return {
                scale,
                canvasW: parseInt(canvas.style.width),
                viewW: window.innerWidth,
                viewH: window.innerHeight,
            };
        });

        check('Scale > 1', r.scale > 1, `scale=${r.scale}`);
        check('Canvas fills width (> 80% viewport width)', r.canvasW > r.viewW * 0.8, `${r.canvasW} vs ${r.viewW}`);
        await page.close();
    }

    // =========================================================================
    // Debounced resize — canvas rescales after viewport change
    // =========================================================================
    console.log('\n=== Debounced resize (1280x800 → 800x600) ===');
    {
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await page.goto(`http://localhost:${port}/`);
        await page.waitForTimeout(300);
        await page.evaluate(() => window.game.setState('PLAYING'));
        await page.waitForTimeout(300);

        const before = await page.evaluate(() => ({
            scale: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-scale')),
            canvasW: parseInt(document.getElementById('game-canvas').style.width),
        }));

        await page.setViewportSize({ width: 800, height: 600 });
        await page.waitForTimeout(300);

        const after = await page.evaluate(() => ({
            scale: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-scale')),
            canvasW: parseInt(document.getElementById('game-canvas').style.width),
        }));

        check('Scale changed after resize', before.scale !== after.scale, `${before.scale} → ${after.scale}`);
        check('Canvas shrunk with viewport', after.canvasW < before.canvasW, `${before.canvasW} → ${after.canvasW}`);
        await page.close();
    }

    // =========================================================================
    // Panel proportional scaling — UI adapts to viewport size
    // =========================================================================
    console.log('\n=== Panel proportional scaling (1920x1080 vs 600x900) ===');
    {
        const sizes = [
            { w: 1920, h: 1080, label: 'large' },
            { w: 600, h: 900, label: 'small' },
        ];
        const results = {};
        for (const { w, h, label } of sizes) {
            const page = await browser.newPage({ viewport: { width: w, height: h } });
            await page.goto(`http://localhost:${port}/`);
            await page.waitForTimeout(300);

            const r = await page.evaluate(() => {
                const panel = document.querySelector('.ui-panel');
                const title = document.querySelector('.ui-title');
                const cs = getComputedStyle;
                return {
                    scale: parseFloat(cs(document.documentElement).getPropertyValue('--game-scale')),
                    panelMaxWidth: parseFloat(cs(panel).maxWidth),
                    panelPadding: parseFloat(cs(panel).paddingTop),
                    titleFontSize: parseFloat(cs(title).fontSize),
                };
            });
            results[label] = r;
            await page.close();
        }

        check('Panel max-width larger at large viewport', results.large.panelMaxWidth > results.small.panelMaxWidth, `${results.large.panelMaxWidth} vs ${results.small.panelMaxWidth}`);
        check('Title font larger at large viewport', results.large.titleFontSize > results.small.titleFontSize, `${results.large.titleFontSize} vs ${results.small.titleFontSize}`);
        check('Panel padding larger at large viewport', results.large.panelPadding > results.small.panelPadding, `${results.large.panelPadding} vs ${results.small.panelPadding}`);
    }

    // =========================================================================
    // Mobile portrait with D-pad — no overflow
    // =========================================================================
    console.log('\n=== Mobile portrait with D-pad (393x852) ===');
    {
        const page = await browser.newPage({
            viewport: { width: 393, height: 852 },
            hasTouch: true,
            isMobile: true,
        });
        await page.goto(`http://localhost:${port}/`);
        await page.waitForTimeout(300);

        await page.evaluate(() => {
            window.game.inputHandler.mobileInputMethod = 'dpad';
            document.getElementById('dpad').hidden = false;
            window.game.setState('PLAYING');
        });
        await page.waitForTimeout(300);

        const r = await page.evaluate(() => {
            const canvas = document.getElementById('game-canvas');
            const hud = document.getElementById('game-hud');
            const dpad = document.getElementById('dpad');
            const canvasH = parseInt(canvas.style.height);
            const hudH = hud.offsetHeight;
            const dpadH = dpad.offsetHeight;
            const total = hudH + canvasH + dpadH + 32;
            return {
                canvasH, hudH, dpadH, total,
                viewH: window.innerHeight,
                overflow: total > window.innerHeight,
                dpadVisible: getComputedStyle(dpad).display !== 'none',
            };
        });

        check('D-pad visible', r.dpadVisible);
        check('D-pad has reasonable height (> 80px)', r.dpadH > 80, `dpadH=${r.dpadH}`);
        check('No overflow (total ≤ viewport)', !r.overflow, `total=${r.total} viewport=${r.viewH}`);
        await page.close();
    }

    // =========================================================================
    // Glow effect scaling — shadowBlur counter-scaled at high DPI
    // =========================================================================
    console.log('\n=== Glow effect scaling (1920x1080) ===');
    {
        const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
        await page.goto(`http://localhost:${port}/`);
        await page.waitForTimeout(300);
        await page.evaluate(() => window.game.setState('PLAYING'));
        await page.waitForTimeout(300);

        const r = await page.evaluate(() => {
            const renderer = window.game.renderer;
            return {
                glowScale: renderer.glowScale,
                bitmapW: renderer.canvas.width,
                displaySize: renderer.displaySize,
            };
        });

        check('Bitmap > 500 (upscaled)', r.bitmapW > 500, `bitmap=${r.bitmapW}`);
        check('glowScale < 1 (counter-scales shadowBlur)', r.glowScale < 1, `glowScale=${r.glowScale}`);
        check('glowScale is correct ratio', Math.abs(r.glowScale - 500 / r.bitmapW) < 0.001, `${r.glowScale} vs ${500/r.bitmapW}`);
        await page.close();
    }

    // =========================================================================
    // Summary
    // =========================================================================
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Results: ${passed} passed, ${failed} failed`);
    if (failed > 0) console.log('SOME TESTS FAILED');
    else console.log('ALL TESTS PASSED');

    await browser.close();
    server.close();
    process.exit(failed > 0 ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
