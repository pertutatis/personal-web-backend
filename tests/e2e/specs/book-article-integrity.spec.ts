import { test, expect } from '@playwright/test';
import { v4 as uuid } from 'uuid';
import { ArticlesApi } from '../apis/articles-api';
import { BooksApi } from '../apis/books-api';
import { ApiHelpers } from '../fixtures/api-helpers';

test.describe('Book-Article Integrity', () => {
  let apiHelpers: ApiHelpers;

  test.beforeEach(async ({ request }) => {
    apiHelpers = ApiHelpers.create(request);
    await apiHelpers.cleanupTestData();
  });

  test.afterEach(async () => {
    await apiHelpers.dispose();
  });

  const validTestIsbns = [
    '978-0132350884',  // Clean Code
    '978-0201633610',  // Design Patterns
    '978-0134494166',  // Clean Architecture
    '978-0137081073',  // The Clean Coder
    '978-0735619678',  // Code Complete
    '978-0134757599'   // Refactoring
  ];

  let isbnIndex = 0;
  function getNextIsbn(): string {
    const isbn = validTestIsbns[isbnIndex];
    isbnIndex = (isbnIndex + 1) % validTestIsbns.length;
    return isbn;
  }
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
      isbn: getNextIsbn(),
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

    // Wait a bit for the event to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify the article no longer has the book reference
    const articleAfterDelete = await articlesApi.getArticle(articleId);
    expect(articleAfterDelete.status()).toBe(200);
    const articleDataAfter = await articleAfterDelete.json();
    expect(articleDataAfter.bookIds).not.toContain(bookId);
  });

  test('should maintain referential integrity when deleting a book referenced by multiple articles', async () => {
    // Create two books
    const book1Id = uuid();
    const book2Id = uuid();
    const createBook1Response = await booksApi.createBook({
      id: book1Id,
      isbn: getNextIsbn(),
      title: 'Test Book 1',
      author: 'Test Author 1',
      description: 'Test Description 1',
      purchaseLink: 'https://example.com/book1'
    });
    expect(createBook1Response.status()).toBe(201);

    const createBook2Response = await booksApi.createBook({
      id: book2Id,
      isbn: getNextIsbn(),
      title: 'Test Book 2',
      author: 'Test Author 2',
      description: 'Test Description 2',
      purchaseLink: 'https://example.com/book2'
    });
    expect(createBook2Response.status()).toBe(201);

    // Create two articles referencing both books
    const article1Id = uuid();
    const article2Id = uuid();

    const createArticle1Response = await articlesApi.createArticle({
      id: article1Id,
      title: 'Test Article 1',
      excerpt: 'Test Excerpt 1',
      content: 'Test Content 1',
      bookIds: [book1Id, book2Id],
      relatedLinks: [],
      slug: 'test-article-1-with-books'
    });
    expect(createArticle1Response.status()).toBe(201);

    const createArticle2Response = await articlesApi.createArticle({
      id: article2Id,
      title: 'Test Article 2',
      excerpt: 'Test Excerpt 2',
      content: 'Test Content 2',
      bookIds: [book1Id, book2Id],
      relatedLinks: [],
      slug: 'test-article-2-with-books'
    });
    expect(createArticle2Response.status()).toBe(201);

    // Verify both articles have references to both books
    const article1BeforeDelete = await articlesApi.getArticle(article1Id);
    const article2BeforeDelete = await articlesApi.getArticle(article2Id);
    expect(article1BeforeDelete.status()).toBe(200);
    expect(article2BeforeDelete.status()).toBe(200);

    const article1DataBefore = await article1BeforeDelete.json();
    const article2DataBefore = await article2BeforeDelete.json();
    expect(article1DataBefore.bookIds).toContain(book1Id);
    expect(article1DataBefore.bookIds).toContain(book2Id);
    expect(article2DataBefore.bookIds).toContain(book1Id);
    expect(article2DataBefore.bookIds).toContain(book2Id);

    // Delete book 1
    const deleteResponse = await booksApi.deleteBook(book1Id);
    expect(deleteResponse.status()).toBe(204);

    // Wait a bit for the event to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify both articles no longer have book1 reference but still have book2
    const article1AfterDelete = await articlesApi.getArticle(article1Id);
    const article2AfterDelete = await articlesApi.getArticle(article2Id);
    expect(article1AfterDelete.status()).toBe(200);
    expect(article2AfterDelete.status()).toBe(200);

    const article1DataAfter = await article1AfterDelete.json();
    const article2DataAfter = await article2AfterDelete.json();
    
    expect(article1DataAfter.bookIds).not.toContain(book1Id);
    expect(article1DataAfter.bookIds).toContain(book2Id);
    expect(article2DataAfter.bookIds).not.toContain(book1Id);
    expect(article2DataAfter.bookIds).toContain(book2Id);
  });
});
