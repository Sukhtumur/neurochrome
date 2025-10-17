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

  // Minimal type for chrome.storage used in extension context
  private getChromeStorage(): { sync?: { get?: (k: string) => Promise<Record<string, unknown>>; set?: (v: Record<string, unknown>) => Promise<void> } } | null {
    try {
      const win = window as unknown as { chrome?: unknown }
      // Narrow to unknown and check existence
      const maybeChrome = (win.chrome as unknown) as { storage?: { sync?: { get?: (k: string) => Promise<Record<string, unknown>>; set?: (v: Record<string, unknown>) => Promise<void> } } } | undefined
      if (maybeChrome && maybeChrome.storage && maybeChrome.storage.sync) {
        return { sync: maybeChrome.storage.sync }
      }
      return null
    } catch (e) {
      return null
    }
  }

  /**
   * Initialize with API key
   */
  async initialize(config: GeminiConfig): Promise<boolean> {
    this.apiKey = config.apiKey
    if (config.model) {
      this.model = config.model
    }
    // Try to load cached model (if previously discovered)
    try {
      const storage = this.getChromeStorage()
      if (storage?.sync?.get) {
        const stored = await storage.sync.get('geminiModel')
        if (!config.model && stored?.geminiModel) {
          this.model = String(stored.geminiModel)
          logger.info('Loaded cached Gemini model from storage:', this.model)
        }
      }
    } catch (err) {
      // ignore storage errors
      logger.debug('Could not read cached Gemini model:', err)
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
    const response = await fetch(`${this.baseUrl}/models?key=${this.apiKey}`)
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Gemini API test failed: ${response.status} ${response.statusText} - ${text}`)
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
    // Helper to call generateContent for the configured model
    const callGenerate = async (modelName: string) => {
      const url = `${this.baseUrl}/models/${modelName}:generateContent?key=${this.apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      })

      return res
    }

    // First attempt with current model
    let response = await callGenerate(this.model)

    // If model not found (404) or quota exceeded (429), try to discover a better model and retry once
    if (response.status === 404 || response.status === 429) {
      try {
        const reason = response.status === 404 ? 'not supported by API' : 'quota exceeded'
        logger.warn(`Configured Gemini model (${this.model}) ${reason}, attempting to discover available models`)
        const selected = await this.discoverAndSelectModel()
        if (selected && selected !== this.model) {
          logger.info('Discovered alternative Gemini model:', selected)
          this.model = selected
          // Cache selected model
          try {
            const storage = this.getChromeStorage()
            if (storage?.sync?.set) {
              await storage.sync.set({ geminiModel: selected })
            }
          } catch (err) {
            logger.debug('Failed to cache selected Gemini model:', err)
          }
          // Retry with discovered model
          response = await callGenerate(this.model)
        }
      } catch (err) {
        logger.error('Model discovery failed:', err)
        // fallthrough to error handling below
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API')
    }

    const text = data.candidates[0].content.parts[0].text
    return text.trim()
  }

  /**
   * Discover available models from the ListModels endpoint and return a model
   * name that supports generateContent (or a reasonable Gemini model).
   */
  private async discoverAndSelectModel(): Promise<string | null> {
    logger.debug('Listing Gemini models from API...')
    const res = await fetch(`${this.baseUrl}/models?key=${this.apiKey}`)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`ListModels failed: ${res.status} ${res.statusText} - ${text}`)
    }

    const data = await res.json()
    const models = Array.isArray(data.models) ? data.models : data.items || []

    // Helper to strip 'models/' prefix
    const stripPrefix = (name: string): string => {
      return name.startsWith('models/') ? name.substring(7) : name
    }

    // Helper to check if model is experimental (avoid quota issues)
    const isExperimental = (name: string): boolean => {
      const lower = name.toLowerCase()
      return lower.includes('-exp') || lower.includes('experimental') || lower.includes('preview')
    }

    // Helper to get model priority (lower is better)
    const getModelPriority = (name: string): number => {
      const lower = name.toLowerCase()
      // Prefer stable flash models (best quota/performance balance)
      if (lower.includes('1.5-flash')) return 1
      if (lower.includes('1.5-pro')) return 2
      if (lower.includes('2.0-flash')) return 3
      if (lower.includes('flash')) return 4
      if (lower.includes('pro') && !isExperimental(name)) return 5
      if (lower.includes('gemini') && !isExperimental(name)) return 6
      // Experimental models last (they have lower quotas)
      if (isExperimental(name)) return 100
      return 50
    }

    // Collect all viable models with generateContent support
    const viableModels: Array<{ name: string; priority: number }> = []
    
    for (const m of models) {
      let name = m.name || m.model || ''
      const supported = m.supportedMethods || m.methods || []
      
      if (typeof name === 'string' && name) {
        name = stripPrefix(name)
        
        // Only consider models with generateContent support
        if (Array.isArray(supported) && supported.includes('generateContent')) {
          viableModels.push({ name, priority: getModelPriority(name) })
        }
      }
    }

    // Sort by priority and return best model
    if (viableModels.length > 0) {
      viableModels.sort((a, b) => a.priority - b.priority)
      const selected = viableModels[0].name
      logger.info(`Selected model: ${selected} (priority: ${viableModels[0].priority})`)
      logger.debug(`Available models: ${viableModels.map(m => `${m.name}(${m.priority})`).join(', ')}`)
      return selected
    }

    // Fallback: just find any gemini model
    for (const m of models) {
      let name = m.name || m.model || ''
      if (typeof name === 'string' && name) {
        name = stripPrefix(name)
        if (name.toLowerCase().includes('gemini') && !isExperimental(name)) {
          logger.debug('Using gemini model via name heuristic:', name)
          return name
        }
      }
    }

    logger.warn('No suitable models found')
    return null
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
