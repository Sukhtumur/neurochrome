# Architecture Documentation

## System Overview

Local Web Brain is built using **Clean Architecture** principles, ensuring separation of concerns, testability, and maintainability.

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Popup UI  │  │ Components │  │   Svelte   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Query    │  │ Background │  │   Content  │            │
│  │  Service   │  │  Worker    │  │   Script   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Memory    │  │   Config   │  │   Types    │            │
│  │  Entity    │  │   Entity   │  │ & Errors   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Chrome AI │  │   Dexie    │  │  Web Crypto│            │
│  │   Service  │  │ Repository │  │   Service  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐                            │
│  │   Vector   │  │   Logger   │                            │
│  │   Search   │  │  & Helpers │                            │
│  └────────────┘  └────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## Core Principles

### 1. Separation of Concerns

Each layer has a distinct responsibility:

- **Presentation**: User interface and user interaction
- **Application**: Business logic orchestration
- **Domain**: Core business entities and rules
- **Infrastructure**: External integrations and technical details

### 2. Dependency Rule

Dependencies point inward:

```
Presentation → Application → Domain ← Infrastructure
```

- Domain has no dependencies
- Infrastructure depends on Domain
- Application depends on Domain
- Presentation depends on Application

### 3. Repository Pattern

Database access is abstracted through repositories:

```typescript
// Interface (Domain)
interface IMemoryRepository {
  create(memory: Memory): Promise<Memory>
  getById(id: string): Promise<Memory | undefined>
  // ...
}

// Implementation (Infrastructure)
class MemoryRepository implements IMemoryRepository {
  // Concrete implementation using Dexie
}
```

### 4. Service Pattern

External APIs wrapped in services:

```typescript
// Chrome AI Service
class ChromeAIService {
  async summarize(text: string): Promise<string>
  async embed(text: string): Promise<Float32Array>
  // ...
}
```

## Data Flow

### Page Capture Flow

```
User visits page
       ↓
Tab onUpdated event
       ↓
Inject content script
       ↓
Extract page text
       ↓
Send to background worker
       ↓
AI Summarizer (Chrome API)
       ↓
AI Embedder (Chrome API)
       ↓
Encrypt summary (Web Crypto)
       ↓
Store in IndexedDB (Dexie)
```

### Query Flow

```
User enters query (omnibox/popup)
       ↓
Generate query embedding
       ↓
Vector similarity search
       ↓
Retrieve top K memories
       ↓
Decrypt summaries
       ↓
Compose context
       ↓
AI Writer generates answer
       ↓
AI Proofreader polishes
       ↓
Display to user
```

## Component Architecture

### Background Service Worker

**Responsibilities**:
- Monitor tab updates
- Orchestrate capture pipeline
- Handle omnibox queries
- Manage extension lifecycle

**Dependencies**:
- MemoryRepository
- ChromeAIService
- CryptoService
- QueryService

### Content Script

**Responsibilities**:
- Extract page content
- Clean and sanitize text
- Identify main content areas
- Filter noise elements

**Dependencies**:
- Utils (helpers, sanitization)

### Query Service

**Responsibilities**:
- Orchestrate query flow
- Coordinate AI services
- Format responses
- Handle errors

**Dependencies**:
- ChromeAIService
- VectorSearch
- CryptoService
- MemoryRepository

### Vector Search Service

**Responsibilities**:
- Calculate cosine similarity
- Find similar memories
- Support filtering
- Optimize search

**Dependencies**:
- MemoryRepository
- Logger

### Memory Repository

**Responsibilities**:
- CRUD operations
- Query interface
- Data validation
- Error handling

**Dependencies**:
- Database (Dexie)
- Types

## Security Architecture

### Encryption Layer

```
Plaintext Summary
       ↓
Generate random IV
       ↓
AES-GCM encryption
       ↓
Combine IV + Ciphertext
       ↓
Base64 encode
       ↓
Store in IndexedDB
```

### Key Management

```
Extension install
       ↓
Generate AES-256 key
       ↓
Export as raw bytes
       ↓
Store in chrome.storage.local
       ↓
Import on startup
       ↓
Use for encrypt/decrypt
```

## Performance Optimizations

### Vector Search

- **Linear scan** for small datasets (< 1000)
- **Early termination** with threshold
- **Batch processing** for multiple queries
- **Future**: HNSW index for large datasets

### Database

- **Indexed fields**: id, url, created_at, tags
- **Compound queries** for filters
- **Lazy loading** in UI
- **Pagination** for large lists

### Memory Management

- **Max 10,000 memories** limit
- **Auto cleanup** oldest when full
- **Garbage collection** of unused embeddings
- **Compression** of large summaries

## Testing Strategy

### Unit Tests

- **Utils**: Helper functions (sanitization, formatting)
- **Services**: AI service mocks, vector search
- **Repository**: Database operations (in-memory)

### Integration Tests

- **End-to-end flows**: Capture → Search
- **AI API mocking**: Test without real APIs
- **UI components**: Svelte component testing

### Manual Testing

- **Browser testing**: Chrome Canary
- **Extension loading**: Developer mode
- **Real-world usage**: Actual browsing

## Error Handling

### Custom Error Types

```typescript
enum ErrorType {
  AI_API_NOT_AVAILABLE,
  DATABASE_ERROR,
  ENCRYPTION_ERROR,
  NETWORK_ERROR,
  INVALID_INPUT,
  STORAGE_FULL
}

class ExtensionError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public details?: unknown
  )
}
```

### Error Propagation

```
Service Layer → Application Layer → Presentation Layer
     ↓                  ↓                    ↓
  Log error       Handle/Retry         Display to user
```

## Scalability Considerations

### Current Limits

- 10,000 memories max
- 50KB text per page
- 5 search results default

### Future Enhancements

- HNSW vector index
- Background workers
- Streaming responses
- Incremental indexing

## Deployment Architecture

### Build Process

```
TypeScript source
       ↓
Vite bundler
       ↓
Multiple entry points
  ├─ background.js
  ├─ content-script.js
  └─ popup/index.html
       ↓
Minification
       ↓
dist/ folder
```

### Extension Structure

```
dist/
├── manifest.json
├── background.js
├── content-script.js
├── popup/
│   ├── index.html
│   └── assets/
└── icons/
```

## Monitoring & Observability

### Logging

```typescript
logger.debug('Detailed info')
logger.info('Important events')
logger.warn('Potential issues')
logger.error('Critical errors')
```

### Metrics (Future)

- API response times
- Query accuracy
- Storage usage
- User engagement

---

This architecture ensures:
- ✅ **Maintainability**: Clear boundaries
- ✅ **Testability**: Mocked dependencies
- ✅ **Scalability**: Modular design
- ✅ **Security**: Encrypted data
- ✅ **Performance**: Optimized operations
