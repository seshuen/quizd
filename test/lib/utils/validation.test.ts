import { describe, it } from 'mocha'
import { expect } from 'chai'
import { isValidUUID, isValidSlug, sanitizeInput } from '../../../lib/utils/validation'

describe('validation utils', () => {
  describe('isValidUUID', () => {
    it('should return true for valid UUIDs', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).to.be.true
      expect(isValidUUID('123e4567-e89b-42d3-a456-426614174000')).to.be.true
      expect(isValidUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479')).to.be.true
    })

    it('should return false for invalid UUIDs', () => {
      expect(isValidUUID('not-a-uuid')).to.be.false
      expect(isValidUUID('550e8400-e29b-41d4-a716')).to.be.false
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000-extra')).to.be.false
      expect(isValidUUID('')).to.be.false
      expect(isValidUUID('550e8400e29b41d4a716446655440000')).to.be.false
    })

    it('should handle UUIDs with uppercase letters', () => {
      expect(isValidUUID('550E8400-E29B-41D4-A716-446655440000')).to.be.true
      expect(isValidUUID('F47AC10B-58CC-4372-A567-0E02B2C3D479')).to.be.true
    })
  })

  describe('isValidSlug', () => {
    it('should return true for valid slugs', () => {
      expect(isValidSlug('javascript')).to.be.true
      expect(isValidSlug('web-development')).to.be.true
      expect(isValidSlug('python-101')).to.be.true
      expect(isValidSlug('react-hooks')).to.be.true
    })

    it('should return false for invalid slugs', () => {
      expect(isValidSlug('Invalid Slug')).to.be.false
      expect(isValidSlug('slug_with_underscore')).to.be.false
      expect(isValidSlug('UPPERCASE')).to.be.false
      expect(isValidSlug('slug-')).to.be.false
      expect(isValidSlug('-slug')).to.be.false
      expect(isValidSlug('slug--double')).to.be.false
      expect(isValidSlug('')).to.be.false
      expect(isValidSlug('slug/with/slash')).to.be.false
      expect(isValidSlug('slug.with.dot')).to.be.false
    })
  })

  describe('sanitizeInput', () => {
    it('should trim whitespace from input', () => {
      expect(sanitizeInput('  test  ')).to.equal('test')
      expect(sanitizeInput('\n\ttest\n\t')).to.equal('test')
    })

    it('should limit input length to 500 characters', () => {
      const longInput = 'a'.repeat(600)
      const result = sanitizeInput(longInput)
      expect(result.length).to.equal(500)
    })

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).to.equal('')
      expect(sanitizeInput('   ')).to.equal('')
    })

    it('should preserve valid content', () => {
      expect(sanitizeInput('Hello World')).to.equal('Hello World')
      expect(sanitizeInput('Test123')).to.equal('Test123')
    })
  })
})
