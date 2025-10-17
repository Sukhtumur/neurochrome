<script lang="ts">
  import { onMount } from 'svelte'
  import MemoryList from '@/components/MemoryList.svelte'
  import SearchBar from '@/components/SearchBar.svelte'
  import Stats from '@/components/Stats.svelte'
  import Settings from '@/components/Settings.svelte'
  import type { QueryResponse } from '@/types'

  let activeTab: 'search' | 'memories' | 'stats' | 'settings' = 'search'
  let lastQueryResponse: QueryResponse | null = null

  onMount(async () => {
    // Load last query if available
    const result = await chrome.storage.local.get('lastQuery')
    if (result.lastQuery) {
      lastQueryResponse = result.lastQuery.response
    }
  })

  function handleTabChange(tab: 'search' | 'memories' | 'stats' | 'settings') {
    activeTab = tab
  }
</script>

<main class="w-[600px] h-[500px] bg-white dark:bg-gray-900">
  <!-- Header -->
  <header class="bg-primary-600 text-white p-4 shadow-lg">
    <h1 class="text-xl font-bold flex items-center gap-2">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      Local Web Brain
    </h1>
    <p class="text-sm opacity-90 mt-1">Your personal knowledge assistant</p>
  </header>

  <!-- Tabs -->
  <nav class="flex border-b border-gray-200 dark:border-gray-700">
    <button
      class="flex-1 px-3 py-3 text-sm font-medium transition-colors {activeTab ===
      'search'
        ? 'text-primary-600 border-b-2 border-primary-600'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
      on:click={() => handleTabChange('search')}
    >
      Search
    </button>
    <button
      class="flex-1 px-3 py-3 text-sm font-medium transition-colors {activeTab ===
      'memories'
        ? 'text-primary-600 border-b-2 border-primary-600'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
      on:click={() => handleTabChange('memories')}
    >
      Memories
    </button>
    <button
      class="flex-1 px-3 py-3 text-sm font-medium transition-colors {activeTab ===
      'stats'
        ? 'text-primary-600 border-b-2 border-primary-600'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
      on:click={() => handleTabChange('stats')}
    >
      Stats
    </button>
    <button
      class="flex-1 px-3 py-3 text-sm font-medium transition-colors {activeTab ===
      'settings'
        ? 'text-primary-600 border-b-2 border-primary-600'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
      on:click={() => handleTabChange('settings')}
    >
      Settings
    </button>
  </nav>

  <!-- Content -->
  <div class="h-[calc(100%-140px)] overflow-hidden">
    {#if activeTab === 'search'}
      <SearchBar {lastQueryResponse} />
    {:else if activeTab === 'memories'}
      <MemoryList />
    {:else if activeTab === 'stats'}
      <Stats />
    {:else if activeTab === 'settings'}
      <Settings />
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
