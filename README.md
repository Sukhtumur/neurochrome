# Local Web Brain 🧠

**Hybrid AI cognitive extension that turns browsing history into semantic memory**

A Chrome extension built for the **Google Chrome Built-in AI Challenge 2025** that uses a **hybrid AI strategy**: Chrome Built-in AI (Gemini Nano) when available, Gemini API as reliable cloud fallback. This creates an intelligent, searchable memory of your browsing history with production-ready reliability.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome AI](https://img.shields.io/badge/Chrome%20AI-Hybrid-orange)
![Competition](https://img.shields.io/badge/Competition-Chrome%20AI%202025-purple)

## � Hybrid AI Strategy

What makes this extension special:

- **🎯 Production Ready**: Works reliably TODAY, even in Chrome builds without AI APIs
- **🔄 Automatic Fallback**: Tries Chrome Built-in AI first, seamlessly falls back to Gemini API
- **🔒 Privacy First**: On-device processing when available, secure cloud fallback when needed
- **🚀 Future Proof**: Gets better as Chrome AI rolls out, never breaks
- **✅ All 6 APIs**: Complete implementation of all Chrome Built-in AI capabilities

## 🌟 Features

- **🤖 Hybrid AI**: Chrome Built-in AI (primary) + Gemini API (fallback) for 100% reliability
- **🧠 Semantic Memory**: Convert web pages into searchable semantic memories with AI embeddings
- **📝 AI Summarization**: Automatic 2-3 sentence summaries of every page you visit
- **🌐 AI Translation**: Translate memories to any language
- **✏️ AI Rewriting**: Reformat summaries with different tones, lengths, and formats
- **🔍 Natural Language Search**: Query your history using plain English via omnibox (`lw <query>`)
- **🔐 AES-GCM Encryption**: Summaries encrypted locally using Web Crypto API
- **⚡ Vector Similarity Search**: Find relevant pages using cosine similarity
- **🎨 Beautiful UI**: Clean, modern interface built with Svelte and TailwindCSS
- **📊 Statistics Dashboard**: Track your knowledge base growth

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Chrome AI APIs](#chrome-ai-apis)
- [Privacy & Security](#privacy--security)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Extension                         │
│                                                             │
│  ┌───────────────┐   ┌─────────────┐   ┌────────────────┐  │
│  │ Content       │   │ AI          │   │ Vector         │  │
│  │ Scraper       │───│ Summarizer  │───│ Search Engine  │  │
│  └───────────────┘   └─────────────┘   └────────────────┘  │
│          │                  │                    │          │
│          ▼                  ▼                    ▼          │
│     Page Text         Summaries +           IndexedDB       │
│                       Embeddings            (Encrypted)     │
│          │                  │                    │          │
│          └─────────► Query Handler ◄─────────────┘          │
│                          │                                  │
│                     Omnibox & Popup                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Capture**: When you visit a page, content script extracts main text
2. **Summarize**: Background worker uses Chrome AI Summarizer to compress content
3. **Embed**: Text is converted to vector embeddings using Chrome AI
4. **Encrypt**: Summary is encrypted with AES-GCM
5. **Store**: Memory is saved to IndexedDB with embedding
6. **Query**: Use omnibox to search memories semantically
7. **Answer**: AI Writer composes answer from relevant memories

## 🛠️ Tech Stack

### Core Technologies

- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Svelte**: Reactive UI framework
- **TailwindCSS**: Utility-first styling

### Chrome APIs

- `chrome.ai.summarizer` - Compress page content
- `chrome.ai.prompt` - Generate embeddings
- `chrome.ai.writer` - Compose answers
- `chrome.ai.translator` - Multilingual support
- `chrome.ai.proofreader` - Clean responses
- `chrome.tabs` - Page monitoring
- `chrome.scripting` - Content injection
- `chrome.omnibox` - Search interface
- `chrome.storage` - Configuration sync

### Data Layer

- **Dexie.js**: IndexedDB abstraction
- **Web Crypto API**: AES-GCM encryption
- **Vector Search**: Cosine similarity

### Development Tools

- **ESLint + Prettier**: Code quality
- **Vitest**: Unit testing
- **web-ext**: Development workflow

## 📦 Installation

### Quick Start (Works Immediately!)

The extension uses a **hybrid AI strategy** and works right away:

1. Install the extension
2. Configure Gemini API key (free from [Google AI Studio](https://aistudio.google.com/app/apikey))
3. Start browsing!

Chrome Built-in AI is **optional** but recommended for privacy.

### Prerequisites

- **Chrome Canary** (v143+) or **Chrome Stable** (when AI APIs launch)
- **Node.js** (v18+)
- **Gemini API Key** (free tier available)

### Option A: Gemini API Only (Recommended for Testing)

**No Chrome AI setup needed!** This is the fastest way to get started:

1. Build extension (see below)
2. Load in Chrome
3. Open Settings tab
4. Get free API key: [Google AI Studio](https://aistudio.google.com/app/apikey)
5. Paste key and save
6. Start browsing!

✅ **Works in**: Chrome Stable, Chrome Canary, any Chrome 120+  
✅ **Setup time**: 5 minutes  
✅ **Reliability**: 100% (cloud-based)  

### Option B: Chrome Built-in AI + Gemini Fallback (Best of Both Worlds)

For maximum privacy and performance:

1. **Enable Chrome AI APIs** ([detailed guide](./CHROME_AI_SETUP.md))
   - Navigate to `chrome://flags/#optimization-guide-on-device-model`
   - Set to "Enabled BypassPerfRequirement"
   - Navigate to `chrome://flags/#prompt-api-for-gemini-nano`
   - Set to "Enabled"
   - Restart Chrome
   
2. **Build & configure extension**
3. Extension will automatically use Chrome AI when available
4. Falls back to Gemini API seamlessly

✅ **Works in**: Chrome Canary (143+)  
✅ **Privacy**: On-device processing  
✅ **Performance**: Instant responses  
✅ **Fallback**: Gemini API if Chrome AI unavailable  

### Build & Install Extension

```bash
# Clone repository
git clone https://github.com/Sukhtumur/neurochrome.git
cd neurochrome

# Install dependencies
npm install

# Build for production
npm run build
```

### Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder
5. Click extension icon → **Settings** tab
6. Configure Gemini API key

### Verify Setup

Open Settings tab in extension popup:

- **Provider Badge**: Shows "Using Chrome AI" (green) or "Using Gemini API" (purple)
- **All 6 APIs**: Should show green checkmarks ✓
- **Status Message**: Confirms active AI provider

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing steps.

## 🚀 Usage

### Auto-Capture Mode

By default, the extension automatically captures and indexes pages you visit:

1. Browse normally
2. Extension extracts content in background
3. AI generates summary and embedding
4. Memory stored locally (encrypted)

### Omnibox Search

Type `brain` in Chrome's address bar, then your query:

```
brain what did I read about machine learning yesterday?
brain show me articles about climate change
brain find that recipe I saw last week
```

### Popup Interface

Click the extension icon to:

- **Search**: Manual query with detailed results
- **Memories**: Browse and manage stored pages
- **Statistics**: View storage stats and insights

## 📁 Project Structure

```
local-web-brain/
├── src/
│   ├── background/           # Service worker
│   │   └── background.ts
│   ├── content/              # Content scripts
│   │   └── content-script.ts
│   ├── popup/                # Popup UI
│   │   ├── App.svelte
│   │   ├── popup.ts
│   │   └── index.html
│   ├── components/           # Svelte components
│   │   ├── SearchBar.svelte
│   │   ├── MemoryList.svelte
│   │   └── Stats.svelte
│   ├── lib/                  # Core business logic
│   │   ├── ai/              # Chrome AI services
│   │   │   └── chrome-ai.ts
│   │   ├── db/              # Database layer
│   │   │   ├── database.ts
│   │   │   └── repository.ts
│   │   ├── vector/          # Vector search
│   │   │   └── index.ts
│   │   ├── crypto/          # Encryption
│   │   │   └── index.ts
│   │   └── query/           # Query orchestration
│   │       └── index.ts
│   ├── types/               # TypeScript definitions
│   │   ├── index.ts
│   │   └── chrome-ai.d.ts
│   ├── utils/               # Utilities
│   │   ├── helpers.ts
│   │   └── logger.ts
│   └── tests/               # Unit tests
│       ├── setup.ts
│       └── helpers.test.ts
├── public/
│   ├── manifest.json
│   └── icons/
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

### Clean Architecture Layers

1. **Presentation** (`components/`, `popup/`): UI components
2. **Application** (`lib/query/`): Business logic orchestration
3. **Domain** (`types/`): Core entities and interfaces
4. **Infrastructure** (`lib/ai/`, `lib/db/`, `lib/crypto/`): External services
5. **Utilities** (`utils/`): Shared helpers

## 💻 Development

### Commands

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Test with web-ext
npm run web-ext
```

### Code Style

- **Clean Code**: Descriptive names, single responsibility
- **SOLID Principles**: Dependency injection, interface segregation
- **Type Safety**: Strict TypeScript, no `any`
- **Error Handling**: Custom error types, try-catch blocks
- **Documentation**: JSDoc comments, inline explanations

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## 🤖 AI Implementation

### Hybrid AI Service

The extension uses an intelligent hybrid approach:

```typescript
// Automatically tries Chrome AI first, falls back to Gemini
const summary = await hybridAI.summarize(text)
const embedding = await hybridAI.embed(text)
const translated = await hybridAI.translate(text, 'es')
```

### All 6 Chrome Built-in AI APIs

✅ **Summarizer**: Compress page content to 2-3 sentences  
✅ **Embeddings**: Convert text to semantic vectors (384-dim)  
✅ **Writer**: Generate natural language responses  
✅ **Translator**: Translate to any language  
✅ **Proofreader**: Clean and correct text  
✅ **Rewriter**: Reformat with tone/length/format options  

### Fallback Strategy

**Chrome AI Available** → Use on-device processing (instant, private)  
**Chrome AI Unavailable** → Use Gemini API (1-2s delay, reliable)  
**Both Unavailable** → Show helpful error message  

### Code Example

```typescript
// Initialize hybrid service
await hybridAI.initialize({
  apiKey: userGeminiKey // from Settings
})

// Use any AI function - automatic fallback
const summary = await hybridAI.summarize(pageText)
const embedding = await hybridAI.embed(summary)
const translated = await hybridAI.translate(summary, 'spanish')
const rewritten = await hybridAI.rewrite(summary, { 
  tone: 'professional',
  length: 'short'
})
```

See [hybrid-ai.ts](./src/lib/ai/hybrid-ai.ts) for implementation.

## 🔐 Privacy & Security

### Privacy Guarantees

✅ **Chrome AI**: 100% offline, on-device processing  
✅ **Gemini API**: Only summaries sent (not full page content)  
✅ **Local Storage**: All data in IndexedDB on your device  
✅ **No Analytics**: Zero tracking or user profiling  
✅ **Open Source**: Auditable codebase  

### Security Features

- **AES-GCM Encryption**: Summaries encrypted with 256-bit keys
- **Secure Key Storage**: Gemini API key in chrome.storage.sync
- **Content Security Policy**: Strict CSP in manifest
- **HTTPS Only**: Gemini API calls over secure connection
- **Input Validation**: Sanitization of all user inputs
- **XSS Protection**: Svelte's auto-escaping

### Data Retention

- Max 10,000 memories (configurable)
- Auto garbage collection when limit reached
- Manual "Clear All" option in popup

## 🎯 Chrome AI Challenge Alignment

| Criterion | Implementation |
|-----------|---------------|
| **Use of Built-in AI** | All 5 Chrome AI APIs used natively |
| **Innovation** | Semantic browser memory, offline cognitive extension |
| **Privacy** | Zero network calls, local encryption, no tracking |
| **Usability** | Omnibox integration, clean UI, natural language queries |
| **Technical Depth** | Vector search, encryption, repository pattern, clean architecture |
| **Scalability** | Efficient indexing, cosine similarity, auto GC |

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and descriptive

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Chrome Built-in AI team for Gemini Nano APIs
- Dexie.js for excellent IndexedDB abstraction
- Svelte team for reactive simplicity
- TailwindCSS for utility-first styling

## 📞 Contact

- **Author**: Your Name
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Demo Video**: [YouTube Link]

---

**Built with ❤️ for the Chrome Built-in AI Challenge**

*Turn your browser into a second brain—privately and intelligently.*
