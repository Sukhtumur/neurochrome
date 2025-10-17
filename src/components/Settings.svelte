<script lang="ts">
  import type { ChromeAICapabilities } from '@/types'
  import { onMount } from 'svelte'

  // @ts-ignore - chrome is available in extension context
  declare const chrome: any

  let capabilities: ChromeAICapabilities | null = null
  let provider: 'chrome' | 'gemini' = 'chrome'
  let loading = true
  let geminiApiKey = ''
  let showApiKey = false
  let saving = false
  let savedMessage = false

  onMount(async () => {
    try {
      // Load capabilities and provider
      const response = await chrome.runtime.sendMessage({ action: 'getCapabilities' })
      capabilities = response.capabilities
      provider = response.provider

      // Load saved API key
      const stored = await chrome.storage.sync.get(['geminiApiKey'])
      geminiApiKey = stored.geminiApiKey || ''
    } catch (error) {
      console.error('Failed to load capabilities:', error)
    } finally {
      loading = false
    }
  })

  async function saveApiKey() {
    saving = true
    savedMessage = false
    try {
      await chrome.storage.sync.set({ geminiApiKey })
      savedMessage = true
      setTimeout(() => {
        savedMessage = false
      }, 3000)
      
      // Reload extension to apply new API key
      chrome.runtime.reload()
    } catch (error) {
      console.error('Failed to save API key:', error)
      alert('Failed to save API key. Please try again.')
    } finally {
      saving = false
    }
  }

  function getStatusColor(available: boolean): string {
    return available ? 'text-green-500' : 'text-red-500'
  }

  function getStatusIcon(available: boolean): string {
    return available ? '✓' : '✗'
  }

  function getProviderBadge() {
    if (provider === 'gemini') {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Extension configuration and AI API status
    </p>
  </div>

  <!-- Gemini API Key Configuration -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Gemini API Key
      </h3>
      <span class={`px-3 py-1 rounded-full text-xs font-medium ${getProviderBadge()}`}>
        {provider === 'gemini' ? 'Using Gemini API' : 'Using Chrome AI'}
      </span>
    </div>

    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {#if provider === 'gemini'}
        Chrome AI is unavailable. Using Gemini API as fallback.
      {:else}
        Chrome AI is active. Gemini API will be used as fallback if needed.
      {/if}
    </p>

    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          API Key
        </label>
        <div class="flex gap-2">
          {#if showApiKey}
            <input
              type="text"
              bind:value={geminiApiKey}
              placeholder="AIzaSy..."
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          {:else}
            <input
              type="password"
              bind:value={geminiApiKey}
              placeholder="AIzaSy..."
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          {/if}
          <button
            type="button"
            on:click={() => (showApiKey = !showApiKey)}
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            {showApiKey ? '🙈' : '👁️'}
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-primary-600 hover:underline">Google AI Studio</a>
        </p>
      </div>

      <button
        on:click={saveApiKey}
        disabled={saving || !geminiApiKey}
        class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'Saving...' : 'Save & Reload Extension'}
      </button>

      {#if savedMessage}
        <div class="text-sm text-green-600 dark:text-green-400 text-center">
          ✓ API key saved! Extension reloading...
        </div>
      {/if}
    </div>
  </div>

  <!-- AI Capabilities Status -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      AI Capabilities
    </h3>

    {#if loading}
      <div class="animate-pulse space-y-3">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    {:else if capabilities}
      <div class="space-y-3">
        <!-- Prompt API (Embeddings) -->
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center gap-3">
            <span class={`text-2xl ${getStatusColor(capabilities.embedder)}`}>
              {getStatusIcon(capabilities.embedder)}
            </span>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Prompt API</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Embeddings & semantic understanding
              </div>
            </div>
          </div>
          <span class={`text-sm font-medium ${getStatusColor(capabilities.embedder)}`}>
            {capabilities.embedder ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <!-- Summarizer API -->
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center gap-3">
            <span class={`text-2xl ${getStatusColor(capabilities.summarizer)}`}>
              {getStatusIcon(capabilities.summarizer)}
            </span>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Summarizer API</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Generate page summaries
              </div>
            </div>
          </div>
          <span class={`text-sm font-medium ${getStatusColor(capabilities.summarizer)}`}>
            {capabilities.summarizer ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <!-- Writer API -->
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center gap-3">
            <span class={`text-2xl ${getStatusColor(capabilities.writer)}`}>
              {getStatusIcon(capabilities.writer)}
            </span>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Writer API</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Generate natural language answers
              </div>
            </div>
          </div>
          <span class={`text-sm font-medium ${getStatusColor(capabilities.writer)}`}>
            {capabilities.writer ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <!-- Translator API -->
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center gap-3">
            <span class={`text-2xl ${getStatusColor(capabilities.translator)}`}>
              {getStatusIcon(capabilities.translator)}
            </span>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Translator API</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Translate memories to other languages
              </div>
            </div>
          </div>
          <span class={`text-sm font-medium ${getStatusColor(capabilities.translator)}`}>
            {capabilities.translator ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <!-- Proofreader API -->
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center gap-3">
            <span class={`text-2xl ${getStatusColor(capabilities.proofreader)}`}>
              {getStatusIcon(capabilities.proofreader)}
            </span>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Proofreader API</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Clean up extracted content
              </div>
            </div>
          </div>
          <span class={`text-sm font-medium ${getStatusColor(capabilities.proofreader)}`}>
            {capabilities.proofreader ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <!-- Rewriter API -->
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center gap-3">
            <span class={`text-2xl ${getStatusColor(capabilities.rewriter)}`}>
              {getStatusIcon(capabilities.rewriter)}
            </span>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Rewriter API</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Improve and rewrite summaries
              </div>
            </div>
          </div>
          <span class={`text-sm font-medium ${getStatusColor(capabilities.rewriter)}`}>
            {capabilities.rewriter ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <!-- Status Summary -->
      <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="text-sm text-blue-800 dark:text-blue-200">
          {#if provider === 'chrome'}
            <strong>✓ Chrome AI Active!</strong> Using on-device AI for privacy and performance.
          {:else if geminiApiKey}
            <strong>🌐 Gemini API Active</strong> Using cloud AI as fallback. All features available.
          {:else}
            <strong>⚠️ Configure Gemini API</strong> Chrome AI unavailable. Add Gemini API key to enable features.
          {/if}
        </div>
      </div>
    {:else}
      <div class="text-center text-gray-500 dark:text-gray-400">
        Failed to load API status
      </div>
    {/if}
  </div>

  <!-- Extension Info -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      About Local Web Brain
    </h3>
    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
      <p><strong>Version:</strong> 1.0.0</p>
      <p><strong>Privacy:</strong> Hybrid AI (Chrome on-device + Gemini cloud)</p>
      <p><strong>Storage:</strong> Local IndexedDB + AES-GCM Encryption</p>
      <p>
        <strong>Features:</strong> Summarization, Embeddings, Translation, Rewriting, Proofreading
      </p>
      <p>
        <strong>Competition:</strong> Google Chrome Built-in AI Challenge 2025
      </p>
    </div>
  </div>

  <!-- Hybrid AI Advantage -->
  <div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow p-6 text-white">
    <h3 class="text-lg font-semibold mb-2">🏆 Hybrid AI Strategy</h3>
    <p class="text-sm mb-4 text-purple-100">
      This extension uses a hybrid approach: Chrome AI for on-device privacy when available, 
      Gemini API as reliable cloud fallback. Best of both worlds!
    </p>
    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="bg-white/10 rounded p-2">
        <div class="font-semibold">Chrome AI</div>
        <div>Fast, private, offline</div>
      </div>
      <div class="bg-white/10 rounded p-2">
        <div class="font-semibold">Gemini API</div>
        <div>Reliable, powerful, always available</div>
      </div>
    </div>
  </div>

  <!-- Setup Guide Link -->
  <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow p-6 text-white">
    <h3 class="text-lg font-semibold mb-2">Need Help?</h3>
    <p class="text-sm mb-4 text-primary-100">
      Follow our setup guide to enable Chrome Built-in AI or configure Gemini API fallback.
    </p>
    <button
      class="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-50 transition-colors"
      on:click={() => chrome.tabs.create({ url: 'https://github.com/Sukhtumur/neurochrome#setup' })}
    >
      View Setup Guide
    </button>
  </div>
</div>
