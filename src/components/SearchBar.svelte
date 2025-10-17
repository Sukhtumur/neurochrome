<script lang="ts">
  import type { QueryResponse } from '@/types'
  import { formatRelativeTime } from '@/utils/helpers'

  export let lastQueryResponse: QueryResponse | null = null

  let query = ''
  let isLoading = false
  let response: QueryResponse | null = lastQueryResponse

  async function handleSearch() {
    if (!query.trim() || isLoading) return

    isLoading = true
    try {
      const result = await chrome.runtime.sendMessage({
        action: 'query',
        data: { query },
      })

      if (result.success) {
        response = result.data
      } else {
        console.error('Query failed:', result.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      isLoading = false
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }
</script>

<div class="h-full flex flex-col p-4 overflow-y-auto scrollbar-thin">
  <!-- Search Input -->
  <div class="flex gap-2 mb-4">
    <input
      type="text"
      bind:value={query}
      on:keypress={handleKeyPress}
      placeholder="Ask about your browsing history..."
      class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
      disabled={isLoading}
    />
    <button
      on:click={handleSearch}
      disabled={isLoading || !query.trim()}
      class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Searching...' : 'Search'}
    </button>
  </div>

  <!-- Results -->
  {#if response}
    <div class="flex-1 space-y-4">
      <!-- Answer -->
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Answer
        </h3>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {response.answer}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Processed in {response.processingTime}ms
        </p>
      </div>

      <!-- Sources -->
      {#if response.sources.length > 0}
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Sources ({response.sources.length})
          </h3>
          <div class="space-y-2">
            {#each response.sources as source, idx}
              <div
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span
                        class="inline-flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold"
                      >
                        {idx + 1}
                      </span>
                      <h4 class="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {source.memory.title}
                      </h4>
                    </div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {source.memory.summary.substring(0, 150)}...
                    </p>
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Relevance: {Math.round(source.score * 100)}%</span>
                      <span>•</span>
                      <a
                        href={source.memory.url}
                        target="_blank"
                        class="text-primary-600 dark:text-primary-400 hover:underline truncate max-w-[200px]"
                      >
                        {source.memory.url}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex-1 flex items-center justify-center">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p class="text-sm">
          Ask a question about your browsing history
        </p>
        <p class="text-xs mt-2">
          Try: "What did I read about AI yesterday?"
        </p>
      </div>
    </div>
  {/if}
</div>
