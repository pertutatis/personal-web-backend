import { test, expect } from '@playwright/test';
import { BooksApi } from '../apis/books-api';
import { ApiHelpers } from '../fixtures/api-helpers';
import { testBooks } from '../fixtures/test-data';
import { BookResponse, PaginatedResponse } from '../fixtures/api-types';
import { v4 as uuidv4 } from 'uuid';

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

  test('should create a new book with client-provided UUID', async () => {
    const response = await booksApi.createBook(testBooks.valid);
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('');

    const getResponse = await booksApi.getBook(testBooks.valid.id);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(getResponse);

    expect(book).toMatchObject({
      id: testBooks.valid.id,
      title: testBooks.valid.title,
      author: testBooks.valid.author,
      isbn: testBooks.valid.isbn,
      description: testBooks.valid.description,
      purchaseLink: testBooks.valid.purchaseLink
    });
  });

  test('should return 400 for invalid UUID format', async () => {
    const response = await booksApi.createBook(testBooks.invalidUuid);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.type).toBe('BookIdInvalid');
  });

  test('should return 400 for non-v4 UUID', async () => {
    const response = await booksApi.createBook(testBooks.nonV4Uuid);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.type).toBe('BookIdInvalid');
  });

  test('should return 409 for duplicate UUID', async () => {
    await booksApi.createBook(testBooks.valid);
    
    const duplicateResponse = await booksApi.createBook({
      ...testBooks.validSecond,
      id: testBooks.valid.id
    });

    const error = await apiHelpers.verifyErrorResponse(duplicateResponse, 409);
    expect(error.type).toBe('BookIdDuplicated');
  });

  test('should create a book without purchase link', async () => {
    const response = await booksApi.createBook(testBooks.validWithoutPurchaseLink);
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('');

    const getResponse = await booksApi.getBook(testBooks.validWithoutPurchaseLink.id);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(getResponse);
    expect(book.purchaseLink).toBeNull();
  });

  test('should handle description with maximum length', async () => {
    const response = await booksApi.createBook(testBooks.maxLengthDescription);
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('');

    const getResponse = await booksApi.getBook(testBooks.maxLengthDescription.id);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(getResponse);
    expect(book.description).toBe(testBooks.maxLengthDescription.description);
  });

  test('should handle purchase link with maximum length', async () => {
    const response = await booksApi.createBook(testBooks.maxLengthPurchaseLink);
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('');

    const getResponse = await booksApi.getBook(testBooks.maxLengthPurchaseLink.id);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(getResponse);
    expect(book.purchaseLink).toBe(testBooks.maxLengthPurchaseLink.purchaseLink);
  });

  test('should prevent duplicate ISBN', async () => {
    await booksApi.createBook(testBooks.valid);

    const book2 = {
      ...testBooks.validSecond,
      isbn: testBooks.valid.isbn
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
    const createResponse = await booksApi.createBook(testBooks.valid);
    expect(createResponse.status()).toBe(201);
    expect(await createResponse.text()).toBe('');

    const response = await booksApi.getBook(testBooks.valid.id);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(response);

    expect(book).toMatchObject({
      id: testBooks.valid.id,
      title: testBooks.valid.title,
      author: testBooks.valid.author,
      isbn: testBooks.valid.isbn,
      description: testBooks.valid.description,
      purchaseLink: testBooks.valid.purchaseLink
    });
  });

  test('should update all book fields', async () => {
    const createResponse = await booksApi.createBook(testBooks.valid);
    expect(createResponse.status()).toBe(201);
    expect(await createResponse.text()).toBe('');

    const updateData = {
      title: 'Updated Title',
      author: 'Updated Author',
      description: 'Updated Description',
      purchaseLink: 'https://example.com/updated-book'
    };

    const updateResponse = await booksApi.updateBook(testBooks.valid.id, updateData);
    expect(updateResponse.status()).toBe(204);
    expect(await updateResponse.text()).toBe('');

    const getResponse = await booksApi.getBook(testBooks.valid.id);
    const updatedBook = await apiHelpers.verifySuccessResponse<BookResponse>(getResponse);

    expect(updatedBook).toMatchObject({
      id: testBooks.valid.id,
      ...updateData
    });
  });

  test('should list books with pagination', async () => {
    const book1Response = await booksApi.createBook(testBooks.valid);
    expect(book1Response.status()).toBe(201);
    expect(await book1Response.text()).toBe('');

    const book2Response = await booksApi.createBook(testBooks.validSecond);
    expect(book2Response.status()).toBe(201);
    expect(await book2Response.text()).toBe('');

    const response = await booksApi.listBooks({ page: 1, limit: 1 });
    const result = await apiHelpers.verifySuccessResponse<PaginatedResponse<BookResponse>>(response);

    expect(result.items).toHaveLength(1);
    expect(result.total).toBeGreaterThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
    expect(result.items[0].description).toBeDefined();
    expect(result.items[0].purchaseLink).toBeDefined();
  });
});
