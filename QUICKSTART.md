# Quick Start Guide

## Prerequisites Check

Before you begin, make sure you have:

- ✅ Chrome Canary (v127+)
- ✅ Node.js (v18+)
- ✅ npm or pnpm

## Step-by-Step Setup

### 1. Enable Chrome AI APIs

Chrome AI APIs are experimental. Enable them:

1. Open Chrome Canary
2. Go to `chrome://flags/#optimization-guide-on-device-model`
3. Select **"Enabled BypassPerfRequirement"**
4. Go to `chrome://flags/#prompt-api-for-gemini-nano`
5. Select **"Enabled"**
6. **Restart Chrome**

Verify AI is available:
1. Open DevTools Console (F12)
2. Type: `await chrome.ai.summarizer.available()`
3. Should return `true`

### 2. Install Dependencies

```powershell
# Navigate to project directory
cd neurochrome

# Install all dependencies
npm install
```

This will install:
- Vite & Svelte
- Dexie.js for database
- TailwindCSS for styling
- TypeScript & dev tools

### 3. Build the Extension

```powershell
# Development build (with hot reload)
npm run dev

# Production build (optimized)
npm run build
```

The built extension will be in the `dist/` folder.

### 4. Load Extension in Chrome

1. Open Chrome Canary
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top-right)
4. Click **"Load unpacked"**
5. Select the `dist` folder from this project
6. Extension icon should appear in toolbar

### 5. Test the Extension

#### Auto-Capture Test:
1. Visit any article (e.g., Wikipedia, blog post)
2. Wait 2-3 seconds for processing
3. Click extension icon → "Memories" tab
4. Your page should appear in the list

#### Omnibox Test:
1. In Chrome address bar, type `brain` and press Tab
2. Enter a query: "what did I just read?"
3. Press Enter
4. Notification with answer should appear

#### Manual Search Test:
1. Click extension icon
2. "Search" tab should be active
3. Type a question in search box
4. Click "Search" or press Enter
5. Answer and sources appear below

## Troubleshooting

### AI APIs Not Available

**Problem**: `chrome.ai.summarizer.available()` returns `false`

**Solutions**:
- Ensure Chrome Canary version is 127+
- Double-check flags are enabled
- Restart Chrome completely
- Wait 5 minutes after first launch (AI model downloads)

### Extension Not Loading

**Problem**: Extension fails to load or shows errors

**Solutions**:
- Run `npm run build` again
- Check console for errors
- Ensure all dependencies installed (`npm install`)
- Clear Chrome cache and reload extension

### No Memories Captured

**Problem**: Pages visited but no memories appear

**Solutions**:
- Check page has enough text (minimum 200 characters)
- Avoid chrome:// pages (can't capture)
- Check DevTools console for errors
- Verify extension has permissions (should auto-prompt)

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Clear Vite cache
Remove-Item -Recurse -Force .vite
npm run build
```

## Development Workflow

### Watch Mode (Development)

```powershell
# Terminal 1: Build with watch
npm run dev

# In Chrome: 
# 1. Go to chrome://extensions/
# 2. Click reload icon on extension
# 3. Changes auto-rebuild
```

### Testing

```powershell
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage
```

### Linting & Formatting

```powershell
# Check for lint errors
npm run lint

# Auto-format code
npm run format
```

## Next Steps

### Customize Settings

1. Click extension icon
2. Go to "Statistics" tab
3. View current configuration
4. Modify in `src/background/background.ts` (DEFAULT_CONFIG)

### Add Custom Features

The codebase follows clean architecture:

- **Add UI component**: `src/components/`
- **Add AI service**: `src/lib/ai/`
- **Add database logic**: `src/lib/db/repository.ts`
- **Add utility**: `src/utils/helpers.ts`

### Create Icons

Replace placeholder icons in `public/icons/`:
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

Use online tools:
- https://favicon.io/
- https://www.canva.com/

## Useful Commands

```powershell
# Full rebuild
npm run build

# Development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Clean build
Remove-Item -Recurse -Force dist
npm run build
```

## Support

If you encounter issues:

1. Check this guide first
2. Search existing GitHub issues
3. Create new issue with:
   - Chrome version
   - Error messages
   - Steps to reproduce

## Resources

- [Chrome Built-in AI Docs](https://developer.chrome.com/docs/ai/built-in)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Dexie.js Docs](https://dexie.org/)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**You're all set! Start browsing and building your personal knowledge base.** 🧠✨
