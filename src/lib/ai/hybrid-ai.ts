/**
 * Hybrid AI Service
 * Automatically uses Chrome AI when available, falls back to Gemini API
 */

import { chromeAI } from './chrome-ai'
import { geminiAI, type GeminiConfig } from './gemini-ai'
import { logger } from '@/utils/logger'
import type { ChromeAICapabilities } from '@/types'

export type AIProvider = 'chrome' | 'gemini'

export class HybridAIService {
  private currentProvider: AIProvider = 'chrome'
  private capabilities: ChromeAICapabilities = {
    summarizer: false,
    embedder: false,
    writer: false,
    translator: false,
    proofreader: false,
    rewriter: false,
  }

  /**
   * Initialize AI services
   */
  async initialize(geminiConfig?: GeminiConfig): Promise<void> {
    logger.info('Initializing Hybrid AI services...')

    // Try Chrome AI first
    try {
      this.capabilities = await chromeAI.initialize()
      const hasAnyCapability = Object.values(this.capabilities).some(cap => cap)
      
      if (hasAnyCapability) {
        this.currentProvider = 'chrome'
        logger.info('Using Chrome Built-in AI as primary provider')
      } else {
        throw new Error('No Chrome AI capabilities available')
      }
    } catch (error) {
      logger.warn('Chrome AI not available, will use Gemini fallback')
      this.currentProvider = 'gemini'
    }

    // Initialize Gemini as fallback
    if (geminiConfig?.apiKey) {
      const geminiReady = await geminiAI.initialize(geminiConfig)
      if (geminiReady) {
        logger.info('Gemini API initialized as fallback')
        // If Chrome AI isn't available, use Gemini for everything
        if (this.currentProvider === 'gemini') {
          this.capabilities = {
            summarizer: true,
            embedder: true,
            writer: true,
            translator: true,
            proofreader: true,
            rewriter: true,
          }
        }
      }
    } else {
      logger.warn('Gemini API key not provided, fallback unavailable')
    }

    logger.info(`Active AI provider: ${this.currentProvider}`)
    logger.info('AI capabilities:', this.capabilities)
  }

  /**
   * Generate summary from text
   */
  async summarize(text: string): Promise<string> {
    if (this.capabilities.summarizer && this.currentProvider === 'chrome') {
      try {
        return await chromeAI.summarize(text)
      } catch (error) {
        logger.warn('Chrome AI summarize failed, trying Gemini fallback')
        if (geminiAI.isConfigured()) {
          return await geminiAI.summarize(text)
        }
        throw error
      }
    }
    
    if (geminiAI.isConfigured()) {
      return await geminiAI.summarize(text)
    }
    
    throw new Error('No AI provider available for summarization')
  }

  /**
   * Generate embedding vector from text
   */
  async embed(text: string): Promise<Float32Array> {
    if (this.capabilities.embedder && this.currentProvider === 'chrome') {
      try {
        return await chromeAI.embed(text)
      } catch (error) {
        logger.warn('Chrome AI embed failed, trying Gemini fallback')
        if (geminiAI.isConfigured()) {
          return await geminiAI.embed(text)
        }
        throw error
      }
    }
    
    if (geminiAI.isConfigured()) {
      return await geminiAI.embed(text)
    }
    
    throw new Error('No AI provider available for embeddings')
  }

  /**
   * Generate text using writer API
   */
  async write(prompt: string, options?: { tone?: string; length?: string }): Promise<string> {
    if (this.capabilities.writer && this.currentProvider === 'chrome') {
      try {
        return await chromeAI.write(prompt, options)
      } catch (error) {
        logger.warn('Chrome AI write failed, trying Gemini fallback')
        if (geminiAI.isConfigured()) {
          return await geminiAI.write(prompt, options)
        }
        throw error
      }
    }
    
    if (geminiAI.isConfigured()) {
      return await geminiAI.write(prompt, options)
    }
    
    throw new Error('No AI provider available for writing')
  }

  /**
   * Translate text
   */
  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    if (this.capabilities.translator && this.currentProvider === 'chrome') {
      try {
        return await chromeAI.translate(text, targetLanguage, sourceLanguage)
      } catch (error) {
        logger.warn('Chrome AI translate failed, trying Gemini fallback')
        if (geminiAI.isConfigured()) {
          return await geminiAI.translate(text, targetLanguage, sourceLanguage)
        }
        throw error
      }
    }
    
    if (geminiAI.isConfigured()) {
      return await geminiAI.translate(text, targetLanguage, sourceLanguage)
    }
    
    throw new Error('No AI provider available for translation')
  }

  /**
   * Proofread text
   */
  async proofread(text: string): Promise<string> {
    if (this.capabilities.proofreader && this.currentProvider === 'chrome') {
      try {
        return await chromeAI.proofread(text)
      } catch (error) {
        logger.warn('Chrome AI proofread failed, trying Gemini fallback')
        if (geminiAI.isConfigured()) {
          return await geminiAI.proofread(text)
        }
        throw error
      }
    }
    
    if (geminiAI.isConfigured()) {
      return await geminiAI.proofread(text)
    }
    
    throw new Error('No AI provider available for proofreading')
  }

  /**
   * Rewrite text
   */
  async rewrite(
    text: string,
    options?: { tone?: string; length?: string; format?: string }
  ): Promise<string> {
    if (this.capabilities.rewriter && this.currentProvider === 'chrome') {
      try {
        return await chromeAI.rewrite(text, options)
      } catch (error) {
        logger.warn('Chrome AI rewrite failed, trying Gemini fallback')
        if (geminiAI.isConfigured()) {
          return await geminiAI.rewrite(text, options)
        }
        throw error
      }
    }
    
    if (geminiAI.isConfigured()) {
      return await geminiAI.rewrite(text, options)
    }
    
    throw new Error('No AI provider available for rewriting')
  }

  /**
   * Get current capabilities
   */
  getCapabilities(): ChromeAICapabilities {
    return { ...this.capabilities }
  }

  /**
   * Get current provider
   */
  getCurrentProvider(): AIProvider {
    return this.currentProvider
  }

  /**
   * Check if Gemini is configured
   */
  isGeminiConfigured(): boolean {
    return geminiAI.isConfigured()
  }
}

// Export singleton instance
export const hybridAI = new HybridAIService()
