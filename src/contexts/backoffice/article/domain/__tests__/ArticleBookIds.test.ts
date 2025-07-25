import { ArticleBookIds } from '../ArticleBookIds'
import { ArticleBookIdsEmpty } from '../ArticleBookIdsEmpty'

describe('ArticleBookIds', () => {
  describe('create', () => {
    it('should create ArticleBookIds with valid references', () => {
      const bookIds = ['book-1', 'book-2']
      const articleBookIds = ArticleBookIds.create(bookIds)
      expect(articleBookIds.getValue()).toEqual(bookIds)
    })

    it('should throw ArticleBookIdsEmpty when value is not an array', () => {
      expect(() => ArticleBookIds.create(null as any)).toThrow(
        ArticleBookIdsEmpty,
      )
    })

    it('should remove duplicate book references', () => {
      const bookIds = ['book-1', 'book-1', 'book-2']
      const articleBookIds = ArticleBookIds.create(bookIds)
      expect(articleBookIds.getValue()).toEqual(['book-1', 'book-2'])
    })

    it('should throw error when exceeding max references', () => {
      const maxIds = Array.from(
        { length: ArticleBookIds.MAX_BOOK_IDS + 1 },
        (_, i) => `book-${i}`,
      )
      expect(() => ArticleBookIds.create(maxIds)).toThrow(
        `Maximum of ${ArticleBookIds.MAX_BOOK_IDS} book ids allowed`,
      )
    })
  })

  describe('add', () => {
    it('should add a new book reference', () => {
      const bookIds = ArticleBookIds.create(['book-1'])
      const newBookIds = bookIds.add('book-2')
      expect(newBookIds.getValue()).toEqual(['book-1', 'book-2'])
    })

    it('should not add duplicate reference', () => {
      const bookIds = ArticleBookIds.create(['book-1'])
      const newBookIds = bookIds.add('book-1')
      expect(newBookIds.getValue()).toEqual(['book-1'])
    })

    it('should throw error when exceeding max references', () => {
      const maxIds = Array.from(
        { length: ArticleBookIds.MAX_BOOK_IDS },
        (_, i) => `book-${i}`,
      )
      const bookIds = ArticleBookIds.create(maxIds)
      expect(() => bookIds.add('new-book')).toThrow(
        `Maximum of ${ArticleBookIds.MAX_BOOK_IDS} book ids allowed`,
      )
    })
  })

  describe('remove', () => {
    it('should remove existing reference', () => {
      const bookIds = ArticleBookIds.create(['book-1', 'book-2'])
      const newBookIds = bookIds.remove('book-1')
      expect(newBookIds.getValue()).toEqual(['book-2'])
    })

    it('should do nothing when removing non-existent reference', () => {
      const bookIds = ArticleBookIds.create(['book-1'])
      const newBookIds = bookIds.remove('non-existent')
      expect(newBookIds.getValue()).toEqual(['book-1'])
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty book ids', () => {
      const bookIds = ArticleBookIds.createEmpty()
      expect(bookIds.isEmpty).toBe(true)
    })

    it('should return false for non-empty book ids', () => {
      const bookIds = ArticleBookIds.create(['book-1'])
      expect(bookIds.isEmpty).toBe(false)
    })
  })
})
