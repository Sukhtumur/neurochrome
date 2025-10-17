# Quick Setup Checklist for Chrome Built-in AI

## 🚀 Quick Start (5 minutes)

### Step 1: Install Chrome Canary
- [ ] Download from: https://www.google.com/chrome/canary/
- [ ] Install and launch

### Step 2: Enable AI Flags
Open `chrome://flags` and enable these flags:

```
chrome://flags/#optimization-guide-on-device-model
→ "Enabled BypassPerfRequirement"

chrome://flags/#prompt-api-for-gemini-nano
→ "Enabled"

chrome://flags/#summarization-api-for-gemini-nano  
→ "Enabled"

chrome://flags/#writer-api-for-gemini-nano
→ "Enabled"

chrome://flags/#translator-api-for-gemini-nano
→ "Enabled"

chrome://flags/#language-detection-api
→ "Enabled"
```

- [ ] Click "Relaunch" button

### Step 3: Download Gemini Nano Model
1. Open DevTools (F12)
2. Run in console:
   ```javascript
   await ai.languageModel.create()
   ```
3. Go to `chrome://components/`
4. Find "Optimization Guide On Device Model"
5. Wait for download (1.5-3GB, 5-30 minutes)

- [ ] Model downloaded and shows "Up to date"

### Step 4: Verify AI Works
In DevTools console:
```javascript
const session = await ai.languageModel.create();
await session.prompt("Say hello!");
```

- [ ] Returns response without errors

### Step 5: Load Extension
```bash
cd C:\Users\sukhtumur\Documents\neurochrome
npm run build
```

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist` folder

- [ ] Extension loaded without errors

### Step 6: Test Extension
- [ ] Click extension icon - popup opens
- [ ] Visit any webpage - gets captured
- [ ] Type `brain test` in address bar - search works
- [ ] Check background console - no errors

## ✅ You're Done!

Your Local Web Brain extension is now using on-device Gemini Nano AI!

---

## 🐛 Quick Troubleshooting

**AI not available?**
→ Check all flags enabled, restart Chrome

**Model not downloading?**
→ Check internet, wait 30 min, try again

**Extension errors?**
→ Reload extension, check service worker console

**Can't find something?**
→ See full guide: `CHROME_AI_SETUP.md`

---

## 📝 Quick Test Commands

Test in DevTools console (F12):

```javascript
// Check AI availability
await ai.languageModel.capabilities()
// Should return: { available: "readily" }

// Test prompt
const s = await ai.languageModel.create();
await s.prompt("Hello!")

// Test summarizer  
const sum = await ai.summarizer.create();
await sum.summarize("Long text here...")

// Check in extension
chrome.ai.languageModel.capabilities().then(console.log)
```

---

## 📍 Important URLs

- Flags: `chrome://flags`
- Components: `chrome://components/`
- Extensions: `chrome://extensions/`
- AI Docs: https://developer.chrome.com/docs/ai/built-in

---

**Need help?** See `CHROME_AI_SETUP.md` for detailed instructions.
