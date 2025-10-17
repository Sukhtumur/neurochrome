# Chrome Built-in AI - Code Examples & Testing

This guide provides practical code examples for testing Chrome's Built-in AI APIs.

## 🧪 Testing in DevTools Console

### Prerequisites
1. Chrome Canary with AI flags enabled
2. Gemini Nano model downloaded
3. Open DevTools (F12) on any page

---

## Basic API Tests

### 1. Check AI Availability

```javascript
// Check what's available
const capabilities = await ai.languageModel.capabilities();
console.log('Language Model:', capabilities.available);
// Expected: "readily", "after-download", or "no"

// Check specific APIs
console.log('Summarizer:', await ai.summarizer.capabilities());
console.log('Writer:', await ai.writer.capabilities());
console.log('Translator:', await ai.translator.capabilities());
```

### 2. Simple Prompt Test

```javascript
// Create a session
const session = await ai.languageModel.create({
  temperature: 0.7,        // 0-1, higher = more creative
  topK: 3,                 // Top K sampling
});

// Ask a question
const response = await session.prompt("What is artificial intelligence in one sentence?");
console.log(response);

// Cleanup
session.destroy();
```

### 3. Summarization Test

```javascript
// Create summarizer
const summarizer = await ai.summarizer.create({
  type: 'tl;dr',           // Options: 'tl;dr', 'key-points', 'teaser', 'headline'
  format: 'markdown',      // Options: 'plain-text', 'markdown'
  length: 'medium'         // Options: 'short', 'medium', 'long'
});

// Long text to summarize
const longText = `
Artificial intelligence (AI) is intelligence demonstrated by machines, 
as opposed to natural intelligence displayed by animals including humans. 
AI research has been defined as the field of study of intelligent agents, 
which refers to any system that perceives its environment and takes actions 
that maximize its chance of achieving its goals. The term "artificial intelligence" 
had previously been used to describe machines that mimic and display "human" 
cognitive skills that are associated with the human mind, such as "learning" 
and "problem-solving". This definition has since been rejected by major AI 
researchers who now describe AI in terms of rationality and acting rationally, 
which does not limit how intelligence can be articulated.
`;

const summary = await summarizer.summarize(longText);
console.log('Summary:', summary);

summarizer.destroy();
```

### 4. Writer API Test

```javascript
// Create writer with specific tone
const writer = await ai.writer.create({
  tone: 'formal',          // Options: 'formal', 'neutral', 'casual'
  format: 'markdown',
  length: 'medium'
});

// Generate content
const sharedContext = "Write a brief introduction about quantum computing";
const result = await writer.write(sharedContext);
console.log('Generated:', result);

writer.destroy();
```

### 5. Translation Test

```javascript
// Create translator
const translator = await ai.translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'es'
});

// Translate text
const translated = await translator.translate("Hello, how are you today?");
console.log('Translated:', translated);

translator.destroy();
```

### 6. Language Detection

```javascript
// Create detector
const detector = await ai.languageDetector.create();

// Detect language
const result = await detector.detect("Bonjour, comment allez-vous?");
console.log('Detected:', result);
// Output: [{ language: 'fr', confidence: 0.98 }]

detector.destroy();
```

---

## Advanced Examples

### Streaming Responses

```javascript
// Create session with streaming
const session = await ai.languageModel.create();

// Stream response
const stream = await session.promptStreaming("Write a short poem about coding");

for await (const chunk of stream) {
  console.log(chunk);
}

session.destroy();
```

### Multi-turn Conversation

```javascript
const session = await ai.languageModel.create({
  systemPrompt: "You are a helpful coding assistant."
});

// Turn 1
const response1 = await session.prompt("What is TypeScript?");
console.log('Turn 1:', response1);

// Turn 2 - context is maintained
const response2 = await session.prompt("What are its main benefits?");
console.log('Turn 2:', response2);

// Turn 3
const response3 = await session.prompt("Show me a simple example");
console.log('Turn 3:', response3);

session.destroy();
```

### Batch Processing

```javascript
const session = await ai.languageModel.create();

const questions = [
  "What is 2+2?",
  "What is the capital of France?",
  "What is JavaScript?"
];

// Process all questions in parallel
const answers = await Promise.all(
  questions.map(q => session.prompt(q))
);

answers.forEach((answer, i) => {
  console.log(`Q${i+1}: ${questions[i]}`);
  console.log(`A${i+1}: ${answer}\n`);
});

session.destroy();
```

---

## Testing Your Extension

### Test in Background Service Worker

