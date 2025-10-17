# API Documentation

## Chrome Built-in AI APIs

### Summarizer API

Generate concise summaries from long text.

```typescript
chrome.ai.summarizer.summarize(
  text: string,
  options?: { maxLength?: number }
): Promise<string>

chrome.ai.summarizer.available(): Promise<boolean>
```

**Example**:
```typescript
const summary = await chrome.ai.summarizer.summarize(longText, {
  maxLength: 500
})
```

**Parameters**:
- `text`: Input text to summarize
- `options.maxLength`: Maximum summary length (default: 500)

**Returns**: Summarized text

---

### Prompt API (Embeddings)

Generate vector embeddings for semantic search.

```typescript
chrome.ai.prompt.embed(text: string): Promise<Float32Array>

chrome.ai.prompt.prompt(
  text: string,
  options?: { temperature?: number }
): Promise<string>

chrome.ai.prompt.available(): Promise<boolean>
```

**Example**:
```typescript
const embedding = await chrome.ai.prompt.embed("machine learning")
// Returns: Float32Array(768) [0.123, -0.456, ...]
```

**Parameters**:
- `text`: Input text to embed

**Returns**: Float32Array vector (768 dimensions)

---

### Writer API

Generate coherent text from prompts.

```typescript
chrome.ai.writer.write(
  prompt: string,
  options?: {
    tone?: 'formal' | 'casual' | 'helpful'
    length?: 'short' | 'medium' | 'long'
  }
): Promise<string>

chrome.ai.writer.available(): Promise<boolean>
```

**Example**:
```typescript
const answer = await chrome.ai.writer.write(
  "Explain machine learning in simple terms",
  { tone: 'helpful', length: 'medium' }
)
```

**Parameters**:
- `prompt`: Generation prompt
- `options.tone`: Output tone
- `options.length`: Desired length

**Returns**: Generated text

---

### Translator API

Translate text between languages.

```typescript
chrome.ai.translator.translate(
  text: string,
  options: {
    sourceLanguage?: string
    targetLanguage: string
  }
): Promise<string>

chrome.ai.translator.available(): Promise<boolean>
```

**Example**:
```typescript
const translated = await chrome.ai.translator.translate(
  "Hello world",
  { targetLanguage: 'es' }
)
// Returns: "Hola mundo"
```

**Parameters**:
- `text`: Text to translate
- `options.sourceLanguage`: Source language code (auto-detect if omitted)
- `options.targetLanguage`: Target language code

**Returns**: Translated text

---

### Proofreader API

Improve grammar and style.

```typescript
chrome.ai.proofreader.proofread(text: string): Promise<string>

chrome.ai.proofreader.available(): Promise<boolean>
```

**Example**:
```typescript
const corrected = await chrome.ai.proofreader.proofread(
  "this sentence have bad grammer"
)
// Returns: "This sentence has bad grammar."
```

**Parameters**:
- `text`: Text to proofread

**Returns**: Corrected text

---

## Extension Internal APIs

### Memory Repository

Database operations for memories.

#### `create()`

```typescript
async create(
  memoryData: Omit<Memory, 'id' | 'created_at'>
): Promise<Memory>
```

**Example**:
```typescript
const memory = await memoryRepository.create({
  url: 'https://example.com',
  title: 'Example Page',
  summary: 'This is a summary...',
  embedding: new Float32Array([...]),
})
```

#### `getById()`

```typescript
async getById(id: string): Promise<Memory | undefined>
```

#### `getAll()`

```typescript
async getAll(options?: {
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'last_accessed' | 'visit_count'
  order?: 'asc' | 'desc'
}): Promise<Memory[]>
```

**Example**:
```typescript
const recent = await memoryRepository.getAll({
  sortBy: 'created_at',
  order: 'desc',
  limit: 10
})
```

#### `delete()`

```typescript
async delete(id: string): Promise<void>
```

#### `searchByText()`

```typescript
async searchByText(query: string): Promise<Memory[]>
```

Simple text search (non-semantic).

---

### Vector Search Service

Semantic similarity search.

#### `findSimilar()`

```typescript
async findSimilar(
  queryVector: Float32Array,
  options?: {
    limit?: number
    threshold?: number
    dateRange?: { start: number; end: number }
    tags?: string[]
  }
): Promise<SearchResult[]>
```

**Example**:
```typescript
const queryVec = await chromeAI.embed("machine learning")
const results = await vectorSearch.findSimilar(queryVec, {
  limit: 5,
  threshold: 0.7
})
```

**Parameters**:
- `queryVector`: Query embedding
- `options.limit`: Max results (default: 5)
- `options.threshold`: Min similarity (default: 0.5)
- `options.dateRange`: Filter by date
- `options.tags`: Filter by tags

**Returns**: Array of search results with scores

#### `findMostSimilar()`

```typescript
async findMostSimilar(
  queryVector: Float32Array
): Promise<SearchResult | null>
```

