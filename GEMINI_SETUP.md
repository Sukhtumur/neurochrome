# 🌐 Gemini API Setup Guide

## 🎯 Quick Setup (5 Minutes)

### Why Gemini API?

Your extension uses a **hybrid AI strategy**:
- **Chrome AI**: On-device, private, fast (when available)
- **Gemini API**: Cloud-based, reliable, always works

Since Chrome AI isn't available in all builds yet, Gemini API ensures your extension **works right now**.

## 🔑 Get Your Free API Key

### Step 1: Visit Google AI Studio

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account

### Step 2: Create API Key

1. Click **"Get API Key"** or **"Create API Key"**
2. Select or create a Google Cloud project (or use default)
3. Click **"Create API Key"**
4. Copy your API key (starts with `AIzaSy...`)

### Step 3: Configure Extension

1. Open **Local Web Brain** extension popup
2. Click **Settings** tab
3. Paste your API key in the **Gemini API Key** field
4. Click **"Save & Reload Extension"**
5. Extension will reload automatically

## ✅ Verify Setup

After saving your API key, check the Settings tab:

### Provider Status
You should see a **purple badge**:
```
Using Gemini API
```

### Status Message
```
Chrome AI is unavailable. Using Gemini API as fallback.
```

### All 6 Capabilities Green
All APIs should show green checkmarks ✓:
- ✅ Prompt API (Embeddings)
- ✅ Summarizer API
- ✅ Writer API
- ✅ Translator API
- ✅ Proofreader API
- ✅ Rewriter API

## 🔒 Security & Privacy

### Where is my API key stored?
- Stored securely in `chrome.storage.sync`
- Never sent to third parties
- Only used to call Google's Gemini API
- Syncs across your Chrome profile

### Can I change my API key?
Yes! Just enter a new key in Settings and save.

### What data is sent to Gemini?
- Only page summaries (2-3 sentences)
- Not full page content
- No cookies or tracking data
- Only text content

## 📊 Free Tier Limits

Gemini API offers generous free tier:
- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

For typical browsing (50-100 pages/day), you'll stay within limits.

## 🐛 Troubleshooting

### "API key invalid" error
- Verify key starts with `AIzaSy`
- Check for extra spaces
- Try regenerating key in AI Studio

### "Quota exceeded" error
- You've hit the 15 req/min or 1,500/day limit
- Wait a few minutes and try again

### Features not working
- Check internet connection (Gemini requires network)
- Verify API key is saved
- Check browser console for errors
- Try reloading extension

### "Network error" messages
- Check firewall/VPN settings
- Ensure `generativelanguage.googleapis.com` is not blocked
- Try disabling ad blockers

## 🎯 Best Practices

### Privacy Tips
- Gemini API sees your page summaries (not full content)
- Summaries generated locally first
- If privacy is critical, wait for Chrome AI to become available

### Performance Tips
- Gemini API calls take 1-3 seconds
- Results cached locally
- Duplicate pages not re-summarized

## 🏆 Why This Works

The hybrid approach gives you:
1. **Reliability**: Always works, even without Chrome AI
2. **Production Ready**: Deployable today
3. **Future Proof**: Automatically switches to Chrome AI when available
4. **Best of Both Worlds**: Privacy when possible, reliability always

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Pricing & Quotas](https://ai.google.dev/pricing)
- [Google AI Studio](https://aistudio.google.com/)

---

**Ready?** Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey) and start using your extension! 🚀
