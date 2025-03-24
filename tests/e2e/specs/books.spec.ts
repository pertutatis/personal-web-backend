import { test, expect } from '@playwright/test';
import { BooksApi } from '../apis/books-api';
import { ApiHelpers } from '../fixtures/api-helpers';
import { testBooks, generateValidIsbn } from '../fixtures/test-data';
import { BookResponse, PaginatedResponse } from '../fixtures/api-types';

test.describe('Books API', () => {
  let booksApi: BooksApi;
  let apiHelpers: ApiHelpers;

  test.beforeAll(async ({ request }) => {
    apiHelpers = ApiHelpers.create(request);
    console.log('Initial cleanup...');
    await apiHelpers.cleanupTestData();
  });

  test.beforeEach(async ({ request }) => {
    booksApi = new BooksApi(request);
    apiHelpers = ApiHelpers.create(request);
    console.log('Pre-test cleanup...');
    await apiHelpers.cleanupTestData();
  });

  test.afterEach(async () => {
    console.log('Post-test cleanup...');
    if (apiHelpers) {
      await apiHelpers.cleanupTestData();
      await apiHelpers.dispose();
    }
  });

  test('should create a new book with all fields', async () => {
    const isbn = generateValidIsbn(5);
    console.log('Using ISBN for create test:', isbn);
    
    const testBook = {
      ...testBooks.valid,
      isbn
    };

    const response = await booksApi.createBook(testBook);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(response, 201);

    expect(book).toMatchObject({
      title: testBook.title,
      author: testBook.author,
      isbn: testBook.isbn,
      description: testBook.description,
      purchaseLink: testBook.purchaseLink
    });
    expect(book.id).toBeDefined();
    expect(book.createdAt).toBeDefined();
    expect(book.updatedAt).toBeDefined();
  });

  test('should create a book without purchase link', async () => {
    const testBook = testBooks.validWithoutPurchaseLink;
    const response = await booksApi.createBook(testBook);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(response, 201);

    expect(book.purchaseLink).toBeNull();
  });

  test('should handle description with maximum length', async () => {
    const testBook = testBooks.maxLengthDescription;
    const response = await booksApi.createBook(testBook);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(response, 201);

    expect(book.description).toBe(testBook.description);
  });

  test('should handle purchase link with maximum length', async () => {
    const testBook = testBooks.maxLengthPurchaseLink;
    const response = await booksApi.createBook(testBook);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(response, 201);

    expect(book.purchaseLink).toBe(testBook.purchaseLink);
  });

  test('should prevent duplicate ISBN', async () => {
    const isbn = generateValidIsbn(6);
    console.log('Using ISBN for duplicate test:', isbn);
    
    const book1 = {
      ...testBooks.valid,
      isbn
    };

    const response1 = await booksApi.createBook(book1);
    await apiHelpers.verifySuccessResponse<BookResponse>(response1, 201);

    const book2 = {
      ...testBooks.validSecond,
      isbn
    };

    const response2 = await booksApi.createBook(book2);
    await apiHelpers.verifyErrorResponse(response2, 400);
  });

  test('should return 400 for empty description', async () => {
    const response = await booksApi.createBook(testBooks.invalidDescription);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('description');
  });

  test('should return 400 for invalid purchase link', async () => {
    const response = await booksApi.createBook(testBooks.invalidPurchaseLink);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('purchase link');
  });

  test('should return 400 for invalid ISBN', async () => {
    const response = await booksApi.createBook(testBooks.invalidIsbn);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('ISBN');
  });

  test('should return 400 for empty title', async () => {
    const response = await booksApi.createBook(testBooks.invalidTitle);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('title');
  });

  test('should return 400 for empty author', async () => {
    const response = await booksApi.createBook(testBooks.invalidAuthor);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('author');
  });

  test('should get a book by id', async () => {
    const createdBook = await apiHelpers.createTestBook(testBooks.valid);
    const response = await booksApi.getBook(createdBook.id);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(response);

    expect(book.id).toBe(createdBook.id);
    expect(book.title).toBe(createdBook.title);
    expect(book.author).toBe(createdBook.author);
    expect(book.isbn).toBe(createdBook.isbn);
    expect(book.description).toBe(createdBook.description);
    expect(book.purchaseLink).toBe(createdBook.purchaseLink);
    expect(book.createdAt).toBeDefined();
    expect(book.updatedAt).toBeDefined();
  });

  test('should update all book fields', async () => {
    const createdBook = await apiHelpers.createTestBook(testBooks.valid);
    const updateData = {
      title: 'Updated Title',
      author: 'Updated Author',
      description: 'Updated Description',
      purchaseLink: 'https://example.com/updated-book'
    };

    const updateResponse = await booksApi.updateBook(createdBook.id, updateData);
    const updatedBook = await apiHelpers.verifySuccessResponse<BookResponse>(updateResponse);

    expect(updatedBook).toMatchObject({
      ...createdBook,
      ...updateData,
      updatedAt: expect.any(String)
    });
    expect(Date.parse(updatedBook.updatedAt)).toBeGreaterThan(Date.parse(createdBook.updatedAt));
  });

  test('should update book removing purchase link', async () => {
    const createdBook = await apiHelpers.createTestBook(testBooks.valid);
    const updateData = {
      purchaseLink: null
    };

    const updateResponse = await booksApi.updateBook(createdBook.id, updateData);
    const updatedBook = await apiHelpers.verifySuccessResponse<BookResponse>(updateResponse);

    expect(updatedBook.purchaseLink).toBeNull();
  });

  test('should list books with pagination', async () => {
    const booksToCreate = [testBooks.valid, testBooks.validSecond];
    for (const book of booksToCreate) {
      await apiHelpers.createTestBook(book);
    }

    const response = await booksApi.listBooks({ page: 1, limit: 1 });
    const result = await apiHelpers.verifySuccessResponse<PaginatedResponse<BookResponse>>(response);

    expect(result.items).toHaveLength(1);
    expect(result.total).toBeGreaterThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
    expect(result.items[0].description).toBeDefined();
    expect(result.items[0].purchaseLink).toBeDefined();
  });

  test('should handle concurrent book creation', async () => {
    const startIndex = 20;
    const concurrentBooks = Array(3).fill(null).map((_, index) => {
      const isbn = generateValidIsbn(startIndex + index);
      console.log(`Using ISBN for concurrent book ${index}:`, isbn);
      return {
        ...testBooks.valid,
        title: `Concurrent Book ${index}`,
        isbn
      };
    });

    for (const book of concurrentBooks) {
      console.log('Creating book with data:', book);
      const response = await booksApi.createBook(book);
      const createdBook = await apiHelpers.verifySuccessResponse<BookResponse>(response, 201);
      expect(createdBook.id).toBeDefined();
      expect(createdBook.isbn).toBe(book.isbn);
      expect(createdBook.description).toBe(book.description);
      expect(createdBook.purchaseLink).toBe(book.purchaseLink);
    }
  });
});
