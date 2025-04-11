import { test, expect } from '@playwright/test';
import { ArticlesApi } from '../apis/articles-api';
import { BooksApi } from '../apis/books-api';
import { ApiHelpers } from '../fixtures/api-helpers';
import { testArticles, testBooks } from '../fixtures/test-data';
import { ArticleResponse, PaginatedResponse } from '../fixtures/api-types';
import { v4 as uuidv4 } from 'uuid';

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

  test('should return 400 for article with non-existent book ids', async () => {
    const nonExistentId = 'cc8d8194-e099-4e3a-a431-000000000000'; // UUID v4 válido pero no existe
    const articleData = {
      ...testArticles.valid,
      id: uuidv4(),
      bookIds: [nonExistentId]
    };

    const response = await articlesApi.createArticle(articleData);
    const error = await apiHelpers.verifyErrorResponse(response, 400);
    expect(error.type).toBe('InvalidBookReferenceError');
    expect(error.message).toBe('One or more referenced books do not exist');
  });
});