Returns single best match.

#### `findDiverseSimilar()`

```typescript
async findDiverseSimilar(
  queryVector: Float32Array,
  options?: {
    limit?: number
    threshold?: number
    diversityThreshold?: number
  }
): Promise<SearchResult[]>
```

Returns diverse results (not too similar to each other).

---

### Crypto Service

AES-GCM encryption for summaries.

#### `initialize()`

```typescript
async initialize(): Promise<void>
```

Generate or load encryption key.

#### `encrypt()`

```typescript
async encrypt(plaintext: string): Promise<string>
```

**Example**:
```typescript
const encrypted = await cryptoService.encrypt("sensitive data")
```

**Returns**: Base64-encoded ciphertext

#### `decrypt()`

```typescript
async decrypt(ciphertext: string): Promise<string>
```

**Example**:
```typescript
const plaintext = await cryptoService.decrypt(encrypted)
```

**Returns**: Original plaintext

---

### Query Service

High-level query orchestration.

#### `processQuery()`

```typescript
async processQuery(
  request: QueryRequest
): Promise<QueryResponse>
```

**Example**:
```typescript
const response = await queryService.processQuery({
  query: "What did I read about AI?",
  limit: 5,
  dateRange: {
    start: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    end: Date.now()
  }
})

console.log(response.answer)
console.log(response.sources)
```

**QueryRequest**:
```typescript
interface QueryRequest {
  query: string
  limit?: number
  dateRange?: { start: number; end: number }
  tags?: string[]
}
```

**QueryResponse**:
```typescript
interface QueryResponse {
  answer: string
  sources: SearchResult[]
  processingTime: number
}
```

---

## Message Passing API

Communication between components.

### Background → Popup

```typescript
// In popup
const response = await chrome.runtime.sendMessage({
  action: 'query',
  data: { query: 'search term' }
})
```

### Supported Actions

#### `query`

Execute semantic query.

```typescript
{
  action: 'query',
  data: QueryRequest
}
```

**Response**:
```typescript
{
  success: true,
  data: QueryResponse
}
```

#### `getStats`

Get database statistics.

```typescript
{
  action: 'getStats'
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    totalMemories: number
    oldestDate: number
    newestDate: number
  }
}
```

#### `clearMemories`

Delete all memories.

```typescript
{
  action: 'clearMemories'
}
```

**Response**:
```typescript
{
  success: true
}
```

---

## Storage API

Chrome storage for configuration.

### Sync Storage

Settings synced across devices.

```typescript
// Get config
const { config } = await chrome.storage.sync.get('config')

// Set config
await chrome.storage.sync.set({ config: newConfig })
```

**Config Schema**:
```typescript
interface ExtensionConfig {
  autoCaptureEnabled: boolean
  maxMemories: number
  encryptionEnabled: boolean
  minTextLength: number
  multilingualEnabled: boolean
  similarityThreshold: number
}
```

### Local Storage

Device-specific data.

```typescript
// Get last query
const { lastQuery } = await chrome.storage.local.get('lastQuery')

// Store query
await chrome.storage.local.set({
  lastQuery: {
    query: string,
    response: QueryResponse,
    timestamp: number
  }
})
```

---

## Utility Functions

### Helpers

```typescript
// Generate unique ID
generateId(): string

// Sanitize text
sanitizeText(text: string): string

// Truncate text
truncateText(text: string, maxLength: number): string

// Format date
formatDate(timestamp: number): string

// Format relative time
formatRelativeTime(timestamp: number): string

// Extract domain from URL
extractDomain(url: string): string

// Check if URL should be ignored
shouldIgnoreUrl(url: string): boolean

// Validate text
isValidText(text: string, minLength?: number): boolean

// Chunk text
chunkText(text: string, maxChunkSize?: number): string[]

// Retry with backoff
retry<T>(
  fn: () => Promise<T>,
  options?: {
    maxAttempts?: number
    delay?: number
    backoff?: number
  }
): Promise<T>
```

### Logger

```typescript
import { logger } from '@/utils/logger'

logger.debug('Debug message', data)
logger.info('Info message', data)
logger.warn('Warning message', data)
logger.error('Error message', error)
```

---

## Type Definitions

### Memory

```typescript
interface Memory {
  id: string
  url: string
  title: string
  summary: string
  embedding: Float32Array
  created_at: number
  tags?: string[]
  visit_count?: number
  last_accessed?: number
}
```

### SearchResult

```typescript
interface SearchResult {
  memory: Memory
  score: number // 0-1 (cosine similarity)
}
```

### Error Types

```typescript
enum ErrorType {
  AI_API_NOT_AVAILABLE = 'AI_API_NOT_AVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  STORAGE_FULL = 'STORAGE_FULL',
}

class ExtensionError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public details?: unknown
  )
}
```

---

For more examples, see the source code in `src/` directory.
