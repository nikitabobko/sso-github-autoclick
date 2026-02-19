# GitHub SSO Auto-Continue Extension

A browser extension that automatically clicks the "Continue" button on GitHub Single Sign-On pages.

## Installation from stores

- Google Chrome: https://chromewebstore.google.com/detail/hfbomnfikccplogceifkhiecccpnhhjn/preview?hl=en-GB&authuser=0 (WIP)
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/github-sso-auto-continue (WIP)

## Installation from sources

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

## Google Accounts Integration

When you sign in to GitHub via Google, you may be redirected to Google's account chooser. This extension handles that page as well by automatically selecting an account.

### Account Selection Algorithm

1. If you have previously selected an account, that account is automatically chosen
2. If there is only one account available, it is automatically selected
3. If there are multiple accounts and exactly one is a non-Gmail address (e.g., work email), that account is selected
4. Otherwise, the extension waits for you to manually click an account. Your selection is saved for future sessions.

We believe this sensible default behavior works well for most users. Currently, we do not offer configuration options to customize this behavior.

## Development

100% vibe coded
