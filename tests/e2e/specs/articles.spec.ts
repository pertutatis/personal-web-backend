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
      excerpt: testArticles.valid.excerpt,
      content: testArticles.valid.content,
      bookIds: [],
      relatedLinks: testArticles.valid.relatedLinks,
      slug: 'understanding-domain-driven-design'
    });
    expect(article.id).toBeDefined();
    expect(article.createdAt).toBeDefined();
    expect(article.updatedAt).toBeDefined();
  });

  test('should create an article with related links', async () => {
    const response = await articlesApi.createArticle(testArticles.valid);
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response, 201);

    expect(article.relatedLinks).toHaveLength(1);
    expect(article.relatedLinks[0]).toEqual({
      text: 'Learn DDD',
      url: 'https://example.com/learn-ddd'
    });
  });

  test('should generate correct slug from title with special characters', async () => {
    const response = await articlesApi.createArticle(testArticles.specialCharactersTitle);
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response, 201);

    expect(article.slug).toBe('como-implementar-ddd-en-typescript');
  });

  test('should find article by slug', async () => {
    const createResponse = await articlesApi.createArticle(testArticles.valid);
    const createdArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(createResponse, 201);

    const response = await articlesApi.getArticleBySlug(createdArticle.slug);
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response);

    expect(article).toEqual(createdArticle);
  });

  test('should update article related links', async () => {
    const createResponse = await articlesApi.createArticle(testArticles.valid);
    const createdArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(createResponse, 201);

    const newLinks = [
      { text: 'Updated Link', url: 'https://example.com/updated' }
    ];

    const updateResponse = await articlesApi.updateArticle(createdArticle.id, {
      relatedLinks: newLinks
    });
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(updateResponse);

    expect(updatedArticle.relatedLinks).toEqual(newLinks);
  });

  test('should validate maximum number of related links', async () => {
    const response = await articlesApi.createArticle(testArticles.tooManyLinks);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('Cannot have more than 10 related links');
  });

  test('should validate related links format', async () => {
    const response = await articlesApi.createArticle(testArticles.invalidLinks);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('text exceeds maximum length');
  });

  test('should validate related links URLs', async () => {
    const response = await articlesApi.createArticle(testArticles.invalidLinkUrl);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('not a valid URL');
  });

  test('should reject duplicate URLs in related links', async () => {
    const response = await articlesApi.createArticle(testArticles.duplicateLinks);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('Duplicate URLs are not allowed');
  });

  test('should update slug when title changes', async () => {
    const createResponse = await articlesApi.createArticle(testArticles.valid);
    const createdArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(createResponse, 201);

    const updateResponse = await articlesApi.updateArticle(createdArticle.id, {
      title: 'Updated Title'
    });
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(updateResponse);

    expect(updatedArticle.slug).toBe('updated-title');
  });

  test('should handle concurrent article creation', async () => {
    const concurrentArticles = Array(5).fill(null).map((_, index) => ({
      title: `Concurrent Article ${index}`,
      excerpt: `Excerpt for concurrent article ${index}`,
      content: `Content for concurrent article ${index}`,
      bookIds: [] as string[],
      relatedLinks: [] as { text: string; url: string }[]
    }));

    const responses = await Promise.all(
      concurrentArticles.map(article => articlesApi.createArticle(article))
    );

    for (const response of responses) {
      expect(response.status()).toBe(201);
      const article = await response.json();
      expect(article.id).toBeDefined();
      expect(article.slug).toBeDefined();
    }
  });

  test('should create an article with referenced books', async () => {
    const book = await apiHelpers.createTestBook(testBooks.valid);

    const response = await articlesApi.createArticle({
      ...testArticles.valid,
      bookIds: [book.id],
    });
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(
      response,
      201
    );

    expect(article.bookIds).toContain(book.id);
  });

  test('should return 400 for article with non-existent book ids', async () => {
    const response = await articlesApi.createArticle(
      testArticles.invalidBookIds
    );
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('book');
  });

  test('should get an article by id', async () => {
    const createdArticle = await apiHelpers.createTestArticle({
      ...testArticles.valid,
      bookIds: [],
    });

    const response = await articlesApi.getArticle(createdArticle.id);
    const article =
      await apiHelpers.verifySuccessResponse<ArticleResponse>(response);

    expect(article).toEqual(createdArticle);
  });

  test('should return 404 for non-existent article', async () => {
    const response = await articlesApi.getArticle('non-existent-id');
    await apiHelpers.verifyErrorResponse(response, 404);
  });

  test('should update an article', async () => {
    const createdArticle = await apiHelpers.createTestArticle({
      ...testArticles.valid,
      bookIds: [],
    });

    const updateData = {
      title: 'Updated Article Title',
      excerpt: 'Updated article excerpt',
      content: 'Updated article content',
    };
    const updateResponse = await articlesApi.updateArticle(
      createdArticle.id,
      updateData
    );
    const updatedArticle =
      await apiHelpers.verifySuccessResponse<ArticleResponse>(updateResponse);

    expect(updatedArticle).toMatchObject({
      id: createdArticle.id,
      title: updateData.title,
      excerpt: updateData.excerpt,
      content: updateData.content,
      updatedAt: expect.any(String),
      bookIds: createdArticle.bookIds,
      relatedLinks: createdArticle.relatedLinks
    });
    expect(Date.parse(updatedArticle.updatedAt)).toBeGreaterThan(
      Date.parse(createdArticle.updatedAt)
    );
  });

  test('should update article book references', async () => {
    const createdArticle = await apiHelpers.createTestArticle({
      ...testArticles.valid,
      bookIds: [],
    });

    const book = await apiHelpers.createTestBook(testBooks.valid);

    const updateResponse = await articlesApi.updateArticle(createdArticle.id, {
      bookIds: [book.id],
    });
    const updatedArticle =
      await apiHelpers.verifySuccessResponse<ArticleResponse>(updateResponse);

    expect(updatedArticle.bookIds).toContain(book.id);
  });

  test('should delete an article', async () => {
    const createdArticle = await apiHelpers.createTestArticle({
      ...testArticles.valid,
      bookIds: [],
    });

    const deleteResponse = await articlesApi.deleteArticle(createdArticle.id);
    expect(deleteResponse.status()).toBe(204);

    const getResponse = await articlesApi.getArticle(createdArticle.id);
    await apiHelpers.verifyErrorResponse(getResponse, 404);
  });

  test('should list articles with pagination', async () => {
    const articlesToCreate = [
      { ...testArticles.valid, bookIds: [] },
      { ...testArticles.validWithBooks, bookIds: [] },
    ];

    for (const article of articlesToCreate) {
      await apiHelpers.createTestArticle(article);
    }

    const response = await articlesApi.listArticles({ page: 1, limit: 1 });
    const result =
      await apiHelpers.verifySuccessResponse<
        PaginatedResponse<ArticleResponse>
      >(response);

    expect(result.items).toHaveLength(1);
    expect(result.total).toBeGreaterThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
  });

  test('should handle article with maximum content length', async () => {
    const maxLengthArticle = {
      title: 'Max Length Article',
      excerpt: 'Test excerpt',
      content: 'A'.repeat(10000),
      bookIds: [] as string[],
      relatedLinks: [] as Array<{ text: string; url: string }>,
    };

    const response = await articlesApi.createArticle(maxLengthArticle);
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(
      response,
      201
    );
    expect(article.content).toHaveLength(10000);
  });

  test('should handle article with content exceeding maximum length', async () => {
    const oversizedArticle = {
      title: 'Oversized Article',
      excerpt: 'Test excerpt',
      content: 'A'.repeat(10001),
      bookIds: [] as string[],
      relatedLinks: [] as Array<{ text: string; url: string }>,
    };

    const response = await articlesApi.createArticle(oversizedArticle);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('content');
  });

  test('should handle article with maximum excerpt length', async () => {
    const response = await articlesApi.createArticle(
      testArticles.maxLengthExcerpt
    );
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(
      response,
      201
    );
    expect(article.excerpt).toHaveLength(160);
  });

  test('should return 400 for article with excerpt exceeding maximum length', async () => {
    const response = await articlesApi.createArticle(
      testArticles.invalidExcerpt
    );
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('excerpt');
  });

  test('should maintain book references after book update', async () => {
    const { book, article } = await apiHelpers.createTestBookWithArticle();

    const booksApi = new BooksApi(apiHelpers['request']);
    await booksApi.updateBook(book.id, {
      title: 'Updated Book Title',
    });
    await apiHelpers.verifySuccessResponse(
      await booksApi.getBook(book.id),
      200
    );

    const getArticleResponse = await articlesApi.getArticle(article.id);
    const updatedArticle =
      await apiHelpers.verifySuccessResponse<ArticleResponse>(
        getArticleResponse
      );
    expect(updatedArticle.bookIds).toContain(book.id);
  });
});
