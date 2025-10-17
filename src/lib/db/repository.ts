/**
 * Memory Repository
 * Implements repository pattern for clean separation of data access logic
 */

import { db } from './database'
import type { Memory } from '@/types'
import { ErrorType, ExtensionError } from '@/types'
import { generateId } from '@/utils/helpers'

export class MemoryRepository {
  /**
   * Store a new memory
   */
  async create(memoryData: Omit<Memory, 'id' | 'created_at'>): Promise<Memory> {
    try {
      const memory: Memory = {
        ...memoryData,
        id: generateId(),
        created_at: Date.now(),
        visit_count: 1,
        last_accessed: Date.now(),
      }

      await db.memories.add(memory)
      return memory
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to create memory',
        error
      )
    }
  }

  /**
   * Update an existing memory
   */
  async update(id: string, updates: Partial<Memory>): Promise<void> {
    try {
      await db.memories.update(id, updates)
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to update memory',
        error
      )
    }
  }

  /**
   * Get memory by ID
   */
  async getById(id: string): Promise<Memory | undefined> {
    try {
      return await db.memories.get(id)
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to retrieve memory',
        error
      )
    }
  }

  /**
   * Get memory by URL
   */
  async getByUrl(url: string): Promise<Memory | undefined> {
    try {
      return await db.memories.where('url').equals(url).first()
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to retrieve memory by URL',
        error
      )
    }
  }

  /**
   * Get all memories with optional filters
   */
  async getAll(options?: {
    limit?: number
    offset?: number
    sortBy?: 'created_at' | 'last_accessed' | 'visit_count'
    order?: 'asc' | 'desc'
  }): Promise<Memory[]> {
    try {
      let collection = db.memories.toCollection()

      if (options?.sortBy) {
        collection = db.memories.orderBy(options.sortBy)
        if (options.order === 'desc') {
          collection = collection.reverse()
        }
      }

      if (options?.offset) {
        collection = collection.offset(options.offset)
      }

      if (options?.limit) {
        collection = collection.limit(options.limit)
      }

      return await collection.toArray()
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to retrieve memories',
        error
      )
    }
  }

  /**
   * Delete memory by ID
   */
  async delete(id: string): Promise<void> {
    try {
      await db.memories.delete(id)
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to delete memory',
        error
      )
    }
  }

  /**
   * Delete multiple memories
   */
  async deleteMany(ids: string[]): Promise<void> {
    try {
      await db.memories.bulkDelete(ids)
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to delete memories',
        error
      )
    }
  }

  /**
   * Clear all memories
   */
  async clear(): Promise<void> {
    try {
      await db.memories.clear()
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to clear memories',
        error
      )
    }
  }

  /**
   * Increment visit count for a memory
   */
  async incrementVisitCount(id: string): Promise<void> {
    try {
      const memory = await this.getById(id)
      if (memory) {
        await this.update(id, {
          visit_count: (memory.visit_count || 0) + 1,
          last_accessed: Date.now(),
        })
      }
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to increment visit count',
        error
      )
    }
  }

  /**
   * Search memories by text (simple text search, not semantic)
   */
  async searchByText(query: string): Promise<Memory[]> {
    try {
      const lowerQuery = query.toLowerCase()
      return await db.memories
        .filter(
          (memory) =>
            memory.title.toLowerCase().includes(lowerQuery) ||
            memory.summary.toLowerCase().includes(lowerQuery) ||
            memory.url.toLowerCase().includes(lowerQuery)
        )
        .toArray()
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to search memories',
        error
      )
    }
  }

  /**
   * Get memories within a date range
   */
  async getByDateRange(start: number, end: number): Promise<Memory[]> {
    try {
      return await db.memories
        .where('created_at')
        .between(start, end, true, true)
        .toArray()
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to retrieve memories by date range',
        error
      )
    }
  }

  /**
   * Get memories by tags
   */
  async getByTags(tags: string[]): Promise<Memory[]> {
    try {
      return await db.memories
        .where('tags')
        .anyOf(tags)
        .toArray()
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to retrieve memories by tags',
        error
      )
    }
  }

  /**
   * Get total count
   */
  async count(): Promise<number> {
    try {
      return await db.memories.count()
    } catch (error) {
      throw new ExtensionError(
        ErrorType.DATABASE_ERROR,
        'Failed to count memories',
        error
      )
    }
  }
}

// Export singleton instance
export const memoryRepository = new MemoryRepository()
