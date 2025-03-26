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

  // ... (keep existing tests)

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

  // ... (keep other existing tests)
});
