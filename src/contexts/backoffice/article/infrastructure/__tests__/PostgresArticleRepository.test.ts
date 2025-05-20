import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { PostgresArticleRepository } from '../PostgresArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleSlug } from '../../domain/ArticleSlug';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { InvalidBookReferenceError } from '../../domain/InvalidBookReferenceError';

describe('PostgresArticleRepository', () => {
  let articlesConnection: jest.Mocked<PostgresConnection>;
  let booksConnection: jest.Mocked<PostgresConnection>;
  let repository: PostgresArticleRepository;

  beforeEach(() => {
    articlesConnection = {
      execute: jest.fn()
    } as any;

    booksConnection = {
      execute: jest.fn()
    } as any;

    repository = new PostgresArticleRepository(articlesConnection, booksConnection);
  });

  describe('removeBookReference', () => {
    it('should update articles removing book reference', async () => {
      const bookId = 'book-123';
      articlesConnection.execute.mockResolvedValue({
        rows: [],
        rowCount: 2,
        command: 'UPDATE',
        oid: 0,
        fields: []
      });

      await repository.removeBookReference(bookId);

      expect(articlesConnection.execute).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE articles.*SET book_ids/i),
        [bookId]
      );
    });

    it('should handle when no articles reference the book', async () => {
      const bookId = 'non-referenced-book';
      articlesConnection.execute.mockResolvedValue({
        rows: [],
        rowCount: 0,
        command: 'UPDATE',
        oid: 0,
        fields: []
      });

      await repository.removeBookReference(bookId);

      expect(articlesConnection.execute).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE articles.*SET book_ids/i),
        [bookId]
      );
    });

    it('should propagate database errors', async () => {
      const bookId = 'book-123';
      const error = new Error('Database error');
      articlesConnection.execute.mockRejectedValue(error);

      await expect(repository.removeBookReference(bookId)).rejects.toThrow(error);
    });
  });

  describe('validateBookIds', () => {
    it('should validate existing book references', async () => {
      const bookIds = ['book-1', 'book-2'];
      booksConnection.execute.mockResolvedValue({
        rows: [
          { id: 'book-1', exists: true },
          { id: 'book-2', exists: true }
        ],
        rowCount: 2,
        command: 'SELECT',
        oid: 0,
        fields: []
      });

      await expect(repository['validateBookIds'](bookIds)).resolves.not.toThrow();
    });

    it('should throw InvalidBookReferenceError for non-existent books', async () => {
      const bookIds = ['book-1', 'invalid-book'];
      booksConnection.execute.mockResolvedValue({
        rows: [
          { id: 'book-1', exists: true },
          { id: 'invalid-book', exists: false }
        ],
        rowCount: 2,
        command: 'SELECT',
        oid: 0,
        fields: []
      });

      await expect(repository['validateBookIds'](bookIds)).rejects.toThrow(InvalidBookReferenceError);
    });

    it('should handle empty book ids array', async () => {
      const bookIds: string[] = [];

      await expect(repository['validateBookIds'](bookIds)).resolves.not.toThrow();
      expect(booksConnection.execute).not.toHaveBeenCalled();
    });

    it('should propagate database errors during validation', async () => {
      const bookIds = ['book-1'];
      const error = new Error('Database error');
      booksConnection.execute.mockRejectedValue(error);

      await expect(repository['validateBookIds'](bookIds)).rejects.toThrow(error);
    });
  });
});
