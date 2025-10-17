/**
 * Vector Similarity Search Service
 * Implements cosine similarity for semantic search
 */

import type { Memory, SearchResult } from '@/types'
import { memoryRepository } from '@/lib/db'
import { logger } from '@/utils/logger'

export class VectorSearchService {
  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB)

    if (magnitude === 0) {
      return 0
    }

    return dotProduct / magnitude
  }

  /**
   * Find most similar memories to a query vector
   */
  async findSimilar(
    queryVector: Float32Array,
    options: {
      limit?: number
      threshold?: number
      dateRange?: { start: number; end: number }
      tags?: string[]
    } = {}
  ): Promise<SearchResult[]> {
    const { limit = 5, threshold = 0.5, dateRange, tags } = options

    try {
      // Get all memories from database
      let memories = await memoryRepository.getAll()

      // Apply filters
      if (dateRange) {
        memories = memories.filter(
          (m) => m.created_at >= dateRange.start && m.created_at <= dateRange.end
        )
      }

      if (tags && tags.length > 0) {
        memories = memories.filter((m) =>
          m.tags?.some((tag) => tags.includes(tag))
        )
      }

      logger.debug(`Searching through ${memories.length} memories...`)

      // Calculate similarities
      const results: SearchResult[] = memories
        .map((memory) => ({
          memory,
          score: this.cosineSimilarity(queryVector, memory.embedding),
        }))
        .filter((result) => result.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      logger.debug(`Found ${results.length} similar memories`)

      return results
    } catch (error) {
      logger.error('Vector search failed:', error)
      throw error
    }
  }

  /**
   * Find the single most similar memory
   */
  async findMostSimilar(queryVector: Float32Array): Promise<SearchResult | null> {
    const results = await this.findSimilar(queryVector, { limit: 1 })
    return results.length > 0 ? results[0] : null
  }

  /**
   * Find duplicate or very similar memories (high threshold)
   */
  async findDuplicates(
    queryVector: Float32Array,
    threshold: number = 0.95
  ): Promise<SearchResult[]> {
    return this.findSimilar(queryVector, { threshold, limit: 10 })
  }

  /**
   * Cluster memories by similarity
   * Simple clustering: finds memories similar to each other
   */
  async clusterMemories(threshold: number = 0.7): Promise<Memory[][]> {
    const memories = await memoryRepository.getAll()
    const clusters: Memory[][] = []
    const visited = new Set<string>()

    for (const memory of memories) {
      if (visited.has(memory.id)) continue

      const cluster: Memory[] = [memory]
      visited.add(memory.id)

      // Find similar memories
      const similar = await this.findSimilar(memory.embedding, {
        threshold,
        limit: 100,
      })

      for (const result of similar) {
        if (!visited.has(result.memory.id) && result.memory.id !== memory.id) {
          cluster.push(result.memory)
          visited.add(result.memory.id)
        }
      }

      if (cluster.length > 0) {
        clusters.push(cluster)
      }
    }

    return clusters
  }

  /**
   * Get diversity in search results
   * Returns diverse results by filtering out very similar memories
   */
  async findDiverseSimilar(
    queryVector: Float32Array,
    options: {
      limit?: number
      threshold?: number
      diversityThreshold?: number
    } = {}
  ): Promise<SearchResult[]> {
    const { limit = 5, threshold = 0.5, diversityThreshold = 0.85 } = options

    const initialResults = await this.findSimilar(queryVector, {
      limit: limit * 3, // Get more results initially
      threshold,
    })

    const diverseResults: SearchResult[] = []

    for (const result of initialResults) {
      if (diverseResults.length >= limit) break

      // Check if this result is too similar to already selected results
      const isTooSimilar = diverseResults.some(
        (selected) =>
          this.cosineSimilarity(result.memory.embedding, selected.memory.embedding) >
          diversityThreshold
      )

      if (!isTooSimilar) {
        diverseResults.push(result)
      }
    }

    return diverseResults
  }

  /**
   * Calculate average similarity across all memories
   */
  async calculateAverageSimilarity(queryVector: Float32Array): Promise<number> {
    const memories = await memoryRepository.getAll()

    if (memories.length === 0) return 0

    const totalSimilarity = memories.reduce(
      (sum, memory) => sum + this.cosineSimilarity(queryVector, memory.embedding),
      0
    )

    return totalSimilarity / memories.length
  }
}

// Export singleton instance
export const vectorSearch = new VectorSearchService()
