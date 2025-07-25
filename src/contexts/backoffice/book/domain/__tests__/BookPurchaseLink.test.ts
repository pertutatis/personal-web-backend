import { BookPurchaseLink } from '../BookPurchaseLink'
import { BookPurchaseLinkInvalid } from '../BookPurchaseLinkInvalid'

describe('BookPurchaseLink', () => {
  it('should create a valid purchase link', () => {
    const link = BookPurchaseLink.create('https://example.com/book')
    expect(link.toString()).toBe('https://example.com/book')
  })

  it('should create an empty purchase link', () => {
    const link = BookPurchaseLink.createEmpty()
    expect(link.isEmpty()).toBe(true)
    expect(link.toString()).toBe('')
  })

  it('should allow empty string as valid input', () => {
    const link = BookPurchaseLink.create('')
    expect(link.isEmpty()).toBe(true)
  })

  it('should trim input values', () => {
    const link = BookPurchaseLink.create('  https://example.com/book  ')
    expect(link.toString()).toBe('https://example.com/book')
  })

  it('should throw error for invalid URLs', () => {
    expect(() => {
      BookPurchaseLink.create('not-a-url')
    }).toThrow(BookPurchaseLinkInvalid)

    expect(() => {
      BookPurchaseLink.create('ftp://example.com')
    }).toThrow(BookPurchaseLinkInvalid)
  })

  it('should validate http and https protocols', () => {
    expect(() => {
      BookPurchaseLink.create('http://example.com')
    }).not.toThrow()

    expect(() => {
      BookPurchaseLink.create('https://example.com')
    }).not.toThrow()
  })

  it('should allow URLs with query parameters', () => {
    const link = BookPurchaseLink.create(
      'https://example.com/book?id=123&ref=abc',
    )
    expect(link.toString()).toBe('https://example.com/book?id=123&ref=abc')
  })

  it('should allow URLs with fragments', () => {
    const link = BookPurchaseLink.create('https://example.com/book#section1')
    expect(link.toString()).toBe('https://example.com/book#section1')
  })
})
