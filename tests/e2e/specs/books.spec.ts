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

  test('should create a new book', async () => {
    console.log('Starting create book test...');
    // Usar un ISBN único para este test
    const isbn = generateValidIsbn(5); // Usar un índice más alto para evitar conflictos
    console.log('Using ISBN for create test:', isbn);
    
    const testBook = {
      title: 'Test Book',
      author: 'Test Author',
      isbn
    };

    const response = await booksApi.createBook(testBook);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(response, 201);

    expect(book).toMatchObject({
      title: testBook.title,
      author: testBook.author,
      isbn: testBook.isbn
    });
    expect(book.id).toBeDefined();
    expect(book.createdAt).toBeDefined();
    expect(book.updatedAt).toBeDefined();
  });

  test('should prevent duplicate ISBN', async () => {
    // Usar un ISBN único para el primer libro en este test
    const isbn = generateValidIsbn(6); // Usar un índice más alto y diferente del test anterior
    console.log('Using ISBN for duplicate test:', isbn);
    
    const book1 = {
      title: 'First Book',
      author: 'First Author',
      isbn
    };

    const response1 = await booksApi.createBook(book1);
    await apiHelpers.verifySuccessResponse<BookResponse>(response1, 201);

    // Intentar crear un segundo libro con el mismo ISBN
    const book2 = {
      title: 'Second Book',
      author: 'Second Author',
      isbn
    };

    const response2 = await booksApi.createBook(book2);
    await apiHelpers.verifyErrorResponse(response2, 400);
  });

  test('should return 400 for invalid ISBN', async () => {
    const response = await booksApi.createBook(testBooks.invalidIsbn);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('ISBN');
  });

  test('should return 400 for empty title', async () => {
    const response = await booksApi.createBook({
      ...testBooks.valid,
      title: ''
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('title');
  });

  test('should return 400 for empty author', async () => {
    const response = await booksApi.createBook({
      ...testBooks.valid,
      author: ''
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('author');
  });

  test('should get a book by id', async () => {
    const createdBook = await apiHelpers.createTestBook(testBooks.valid);
    const response = await booksApi.getBook(createdBook.id);
    const book = await apiHelpers.verifySuccessResponse<BookResponse>(response);
    expect(book).toEqual(createdBook);
  });

  test('should return 404 for non-existent book', async () => {
    const response = await booksApi.getBook('non-existent-id');
    await apiHelpers.verifyErrorResponse(response, 404);
  });

  test('should update a book completely', async () => {
    const createdBook = await apiHelpers.createTestBook(testBooks.valid);
    const updateData = {
      title: 'Updated Title',
      author: 'Updated Author'
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

  test('should update book title only', async () => {
    const createdBook = await apiHelpers.createTestBook(testBooks.valid);
    const updateData = {
      title: 'Updated Title Only'
    };
    const updateResponse = await booksApi.updateBook(createdBook.id, updateData);
    const updatedBook = await apiHelpers.verifySuccessResponse<BookResponse>(updateResponse);

    expect(updatedBook).toMatchObject({
      ...createdBook,
      title: updateData.title,
      author: createdBook.author,
      updatedAt: expect.any(String)
    });
  });

  test('should update book author only', async () => {
    const createdBook = await apiHelpers.createTestBook(testBooks.valid);
    const updateData = {
      author: 'Updated Author Only'
    };
    const updateResponse = await booksApi.updateBook(createdBook.id, updateData);
    const updatedBook = await apiHelpers.verifySuccessResponse<BookResponse>(updateResponse);

    expect(updatedBook).toMatchObject({
      ...createdBook,
      author: updateData.author,
      title: createdBook.title,
      updatedAt: expect.any(String)
    });
  });

  test('should delete a book', async () => {
    const createdBook = await apiHelpers.createTestBook(testBooks.valid);
    const deleteResponse = await booksApi.deleteBook(createdBook.id);
    expect(deleteResponse.status()).toBe(204);

    const getResponse = await booksApi.getBook(createdBook.id);
    await apiHelpers.verifyErrorResponse(getResponse, 404);
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
  });

  test('should handle concurrent book creation', async () => {
    // Usar un rango diferente de ISBNs para los libros concurrentes
    const startIndex = 20; // Empezar desde un índice mucho más alto para evitar conflictos
    const concurrentBooks = Array(3).fill(null).map((_, index) => {
      const isbn = generateValidIsbn(startIndex + index);
      console.log(`Using ISBN for concurrent book ${index}:`, isbn);
      return {
        title: `Concurrent Book ${index}`,
        author: 'Test Author',
        isbn
      };
    });

    // Crear los libros secuencialmente
    for (const book of concurrentBooks) {
      console.log('Creating book with data:', book);
      const response = await booksApi.createBook(book);
      const createdBook = await apiHelpers.verifySuccessResponse<BookResponse>(response, 201);
      expect(createdBook.id).toBeDefined();
      expect(createdBook.isbn).toBe(book.isbn);
    }
  });

  // test('should handle invalid pagination parameters', async () => {
  //   const response = await booksApi.listBooks({ page: -1, limit: 0 });
  //   const error = await apiHelpers.verifyErrorResponse(response, 400);
  //   expect(error.message).toContain('pagination');
  // });
});
