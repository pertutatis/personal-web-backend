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
    const articleData = {
      ...testArticles.valid,
      bookIds: []
    };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);

    expect(createdArticle).toBeDefined();
    expect(createdArticle).toMatchObject({
      title: testArticles.valid.title,
      excerpt: testArticles.valid.excerpt,
      content: testArticles.valid.content,
      bookIds: [],
      relatedLinks: testArticles.valid.relatedLinks,
      slug: 'understanding-domain-driven-design'
    });
    expect(createdArticle.id).toBeDefined();
    expect(createdArticle.createdAt).toBeDefined();
    expect(createdArticle.updatedAt).toBeDefined();
  });

  test('should create an article with related links', async () => {
    const articleData = { ...testArticles.valid };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);

    expect(createdArticle.relatedLinks).toHaveLength(1);
    expect(createdArticle.relatedLinks[0]).toEqual({
      text: 'Learn DDD',
      url: 'https://example.com/learn-ddd'
    });
  });

  test('should generate correct slug from title with special characters', async () => {
    const articleData = { ...testArticles.specialCharactersTitle };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);
    expect(createdArticle.slug).toBe('como-implementar-ddd-en-typescript');
  });

  test('should find article by slug', async () => {
    const articleData = { ...testArticles.valid };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);

    const response = await articlesApi.getArticleBySlug(createdArticle.slug);
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response);

    expect(article).toEqual(createdArticle);
  });

  test('should update article related links', async () => {
    const articleData = { ...testArticles.valid };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);

    const newLinks = [
      { text: 'Updated Link', url: 'https://example.com/updated' }
    ];

    const updateResponse = await articlesApi.updateArticle(createdArticle.id, {
      relatedLinks: newLinks
    });
    expect(updateResponse.status()).toBe(204);
  });

  test('should validate maximum number of related links', async () => {
    const articleData = { ...testArticles.tooManyLinks };
    delete (articleData as any).id;

    const response = await articlesApi.createArticle({
      ...articleData,
      id: testArticles.valid.id
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('Cannot have more than 10 related links');
  });

  test('should validate related links format', async () => {
    const articleData = { ...testArticles.invalidLinks };
    delete (articleData as any).id;

    const response = await articlesApi.createArticle({
      ...articleData,
      id: testArticles.valid.id
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('text exceeds maximum length');
  });

  test('should validate related links URLs', async () => {
    const articleData = { ...testArticles.invalidLinkUrl };
    delete (articleData as any).id;

    const response = await articlesApi.createArticle({
      ...articleData,
      id: testArticles.valid.id
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('not a valid URL');
  });

  test('should reject duplicate URLs in related links', async () => {
    const articleData = { ...testArticles.duplicateLinks };
    delete (articleData as any).id;

    const response = await articlesApi.createArticle({
      ...articleData,
      id: testArticles.valid.id
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('Duplicate URLs are not allowed');
  });

  test('should update slug when title changes', async () => {
    const articleData = { ...testArticles.valid };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);

    const updateResponse = await articlesApi.updateArticle(createdArticle.id, {
      title: 'Updated Title'
    });
    expect(updateResponse.status()).toBe(204);

    const getResponse = await articlesApi.getArticle(createdArticle.id);
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(getResponse);
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

    const articles = await Promise.all(
      concurrentArticles.map(article => apiHelpers.createTestArticle(article))
    );

    for (const article of articles) {
      expect(article.id).toBeDefined();
      expect(article.slug).toBeDefined();
    }
  });

  test('should create an article with referenced books', async () => {
    const book = await apiHelpers.createTestBook(testBooks.valid);

    const articleData = {
      ...testArticles.valid,
      bookIds: [book.id]
    };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);
    expect(createdArticle.bookIds).toContain(book.id);
  });

  test('should return 400 for article with non-existent book ids', async () => {
    const articleData = { ...testArticles.invalidBookIds };
    delete (articleData as any).id;

    const response = await articlesApi.createArticle({
      ...articleData,
      id: testArticles.valid.id
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('book');
  });

  test('should get an article by id', async () => {
    const articleData = {
      ...testArticles.valid,
      bookIds: []
    };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);

    const response = await articlesApi.getArticle(createdArticle.id);
    const article = await apiHelpers.verifySuccessResponse<ArticleResponse>(response);

    expect(article).toEqual(createdArticle);
  });

  test('should return 404 for non-existent article', async () => {
    const response = await articlesApi.getArticle('cc8d8194-e099-4e3a-a431-000000000000');
    await apiHelpers.verifyErrorResponse(response, 404);
  });

  test('should update an article', async () => {
    const articleData = {
      ...testArticles.valid,
      bookIds: []
    };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);

    const updateData = {
      title: 'Updated Article Title',
      excerpt: 'Updated article excerpt',
      content: 'Updated article content',
    };

    const updateResponse = await articlesApi.updateArticle(createdArticle.id, updateData);
    expect(updateResponse.status()).toBe(204);

    const getResponse = await articlesApi.getArticle(createdArticle.id);
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(getResponse);

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
    const articleData = {
      ...testArticles.valid,
      bookIds: []
    };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);
    const book = await apiHelpers.createTestBook(testBooks.valid);

    const updateResponse = await articlesApi.updateArticle(createdArticle.id, {
      bookIds: [book.id]
    });
    expect(updateResponse.status()).toBe(204);

    const getResponse = await articlesApi.getArticle(createdArticle.id);
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(getResponse);

    expect(updatedArticle.bookIds).toContain(book.id);
  });

  test('should delete an article', async () => {
    const articleData = {
      ...testArticles.valid,
      bookIds: []
    };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);

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
      delete (article as any).id;
      await apiHelpers.createTestArticle(article);
    }

    const response = await articlesApi.listArticles({ page: 1, limit: 1 });
    const result = await apiHelpers.verifySuccessResponse<PaginatedResponse<ArticleResponse>>(response);

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

    const createdArticle = await apiHelpers.createTestArticle(maxLengthArticle);
    expect(createdArticle.content).toHaveLength(10000);
  });

  test('should handle article with content exceeding maximum length', async () => {
    const oversizedArticle = {
      title: 'Oversized Article',
      excerpt: 'Test excerpt',
      content: 'A'.repeat(10001),
      bookIds: [] as string[],
      relatedLinks: [] as Array<{ text: string; url: string }>,
    };

    const response = await articlesApi.createArticle({
      ...oversizedArticle,
      id: testArticles.valid.id
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.message).toContain('content');
  });

  test('should handle article with maximum excerpt length', async () => {
    const articleData = { ...testArticles.maxLengthExcerpt };
    delete (articleData as any).id;

    const createdArticle = await apiHelpers.createTestArticle(articleData);
    expect(createdArticle.excerpt).toHaveLength(160);
  });

  test('should return 400 for article with excerpt exceeding maximum length', async () => {
    const articleData = { ...testArticles.invalidExcerpt };
    delete (articleData as any).id;

    const response = await articlesApi.createArticle({
      ...articleData,
      id: testArticles.valid.id
    });
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
    const updatedArticle = await apiHelpers.verifySuccessResponse<ArticleResponse>(getArticleResponse);
    expect(updatedArticle.bookIds).toContain(book.id);
  });
});
