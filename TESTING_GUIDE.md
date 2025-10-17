# 🧪 Testing Guide

## 📋 Complete Testing Steps

### 1. Extension Loading (2 min)

**Steps:**
1. Open Chrome Canary
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select folder: `c:\Users\sukhtumur\Documents\neurochrome\dist`

**Verify:**
- [ ] Extension appears in list
- [ ] Extension icon visible in toolbar
- [ ] No errors shown
- [ ] Version shows 1.0.0

### 2. API Key Configuration (2 min)

**Steps:**
1. Click extension icon
2. Navigate to **Settings** tab
3. Enter API key: `AIzaSyDAcCOOCJiqiLG89_dAyR-JD_AzNlgbGf0`
4. Click "Save & Reload Extension"
5. Reopen extension popup

**Verify:**
- [ ] Purple badge shows "Using Gemini API"
- [ ] All 6 APIs show green checkmarks ✓
- [ ] API key persisted after reload
- [ ] Status message: "Chrome AI is unavailable. Using Gemini API as fallback."

### 3. Service Worker Check (2 min)

**Steps:**
1. Go to `chrome://extensions/`
2. Click "service worker" link under your extension
3. Check console logs

**Verify:**
- [ ] `[INFO] Initializing Local Web Brain...`
- [ ] `[INFO] Database initialized`
- [ ] `[INFO] AI services initialized (provider: gemini)`
- [ ] `[INFO] Extension initialized successfully`
- [ ] No error messages (red text)

### 4. Webpage Capture (3 min)

**Steps:**
1. Visit `https://en.wikipedia.org/wiki/Artificial_intelligence`
2. Wait 2-3 seconds
3. Click extension icon → Memories tab

**Verify:**
- [ ] New memory appears
- [ ] Shows Wikipedia page title
- [ ] Has AI-generated summary (2-3 sentences)
- [ ] Shows timestamp
- [ ] Visit count is 1

**Service Worker Console:**
- [ ] `[INFO] Capturing webpage: https://...`
- [ ] `[DEBUG] Generating summary...`
- [ ] `[DEBUG] Generating embedding...`
- [ ] `[INFO] Memory saved successfully`

### 5. Omnibox Search (2 min)

**Steps:**
1. Click Chrome address bar
2. Type: `lw` (lowercase L, W)
3. Press Space
4. Type: `artificial intelligence`
5. Press Enter

**Verify:**
- [ ] Address bar activates extension (purple theme)
- [ ] Extension popup opens with results
- [ ] Results show relevant memories
- [ ] Memories ranked by relevance

### 6. Translate Feature (2 min)

**Steps:**
1. In Memories tab, select any memory
2. Click **🌐 Translate** button
3. Select target language: Spanish
4. Wait for translation

**Verify:**
- [ ] Summary changes to Spanish
- [ ] Translation makes sense
- [ ] No errors in console
- [ ] Can translate back to English

### 7. Rewrite Feature (2 min)

**Steps:**
1. In Memories tab, select any memory
2. Click **✏️ Rewrite** button
3. Select options:
   - Tone: Professional
   - Length: Short
   - Format: Bullet points
4. Wait for rewrite

**Verify:**
- [ ] Summary rewrites with selected style
- [ ] Format matches selection
- [ ] Content meaning preserved
- [ ] No errors in console

### 8. Multiple Captures (3 min)

**Steps:**
1. Visit `https://en.wikipedia.org/wiki/Machine_learning`
2. Visit `https://en.wikipedia.org/wiki/Deep_learning`
3. Visit `https://en.wikipedia.org/wiki/Neural_network`
4. Check Memories tab

**Verify:**
- [ ] All 4 pages captured
- [ ] Each has unique summary
- [ ] All timestamps different
- [ ] No duplicate entries

### 9. Re-visit Test (1 min)

**Steps:**
1. Visit Wikipedia AI page again (already captured)
2. Check console

**Verify:**
- [ ] Console shows "URL already captured"
- [ ] Visit count incremented to 2
- [ ] No duplicate memory created

### 10. Error Handling (3 min)

**Test Invalid API Key:**
1. Go to Settings
2. Enter: `invalid-key-123`
3. Save & reload
4. Try to capture page

**Verify:**
- [ ] Extension shows error message
- [ ] Extension doesn't crash
- [ ] Can recover by entering correct key

**Test Network Offline:**
1. Disconnect internet
2. Try to capture page

**Verify:**
- [ ] Appropriate error shown
- [ ] Extension doesn't crash
- [ ] Works again after reconnecting

## 🎯 Quick Verification

**Must Pass:**
- ✅ Extension loads without errors
- ✅ API key saves successfully
- ✅ Auto-capture generates summaries
- ✅ Omnibox search works
- ✅ No console errors

**Should Pass:**
- ✅ Translate feature works
- ✅ Rewrite feature works
- ✅ Multiple captures work
- ✅ Re-visit increments count
- ✅ Error handling graceful

## 🐛 Troubleshooting

### Extension Not Loading
- Check `dist/manifest.json` exists
- Verify no syntax errors: `npm run build`
- Check browser console for errors

### API Key Not Saving
- Enable Chrome sync: `chrome://settings/syncSetup`
- Try manual save in console:
  ```javascript
  chrome.storage.sync.set({ geminiApiKey: 'AIzaSy...' })
  ```

### Features Not Working
- Verify internet connection
- Check service worker console for errors
- Verify provider shows "Using Gemini API"
- Try reloading extension

### No Memories Captured
- Check URL isn't on ignore list (chrome://, etc.)
- Verify page has >200 characters
- Check service worker is running
- Look for errors in console

## 📊 Expected Performance

- **Capture Time**: 2-3 seconds per page
- **Search Time**: <1 second
- **Translate Time**: 1-2 seconds
- **Rewrite Time**: 1-2 seconds

## ✅ Testing Complete

When all tests pass:
1. ✅ Extension is production-ready
2. ✅ All features functional
3. ✅ Ready to record demo
4. ✅ Ready to submit

---

**Next:** Record demo video showing all features working!
