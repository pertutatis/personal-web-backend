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
import { BookId } from '@/contexts/backoffice/book/domain/BookId';
import { v4 as uuidv4 } from 'uuid';
import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase';

describe('PostgresArticleRepository', () => {
  let articlesConnection: PostgresConnection;
  let booksConnection: PostgresConnection;
  let repository: PostgresArticleRepository;

  beforeAll(async () => {
    articlesConnection = await TestDatabase.getArticlesConnection();
    booksConnection = await TestDatabase.getBooksConnection();
    repository = new PostgresArticleRepository(articlesConnection, booksConnection);
  });

  afterAll(async () => {
    await TestDatabase.closeAll();
  });

  beforeEach(async () => {
    await TestDatabase.cleanAll();
  });

  describe('removeBookReference', () => {
    it('should update articles removing book reference', async () => {
      // First create a book
      const bookId = new BookId(uuidv4());
      await booksConnection.execute(
        `INSERT INTO books (id, title, author, isbn, description) 
         VALUES ($1, 'Test Book', 'Test Author', '1234567890', 'Test Description')`,
        [bookId.value]
      );

      // Create an article with the book reference
      const article = Article.create({
        id: new ArticleId(uuidv4()),
        title: new ArticleTitle('Test Article'),
        excerpt: new ArticleExcerpt('Test excerpt'),
        content: new ArticleContent('Test content'),
        bookIds: ArticleBookIds.create([bookId.value]),
        slug: new ArticleSlug('test-article'),
        relatedLinks: ArticleRelatedLinks.create([]),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await repository.save(article);

      // Remove the book reference
      await repository.removeBookReference(bookId);

      // Verify the reference was removed
      const updatedArticle = await repository.search(article.id);
      expect(updatedArticle?.bookIds.getValue()).not.toContain(bookId.value);
    });

    it('should handle when no articles reference the book', async () => {
      const bookId = new BookId(uuidv4());
      await repository.removeBookReference(bookId);
      // If no error is thrown, the test passes
    });

    it('should validate UUID format', async () => {
      // This test is no longer needed as BookId validation is handled by the BookId class
      // and is tested in its own test suite
    });
  });

  describe('validateBookIds', () => {
    it('should validate existing book references', async () => {
      const bookId = uuidv4();
      await booksConnection.execute(
        `INSERT INTO books (id, title, author, isbn, description) 
         VALUES ($1, 'Test Book', 'Test Author', '1234567890', 'Test Description')`,
        [bookId]
      );

      await expect(repository['validateBookIds']([bookId])).resolves.not.toThrow();
    });

    it('should throw InvalidBookReferenceError for non-existent books', async () => {
      const bookId = uuidv4();
      await expect(repository['validateBookIds']([bookId])).rejects.toThrow(InvalidBookReferenceError);
    });

    it('should handle empty book ids array', async () => {
      await expect(repository['validateBookIds']([])).resolves.not.toThrow();
    });
  });
});
