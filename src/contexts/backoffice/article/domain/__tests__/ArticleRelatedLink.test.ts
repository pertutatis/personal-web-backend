import { ArticleRelatedLink } from '../ArticleRelatedLink'
import { ArticleRelatedLinkTextLengthExceeded } from '../ArticleRelatedLinkTextLengthExceeded'
import { ArticleRelatedLinkUrlLengthExceeded } from '../ArticleRelatedLinkUrlLengthExceeded'
import { ArticleRelatedLinkUrlInvalid } from '../ArticleRelatedLinkUrlInvalid'

describe('ArticleRelatedLink', () => {
  describe('creation', () => {
    it('should create a valid link', () => {
      const link = ArticleRelatedLink.create(
        'Example Link',
        'https://example.com',
      )
      expect(link.getText()).toBe('Example Link')
      expect(link.getUrl()).toBe('https://example.com')
      expect(link.protocol).toBe('https:')
      expect(link.host).toBe('example.com')
    })

    it('should trim whitespace', () => {
      const link = ArticleRelatedLink.create(
        '  Example Link  ',
        '  https://example.com  ',
      )
      expect(link.getText()).toBe('Example Link')
      expect(link.getUrl()).toBe('https://example.com')
    })
  })

  describe('URLs', () => {
    it('should support query parameters', () => {
      const link = ArticleRelatedLink.create(
        'Example Link',
        'https://example.com/search?q=test&page=1',
      )
      expect(link.getUrl()).toContain('?')
      expect(link.getUrl()).toContain('=')
    })

    it('should support fragments', () => {
      const link = ArticleRelatedLink.create(
        'Example Link',
        'https://example.com/page#section',
      )
      expect(link.getUrl()).toContain('#')
    })

    it('should validate URL format', () => {
      expect(() => {
        ArticleRelatedLink.create('Example Link', 'not-a-url')
      }).toThrow(ArticleRelatedLinkUrlInvalid)
    })
  })

  describe('validation', () => {
    it('should not allow empty text', () => {
      expect(() => {
        ArticleRelatedLink.create('', 'https://example.com')
      }).toThrow('Link text cannot be empty')
    })

    it('should not allow empty URL', () => {
      expect(() => {
        ArticleRelatedLink.create('Example Link', '')
      }).toThrow('Link URL cannot be empty')
    })

    it('should not allow text longer than maximum length', () => {
      const longText = 'a'.repeat(ArticleRelatedLink.TEXT_MAX_LENGTH + 1)
      expect(() => {
        ArticleRelatedLink.create(longText, 'https://example.com')
      }).toThrow(ArticleRelatedLinkTextLengthExceeded)
    })

    it('should not allow URL longer than maximum length', () => {
      const longUrl = `https://example.com/${'a'.repeat(ArticleRelatedLink.URL_MAX_LENGTH)}`
      expect(() => {
        ArticleRelatedLink.create('Example Link', longUrl)
      }).toThrow(ArticleRelatedLinkUrlLengthExceeded)
    })
  })

  describe('object behavior', () => {
    it('should be immutable', () => {
      const link = ArticleRelatedLink.create(
        'Example Link',
        'https://example.com',
      )
      expect(() => {
        ;(link as any)._text = 'New Text'
      }).toThrow()
    })

    it('should implement equals correctly', () => {
      const link1 = ArticleRelatedLink.create(
        'Example Link',
        'https://example.com',
      )
      const link2 = ArticleRelatedLink.create(
        'Example Link',
        'https://example.com',
      )
      const different = ArticleRelatedLink.create(
        'Different',
        'https://example.com',
      )

      expect(link1.equals(link2)).toBe(true)
      expect(link1.equals(different)).toBe(false)
      expect(link1.equals(null)).toBe(false)
    })

    it('should convert to string format correctly', () => {
      const link = ArticleRelatedLink.create(
        'Example Link',
        'https://example.com',
      )
      expect(link.toString()).toBe('Example Link (https://example.com)')
    })

    it('should convert to primitives correctly', () => {
      const link = ArticleRelatedLink.create(
        'Example Link',
        'https://example.com',
      )
      const primitives = link.toPrimitives()
      expect(primitives).toEqual({
        text: 'Example Link',
        url: 'https://example.com',
      })
    })
  })
})
