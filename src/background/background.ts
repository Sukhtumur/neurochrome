/**
 * Background Service Worker
 * Main orchestrator for the extension
 */

import { db } from '@/lib/db'
import { memoryRepository } from '@/lib/db'
import { chromeAI } from '@/lib/ai'
import { cryptoService } from '@/lib/crypto'
import { queryService } from '@/lib/query'
import { logger } from '@/utils/logger'
import { shouldIgnoreUrl, isValidText } from '@/utils/helpers'
import type { ExtensionConfig } from '@/types'

// Default configuration
const DEFAULT_CONFIG: ExtensionConfig = {
  autoCaptureEnabled: true,
  maxMemories: 10000,
  encryptionEnabled: true,
  minTextLength: 200,
  multilingualEnabled: false,
  similarityThreshold: 0.5,
}

/**
 * Initialize the extension
 */
async function initialize(): Promise<void> {
  try {
    logger.info('Initializing Local Web Brain...')

    // Initialize database
    await db.initialize()
    logger.info('Database initialized')

    // Initialize AI services
    await chromeAI.initialize()
    logger.info('AI services initialized')

    // Initialize encryption
    if (DEFAULT_CONFIG.encryptionEnabled) {
      await cryptoService.initialize()
      logger.info('Encryption initialized')
    }

    // Load configuration
    const stored = await chrome.storage.sync.get('config')
    const config = { ...DEFAULT_CONFIG, ...stored.config }
    await chrome.storage.sync.set({ config })

    logger.info('Extension initialized successfully')
  } catch (error) {
    logger.error('Initialization failed:', error)
  }
}

/**
 * Capture and process a webpage
 */
async function captureWebpage(tabId: number, url: string): Promise<void> {
  try {
    // Check if URL should be ignored
    if (shouldIgnoreUrl(url)) {
      logger.debug(`Ignoring URL: ${url}`)
      return
    }

    // Check if already captured
    const existing = await memoryRepository.getByUrl(url)
    if (existing) {
      logger.debug(`URL already captured: ${url}`)
      await memoryRepository.incrementVisitCount(existing.id)
      return
    }

    logger.info(`Capturing webpage: ${url}`)

    // Extract content using content script
    const [response] = await chrome.tabs.sendMessage(tabId, {
      action: 'extractContent',
    })

    if (!response?.success || !response.content) {
      logger.warn('Failed to extract content')
      return
    }

    const { text, title } = response.content

    // Validate text
    if (!isValidText(text, DEFAULT_CONFIG.minTextLength)) {
      logger.debug('Text too short, skipping')
      return
    }

    // Generate summary
    logger.debug('Generating summary...')
    const summary = await chromeAI.summarize(text, 500)

    // Generate embedding
    logger.debug('Generating embedding...')
    const embedding = await chromeAI.embed(text)

    // Encrypt summary if enabled
    const finalSummary = DEFAULT_CONFIG.encryptionEnabled
      ? await cryptoService.encrypt(summary)
      : summary

    // Store memory
    await memoryRepository.create({
      url,
      title,
      summary: finalSummary,
      embedding,
    })

    logger.info(`Memory created for: ${title}`)
  } catch (error) {
    logger.error('Failed to capture webpage:', error)
  }
}

/**
 * Handle omnibox query
 */
async function handleOmniboxQuery(query: string): Promise<void> {
  try {
    logger.info(`Omnibox query: ${query}`)

    // Process query
    const response = await queryService.processQuery({ query })

    // Show notification with answer
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Local Web Brain',
      message: response.answer,
      priority: 2,
    })

    // Store query response for popup to display
    await chrome.storage.local.set({
      lastQuery: {
        query,
        response,
        timestamp: Date.now(),
      },
    })
  } catch (error) {
    logger.error('Omnibox query failed:', error)
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Error',
      message: 'Failed to process your query. Please try again.',
      priority: 1,
    })
  }
}

// ==================== Event Listeners ====================

// Extension installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    logger.info('Extension installed')
    await initialize()
  } else if (details.reason === 'update') {
    logger.info('Extension updated')
  }
})

// Extension startup
chrome.runtime.onStartup.addListener(async () => {
  logger.info('Extension started')
  await initialize()
})

// Tab updates (page navigation)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const { config } = await chrome.storage.sync.get('config')
    const extensionConfig = { ...DEFAULT_CONFIG, ...config }

    if (extensionConfig.autoCaptureEnabled) {
      // Inject content script
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['content-script.js'],
        })

        // Capture webpage
        await captureWebpage(tabId, tab.url)
      } catch (error) {
        logger.debug('Failed to inject content script:', error)
      }
    }
  }
})

// Omnibox input
chrome.omnibox.onInputEntered.addListener(async (text) => {
  await handleOmniboxQuery(text)
})

// Message handler for popup/options
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  ;(async () => {
    try {
      switch (request.action) {
        case 'query': {
          const response = await queryService.processQuery(request.data)
          sendResponse({ success: true, data: response })
          break
        }

        case 'getStats': {
          const stats = await db.getStats()
          sendResponse({ success: true, data: stats })
          break
        }

        case 'clearMemories': {
          await memoryRepository.clear()
          sendResponse({ success: true })
          break
        }

        case 'getCapabilities': {
          const capabilities = chromeAI.getCapabilities()
          sendResponse({ success: true, capabilities })
          break
        }

        case 'translate': {
          const { text, targetLanguage } = request.data
          const translated = await chromeAI.translate(text, targetLanguage)
          sendResponse({ success: true, translated })
          break
        }

        case 'rewrite': {
          const { text, tone, length, format } = request.data
          const rewritten = await chromeAI.rewrite(text, { tone, length, format })
          sendResponse({ success: true, rewritten })
          break
        }

        default:
          sendResponse({ success: false, error: 'Unknown action' })
      }
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })()

  return true // Keep channel open for async response
})

// Initialize on script load
initialize()
