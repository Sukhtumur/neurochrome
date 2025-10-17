/**
 * Chrome Built-in AI Service
 * Wrapper for Chrome AI APIs with error handling and availability checks
 */

import { ErrorType, ExtensionError, type ChromeAICapabilities } from '@/types'
import { logger } from '@/utils/logger'
import { retry } from '@/utils/helpers'

export class ChromeAIService {
  private capabilities: ChromeAICapabilities = {
    summarizer: false,
    embedder: false,
    writer: false,
    translator: false,
    proofreader: false,
    rewriter: false,
  }

  /**
   * Initialize and check AI capabilities
   */
  async initialize(): Promise<ChromeAICapabilities> {
    logger.info('Initializing Chrome AI services...')

    try {
      // Check each API availability
      if (chrome.ai?.summarizer) {
        this.capabilities.summarizer = await chrome.ai.summarizer.available()
      }
      if (chrome.ai?.prompt) {
        this.capabilities.embedder = await chrome.ai.prompt.available()
      }
      if (chrome.ai?.writer) {
        this.capabilities.writer = await chrome.ai.writer.available()
      }
      if (chrome.ai?.translator) {
        this.capabilities.translator = await chrome.ai.translator.available()
      }
      if (chrome.ai?.proofreader) {
        this.capabilities.proofreader = await chrome.ai.proofreader.available()
      }
      if (chrome.ai?.rewriter) {
        this.capabilities.rewriter = await chrome.ai.rewriter.available()
      }

      logger.info('AI capabilities:', this.capabilities)
      return this.capabilities
    } catch (error) {
      logger.error('Failed to initialize AI services:', error)
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Chrome AI APIs are not available',
        error
      )
    }
  }

  /**
   * Generate summary from text
   */
  async summarize(text: string, maxLength: number = 500): Promise<string> {
    if (!this.capabilities.summarizer) {
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Summarizer API is not available'
      )
    }

    try {
      logger.debug('Generating summary...')
      const summary = await retry(
        () => chrome.ai.summarizer.summarize(text, { maxLength }),
        { maxAttempts: 3, delay: 500 }
      )
      logger.debug('Summary generated successfully')
      return summary
    } catch (error) {
      logger.error('Failed to generate summary:', error)
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Failed to generate summary',
        error
      )
    }
  }

  /**
   * Generate embedding vector from text
   */
  async embed(text: string): Promise<Float32Array> {
    if (!this.capabilities.embedder) {
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Embedding API is not available'
      )
    }

    try {
      logger.debug('Generating embedding...')
      const embedding = await retry(
        () => chrome.ai.prompt.embed(text),
        { maxAttempts: 3, delay: 500 }
      )
      logger.debug('Embedding generated successfully')
      return embedding
    } catch (error) {
      logger.error('Failed to generate embedding:', error)
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Failed to generate embedding',
        error
      )
    }
  }

  /**
   * Generate text using writer API
   */
  async write(
    prompt: string,
    options?: { tone?: string; length?: string }
  ): Promise<string> {
    if (!this.capabilities.writer) {
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Writer API is not available'
      )
    }

    try {
      logger.debug('Generating text...')
      const text = await retry(
        () => chrome.ai.writer.write(prompt, options),
        { maxAttempts: 3, delay: 500 }
      )
      logger.debug('Text generated successfully')
      return text
    } catch (error) {
      logger.error('Failed to generate text:', error)
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Failed to generate text',
        error
      )
    }
  }

  /**
   * Translate text
   */
  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    if (!this.capabilities.translator) {
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Translator API is not available'
      )
    }

    try {
      logger.debug(`Translating to ${targetLanguage}...`)
      const translated = await retry(
        () => chrome.ai.translator.translate(text, { sourceLanguage, targetLanguage }),
        { maxAttempts: 3, delay: 500 }
      )
      logger.debug('Translation completed')
      return translated
    } catch (error) {
      logger.error('Failed to translate:', error)
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Failed to translate text',
        error
      )
    }
  }

  /**
   * Proofread text
   */
  async proofread(text: string): Promise<string> {
    if (!this.capabilities.proofreader) {
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Proofreader API is not available'
      )
    }

    try {
      logger.debug('Proofreading text...')
      const proofread = await retry(
        () => chrome.ai.proofreader.proofread(text),
        { maxAttempts: 3, delay: 500 }
      )
      logger.debug('Proofreading completed')
      return proofread
    } catch (error) {
      logger.error('Failed to proofread:', error)
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Failed to proofread text',
        error
      )
    }
  }

  /**
   * Rewrite text with different tone/length/format
   */
  async rewrite(
    text: string,
    options?: { tone?: string; length?: string; format?: string }
  ): Promise<string> {
    if (!this.capabilities.rewriter) {
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Rewriter API is not available'
      )
    }

    try {
      logger.debug('Rewriting text with options:', options)
      const rewritten = await retry(
        () => chrome.ai.rewriter.rewrite(text, options),
        { maxAttempts: 3, delay: 500 }
      )
      logger.debug('Rewriting completed')
      return rewritten
    } catch (error) {
      logger.error('Failed to rewrite:', error)
      throw new ExtensionError(
        ErrorType.AI_API_NOT_AVAILABLE,
        'Failed to rewrite text',
        error
      )
    }
  }

  /**
   * Get current capabilities
   */
  getCapabilities(): ChromeAICapabilities {
    return { ...this.capabilities }
  }
}

// Export singleton instance
export const chromeAI = new ChromeAIService()
