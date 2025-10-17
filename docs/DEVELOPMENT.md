# Development Guide

## Getting Started

### Prerequisites

Ensure you have these installed:

```powershell
# Check Node.js version (requires 18+)
node --version

# Check npm version
npm --version

# Install dependencies
npm install
```

## Development Workflow

### 1. Development Mode

```powershell
# Start Vite in watch mode
npm run dev

# In another terminal, run tests in watch mode
npm run test -- --watch
```

This will:
- Build the extension to `dist/`
- Watch for file changes
- Rebuild automatically
- Output source maps for debugging

### 2. Load Extension

1. Open Chrome Canary
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` folder

### 3. Reload After Changes

After making changes:
1. Vite rebuilds automatically
2. Go to `chrome://extensions/`
3. Click reload icon on your extension
4. Test your changes

## Project Structure Explained

### Entry Points

The extension has 3 main entry points:

1. **Background Worker** (`src/background/background.ts`)
   - Service worker (runs in background)
   - Handles tab monitoring, omnibox, messages
   - Entry: Defined in `vite.config.ts`

2. **Content Script** (`src/content/content-script.ts`)
   - Injected into web pages
   - Extracts page content
   - Entry: Defined in `vite.config.ts`

3. **Popup** (`src/popup/index.html`)
   - UI when clicking extension icon
   - Svelte app with routing
   - Entry: HTML file with script tag

### Directory Purpose

```
src/
├── background/     → Background service worker logic
├── content/        → Scripts injected into pages
├── popup/          → Extension popup UI
├── components/     → Reusable Svelte components
├── lib/            → Core business logic (services)
├── types/          → TypeScript type definitions
├── utils/          → Utility functions
└── tests/          → Unit and integration tests
```

## Code Organization Principles

### 1. Clean Architecture

Follow the dependency rule:

```
Presentation → Application → Domain ← Infrastructure
```

- **Domain** (`types/`): Pure TypeScript interfaces, no dependencies
- **Infrastructure** (`lib/ai/`, `lib/db/`, `lib/crypto/`): External integrations
- **Application** (`lib/query/`): Business logic orchestration
- **Presentation** (`components/`, `popup/`): User interface

### 2. File Naming

- **Components**: PascalCase (e.g., `SearchBar.svelte`)
- **Services**: kebab-case (e.g., `chrome-ai.ts`)
- **Utilities**: kebab-case (e.g., `helpers.ts`)
- **Types**: kebab-case (e.g., `chrome-ai.d.ts`)

### 3. Import Aliases

Use path aliases for cleaner imports:

```typescript
// ❌ Bad
import { Memory } from '../../types/index'

// ✅ Good
import type { Memory } from '@/types'
```

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["src/*"],
    "@/lib/*": ["src/lib/*"],
    "@/types/*": ["src/types/*"]
  }
}
```

## Adding New Features

### Example: Add New AI Service

1. **Define Interface** (`src/types/index.ts`)

```typescript
export interface ImageAnalysisResult {
  description: string
  tags: string[]
}
```

2. **Create Service** (`src/lib/ai/image-analyzer.ts`)

```typescript
import { ErrorType, ExtensionError } from '@/types'
import { logger } from '@/utils/logger'

export class ImageAnalyzerService {
  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    try {
      logger.debug('Analyzing image...')
      // Implementation here
      return { description: '', tags: [] }
    } catch (error) {
      logger.error('Image analysis failed:', error)
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Failed to analyze image',
        error
      )
    }
  }
}

export const imageAnalyzer = new ImageAnalyzerService()
```

3. **Export** (`src/lib/ai/index.ts`)

```typescript
export { imageAnalyzer, ImageAnalyzerService } from './image-analyzer'
```

4. **Use in Application**

```typescript
import { imageAnalyzer } from '@/lib/ai'

const result = await imageAnalyzer.analyzeImage(url)
```

### Example: Add New Component

1. **Create Component** (`src/components/ImageGallery.svelte`)

```svelte
<script lang="ts">
  export let images: string[] = []
  
  function handleClick(image: string) {
    console.log('Clicked:', image)
  }
</script>

<div class="grid grid-cols-3 gap-4">
  {#each images as image}
    <button on:click={() => handleClick(image)}>
      <img src={image} alt="" class="rounded-lg" />
    </button>
  {/each}
</div>
```

2. **Use in Parent**

```svelte
<script lang="ts">
  import ImageGallery from '@/components/ImageGallery.svelte'
  
  const images = [...]
</script>

<ImageGallery {images} />
```

## Testing

### Running Tests

```powershell
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Run specific test file
npm test -- helpers.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/utils/helpers'

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })

  it('should handle edge case', () => {
    expect(() => myFunction('')).toThrow()
  })
})
```

### Mocking Chrome APIs

```typescript
import { vi } from 'vitest'

