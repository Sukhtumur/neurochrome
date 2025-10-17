# Chrome Built-in AI (Gemini Nano) Setup Guide

This guide will help you set up and test the Chrome Built-in AI APIs (Gemini Nano) for the Local Web Brain extension.

## Prerequisites

### 1. Chrome Canary (Required)
- **Download**: [Chrome Canary](https://www.google.com/chrome/canary/)
- **Why**: Built-in AI APIs are only available in Chrome Canary (Version 128+)
- **Current stable version**: Not yet available in regular Chrome

### 2. Minimum System Requirements
- **Windows**: Windows 10/11 (64-bit)
- **macOS**: macOS 13 or later
- **RAM**: At least 8GB (16GB recommended)
- **Storage**: ~10GB free space (for Gemini Nano model)

---

## Step-by-Step Setup

### Step 1: Enable Chrome AI Flags

1. **Open Chrome Canary** and navigate to:
   ```
   chrome://flags
   ```

2. **Enable the following flags** (search for each and set to "Enabled"):

   #### Required Flags:
   ```
   chrome://flags/#optimization-guide-on-device-model
   → Set to: "Enabled BypassPerfRequirement"
   
   chrome://flags/#prompt-api-for-gemini-nano
   → Set to: "Enabled"
   
   chrome://flags/#summarization-api-for-gemini-nano
   → Set to: "Enabled"
   
   chrome://flags/#writer-api-for-gemini-nano
   → Set to: "Enabled"
   
   chrome://flags/#translator-api-for-gemini-nano
   → Set to: "Enabled"
   
   chrome://flags/#language-detection-api
   → Set to: "Enabled"
   ```

   #### Optional (for debugging):
   ```
   chrome://flags/#optimization-guide-debug-logs
   → Set to: "Enabled"
   ```

3. **Restart Chrome Canary** (click "Relaunch" button)

### Step 2: Download Gemini Nano Model

1. **Open DevTools Console**:
   - Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)

2. **Check AI availability**:
   ```javascript
   // Check if APIs are available
   await chrome.aiOriginTrial.languageModel.capabilities()
   ```
   
   Or use the newer API:
   ```javascript
   await ai.languageModel.capabilities()
   ```

3. **Expected Response**:
   ```javascript
   {
     available: "readily" | "after-download" | "no"
   }
   ```

4. **If status is "after-download"**, trigger download:
   ```javascript
   // Create a session to trigger model download
   const session = await ai.languageModel.create();
   ```

5. **Monitor download progress**:
   - Go to: `chrome://components/`
   - Look for: **"Optimization Guide On Device Model"**
   - Status should show version and "Up to date"
   - If downloading, you'll see progress

6. **Download size**: ~1.5-3GB (may take 5-30 minutes depending on connection)

### Step 3: Verify Installation

#### Test 1: Check Capabilities
```javascript
// In DevTools console
const capabilities = await ai.languageModel.capabilities();
console.log('AI Available:', capabilities.available);
```

Expected: `"readily"`

#### Test 2: Test Prompt API
```javascript
const session = await ai.languageModel.create();
const result = await session.prompt("Hello! Can you tell me a joke?");
console.log(result);
session.destroy();
```

#### Test 3: Test Summarizer API
```javascript
const summarizer = await ai.summarizer.create();
const summary = await summarizer.summarize(
  "This is a long text about artificial intelligence and machine learning..."
);
console.log(summary);
summarizer.destroy();
```

#### Test 4: Test in Extension
```javascript
// In your extension's background script console
chrome.ai.languageModel.capabilities().then(console.log);
```

---

## Extension-Specific Setup

### Step 1: Load the Extension

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Open Chrome Canary**:
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode** (toggle in top-right)

4. **Load Unpacked**:
   - Click "Load unpacked"
   - Select: `C:\Users\sukhtumur\Documents\neurochrome\dist`

5. **Verify Extension Loaded**:
   - You should see "Local Web Brain" with no errors
   - Click the extension icon to test popup

### Step 2: Test Extension Features

#### 2.1 Test Background Service Worker
1. Click "Service Worker" link in extension card
2. Check console for initialization logs:
   ```
   [INFO] Initializing Chrome AI services...
   [INFO] AI capabilities: {...}
   ```

