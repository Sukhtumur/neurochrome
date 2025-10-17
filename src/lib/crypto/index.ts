/**
 * Encryption utilities using Web Crypto API
 * Implements AES-GCM encryption for summary data
 */

import { ErrorType, ExtensionError } from '@/types'
import { logger } from '@/utils/logger'

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12

export class CryptoService {
  private key: CryptoKey | null = null

  /**
   * Initialize encryption key
   * Generates a new key or retrieves from storage
   */
  async initialize(): Promise<void> {
    try {
      // Try to get existing key from storage
      const stored = await chrome.storage.local.get('encryptionKey')

      if (stored.encryptionKey) {
        // Import stored key
        const keyData = this.base64ToArrayBuffer(stored.encryptionKey)
        this.key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: ALGORITHM, length: KEY_LENGTH },
          true,
          ['encrypt', 'decrypt']
        )
        logger.debug('Encryption key loaded from storage')
      } else {
        // Generate new key
        await this.generateKey()
        logger.debug('New encryption key generated')
      }
    } catch (error) {
      logger.error('Failed to initialize encryption:', error)
      throw new ExtensionError(
        ErrorType.ENCRYPTION_ERROR,
        'Failed to initialize encryption',
        error
      )
    }
  }

  /**
   * Generate new encryption key
   */
  private async generateKey(): Promise<void> {
    try {
      this.key = await crypto.subtle.generateKey(
        { name: ALGORITHM, length: KEY_LENGTH },
        true,
        ['encrypt', 'decrypt']
      )

      // Store key
      const exported = await crypto.subtle.exportKey('raw', this.key)
      const keyString = this.arrayBufferToBase64(exported)
      await chrome.storage.local.set({ encryptionKey: keyString })
    } catch (error) {
      throw new ExtensionError(
        ErrorType.ENCRYPTION_ERROR,
        'Failed to generate encryption key',
        error
      )
    }
  }

  /**
   * Encrypt text data
   */
  async encrypt(plaintext: string): Promise<string> {
    if (!this.key) {
      throw new ExtensionError(
        ErrorType.ENCRYPTION_ERROR,
        'Encryption key not initialized'
      )
    }

    try {
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

      // Encode text
      const encoder = new TextEncoder()
      const data = encoder.encode(plaintext)

      // Encrypt
      const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        this.key,
        data
      )

      // Combine IV + encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv, 0)
      combined.set(new Uint8Array(encrypted), iv.length)

      // Return as base64
      return this.arrayBufferToBase64(combined.buffer)
    } catch (error) {
      logger.error('Encryption failed:', error)
      throw new ExtensionError(
        ErrorType.ENCRYPTION_ERROR,
        'Failed to encrypt data',
        error
      )
    }
  }

  /**
   * Decrypt text data
   */
  async decrypt(ciphertext: string): Promise<string> {
    if (!this.key) {
      throw new ExtensionError(
        ErrorType.ENCRYPTION_ERROR,
        'Encryption key not initialized'
      )
    }

    try {
      // Decode from base64
      const combined = new Uint8Array(this.base64ToArrayBuffer(ciphertext))

      // Extract IV and encrypted data
      const iv = combined.slice(0, IV_LENGTH)
      const data = combined.slice(IV_LENGTH)

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        this.key,
        data
      )

      // Decode text
      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    } catch (error) {
      logger.error('Decryption failed:', error)
      throw new ExtensionError(
        ErrorType.ENCRYPTION_ERROR,
        'Failed to decrypt data',
        error
      )
    }
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  /**
   * Check if encryption is initialized
   */
  isInitialized(): boolean {
    return this.key !== null
  }
}

// Export singleton instance
export const cryptoService = new CryptoService()
