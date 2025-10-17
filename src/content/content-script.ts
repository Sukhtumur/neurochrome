/**
 * Content Script
 * Injected into web pages to extract text content
 */

import { sanitizeText, isValidText } from '@/utils/helpers'

/**
 * Extract main text content from the page
 */
function extractPageContent(): {
  text: string
  title: string
  url: string
} {
  // Get page title
  const title = document.title || ''

  // Get current URL
  const url = window.location.href

  // Extract text from main content areas
  const mainContent = extractMainContent()

  // Fallback to body text if no main content found
  const text = mainContent || document.body.innerText || ''

  // Sanitize and validate
  const cleanText = sanitizeText(text)

  return {
    text: cleanText.slice(0, 50000), // Limit to 50k characters
    title,
    url,
  }
}

/**
 * Extract main content using common content selectors
 */
function extractMainContent(): string {
  const contentSelectors = [
    'article',
    'main',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.content',
    '#content',
    '.main-content',
  ]

  for (const selector of contentSelectors) {
    const element = document.querySelector(selector)
    if (element && element.textContent) {
      const text = element.textContent
      if (isValidText(text, 200)) {
        return text
      }
    }
  }

  return ''
}

/**
 * Check if page should be captured
 */
function shouldCapturePage(): boolean {
  const url = window.location.href

  // Skip certain URLs
  const skipPatterns = [
    /^chrome:/,
    /^about:/,
    /^chrome-extension:/,
    /^file:/,
    /^data:/,
  ]

  if (skipPatterns.some((pattern) => pattern.test(url))) {
    return false
  }

  // Skip if page is too short
  const bodyText = document.body?.innerText || ''
  if (!isValidText(bodyText, 200)) {
    return false
  }

  return true
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'extractContent') {
    try {
      if (!shouldCapturePage()) {
        sendResponse({ success: false, reason: 'Page should not be captured' })
        return
      }

      const content = extractPageContent()
      sendResponse({ success: true, content })
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return true // Keep channel open for async response
})

// Export for testing
export { extractPageContent, shouldCapturePage, extractMainContent }
