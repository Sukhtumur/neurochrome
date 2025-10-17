# Visual Reference Guide

## 🎨 Extension UI Preview

### Popup Interface

```
┌─────────────────────────────────────────────────┐
│  🧠 Local Web Brain                             │
│  Your personal knowledge assistant              │
├─────────────────────────────────────────────────┤
│  Search  │  Memories  │  Statistics             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Ask about your browsing history...     │   │
│  └─────────────────────────────────────────┘   │
│                                   [Search]      │
│                                                 │
│  💡 Try: "What did I read about AI?"           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Search Results View

```
┌─────────────────────────────────────────────────┐
│  Answer:                                        │
│  ┌─────────────────────────────────────────┐   │
│  │ Based on your browsing history, you     │   │
│  │ read about machine learning algorithms  │   │
│  │ on [1] towards data science and [2]...  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Sources (3):                                   │
│  ┌─────────────────────────────────────────┐   │
│  │ [1] Machine Learning Tutorial            │   │
│  │ A comprehensive guide to ML...           │   │
│  │ 95% relevance • example.com              │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │ [2] Deep Learning Basics                 │   │
│  │ Introduction to neural networks...       │   │
│  │ 87% relevance • blog.com                 │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Memories List View

```
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐   │
│  │ Filter memories...                      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Understanding Neural Networks            │   │
│  │ A deep dive into how neural nets...      │   │
│  │ blog.ai • 2 hours ago • 3 visits    [×]  │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │ Python Best Practices                    │   │
│  │ Modern Python coding standards...        │   │
│  │ python.org • 1 day ago          [×]      │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │ Chrome Extension Development             │   │
│  │ Guide to building Chrome extensions...   │   │
│  │ developer.chrome.com • 2 days ago  [×]   │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Statistics View

```
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐   │
│  │  Total Memories               127       │   │
│  │  [Memory icon]                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Timeline:                                      │
│  Oldest Memory: Jan 15, 2025                    │
│  Newest Memory: Oct 17, 2025                    │
│                                                 │
│  Storage:                                       │
│  Capacity Used: 1%                              │
│  [████░░░░░░░░░░░░░░░░░░░░░░░] 127/10,000      │
│                                                 │
│  Actions:                                       │
│  ┌─────────────────────────────────────────┐   │
│  │  🗑️  Clear All Memories                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ℹ️ About                                       │
│  Local Web Brain uses Chrome's AI to create     │
│  semantic memories. All data is local.          │
└─────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagrams

### Capture Flow

```
User Visits Page
       │
       ▼
┌──────────────────┐
│  Tab Updated     │
│  Event Fired     │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Inject Content  │
│  Script          │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Extract Page    │
│  Text            │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Send to         │
│  Background      │
└──────────────────┘
       │
       ├─────────────────┐
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  Summarize   │  │  Generate    │
│  (AI)        │  │  Embedding   │
└──────────────┘  └──────────────┘
       │                 │
       ▼                 │
┌──────────────┐         │
│  Encrypt     │         │
│  Summary     │         │
└──────────────┘         │
       │                 │
       └────────┬────────┘
                ▼
       ┌──────────────────┐
       │  Store in        │
       │  IndexedDB       │
       └──────────────────┘
```

### Query Flow

```
User Enters Query
       │
       ▼
┌──────────────────┐
│  Generate Query  │
│  Embedding       │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Vector          │
│  Similarity      │
│  Search          │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Retrieve Top K  │
│  Memories        │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Decrypt         │
│  Summaries       │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Compose         │
│  Context         │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  AI Writer       │
│  Generate Answer │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Proofread       │
│  (AI)            │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Display to      │
│  User            │
└──────────────────┘
```

## 🏗️ Architecture Layers

```
┌───────────────────────────────────────────────┐
│           PRESENTATION LAYER                  │
│  ┌─────────────┐  ┌─────────────┐            │
│  │  Popup UI   │  │ Components  │            │
│  │  (Svelte)   │  │ (Svelte)    │            │
│  └─────────────┘  └─────────────┘            │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│          APPLICATION LAYER                    │
│  ┌─────────────┐  ┌─────────────┐            │
│  │   Query     │  │ Background  │            │
│  │  Service    │  │   Worker    │            │
│  └─────────────┘  └─────────────┘            │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│             DOMAIN LAYER                      │
│  ┌─────────────┐  ┌─────────────┐            │
│  │   Types &   │  │  Interfaces │            │
│  │  Entities   │  │   & Errors  │            │
│  └─────────────┘  └─────────────┘            │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│        INFRASTRUCTURE LAYER                   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │  AI  │  │  DB  │  │Vector│  │Crypto│     │
│  │      │  │      │  │Search│  │      │     │
│  └──────┘  └──────┘  └──────┘  └──────┘     │
└───────────────────────────────────────────────┘
```

