# GitHub SSO Auto-Continue Extension

A browser extension that automatically clicks the "Continue" button on GitHub Single Sign-On pages.

## Installation

### Chrome / Chromium-based browsers (Brave, Edge, etc.)
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `extension` folder from this directory

### Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select the `extension/manifest.json` file

## How it works

The extension detects GitHub SSO pages by checking:
- Page title contains "Sign in to"
- The page has a `<link rel="sso-modal">` element

When detected, it automatically clicks the "Continue" button (the submit button with "Continue" text).
