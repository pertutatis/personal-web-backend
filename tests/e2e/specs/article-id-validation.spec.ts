import { test, expect } from '@playwright/test';
import { ArticlesApi } from '../apis/articles-api';
import { ApiHelpers } from '../fixtures/api-helpers';
import { testArticles } from '../fixtures/test-data';
import { ArticleResponse } from '../fixtures/api-types';

test.describe('Article ID Validation', () => {
  let articlesApi: ArticlesApi;
  let apiHelpers: ApiHelpers;

  test.beforeEach(async ({ request }) => {
    articlesApi = new ArticlesApi(request);
    apiHelpers = ApiHelpers.create(request);
  });

  test.afterEach(async () => {
    await apiHelpers.cleanupTestData();
  });

  test('should create article with valid UUID v4', async () => {
    const response = await articlesApi.createArticle(testArticles.valid);
    
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('');
  });

  test('should reject invalid UUID format', async () => {
    const response = await articlesApi.createArticle(testArticles.invalidUuidFormat);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    
    expect(error.message).toBe('id must be a valid UUID v4');
  });

  test('should reject UUID v5', async () => {
    const response = await articlesApi.createArticle(testArticles.invalidUuidVersion);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    
    expect(error.message).toBe('id must be a valid UUID v4');
  });

  test('should reject missing UUID', async () => {
    // Use raw request to bypass TypeScript validation
    const response = await apiHelpers['request'].post('/api/backoffice/articles', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      data: testArticles.missingId
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    
    expect(error.message).toBe('id cannot be empty');
  });

  test('should reject duplicate UUID', async () => {
    // First creation should succeed
    const firstResponse = await articlesApi.createArticle(testArticles.valid);
    expect(firstResponse.status()).toBe(201);

    // Second creation with same ID should fail
    const secondResponse = await articlesApi.createArticle(testArticles.valid);
    const error = await apiHelpers.verifyErrorResponse(secondResponse, 409);
    
    expect(error.message).toContain('already exists');
  });

  test('should not return article body on successful creation', async () => {
    const response = await articlesApi.createArticle(testArticles.valid);
    
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('');
  });

  test('should accept valid UUID in update request', async () => {
    // Create article first
    await articlesApi.createArticle(testArticles.valid);

    // Update should succeed and return 204
    const updateResponse = await articlesApi.updateArticle(testArticles.valid.id, {
      title: 'Updated Title'
    });
    
    expect(updateResponse.status()).toBe(204);
    expect(await updateResponse.text()).toBe('');
  });

  test('should reject invalid UUID in update request', async () => {
    const response = await articlesApi.updateArticle('invalid-uuid', {
      title: 'Updated Title'
    });
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    
    expect(error.message).toBe('Article ID must be a valid UUID v4');
  });
});