## 📦 File Organization Tree

```
neurochrome/
│
├── 📄 Configuration (Root Level)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── .eslintrc.json
│   └── .prettierrc.json
│
├── 📁 src/ (Source Code)
│   │
│   ├── 📁 background/
│   │   └── background.ts ⚙️
│   │
│   ├── 📁 content/
│   │   └── content-script.ts 📋
│   │
│   ├── 📁 popup/
│   │   ├── index.html
│   │   ├── popup.ts
│   │   ├── popup.css
│   │   └── App.svelte 🎨
│   │
│   ├── 📁 components/
│   │   ├── SearchBar.svelte 🔍
│   │   ├── MemoryList.svelte 📚
│   │   └── Stats.svelte 📊
│   │
│   ├── 📁 lib/ (Services)
│   │   ├── 📁 ai/
│   │   │   ├── chrome-ai.ts 🤖
│   │   │   └── index.ts
│   │   ├── 📁 db/
│   │   │   ├── database.ts 💾
│   │   │   ├── repository.ts
│   │   │   └── index.ts
│   │   ├── 📁 vector/
│   │   │   └── index.ts 🔢
│   │   ├── 📁 crypto/
│   │   │   └── index.ts 🔐
│   │   └── 📁 query/
│   │       └── index.ts ❓
│   │
│   ├── 📁 types/
│   │   ├── index.ts 📝
│   │   └── chrome-ai.d.ts
│   │
│   ├── 📁 utils/
│   │   ├── helpers.ts 🛠️
│   │   ├── logger.ts 📋
│   │   └── index.ts
│   │
│   └── 📁 tests/
│       ├── setup.ts
│       └── helpers.test.ts ✅
│
├── 📁 public/
│   ├── manifest.json
│   └── 📁 icons/
│       └── README.md
│
├── 📁 docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEVELOPMENT.md
│
└── 📚 Documentation
    ├── README.md
    ├── QUICKSTART.md
    ├── ROADMAP.md
    ├── CONTRIBUTING.md
    ├── COMPLETE.md
    ├── PROJECT_SUMMARY.md
    └── LICENSE
```

## 🔢 Vector Similarity Visualization

```
Query Vector: [0.5, 0.8, 0.3, ...]
                    │
                    ▼
           ┌────────────────┐
           │ Calculate      │
           │ Cosine         │
           │ Similarity     │
           └────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Memory A    Memory B    Memory C
  [0.6, 0.7,  [0.5, 0.8,  [0.1, 0.2,
   0.4, ...]   0.3, ...]   0.9, ...]
        │           │           │
        ▼           ▼           ▼
     Score:      Score:      Score:
      0.95        0.99        0.32
        │           │           │
        └─────┬─────┘           │
              ▼                 │
         ✅ Top Results         │
         (score > 0.5)          │
                                ▼
                           ❌ Below
                           threshold
```

## 🔐 Encryption Flow

```
Plaintext Summary
       │
       ▼
┌──────────────────┐
│ Generate Random  │
│ IV (12 bytes)    │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ AES-256-GCM      │
│ Encrypt          │
│ (Key + IV)       │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Combine:         │
│ IV + Ciphertext  │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Base64 Encode    │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Store in         │
│ IndexedDB        │
└──────────────────┘
```

## 🎨 Color Palette

```
Primary Colors:
┌────┐ #0ea5e9  Primary 500 (Sky Blue)
│    │ 
└────┘

┌────┐ #0284c7  Primary 600 (Darker Blue)
│    │ 
└────┘

┌────┐ #0369a1  Primary 700 (Deep Blue)
│    │ 
└────┘

Background Colors:
┌────┐ #ffffff  White (Light mode)
│    │ 
└────┘

┌────┐ #1a1a1a  Dark Gray (Dark mode)
│    │ 
└────┘

Accent Colors:
┌────┐ #3b82f6  Blue (Information)
│    │ 
└────┘

┌────┐ #ef4444  Red (Danger/Delete)
│    │ 
└────┘

┌────┐ #10b981  Green (Success)
│    │ 
└────┘
```

## 📱 Responsive Breakpoints

```
Extension Popup:
┌─────────────────┐
│   600px wide    │
│   500px tall    │
│                 │
│  Fixed size     │
│  (Extension)    │
└─────────────────┘

Options Page (Future):
Mobile:     < 640px
Tablet:     640px - 1024px
Desktop:    > 1024px
```

---

This visual guide helps understand:
- ✅ UI layout and structure
- ✅ Data flow through the system
- ✅ Architecture organization
- ✅ File structure hierarchy
- ✅ Technical processes (encryption, search)
- ✅ Design system (colors, spacing)
