/**
 * Query Service
 * Orchestrates the query flow: embedding → search → answer generation
 */

import { hybridAI } from '@/lib/ai'
import { vectorSearch } from '@/lib/vector'
import { cryptoService } from '@/lib/crypto'
import type { QueryRequest, QueryResponse } from '@/types'
import { logger } from '@/utils/logger'

export class QueryService {
  /**
   * Process a natural language query
   */
  async processQuery(request: QueryRequest): Promise<QueryResponse> {
    const startTime = Date.now()

    try {
      logger.info(`Processing query: "${request.query}"`)

      // Step 1: Generate query embedding
      const queryEmbedding = await hybridAI.embed(request.query)

      // Step 2: Find similar memories
      const searchResults = await vectorSearch.findSimilar(queryEmbedding, {
        limit: request.limit || 5,
        dateRange: request.dateRange,
        tags: request.tags,
      })

      if (searchResults.length === 0) {
        return {
          answer: "I couldn't find any relevant memories for your query.",
          sources: [],
          processingTime: Date.now() - startTime,
        }
      }

      // Step 3: Decrypt summaries if needed
      const decryptedSources = await Promise.all(
        searchResults.map(async (result) => {
          try {
            const summary = cryptoService.isInitialized()
              ? await cryptoService.decrypt(result.memory.summary)
              : result.memory.summary

            return {
              ...result,
              memory: {
                ...result.memory,
                summary,
              },
            }
          } catch (error) {
            logger.warn(`Failed to decrypt summary for ${result.memory.url}`, error)
            return result
          }
        })
      )

      // Step 4: Compose context from top results
      const context = decryptedSources
        .map(
          (result, idx) =>
            `[${idx + 1}] ${result.memory.title}\n${result.memory.summary}\nSource: ${result.memory.url}\n`
        )
        .join('\n')

      // Step 5: Generate answer using writer
      const prompt = `You are a helpful assistant with access to the user's browsing history.

Question: ${request.query}

Based on these memories from the user's browsing history:
${context}

Provide a concise, helpful answer. Reference the sources by number [1], [2], etc.`

      const answer = await hybridAI.write(prompt, {
        tone: 'helpful',
        length: 'medium',
      })

      // Step 6: Proofread the answer
      const finalAnswer = await hybridAI.proofread(answer)

      const processingTime = Date.now() - startTime
      logger.info(`Query processed in ${processingTime}ms`)

      return {
        answer: finalAnswer,
        sources: decryptedSources,
        processingTime,
      }
    } catch (error) {
      logger.error('Query processing failed:', error)
      throw error
    }
  }
}

export const queryService = new QueryService()
