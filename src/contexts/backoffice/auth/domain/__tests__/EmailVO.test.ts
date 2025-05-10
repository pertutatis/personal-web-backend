import { EmailVO } from '../EmailVO'
import { EmailInvalid } from '../EmailInvalid'
import { EmailEmpty } from '../EmailEmpty'

describe('EmailVO', () => {
  it('should create a valid email', () => {
    const email = new EmailVO('test@example.com')
    expect(email.value).toBe('test@example.com')
  })

  it('should throw EmailInvalid for invalid email format', () => {
    expect(() => new EmailVO('invalid-email')).toThrow(EmailInvalid)
    expect(() => new EmailVO('test@')).toThrow(EmailInvalid)
    expect(() => new EmailVO('@example.com')).toThrow(EmailInvalid)
  })

  it('should throw EmailEmpty for empty email', () => {
    expect(() => new EmailVO('')).toThrow(EmailEmpty)
  })

  it('should throw EmailInvalid for email longer than 255 characters', () => {
    const longEmail = 'a'.repeat(247) + '@test.com' // 256 characters
    expect(() => new EmailVO(longEmail)).toThrow(EmailInvalid)
  })

  it('should compare emails correctly', () => {
    const email1 = new EmailVO('test@example.com')
    const email2 = new EmailVO('test@example.com')
    const email3 = new EmailVO('different@example.com')

    expect(email1.equals(email2)).toBe(true)
    expect(email1.equals(email3)).toBe(false)
  })

  it('should normalize email to lowercase', () => {
    const email = new EmailVO('Test@Example.Com')
    expect(email.value).toBe('test@example.com')
  })
})
