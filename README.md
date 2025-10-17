# Local Web Brain 🧠

**Offline cognitive extension that turns browsing history into semantic memory**

A Chrome extension that uses Gemini Nano (Chrome Built-in AI) to create an intelligent, searchable memory of your browsing history—completely offline and privacy-focused.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome AI](https://img.shields.io/badge/Chrome%20AI-Gemini%20Nano-orange)

## 🌟 Features

- **🔒 100% Offline & Private**: All processing happens locally using Chrome's built-in AI (Gemini Nano)
- **🧠 Semantic Memory**: Convert web pages into searchable semantic memories with embeddings
- **🔍 Natural Language Search**: Query your history using plain English via omnibox (`brain <query>`)
- **🔐 AES-GCM Encryption**: Summaries are encrypted locally using Web Crypto API
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

### Prerequisites

- Chrome Canary (v127+) with Chrome AI APIs enabled
- Node.js (v18+)
- npm or pnpm

### Enable Chrome AI APIs

1. Install Chrome Canary
2. Navigate to `chrome://flags/#optimization-guide-on-device-model`
3. Set to "Enabled BypassPerfRequirement"
4. Navigate to `chrome://flags/#prompt-api-for-gemini-nano`
5. Set to "Enabled"
6. Restart Chrome

### Build & Install Extension

```bash
# Clone repository
git clone https://github.com/yourusername/local-web-brain.git
cd local-web-brain

# Install dependencies
npm install

# Build for production
npm run build

# Or run in development mode
npm run dev
```

### Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

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

## 🤖 Chrome AI APIs

### Summarizer API

```typescript
const summary = await chrome.ai.summarizer.summarize(text, { 
  maxLength: 500 
})
```

### Prompt API (Embeddings)

```typescript
const embedding = await chrome.ai.prompt.embed(text)
// Returns Float32Array vector
```

### Writer API

```typescript
const answer = await chrome.ai.writer.write(prompt, {
  tone: 'helpful',
  length: 'medium'
})
```

### Translator API

```typescript
const translated = await chrome.ai.translator.translate(text, {
  targetLanguage: 'en'
})
```

### Proofreader API

```typescript
const proofread = await chrome.ai.proofreader.proofread(text)
```

## 🔐 Privacy & Security

### Privacy Guarantees

✅ **100% Offline**: No network requests, no telemetry  
✅ **Local Storage**: All data in IndexedDB on your device  
✅ **No Analytics**: Zero tracking or user profiling  
✅ **Open Source**: Auditable codebase  

### Security Features

- **AES-GCM Encryption**: Summaries encrypted with 256-bit keys
- **Secure Key Storage**: Keys in chrome.storage.local
- **Content Security Policy**: Strict CSP in manifest
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
