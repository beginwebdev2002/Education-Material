#!/usr/bin/env node
// Minimal browser driver for the Education-Material frontend, backed by
// Playwright (chromium-cli is not available on this Windows host).
//
// Usage:
//   node driver.mjs <command> [args...]
//
// Commands:
//   screenshot <out.png>                    screenshot the current (guest) home page
//   signin <email> <password> <out.png>     open the Signin modal, submit credentials,
//                                            wait for the header to show a logged-in
//                                            user avatar, then screenshot
//   signin-fail <email> <password> <out.png> same as signin but expects the form to
//                                            show an inline error instead of logging in
//
// Env:
//   FRONTEND_URL (default http://localhost:4200)
//
// All commands print "OK" on success and exit 0, or print the error and
// exit 1. Screenshots are full-page PNGs at the given path.

import { chromium } from 'playwright';

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:4200';
const [, , cmd, ...args] = process.argv;

async function withPage(fn) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.error('[pageerror]', err.message));
  try {
    await fn(page);
  } finally {
    await browser.close();
  }
}

async function openSigninModal(page) {
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
  await page.click('button:has-text("Signin")');
  await page.waitForSelector('#signin-email', { state: 'visible' });
}

async function main() {
  if (cmd === 'screenshot') {
    const [out] = args;
    await withPage(async (page) => {
      await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
      await page.screenshot({ path: out, fullPage: true });
    });
  } else if (cmd === 'signin') {
    const [email, password, out] = args;
    await withPage(async (page) => {
      await openSigninModal(page);
      await page.fill('#signin-email', email);
      await page.fill('#signin-password', password);
      await page.click('form button[type="submit"]');
      await page.waitForSelector('#user-menu-button', { timeout: 10_000 });
      await page.screenshot({ path: out, fullPage: true });
    });
  } else if (cmd === 'signin-fail') {
    const [email, password, out] = args;
    await withPage(async (page) => {
      await openSigninModal(page);
      await page.fill('#signin-email', email);
      await page.fill('#signin-password', password);
      await page.click('form button[type="submit"]');
      await page.waitForSelector('form p.text-red-500', { timeout: 10_000 });
      await page.screenshot({ path: out, fullPage: true });
    });
  } else {
    console.error('Unknown command:', cmd);
    console.error('Usage: node driver.mjs <screenshot|signin|signin-fail> [args...]');
    process.exit(1);
  }
  console.log('OK');
}

main().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
