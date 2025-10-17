/**
 * Core domain types for the Local Web Brain extension
 */

/**
 * Represents a stored memory of a visited webpage
 */
export interface Memory {
  /** Unique identifier for the memory */
  id: string
  /** Original URL of the page */
  url: string
  /** Page title */
  title: string
  /** AI-generated summary (encrypted) */
  summary: string
  /** Text embedding vector for semantic search */
  embedding: Float32Array
  /** Timestamp when memory was created */
  created_at: number
  /** Optional tags for categorization */
  tags?: string[]
  /** Visit count */
  visit_count?: number
  /** Last accessed timestamp */
  last_accessed?: number
}

/**
 * Configuration for extension settings
 */
export interface ExtensionConfig {
  /** Enable/disable auto-capture of browsing history */
  autoCaptureEnabled: boolean
  /** Maximum number of memories to store */
  maxMemories: number
  /** Enable encryption for summaries */
  encryptionEnabled: boolean
  /** Minimum page text length to capture */
  minTextLength: number
  /** Enable multilingual support */
  multilingualEnabled: boolean
  /** Similarity threshold for search results (0-1) */
  similarityThreshold: number
}

/**
 * Result from vector similarity search
 */
export interface SearchResult {
  /** The matching memory */
  memory: Memory
  /** Similarity score (0-1, cosine similarity) */
  score: number
}

/**
 * Query request structure
 */
export interface QueryRequest {
  /** User's natural language query */
  query: string
  /** Number of results to return */
  limit?: number
  /** Filter by date range */
  dateRange?: {
    start: number
    end: number
  }
  /** Filter by tags */
  tags?: string[]
}

/**
 * Response structure for queries
 */
export interface QueryResponse {
  /** Generated answer */
  answer: string
  /** Source memories used to generate answer */
  sources: SearchResult[]
  /** Processing time in ms */
  processingTime: number
}

/**
 * Chrome AI API types
 */
export interface ChromeAICapabilities {
  summarizer: boolean
  embedder: boolean
  writer: boolean
  translator: boolean
  proofreader: boolean
  rewriter: boolean
}

/**
 * Error types for better error handling
 */
export enum ErrorType {
  AI_API_NOT_AVAILABLE = 'AI_API_NOT_AVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  STORAGE_FULL = 'STORAGE_FULL',
}

export class ExtensionError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ExtensionError'
  }
}
