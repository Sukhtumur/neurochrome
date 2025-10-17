<script lang="ts">
  import type { ChromeAICapabilities } from '@/types'
  import { onMount } from 'svelte'

  // @ts-ignore - chrome is available in extension context
  declare const chrome: any

  let capabilities: ChromeAICapabilities | null = null
  let loading = true

  onMount(async () => {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getCapabilities' })
      capabilities = response.capabilities
    } catch (error) {
      console.error('Failed to load capabilities:', error)
    } finally {
      loading = false
    }
  })

  function getStatusColor(available: boolean): string {
    return available ? 'text-green-500' : 'text-red-500'
  }

  function getStatusIcon(available: boolean): string {
    return available ? '✓' : '✗'
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

  <!-- AI Capabilities Status -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Chrome AI API Status
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
          {#if Object.values(capabilities).every((v) => v)}
            <strong>✓ All APIs Available!</strong> Your extension is ready to use all Chrome AI features.
          {:else if Object.values(capabilities).some((v) => v)}
            <strong>⚠️ Partial Support</strong> Some APIs are unavailable. Check Chrome Canary settings and flags.
          {:else}
            <strong>✗ No APIs Available</strong> Please enable Chrome AI flags and download Gemini Nano model.
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
      <p><strong>Privacy:</strong> 100% on-device processing</p>
      <p><strong>Storage:</strong> Local IndexedDB + Encryption</p>
      <p>
        <strong>APIs Used:</strong> Prompt, Summarizer, Writer, Translator, Proofreader, Rewriter
      </p>
    </div>
  </div>

  <!-- Setup Guide Link -->
  <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow p-6 text-white">
    <h3 class="text-lg font-semibold mb-2">Need Help?</h3>
    <p class="text-sm mb-4 text-primary-100">
      If APIs are unavailable, follow our setup guide to enable Chrome Built-in AI features.
    </p>
    <button
      class="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-50 transition-colors"
      on:click={() => chrome.tabs.create({ url: 'https://github.com/Sukhtumur/neurochrome#setup' })}
    >
      View Setup Guide
    </button>
  </div>
</div>
