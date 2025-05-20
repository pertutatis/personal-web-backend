import { test, expect } from '@playwright/test';
import { v4 as uuid } from 'uuid';
import { ArticlesApi } from './apis/articles-api';
import { BooksApi } from './apis/books-api';

test.describe('Book-Article Integrity', () => {
  let articlesApi: ArticlesApi;
  let booksApi: BooksApi;

  test.beforeEach(({ request }) => {
    articlesApi = new ArticlesApi(request);
    booksApi = new BooksApi(request);
  });

  test('should maintain referential integrity when deleting a book', async () => {
    // Create a book
    const bookId = uuid();
    const bookResponse = await booksApi.createBook({
      id: bookId,
      isbn: '978-0123456789',
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      purchaseLink: 'https://example.com/book'
    });
    expect(bookResponse.status()).toBe(201);

    // Create an article referencing the book
    const articleId = uuid();
    const createResponse = await articlesApi.createArticle({
      id: articleId,
      title: 'Test Article',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: [bookId],
      relatedLinks: [],
      slug: 'test-article-with-book'
    });
    expect(createResponse.status()).toBe(201);

    // Verify the article has the book reference
    const articleBeforeDelete = await articlesApi.getArticle(articleId);
    expect(articleBeforeDelete.status()).toBe(200);
    const articleDataBefore = await articleBeforeDelete.json();
    expect(articleDataBefore.bookIds).toContain(bookId);

    // Delete the book
    const deleteResponse = await booksApi.deleteBook(bookId);
    expect(deleteResponse.status()).toBe(204);

    // Verify the article no longer has the book reference
    const articleAfterDelete = await articlesApi.getArticle(articleId);
    expect(articleAfterDelete.status()).toBe(200);
    const articleDataAfter = await articleAfterDelete.json();
    expect(articleDataAfter.bookIds).not.toContain(bookId);
  });

  test('should reject creating article with non-existent book reference', async () => {
    const articleId = uuid();
    const nonExistentBookId = uuid();

    const createResponse = await articlesApi.createArticle({
      id: articleId,
      title: 'Test Article',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: [nonExistentBookId],
      relatedLinks: [],
      slug: 'test-article-with-invalid-book'
    });

    expect(createResponse.status()).toBe(400);
    const error = await createResponse.json();
    expect(error.type).toBe('INVALID_BOOK_REFERENCE');
  });

  test('should reject updating article with non-existent book reference', async () => {
    // Create article without book references
    const articleId = uuid();
    const createResponse = await articlesApi.createArticle({
      id: articleId,
      title: 'Test Article',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: [],
      relatedLinks: [],
      slug: 'test-article-without-books'
    });
    expect(createResponse.status()).toBe(201);

    // Try to update with non-existent book
    const nonExistentBookId = uuid();
    const updateResponse = await articlesApi.updateArticle(articleId, {
      title: 'Updated Title',
      excerpt: 'Updated Excerpt',
      content: 'Updated Content',
      bookIds: [nonExistentBookId],
      relatedLinks: [],
      slug: 'test-article-update-with-invalid-book'
    });

    expect(updateResponse.status()).toBe(400);
    const error = await updateResponse.json();
    expect(error.type).toBe('INVALID_BOOK_REFERENCE');
  });
});