```javascript
// Open extension service worker console
// chrome://extensions/ → Click "Service Worker"

// Test AI initialization
chrome.ai.languageModel.capabilities().then(c => {
  console.log('AI Available:', c.available);
});

// Test summarizer
const sum = await chrome.ai.summarizer.create();
const result = await sum.summarize("Your long text here...");
console.log('Summary:', result);
sum.destroy();

// Test embeddings (used for search)
const session = await chrome.ai.languageModel.create();
const embedding = await session.embed("artificial intelligence");
console.log('Embedding:', embedding);
console.log('Embedding length:', embedding.length);
session.destroy();
```

### Test Memory Storage

```javascript
// In background console, test the database
const { memoryRepository } = await import('./lib/db/repository.js');

// Get all memories
const memories = await memoryRepository.getAll();
console.log(`Total memories: ${memories.length}`);

// Get latest memory
const latest = memories[0];
console.log('Latest:', latest);

// Test search
const results = await memoryRepository.searchByText('AI');
console.log('Search results:', results);
```

### Test Vector Search

```javascript
// In background console
const { vectorSearch } = await import('./lib/vector/index.js');

// Create a test embedding
const session = await chrome.ai.languageModel.create();
const queryEmbedding = await session.embed("machine learning");

// Find similar memories
const similar = await vectorSearch.findSimilar(queryEmbedding, {
  limit: 5,
  threshold: 0.5
});

console.log('Found', similar.length, 'similar memories');
similar.forEach((result, i) => {
  console.log(`${i+1}. ${result.memory.title} (${result.score.toFixed(3)})`);
});

session.destroy();
```

### Test Query System

```javascript
// In background console
const { queryService } = await import('./lib/query/index.js');

// Process a query
const request = {
  query: "What did I read about artificial intelligence?",
  limit: 5
};

const response = await queryService.processQuery(request);

console.log('Answer:', response.answer);
console.log('Sources:');
response.sources.forEach((source, i) => {
  console.log(`${i+1}. ${source.memory.title} (${source.score.toFixed(3)})`);
  console.log(`   ${source.memory.url}`);
});
console.log(`Processing time: ${response.processingTime}ms`);
```

---

## Performance Benchmarking

### Measure API Response Times

```javascript
async function benchmark(name, fn) {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  console.log(`${name}: ${duration.toFixed(2)}ms`);
  return { result, duration };
}

// Test summarization speed
await benchmark('Summarize', async () => {
  const sum = await ai.summarizer.create();
  const result = await sum.summarize("Your text here...");
  sum.destroy();
  return result;
});

// Test embedding speed
await benchmark('Embed', async () => {
  const session = await ai.languageModel.create();
  const embedding = await session.embed("test text");
  session.destroy();
  return embedding;
});

// Test prompt speed
await benchmark('Prompt', async () => {
  const session = await ai.languageModel.create();
  const result = await session.prompt("Say hello");
  session.destroy();
  return result;
});
```

### Memory Usage Test

```javascript
// Monitor memory before
const before = performance.memory.usedJSHeapSize / 1024 / 1024;
console.log(`Memory before: ${before.toFixed(2)} MB`);

// Create multiple sessions
const sessions = [];
for (let i = 0; i < 5; i++) {
  sessions.push(await ai.languageModel.create());
}

// Monitor memory after
const after = performance.memory.usedJSHeapSize / 1024 / 1024;
console.log(`Memory after: ${after.toFixed(2)} MB`);
console.log(`Difference: ${(after - before).toFixed(2)} MB`);

// Cleanup
sessions.forEach(s => s.destroy());
```

---

## Error Handling Examples

### Robust API Usage

```javascript
async function safePrompt(query) {
  let session = null;
  try {
    // Check availability first
    const capabilities = await ai.languageModel.capabilities();
    if (capabilities.available !== 'readily') {
      throw new Error(`AI not available: ${capabilities.available}`);
    }

    // Create session
    session = await ai.languageModel.create();

    // Make request with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 30000)
    );
    
    const resultPromise = session.prompt(query);
    
    const result = await Promise.race([resultPromise, timeoutPromise]);
    
    return { success: true, result };
    
  } catch (error) {
    console.error('AI Error:', error);
    return { success: false, error: error.message };
    
  } finally {
    // Always cleanup
    if (session) {
      try {
        session.destroy();
      } catch (e) {
        console.warn('Cleanup error:', e);
      }
    }
  }
}

// Usage
const response = await safePrompt("What is AI?");
if (response.success) {
  console.log('Result:', response.result);
} else {
  console.error('Error:', response.error);
}
```

### Retry Logic

```javascript
async function retryOperation(operation, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      console.warn(`Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

