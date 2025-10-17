<script lang="ts">
  import { onMount } from 'svelte'
  import { calculatePercentage } from '@/utils/helpers'

  let stats = {
    totalMemories: 0,
    oldestDate: 0,
    newestDate: 0,
  }
  let isLoading = true

  onMount(async () => {
    await loadStats()
  })

  async function loadStats() {
    isLoading = true
    try {
      const result = await chrome.runtime.sendMessage({
        action: 'getStats',
      })

      if (result.success) {
        stats = result.data
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      isLoading = false
    }
  }

  async function clearAllMemories() {
    if (
      !confirm(
        'Are you sure you want to clear all memories? This action cannot be undone.'
      )
    )
      return

    try {
      const result = await chrome.runtime.sendMessage({
        action: 'clearMemories',
      })

      if (result.success) {
        await loadStats()
      }
    } catch (error) {
      console.error('Failed to clear memories:', error)
    }
  }

  function formatDate(timestamp: number): string {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
</script>

<div class="h-full flex flex-col p-4 overflow-y-auto scrollbar-thin">
  {#if isLoading}
    <div class="flex items-center justify-center h-full">
      <div class="text-gray-500 dark:text-gray-400">Loading statistics...</div>
    </div>
  {:else}
    <div class="space-y-4">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4">
        <div
          class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Total Memories</p>
              <p class="text-4xl font-bold mt-1">{stats.totalMemories}</p>
            </div>
            <svg class="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
              />
              <path
                fill-rule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Timeline
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Oldest Memory:</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">
                {formatDate(stats.oldestDate)}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Newest Memory:</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">
                {formatDate(stats.newestDate)}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Storage
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Capacity Used:</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">
                {calculatePercentage(stats.totalMemories, 10000)}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-primary-600 h-2 rounded-full transition-all"
                style="width: {calculatePercentage(stats.totalMemories, 10000)}%"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {stats.totalMemories} / 10,000 memories
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-2">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">
          Actions
        </h3>
        <button
          on:click={clearAllMemories}
          class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear All Memories
        </button>
      </div>

      <!-- Info -->
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          About
        </h3>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Local Web Brain uses Chrome's built-in AI (Gemini Nano) to create semantic
          memories of your browsing history. All data is stored locally and encrypted.
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Use the omnibox keyword <code class="bg-white dark:bg-gray-800 px-1 rounded">brain</code> to query your memories.
        </p>
      </div>
    </div>
  {/if}
</div>
