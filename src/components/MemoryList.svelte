<script lang="ts">
  import { onMount } from 'svelte'
  import type { Memory } from '@/types'
  import { formatRelativeTime, extractDomain } from '@/utils/helpers'

  let memories: Memory[] = []
  let isLoading = true
  let filter = ''
  let expandedMemory: string | null = null
  let translatingMemory: string | null = null
  let rewritingMemory: string | null = null
  let translatedSummaries: Record<string, string> = {}
  let rewrittenSummaries: Record<string, string> = {}

  onMount(async () => {
    await loadMemories()
  })

  async function loadMemories() {
    isLoading = true
    try {
      const db = await import('@/lib/db')
      const repo = db.memoryRepository
      memories = await repo.getAll({
        sortBy: 'created_at',
        order: 'desc',
        limit: 100,
      })
    } catch (error) {
      console.error('Failed to load memories:', error)
    } finally {
      isLoading = false
    }
  }

  async function deleteMemory(id: string) {
    if (!confirm('Are you sure you want to delete this memory?')) return

    try {
      const db = await import('@/lib/db')
      await db.memoryRepository.delete(id)
      await loadMemories()
    } catch (error) {
      console.error('Failed to delete memory:', error)
    }
  }

  function toggleExpand(id: string) {
    expandedMemory = expandedMemory === id ? null : id
  }

  async function translateSummary(memory: Memory, targetLang: string) {
    translatingMemory = memory.id
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'translate',
        data: { text: memory.summary, targetLanguage: targetLang },
      })
      if (response.success) {
        translatedSummaries[memory.id] = response.translated
      } else {
        alert('Translation failed: ' + response.error)
      }
    } catch (error) {
      console.error('Failed to translate:', error)
      alert('Translation failed')
    } finally {
      translatingMemory = null
    }
  }

  async function rewriteSummary(memory: Memory) {
    rewritingMemory = memory.id
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'rewrite',
        data: { text: memory.summary, tone: 'casual', length: 'shorter' },
      })
      if (response.success) {
        rewrittenSummaries[memory.id] = response.rewritten
      } else {
        alert('Rewrite failed: ' + response.error)
      }
    } catch (error) {
      console.error('Failed to rewrite:', error)
      alert('Rewrite failed')
    } finally {
      rewritingMemory = null
    }
  }

  $: filteredMemories = memories.filter(
    (m) =>
      m.title.toLowerCase().includes(filter.toLowerCase()) ||
      m.url.toLowerCase().includes(filter.toLowerCase())
  )
</script>

<div class="h-full flex flex-col p-4">
  <!-- Filter -->
  <div class="mb-4">
    <input
      type="text"
      bind:value={filter}
      placeholder="Filter memories..."
      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
    />
  </div>

  <!-- List -->
  <div class="flex-1 overflow-y-auto scrollbar-thin space-y-2">
    {#if isLoading}
      <div class="flex items-center justify-center h-full">
        <div class="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    {:else if filteredMemories.length === 0}
      <div class="flex items-center justify-center h-full">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <svg
            class="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p class="text-sm">No memories found</p>
          <p class="text-xs mt-2">Start browsing to create memories</p>
        </div>
      </div>
    {:else}
      {#each filteredMemories as memory (memory.id)}
        <div
          class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {memory.title}
              </h4>
              
              <!-- Original Summary -->
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 {expandedMemory === memory.id ? '' : 'line-clamp-2'}">
                {memory.summary}
              </p>

              <!-- Translated Summary -->
              {#if translatedSummaries[memory.id]}
                <div class="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <div class="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">🌐 Translated:</div>
                  <p class="text-xs text-blue-900 dark:text-blue-100">{translatedSummaries[memory.id]}</p>
                </div>
              {/if}

              <!-- Rewritten Summary -->
              {#if rewrittenSummaries[memory.id]}
                <div class="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                  <div class="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">✨ Rewritten:</div>
                  <p class="text-xs text-green-900 dark:text-green-100">{rewrittenSummaries[memory.id]}</p>
                </div>
              {/if}

              <div class="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{extractDomain(memory.url)}</span>
                <span>•</span>
                <span>{formatRelativeTime(memory.created_at)}</span>
                {#if memory.visit_count && memory.visit_count > 1}
                  <span>•</span>
                  <span>{memory.visit_count} visits</span>
                {/if}
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-1 mt-2">
                <button
                  on:click={() => toggleExpand(memory.id)}
                  class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {expandedMemory === memory.id ? 'Show less' : 'Show more'}
                </button>

                <button
                  on:click={() => translateSummary(memory, 'es')}
                  disabled={translatingMemory === memory.id}
                  class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                  title="Translate to Spanish"
                >
                  {translatingMemory === memory.id ? '...' : '🌐 ES'}
                </button>

                <button
                  on:click={() => translateSummary(memory, 'fr')}
                  disabled={translatingMemory === memory.id}
                  class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                  title="Translate to French"
                >
                  {translatingMemory === memory.id ? '...' : '🌐 FR'}
                </button>

                <button
                  on:click={() => rewriteSummary(memory)}
                  disabled={rewritingMemory === memory.id}
                  class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                  title="Rewrite summary (shorter, casual)"
                >
                  {rewritingMemory === memory.id ? '...' : '✨ Rewrite'}
                </button>
              </div>
            </div>
            
            <div class="flex gap-1">
              <a
                href={memory.url}
                target="_blank"
                class="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                title="Open URL"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <button
                on:click={() => deleteMemory(memory.id)}
                class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
