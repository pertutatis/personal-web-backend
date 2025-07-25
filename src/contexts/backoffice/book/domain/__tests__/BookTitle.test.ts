import { BookTitle } from '../BookTitle'
import { BookTitleEmpty } from '../BookTitleEmpty'
import { BookTitleLengthExceeded } from '../BookTitleLengthExceeded'
import { BookTitleMother } from './mothers/BookTitleMother'

describe('BookTitle', () => {
  describe('creation and validation', () => {
    it('should create a valid book title', () => {
      const title = new BookTitle('Clean Code')
      expect(title.value).toBe('Clean Code')
    })

    it('should fail when title is empty', () => {
      expect(() => {
        new BookTitle('')
      }).toThrow(BookTitleEmpty)
    })

    it('should fail when title exceeds 255 characters', () => {
      const longTitle = 'a'.repeat(BookTitle.MAX_LENGTH + 1)
      expect(() => {
        new BookTitle(longTitle)
      }).toThrow(BookTitleLengthExceeded)
    })

    it('should accept titles with exactly 255 characters', () => {
      const maxTitle = 'a'.repeat(BookTitle.MAX_LENGTH)
      const title = new BookTitle(maxTitle)
      expect(title.value).toBe(maxTitle)
    })
  })

  describe('formatting and special characters', () => {
    it('should maintain special characters and spaces', () => {
      const title = new BookTitle(
        'Design Patterns: Elements of Reusable Object-Oriented Software',
      )
      expect(title.value).toBe(
        'Design Patterns: Elements of Reusable Object-Oriented Software',
      )
    })

    it('should trim whitespace', () => {
      const title = new BookTitle('  Clean Code  ')
      expect(title.value).toBe('Clean Code')
    })
  })

  describe('value object behavior', () => {
    it('should be immutable', () => {
      const title = new BookTitle('Clean Code')
      expect(() => {
        ;(title as any).value = 'Changed'
      }).toThrow()
    })

    it('should implement equals correctly', () => {
      const title1 = new BookTitle('Clean Code')
      const title2 = new BookTitle('Clean Code')
      const title3 = new BookTitle('Different Book')

      expect(title1.equals(title2)).toBe(true)
      expect(title1.equals(title3)).toBe(false)
      expect(title1.equals(null)).toBe(false)
      expect(title1.equals({ value: 'Clean Code' })).toBe(false)
    })

    it('should convert to primitive types correctly', () => {
      const title = new BookTitle('Clean Code')
      expect(title.toString()).toBe('Clean Code')
      expect(title.toJSON()).toBe('Clean Code')
    })
  })

  describe('random generation', () => {
    it('should generate valid random titles', () => {
      const titles = new Set<string>()
      // Generar varios títulos para asegurarnos de que son diferentes
      for (let i = 0; i < 10; i++) {
        const title = BookTitleMother.random()
        expect(title.value.length).toBeLessThanOrEqual(BookTitle.MAX_LENGTH)
        expect(title.value.length).toBeGreaterThan(0)
        titles.add(title.value)
      }
      // Debería haber al menos algunos títulos diferentes
      expect(titles.size).toBeGreaterThan(1)
    })
  })
})