// Mock chrome.storage
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
}
```

## Debugging

### Background Worker

1. Go to `chrome://extensions/`
2. Click "Service Worker" under your extension
3. DevTools opens for background script
4. Set breakpoints, inspect variables

### Content Script

1. Open page where content script runs
2. Open DevTools (F12)
3. Go to Sources tab
4. Find content-script.js
5. Set breakpoints

### Popup

1. Right-click extension icon
2. Select "Inspect popup"
3. DevTools opens for popup
4. Use Console, Sources, etc.

### Logging

Use the logger utility:

```typescript
import { logger } from '@/utils/logger'

logger.debug('Detailed info', { data })  // Only in dev
logger.info('Important event', { data })
logger.warn('Potential issue', { data })
logger.error('Critical error', error)
```

## Building for Production

### Production Build

```powershell
# Clean build
Remove-Item -Recurse -Force dist
npm run build
```

This will:
- Compile TypeScript
- Bundle with Vite
- Minify JavaScript
- Optimize assets
- Output to `dist/`

### Build Output

```
dist/
├── manifest.json           # Extension manifest
├── background.js           # Background worker (minified)
├── content-script.js       # Content script (minified)
├── popup/
│   ├── index.html         # Popup HTML
│   └── assets/            # CSS, JS chunks
└── icons/                 # Extension icons
```

### Testing Production Build

```powershell
# Build
npm run build

# Load dist/ folder in Chrome
# Test all features
```

## Code Quality

### Linting

```powershell
# Check for errors
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Formatting

```powershell
# Format all files
npm run format

# Check formatting
npm run format -- --check
```

### Pre-commit Checklist

Before committing:

- [ ] Tests pass (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Types correct (`tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)

## Common Issues

### Issue: Module not found

**Problem**: Import error like `Cannot find module '@/types'`

**Solution**:
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: Vite fails to build

**Problem**: Build errors or crashes

**Solution**:
```powershell
# Clear Vite cache
Remove-Item -Recurse -Force node_modules/.vite
Remove-Item -Recurse -Force dist
npm run build
```

### Issue: Extension not updating

**Problem**: Changes not reflected in Chrome

**Solution**:
1. Check Vite rebuilt (watch terminal output)
2. Click reload in `chrome://extensions/`
3. Hard refresh popup (Ctrl+Shift+R)
4. Restart Chrome if needed

### Issue: Chrome AI APIs not available

**Problem**: `chrome.ai.summarizer.available()` returns false

**Solution**:
1. Use Chrome Canary (not stable Chrome)
2. Enable flags (see QUICKSTART.md)
3. Restart Chrome
4. Wait for AI model download (~5 minutes first time)

## Performance Optimization

### Bundle Size

Check bundle size:

```powershell
npm run build
# Check dist/ folder sizes
```

Optimize if needed:
- Use code splitting
- Lazy load components
- Tree-shake unused code

### Memory Usage

Monitor memory in DevTools:
1. Performance tab
2. Record memory timeline
3. Look for memory leaks

### Database Performance

Optimize queries:
```typescript
// ❌ Bad: Fetch all, then filter
const all = await memoryRepository.getAll()
const filtered = all.filter(m => m.url.includes('example'))

// ✅ Good: Use database query
const filtered = await memoryRepository.searchByText('example')
```

## Extension Publishing

### Prepare for Submission

1. **Create Icons** (see `public/icons/README.md`)
2. **Test Thoroughly**
3. **Update Manifest** (version, description)
4. **Build Production** (`npm run build`)
5. **Create ZIP** (package `dist/` folder)

### ZIP for Distribution

```powershell
# Create release ZIP
Compress-Archive -Path dist\* -DestinationPath local-web-brain-v1.0.0.zip
```

### Chrome Web Store

Follow [Chrome Web Store guide](https://developer.chrome.com/docs/webstore/publish/)

## Resources

### Documentation
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/)
- [Chrome AI APIs](https://developer.chrome.com/docs/ai/built-in)
- [Svelte](https://svelte.dev/)
- [Vite](https://vitejs.dev/)
- [Dexie](https://dexie.org/)
- [TailwindCSS](https://tailwindcss.com/)

### Tools
- [Chrome Canary](https://www.google.com/chrome/canary/)
- [VS Code](https://code.visualstudio.com/)
- [Svelte DevTools](https://github.com/sveltejs/svelte-devtools)

---

**Happy coding! 🚀**

For questions, check existing documentation or create an issue on GitHub.
