import { ArticleBookIds } from '../ArticleBookIds';
import { BookRepository } from '../BookRepository';
import { InvalidBookReferenceError } from '../InvalidBookReferenceError';
import { ArticleBookIdsEmpty } from '../ArticleBookIdsEmpty';

describe('ArticleBookIds', () => {
  let mockBookRepository: jest.Mocked<BookRepository>;

  beforeEach(() => {
    mockBookRepository = {
      exists: jest.fn()
    };

    ArticleBookIds.setBookRepository(mockBookRepository);
  });

  describe('create', () => {
    it('should create ArticleBookIds with valid book references', async () => {
      const bookIds = ['book-1', 'book-2'];
      mockBookRepository.exists.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

      const articleBookIds = await ArticleBookIds.create(bookIds);

      expect(articleBookIds.getValue()).toEqual(bookIds);
      expect(mockBookRepository.exists).toHaveBeenCalledTimes(2);
      expect(mockBookRepository.exists).toHaveBeenCalledWith('book-1');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('book-2');
    });

    it('should throw InvalidBookReferenceError when book does not exist', async () => {
      const bookIds = ['book-1', 'invalid-book'];
      mockBookRepository.exists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      await expect(ArticleBookIds.create(bookIds)).rejects.toThrow(InvalidBookReferenceError);
      expect(mockBookRepository.exists).toHaveBeenCalledTimes(2);
    });

    it('should throw ArticleBookIdsEmpty when value is not an array', async () => {
      await expect(ArticleBookIds.create(null as any)).rejects.toThrow(ArticleBookIdsEmpty);
      expect(mockBookRepository.exists).not.toHaveBeenCalled();
    });

    it('should remove duplicate book references', async () => {
      const bookIds = ['book-1', 'book-1', 'book-2'];
      mockBookRepository.exists.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

      const articleBookIds = await ArticleBookIds.create(bookIds);

      expect(articleBookIds.getValue()).toEqual(['book-1', 'book-2']);
      expect(mockBookRepository.exists).toHaveBeenCalledTimes(2);
    });
  });

  describe('add', () => {
    it('should add a valid book reference', async () => {
      const bookIds = await ArticleBookIds.create(['book-1']);
      mockBookRepository.exists.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

      const newBookIds = await bookIds.add('book-2');

      expect(newBookIds.getValue()).toEqual(['book-1', 'book-2']);
      expect(mockBookRepository.exists).toHaveBeenCalledWith('book-2');
    });

    it('should throw InvalidBookReferenceError when adding non-existent book', async () => {
      const bookIds = await ArticleBookIds.create(['book-1']);
      mockBookRepository.exists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      await expect(bookIds.add('invalid-book')).rejects.toThrow(InvalidBookReferenceError);
    });

    it('should not add duplicate book reference', async () => {
      const bookIds = await ArticleBookIds.create(['book-1']);
      mockBookRepository.exists.mockResolvedValueOnce(true);

      const newBookIds = await bookIds.add('book-1');

      expect(newBookIds.getValue()).toEqual(['book-1']);
      expect(mockBookRepository.exists).not.toHaveBeenCalled();
    });

    it('should throw error when exceeding max book references', async () => {
      const maxIds = Array.from({ length: ArticleBookIds.MAX_BOOK_IDS }, (_, i) => `book-${i}`);
      mockBookRepository.exists.mockResolvedValue(true);
      
      const bookIds = await ArticleBookIds.create(maxIds);
      mockBookRepository.exists.mockResolvedValueOnce(true);

      await expect(bookIds.add('new-book')).rejects.toThrow(`Maximum of ${ArticleBookIds.MAX_BOOK_IDS} book ids allowed`);
    });
  });
});
