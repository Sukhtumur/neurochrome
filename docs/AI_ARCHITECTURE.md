# Chrome Built-in AI Architecture & Setup Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Canary Browser                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Your Extension (Local Web Brain)         │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │  Background Worker          Content Script            │  │
│  │  ┌────────────────┐         ┌────────────────┐      │  │
│  │  │ • AI Service   │         │ • Extract      │      │  │
│  │  │ • Capture      │◄────────┤   Content      │      │  │
│  │  │ • Query        │         │ • Send to BG   │      │  │
│  │  │ • Storage      │         └────────────────┘      │  │
│  │  └────┬───────────┘                                  │  │
│  │       │                                               │  │
│  │       │ API Calls                                     │  │
│  │       ▼                                               │  │
│  └───────┼───────────────────────────────────────────────┘  │
│          │                                                   │
│  ┌───────┼───────────────────────────────────────────────┐  │
│  │       │       Chrome Built-in AI APIs                 │  │
│  │       │                                                │  │
│  │  ┌────▼────────┐  ┌──────────┐  ┌──────────┐        │  │
│  │  │ Prompt API  │  │Summarizer│  │  Writer  │        │  │
│  │  │ (Gemini)    │  │   API    │  │   API    │        │  │
│  │  └─────────────┘  └──────────┘  └──────────┘        │  │
│  │                                                        │  │
│  │  ┌──────────┐  ┌────────────┐  ┌────────────┐       │  │
│  │  │Translator│  │  Language  │  │ Rewriter   │       │  │
│  │  │   API    │  │ Detector   │  │    API     │       │  │
│  │  └──────────┘  └────────────┘  └────────────┘       │  │
│  │         │              │               │              │  │
│  └─────────┼──────────────┼───────────────┼──────────────┘  │
│            │              │               │                  │
│  ┌─────────▼──────────────▼───────────────▼──────────────┐  │
│  │                                                         │  │
│  │           Gemini Nano Model (~3GB)                     │  │
│  │           (On-Device AI Processing)                    │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Setup Flow

```
┌─────────────┐
│   START     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ 1. Install Chrome Canary│
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 2. Enable AI Flags      │
│    chrome://flags       │
│    (6 flags)            │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 3. Restart Chrome       │
│    (Click Relaunch)     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐      ┌─────────────────┐
│ 4. Trigger Download     │      │  Model Size:    │
│    ai.languageModel     │      │  ~3GB           │
│    .create()            │─────▶│  Time: 5-30min  │
└──────────┬──────────────┘      └─────────────────┘
           │
           ▼
┌─────────────────────────┐
│ 5. Wait for Download    │
│    chrome://components/ │
│    Check progress       │
└──────────┬──────────────┘
           │
           ▼
     ┌─────────┐
     │Downloaded│
     │?        │
     └────┬────┘
          │ No
          │ (Wait more)
          │
          │ Yes
          ▼
┌─────────────────────────┐
│ 6. Verify AI Available  │
│    capabilities()       │
│    → "readily"          │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 7. Build Extension      │
│    npm run build        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 8. Load Extension       │
│    chrome://extensions/ │
│    Load unpacked        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 9. Test Extension       │
│    • Visit webpage      │
│    • Check capture      │
│    • Try search         │
└──────────┬──────────────┘
           │
           ▼
     ┌─────────┐
     │  DONE!  │
     └─────────┘
```

## 🔍 Data Flow in Extension

```
                    User Browses Web
                           │
                           ▼
    ┌──────────────────────────────────────┐
    │       Webpage Loaded                 │
    │   (e.g., wikipedia.org/AI)           │
    └─────────────┬────────────────────────┘
                  │
                  ▼
    ┌──────────────────────────────────────┐
    │   Content Script Extracts            │
    │   • Title                            │
    │   • Main content (up to 50k chars)   │
    │   • URL                              │
    └─────────────┬────────────────────────┘
                  │
                  │ chrome.runtime.sendMessage
                  │
                  ▼
    ┌──────────────────────────────────────┐
    │   Background Service Worker          │
    │   Receives: { title, text, url }     │
    └─────────────┬────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐   ┌──────────────┐
│ AI Summarize │   │  AI Embed    │
│ (500 chars)  │   │ (Float32Array│
└──────┬───────┘   └──────┬───────┘
       │                  │
       │     ┌────────────┘
       │     │
       ▼     ▼
┌──────────────────────────────────────┐
│   Encrypt with AES-GCM               │
│   (Summary only)                     │
└─────────────┬────────────────────────┘
              │
              ▼
┌──────────────────────────────────────┐
│   Store in IndexedDB (Dexie)         │
│   {                                  │
│     id, url, title,                  │
│     summary: encrypted,              │
│     embedding: Float32Array,         │
│     created_at, tags                 │
│   }                                  │
└──────────────────────────────────────┘


Later... User Searches
           │
           ▼
    ┌──────────────────┐
    │ Omnibox Query    │
    │ "brain AI"       │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Background Worker                │
    │ 1. AI Embed(query)               │
    │ 2. Vector Search (cosine sim)    │
    │ 3. Get top 5 results             │
    │ 4. Decrypt summaries             │
    │ 5. AI Write(answer)              │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Display Results                  │
    │ • Natural language answer        │
    │ • Source links with scores       │
    └──────────────────────────────────┘
```

