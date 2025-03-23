import { test, expect } from '@playwright/test';
import { ArticlesApi } from '../apis/articles-api';
import { BooksApi } from '../apis/books-api';
import { ApiHelpers } from '../fixtures/api-helpers';
import { testArticles, testBooks } from '../fixtures/test-data';
import { ArticleResponse, PaginatedResponse } from '../fixtures/api-types';

test.describe('Articles API', () => {
  let articlesApi: ArticlesApi;
  let apiHelpers: ApiHelpers;

  test.beforeEach(async ({ request }) => {
    articlesApi = new ArticlesApi(request);
    apiHelpers = ApiHelpers.create(request);
  });

  test.afterEach(async () => {
    await apiHelpers.cleanupTestData();
  });

  test('should create an article without books', async () => {
    const response = await articlesApi.createArticle({
      ...testArticles.valid,
      bookIds: []
    });
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response, 201);

    expect(article).toMatchObject({
      title: testArticles.valid.title,
      content: testArticles.valid.content,
      bookIds: []
    });
    expect(article.id).toBeDefined();
    expect(article.createdAt).toBeDefined();
    expect(article.updatedAt).toBeDefined();
  });

  test('should create an article with referenced books', async () => {
    // Crear libro primero
    const book = await apiHelpers.createTestBook(testBooks.valid);

    // Crear artículo con referencia al libro
    const response = await articlesApi.createArticle({
      ...testArticles.valid,
      bookIds: [book.id]
    });
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response, 201);

    expect(article.bookIds).toContain(book.id);
  });

  test('should return 400 for article with non-existent book ids', async () => {
    const response = await articlesApi.createArticle(testArticles.invalidBookIds);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('book');
  });

  test('should get an article by id', async () => {
    // Crear artículo
    const createdArticle = await apiHelpers.createTestArticle({
      ...testArticles.valid,
      bookIds: []
    });

    // Obtener artículo
    const response = await articlesApi.getArticle(createdArticle.id);
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response);

    expect(article).toEqual(createdArticle);
  });

  test('should return 404 for non-existent article', async () => {
    const response = await articlesApi.getArticle('non-existent-id');
    await apiHelpers.verifyErrorResponse(response, 404);
  });

  test('should update an article', async () => {
    // Crear artículo
    const createdArticle = await apiHelpers.createTestArticle({
      ...testArticles.valid,
      bookIds: []
    });

    // Actualizar artículo
    const updateData = {
      title: 'Updated Article Title',
      content: 'Updated article content'
    };
    const updateResponse = await articlesApi.updateArticle(createdArticle.id, updateData);
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(updateResponse);

    expect(updatedArticle).toMatchObject({
      ...createdArticle,
      ...updateData,
      updatedAt: expect.any(String)
    });
    expect(Date.parse(updatedArticle.updatedAt)).toBeGreaterThan(Date.parse(createdArticle.updatedAt));
  });

  test('should update article book references', async () => {
    // Crear artículo sin libros
    const createdArticle = await apiHelpers.createTestArticle({
      ...testArticles.valid,
      bookIds: []
    });

    // Crear libro
    const book = await apiHelpers.createTestBook(testBooks.valid);

    // Actualizar artículo con referencia al libro
    const updateResponse = await articlesApi.updateArticle(createdArticle.id, {
      bookIds: [book.id]
    });
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(updateResponse);

    expect(updatedArticle.bookIds).toContain(book.id);
  });

  test('should delete an article', async () => {
    // Crear artículo
    const createdArticle = await apiHelpers.createTestArticle({
      ...testArticles.valid,
      bookIds: []
    });

    // Eliminar artículo
    const deleteResponse = await articlesApi.deleteArticle(createdArticle.id);
    expect(deleteResponse.status()).toBe(204);

    // Verificar que el artículo ya no existe
    const getResponse = await articlesApi.getArticle(createdArticle.id);
    await apiHelpers.verifyErrorResponse(getResponse, 404);
  });

  test('should list articles with pagination', async () => {
    // Crear múltiples artículos
    const articlesToCreate = [
      { ...testArticles.valid, bookIds: [] },
      { ...testArticles.validWithBooks, bookIds: [] }
    ];
    
    for (const article of articlesToCreate) {
      await apiHelpers.createTestArticle(article);
    }

    // Obtener primera página
    const response = await articlesApi.listArticles({ page: 1, limit: 1 });
    const result = await apiHelpers.verifySuccessResponse<PaginatedResponse<ArticleResponse>>(response);

    expect(result.items).toHaveLength(1);
    expect(result.total).toBeGreaterThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
  });

  test('should handle concurrent article creation', async () => {
    const concurrentArticles = Array(5).fill(null).map((_, index) => ({
      title: `Concurrent Article ${index}`,
      content: `Content for concurrent article ${index}`,
      bookIds: [] as string[]
    }));

    const responses = await Promise.all(
      concurrentArticles.map(article => articlesApi.createArticle(article))
    );

    for (const response of responses) {
      expect(response.status()).toBe(201);
      const article = await response.json();
      expect(article.id).toBeDefined();
    }
  });

  test('should handle article with maximum content length', async () => {
    const maxLengthArticle = {
      title: 'Max Length Article',
      content: 'A'.repeat(10000), // Asumiendo que 10000 es el límite
      bookIds: [] as string[]
    };

    const response = await articlesApi.createArticle(maxLengthArticle);
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response, 201);
    expect(article.content).toHaveLength(10000);
  });

  test('should handle article with content exceeding maximum length', async () => {
    const oversizedArticle = {
      title: 'Oversized Article',
      content: 'A'.repeat(10001), // Excede el límite por 1
      bookIds: [] as string[]
    };

    const response = await articlesApi.createArticle(oversizedArticle);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('content');
  });

  test('should maintain book references after book update', async () => {
    // Crear libro y artículo
    const { book, article } = await apiHelpers.createTestBookWithArticle();

    // Actualizar libro
    const updateResponse = await new BooksApi(apiHelpers['request']).updateBook(book.id, {
      title: 'Updated Book Title'
    });
    expect(updateResponse.status()).toBe(200);

    // Verificar que el artículo mantiene la referencia
    const getArticleResponse = await articlesApi.getArticle(article.id);
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(getArticleResponse);
    expect(updatedArticle.bookIds).toContain(book.id);
  });
});
