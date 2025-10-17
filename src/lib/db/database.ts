/**
 * Database layer using Dexie.js
 * Provides persistent storage for memories with IndexedDB
 */

import Dexie, { type Table } from 'dexie'
import type { Memory } from '@/types'

export class MemoryDatabase extends Dexie {
  memories!: Table<Memory, string>

  constructor() {
    super('LocalWebBrainDB')

    // Define schema
    this.version(1).stores({
      memories: 'id, url, created_at, last_accessed, *tags',
    })
  }

  /**
   * Initialize database and handle migrations
   */
  async initialize(): Promise<void> {
    await this.open()
  }

  /**
   * Get database statistics
   */
  async getStats() {
    const count = await this.memories.count()
    const oldestMemory = await this.memories.orderBy('created_at').first()
    const newestMemory = await this.memories.orderBy('created_at').reverse().first()

    return {
      totalMemories: count,
      oldestDate: oldestMemory?.created_at,
      newestDate: newestMemory?.created_at,
    }
  }
}

// Singleton instance
export const db = new MemoryDatabase()