## 🧩 Chrome AI API Usage in Your Extension

### Location: `src/lib/ai/chrome-ai.ts`

```
ChromeAIService (Singleton)
├── initialize()
│   └── Check availability of all 5 APIs
│
├── summarize(text, maxLength)
│   ├── Used by: background.ts
│   ├── When: Page captured
│   └── Purpose: Create 500-char summary
│
├── embed(text)
│   ├── Used by: background.ts, query/index.ts
│   ├── When: Page captured, Search query
│   └── Purpose: Generate vector embeddings
│
├── write(prompt, options)
│   ├── Used by: query/index.ts
│   ├── When: User searches
│   └── Purpose: Generate natural language answer
│
├── translate(text, targetLang, sourceLang)
│   ├── Status: Available but not used yet
│   └── Future: Multi-language support
│
└── proofread(text)
    ├── Status: Available but not used yet
    └── Future: Content quality checking
```

## 📊 Performance Characteristics

```
┌──────────────────────────────────────────────────────────┐
│ Operation            │ Time     │ Privacy  │ Cost        │
├──────────────────────┼──────────┼──────────┼─────────────┤
│ Summarize (500 char) │ 1-3s     │ Private  │ Free        │
│ Embed (vector)       │ 0.5-1s   │ Private  │ Free        │
│ Write/Answer         │ 2-5s     │ Private  │ Free        │
│ Translate            │ 1-2s     │ Private  │ Free        │
│ Language Detect      │ <0.1s    │ Private  │ Free        │
└──────────────────────┴──────────┴──────────┴─────────────┘

Key Benefits:
✅ 100% On-Device (No data sent to cloud)
✅ Works Offline (After model downloaded)
✅ Zero Cost (No API keys needed)
✅ Fast Response (No network latency)
✅ Privacy First (Your data never leaves device)
```

## 🎯 API Availability Check Flow

```
Extension Starts
      │
      ▼
Initialize AI Service
      │
      ├──► chrome.ai.summarizer
      │    ├─ Available? → ✅ capabilities.summarizer = true
      │    └─ Not available? → ❌ capabilities.summarizer = false
      │
      ├──► chrome.ai.languageModel (Prompt/Embed)
      │    ├─ Available? → ✅ capabilities.embedder = true
      │    └─ Not available? → ❌ capabilities.embedder = false
      │
      ├──► chrome.ai.writer
      │    ├─ Available? → ✅ capabilities.writer = true
      │    └─ Not available? → ❌ capabilities.writer = false
      │
      ├──► chrome.ai.translator
      │    ├─ Available? → ✅ capabilities.translator = true
      │    └─ Not available? → ❌ capabilities.translator = false
      │
      └──► chrome.ai.languageDetector
           ├─ Available? → ✅ capabilities.detector = true
           └─ Not available? → ❌ capabilities.detector = false

Result logged to console:
"[INFO] AI capabilities: { summarizer: true, embedder: true, ... }"
```

## 🚨 Common Issues & Solutions

```
Issue: "AI APIs not available"
├─ Check: Chrome Canary installed?
├─ Check: All flags enabled?
├─ Check: Browser restarted?
└─ Fix: Enable flags + restart

Issue: "Model not downloading"
├─ Check: Internet connection?
├─ Check: Enough disk space (10GB)?
├─ Check: chrome://components/ status?
└─ Fix: Trigger manually with ai.languageModel.create()

Issue: "Session creation failed"
├─ Check: Model downloaded?
├─ Check: RAM available (8GB+)?
├─ Check: Chrome Canary version (128+)?
└─ Fix: Restart Chrome, try again

Issue: "Extension errors"
├─ Check: Background console logs?
├─ Check: manifest.json valid?
├─ Check: Build successful?
└─ Fix: npm run build, reload extension
```

---

For complete setup instructions, see:
- **Quick Start**: `AI_SETUP_CHECKLIST.md`
- **Detailed Guide**: `CHROME_AI_SETUP.md`
- **User Guide**: `README.md`
- **Development**: `DEVELOPMENT.md`