// Usage
const result = await retryOperation(async () => {
  const session = await ai.languageModel.create();
  const response = await session.prompt("Hello");
  session.destroy();
  return response;
});
```

---

## Integration Tests

### Test Complete Capture Flow

```javascript
// Simulate capturing a webpage
async function testCapture() {
  console.log('Testing page capture flow...');
  
  // 1. Extract content (normally done by content script)
  const content = {
    title: "Test Page",
    text: "This is a test page about artificial intelligence and machine learning.",
    url: "https://example.com/ai"
  };
  
  // 2. Generate summary
  const summarizer = await ai.summarizer.create();
  const summary = await summarizer.summarize(content.text);
  console.log('✓ Summary:', summary);
  summarizer.destroy();
  
  // 3. Generate embedding
  const session = await ai.languageModel.create();
  const embedding = await session.embed(content.text);
  console.log('✓ Embedding length:', embedding.length);
  session.destroy();
  
  // 4. Store (would normally go to IndexedDB)
  console.log('✓ Would store:', {
    title: content.title,
    summary,
    embedding: `Float32Array(${embedding.length})`,
    url: content.url
  });
  
  console.log('✓ Capture flow test complete!');
}

await testCapture();
```

### Test Complete Query Flow

```javascript
async function testQuery() {
  console.log('Testing query flow...');
  
  const query = "What is machine learning?";
  
  // 1. Generate query embedding
  const session = await ai.languageModel.create();
  const queryEmbedding = await session.embed(query);
  console.log('✓ Query embedding generated');
  
  // 2. Search memories (simulated)
  console.log('✓ Would search IndexedDB with cosine similarity');
  
  // 3. Generate answer
  const context = "Machine learning is a subset of AI...";
  const prompt = `Based on this information: ${context}\n\nQuestion: ${query}\n\nAnswer:`;
  const answer = await session.prompt(prompt);
  console.log('✓ Answer:', answer);
  
  session.destroy();
  console.log('✓ Query flow test complete!');
}

await testQuery();
```

---

## Debugging Tips

### Enable Detailed Logging

```javascript
// In background service worker
const DEBUG = true;

function log(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', new Date().toISOString(), ...args);
  }
}

// Use throughout code
log('Creating AI session...');
const session = await ai.languageModel.create();
log('Session created successfully');
```

### Monitor API Calls

```javascript
// Wrap AI calls with monitoring
const originalCreate = ai.languageModel.create;
ai.languageModel.create = async function(...args) {
  console.log('[AI] Creating session:', args);
  const start = performance.now();
  const session = await originalCreate.apply(this, args);
  console.log(`[AI] Session created in ${performance.now() - start}ms`);
  return session;
};
```

### Check Chrome Logs

```
chrome://histograms/OptimizationGuide
chrome://download-internals/
chrome://components/
chrome://gpu/
```

---

## Quick Test Script

Copy this entire script into DevTools console for a complete test:

```javascript
(async function runFullTest() {
  console.log('🚀 Starting Chrome AI Full Test...\n');
  
  try {
    // 1. Check availability
    console.log('1️⃣ Checking AI availability...');
    const caps = await ai.languageModel.capabilities();
    console.log(`   Status: ${caps.available}`);
    if (caps.available !== 'readily') {
      throw new Error('AI not ready!');
    }
    
    // 2. Test prompt
    console.log('\n2️⃣ Testing prompt API...');
    const session = await ai.languageModel.create();
    const response = await session.prompt('Say "Hello from Gemini Nano!"');
    console.log(`   Response: ${response}`);
    
    // 3. Test embed
    console.log('\n3️⃣ Testing embeddings...');
    const embedding = await session.embed('test');
    console.log(`   Embedding size: ${embedding.length}`);
    session.destroy();
    
    // 4. Test summarizer
    console.log('\n4️⃣ Testing summarizer...');
    const sum = await ai.summarizer.create();
    const summary = await sum.summarize('AI is transforming technology...');
    console.log(`   Summary: ${summary}`);
    sum.destroy();
    
    // 5. Test writer
    console.log('\n5️⃣ Testing writer...');
    const writer = await ai.writer.create();
    const written = await writer.write('Write: Hello World');
    console.log(`   Written: ${written}`);
    writer.destroy();
    
    console.log('\n✅ All tests passed! Your Chrome AI is working perfectly!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n📝 Troubleshooting:');
    console.log('   1. Check chrome://flags/ settings');
    console.log('   2. Check chrome://components/ for model');
    console.log('   3. Restart Chrome Canary');
  }
})();
```

---

## Next Steps

After verifying AI works:

1. **Load your extension**: `chrome://extensions/`
2. **Test page capture**: Visit a website
3. **Test search**: Use omnibox `brain <query>`
4. **Check storage**: Open popup → Stats tab
5. **Review logs**: Background service worker console

---

**Happy Testing! 🧪✨**

For more information:
- Setup Guide: `CHROME_AI_SETUP.md`
- Architecture: `docs/AI_ARCHITECTURE.md`
- Extension Code: `src/lib/ai/chrome-ai.ts`
