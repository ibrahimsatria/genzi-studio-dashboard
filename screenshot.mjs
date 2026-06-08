#!/usr/bin/env node
/**
 * screenshot.mjs — captures a full-page screenshot of a localhost URL.
 *
 *   node screenshot.mjs <url> [label] [viewport]
 *
 *   Examples:
 *     node screenshot.mjs http://localhost:3001
 *     node screenshot.mjs http://localhost:3001 landing
 *     node screenshot.mjs http://localhost:3001 landing mobile
 *     node screenshot.mjs http://localhost:3001 landing 1440x900
 *
 * Files are saved to ./temporary screenshots/screenshot-N[-label].png,
 * auto-incremented so existing files are never overwritten.
 *
 * Viewports:
 *   mobile  → 390x844  (iPhone 14)
 *   tablet  → 820x1180 (iPad Air)
 *   desktop → 1440x900 (default)
 *   WxH     → custom (e.g. 1280x720)
 */
import puppeteer from "puppeteer";
import { mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = join(__dirname, "temporary screenshots");

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 900 },
};

function parseViewport(arg) {
  if (!arg) return VIEWPORTS.desktop;
  if (VIEWPORTS[arg]) return VIEWPORTS[arg];
  const m = /^(\d+)x(\d+)$/i.exec(arg);
  if (m) return { width: +m[1], height: +m[2] };
  return VIEWPORTS.desktop;
}

async function nextIndex() {
  try {
    const files = await readdir(SHOT_DIR);
    const nums = files
      .map((f) => /^screenshot-(\d+)/.exec(f))
      .filter(Boolean)
      .map((m) => +m[1]);
    return (nums.length ? Math.max(...nums) : 0) + 1;
  } catch {
    return 1;
  }
}

async function main() {
  const [, , url, label, vp] = process.argv;
  if (!url) {
    console.error("usage: node screenshot.mjs <url> [label] [viewport]");
    process.exit(1);
  }
  if (!url.startsWith("http://localhost") && !url.startsWith("https://localhost")) {
    console.error("⚠ Only localhost URLs are allowed (Frontend Website Rules).");
    process.exit(1);
  }

  await mkdir(SHOT_DIR, { recursive: true });

  const viewport = parseViewport(vp);
  const idx = await nextIndex();
  const labelPart = label ? `-${label.replace(/[^a-z0-9_-]+/gi, "_")}` : "";
  const vpPart = vp && VIEWPORTS[vp] ? `-${vp}` : "";
  const outPath = join(SHOT_DIR, `screenshot-${idx}${vpPart}${labelPart}.png`);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: viewport,
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ ...viewport, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`✓ ${outPath} (${viewport.width}×${viewport.height})`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
