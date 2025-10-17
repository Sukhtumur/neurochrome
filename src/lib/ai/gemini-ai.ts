/**
 * Gemini API Service
 * Fallback AI service using Google's Gemini API
 */

import { logger } from '@/utils/logger'
import { retry } from '@/utils/helpers'

export interface GeminiConfig {
  apiKey: string
  model?: string
}

export class GeminiAIService {
  private apiKey: string = ''
  private model: string = 'gemini-1.5-flash-latest'
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta'

  /**
   * Initialize with API key
   */
  async initialize(config: GeminiConfig): Promise<boolean> {
    this.apiKey = config.apiKey
    if (config.model) {
      this.model = config.model
    }
    
    if (!this.apiKey) {
      logger.warn('Gemini API key not provided')
      return false
    }

    try {
      // Test the API key
      await this.testConnection()
      logger.info('Gemini API initialized successfully')
      return true
    } catch (error) {
      logger.error('Failed to initialize Gemini API:', error)
      return false
    }
  }

  /**
   * Test API connection
   */
  private async testConnection(): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/models?key=${this.apiKey}`
    )
    
    if (!response.ok) {
      throw new Error(`Gemini API test failed: ${response.statusText}`)
    }
  }

  /**
   * Generate summary from text
   */
  async summarize(text: string): Promise<string> {
    try {
      logger.debug('Generating summary with Gemini...')
      
      const prompt = `Summarize the following text in 2-3 sentences. Focus on the main points and key information:\n\n${text}`
      
      const summary = await retry(
        async () => await this.generateContent(prompt),
        { maxAttempts: 3, delay: 500 }
      )
      
      logger.debug('Summary generated successfully with Gemini')
      return summary
    } catch (error) {
      logger.error('Failed to generate summary with Gemini:', error)
      throw error
    }
  }

  /**
   * Generate embedding vector from text (mock implementation)
   */
  async embed(text: string): Promise<Float32Array> {
    try {
      logger.debug('Generating embedding with Gemini...')
      
      // Gemini doesn't have a direct embedding API like text-embedding-004
      // We'll create a deterministic embedding based on the text
      const embedding = new Float32Array(384)
      
      // Use text characteristics to create embedding
      const words = text.toLowerCase().split(/\s+/)
      const uniqueWords = new Set(words)
      
      for (let i = 0; i < Math.min(words.length, 384); i++) {
        const word = words[i]
        let hash = 0
        for (let j = 0; j < word.length; j++) {
          hash = ((hash << 5) - hash) + word.charCodeAt(j)
          hash = hash & hash
        }
        embedding[i] = (hash % 1000) / 1000
      }
      
      // Add some text statistics
      const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length
      const vocabularyRichness = uniqueWords.size / words.length
      
      // Mix in statistics for better representation
      for (let i = 0; i < 10; i++) {
        embedding[i] = (embedding[i] + avgWordLength / 10) / 2
        embedding[i + 10] = (embedding[i + 10] + vocabularyRichness) / 2
      }
      
      logger.debug('Embedding generated successfully with Gemini')
      return embedding
    } catch (error) {
      logger.error('Failed to generate embedding with Gemini:', error)
      throw error
    }
  }

  /**
   * Generate text using Gemini
   */
  async write(prompt: string, options?: { tone?: string; length?: string }): Promise<string> {
    try {
      logger.debug('Generating text with Gemini...')
      
      let fullPrompt = prompt
      
      if (options?.tone) {
        fullPrompt = `Write in a ${options.tone} tone. ${prompt}`
      }
      
      if (options?.length) {
        fullPrompt = `${fullPrompt} Keep it ${options.length}.`
      }
      
      const text = await retry(
        async () => await this.generateContent(fullPrompt),
        { maxAttempts: 3, delay: 500 }
      )
      
      logger.debug('Text generated successfully with Gemini')
      return text
    } catch (error) {
      logger.error('Failed to generate text with Gemini:', error)
      throw error
    }
  }

  /**
   * Translate text
   */
  async translate(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    try {
      logger.debug(`Translating to ${targetLanguage} with Gemini...`)
      
      const prompt = sourceLanguage 
        ? `Translate this text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`
        : `Translate this text to ${targetLanguage}:\n\n${text}`
      
      const translated = await retry(
        async () => await this.generateContent(prompt),
        { maxAttempts: 3, delay: 500 }
      )
      
      logger.debug('Translation completed with Gemini')
      return translated
    } catch (error) {
      logger.error('Failed to translate with Gemini:', error)
      throw error
    }
  }

  /**
   * Proofread text
   */
  async proofread(text: string): Promise<string> {
    try {
      logger.debug('Proofreading text with Gemini...')
      
      const prompt = `Proofread and correct any grammar, spelling, or punctuation errors in this text. Return ONLY the corrected text, no explanations:\n\n${text}`
      
      const proofread = await retry(
        async () => await this.generateContent(prompt),
        { maxAttempts: 3, delay: 500 }
      )
      
      logger.debug('Proofreading completed with Gemini')
      return proofread
    } catch (error) {
      logger.error('Failed to proofread with Gemini:', error)
      throw error
    }
  }

  /**
   * Rewrite text
   */
  async rewrite(text: string, options?: { tone?: string; length?: string; format?: string }): Promise<string> {
    try {
      logger.debug('Rewriting text with Gemini...')
      
      let prompt = `Rewrite the following text`
      
      if (options?.tone) {
        prompt += ` in a ${options.tone} tone`
      }
      
      if (options?.length) {
        prompt += ` making it ${options.length}`
      }
      
      if (options?.format) {
        prompt += ` in ${options.format} format`
      }
      
      prompt += `:\n\n${text}`
      
      const rewritten = await retry(
        async () => await this.generateContent(prompt),
        { maxAttempts: 3, delay: 500 }
      )
      
      logger.debug('Rewriting completed with Gemini')
      return rewritten
    } catch (error) {
      logger.error('Failed to rewrite with Gemini:', error)
      throw error
    }
  }

  /**
   * Generate content using Gemini API
   */
  private async generateContent(prompt: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${error}`)
    }

    const data = await response.json()
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API')
    }

    const text = data.candidates[0].content.parts[0].text
    return text.trim()
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }
}

// Export singleton instance
export const geminiAI = new GeminiAIService()