#### 2.2 Test Content Capture
1. Visit any webpage (e.g., https://wikipedia.org)
2. The extension should auto-capture after a few seconds
3. Check background console for:
   ```
   [INFO] Capturing webpage: https://...
   [DEBUG] Generating summary...
   [DEBUG] Generating embedding...
   ```

#### 2.3 Test Omnibox Search
1. Type in address bar: `brain` + `space`
2. You should see: "Search memories..."
3. Type a query and press Enter
4. Results should appear in a new tab

#### 2.4 Test Popup UI
1. Click extension icon
2. Try all three tabs:
   - **Search**: Query your memories
   - **Memories**: Browse stored pages
   - **Stats**: View statistics

---

## Troubleshooting

### Issue 1: "AI APIs not available"

**Symptoms**:
```javascript
capabilities.available === "no"
```

**Solutions**:
1. ✅ Verify all flags are enabled (Step 1)
2. ✅ Restart Chrome Canary completely
3. ✅ Check system requirements (8GB+ RAM)
4. ✅ Try: `chrome://flags/#optimization-guide-on-device-model` → "Enabled BypassPerfRequirement"

### Issue 2: Model not downloading

**Symptoms**:
- `chrome://components/` shows "Optimization Guide" but no version
- Status stuck on "Checking for update"

**Solutions**:
1. ✅ Check internet connection
2. ✅ Disable VPN/proxy temporarily
3. ✅ Manually trigger download:
   ```javascript
   await ai.languageModel.create()
   ```
4. ✅ Wait 10-30 minutes (large download)
5. ✅ Check: `chrome://histograms/OptimizationGuide`

### Issue 3: "Session creation failed"

**Symptoms**:
```
Error: Failed to create AI session
```

**Solutions**:
1. ✅ Verify model downloaded: `chrome://components/`
2. ✅ Restart Chrome Canary
3. ✅ Check available disk space (need ~10GB)
4. ✅ Try deleting and re-downloading:
   - Go to: `chrome://components/`
   - Find: "Optimization Guide On Device Model"
   - Click: "Check for update"

### Issue 4: Extension service worker errors

**Symptoms**:
```
[ERROR] Failed to initialize AI services
```

**Solutions**:
1. ✅ Check background service worker console
2. ✅ Verify manifest permissions are correct
3. ✅ Reload extension: `chrome://extensions/` → Click reload icon
4. ✅ Check Chrome Canary version (need 128+)

### Issue 5: Content script errors

**Symptoms**:
```
Could not establish connection. Receiving end does not exist.
```

**Solutions**:
1. ✅ Reload the webpage
2. ✅ Reload the extension
3. ✅ Check if content script injected:
   - Open DevTools on webpage
   - Go to Sources → Content Scripts
   - Should see: content-script.js

---

## API Reference

### Available APIs in Your Extension

Your extension uses these Chrome Built-in AI APIs:

#### 1. Language Model (Prompt API)
```typescript
// Create session
const session = await chrome.ai.languageModel.create();

// Generate text
const response = await session.prompt("Your prompt here");

// Cleanup
session.destroy();
```

#### 2. Summarizer API
```typescript
// Create summarizer
const summarizer = await chrome.ai.summarizer.create({
  type: 'key-points',  // or 'tl;dr', 'teaser', 'headline'
  format: 'markdown',  // or 'plain-text'
  length: 'medium'     // or 'short', 'long'
});

// Summarize text
const summary = await summarizer.summarize(longText);

// Cleanup
summarizer.destroy();
```

#### 3. Writer API
```typescript
// Create writer
const writer = await chrome.ai.writer.create({
  tone: 'formal',        // or 'casual', 'neutral'
  format: 'plain-text',  // or 'markdown'
  length: 'medium'       // or 'short', 'long'
});

// Generate text
const text = await writer.write("Write about...");

// Cleanup
writer.destroy();
```

#### 4. Translator API
```typescript
// Create translator
const translator = await chrome.ai.translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'es'
});

// Translate
const translated = await translator.translate("Hello world");

// Cleanup
translator.destroy();
```

#### 5. Language Detection API
```typescript
// Detect language
const detector = await chrome.ai.languageDetector.create();
const languages = await detector.detect("Bonjour le monde");
console.log(languages);
// [{ language: 'fr', confidence: 0.95 }]

detector.destroy();
```

---

## Performance Tips

### 1. Reuse Sessions
```typescript
// ❌ Bad: Create new session every time
async function query() {
  const session = await ai.languageModel.create();
  const result = await session.prompt("...");
  session.destroy();
}

// ✅ Good: Reuse session
let session;
async function initSession() {
  session = await ai.languageModel.create();
}
async function query() {
  if (!session) await initSession();
  return await session.prompt("...");
}
```

### 2. Batch Operations
```typescript
// Process multiple queries with same session
const results = await Promise.all(
  queries.map(q => session.prompt(q))
);
```

### 3. Cleanup Resources
```typescript
// Always destroy sessions when done
window.addEventListener('beforeunload', () => {
  session?.destroy();
});
```

---

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Chrome Canary installed (Version 128+)
- [ ] All required flags enabled
- [ ] Chrome restarted after enabling flags
- [ ] Gemini Nano model downloaded (`chrome://components/`)
- [ ] AI capabilities check returns "readily"
- [ ] Test prompt API in DevTools console
- [ ] Extension loaded without errors
- [ ] Background service worker shows AI initialized
- [ ] Content script injects on web pages
- [ ] Page capture works (check storage)
- [ ] Omnibox search works (`brain` keyword)
- [ ] Popup UI loads all three tabs
- [ ] Search tab returns results
- [ ] Memories tab shows captured pages
- [ ] Stats tab displays metrics

---

## Additional Resources

### Official Documentation
- [Chrome AI Origin Trial](https://developer.chrome.com/docs/ai/built-in)
- [Prompt API Explainer](https://github.com/explainers-by-googlers/prompt-api)
- [Chrome AI Model Card](https://developer.chrome.com/docs/ai/model-card)

### Community Resources
- [Chrome AI Examples](https://github.com/GoogleChromeLabs/chrome-ai-samples)
- [Web AI Community Group](https://www.w3.org/community/web-ai/)

### Your Project Files
- `src/lib/ai/chrome-ai.ts` - AI service wrapper
- `src/background/background.ts` - Extension orchestrator
- `src/lib/query/index.ts` - Query processing
- `QUICKSTART.md` - Quick start guide

---

## Next Steps

Once everything is working:

1. **Test thoroughly**: Visit various websites and verify capture
2. **Query your memories**: Use omnibox (`brain <query>`)
3. **Check storage**: Open popup → Stats tab
4. **Report issues**: Check console logs for errors
5. **Optimize**: Adjust config in `src/background/background.ts`

---

## Support

If you encounter issues:

1. **Check logs**: Background service worker console
2. **Verify setup**: Run through checklist above
3. **Test APIs**: Use DevTools console tests
4. **Check Chrome version**: Must be Canary 128+
5. **Review docs**: `README.md`, `QUICKSTART.md`

---

**Happy Building! 🧠✨**

Your Local Web Brain is ready to turn your browsing history into semantic memory!
