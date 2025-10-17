import { describe, it, expect } from 'vitest'
import { sanitizeText, truncateText, generateId, isValidText } from '@/utils/helpers'

describe('Helper Functions', () => {
  describe('sanitizeText', () => {
    it('should remove extra whitespace', () => {
      const input = 'Hello    world   test'
      const expected = 'Hello world test'
      expect(sanitizeText(input)).toBe(expected)
    })

    it('should replace newlines with spaces', () => {
      const input = 'Hello\nworld\ntest'
      const expected = 'Hello world test'
      expect(sanitizeText(input)).toBe(expected)
    })

    it('should trim whitespace', () => {
      const input = '  Hello world  '
      const expected = 'Hello world'
      expect(sanitizeText(input)).toBe(expected)
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const input = 'This is a very long text that should be truncated'
      const result = truncateText(input, 20)
      expect(result.length).toBeLessThanOrEqual(20)
      expect(result).toContain('...')
    })

    it('should not truncate short text', () => {
      const input = 'Short text'
      const result = truncateText(input, 20)
      expect(result).toBe(input)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should generate valid ID format', () => {
      const id = generateId()
      expect(id).toMatch(/^\d+-[a-z0-9]+$/)
    })
  })

  describe('isValidText', () => {
    it('should validate text length', () => {
      const shortText = 'Short'
      const longText = 'A'.repeat(150)
      
      expect(isValidText(shortText, 100)).toBe(false)
      expect(isValidText(longText, 100)).toBe(true)
    })

    it('should handle whitespace-only text', () => {
      const whitespace = '   '
      expect(isValidText(whitespace, 10)).toBe(false)
    })
  })
})
