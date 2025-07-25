import { test, expect } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'
import { ArticleHelper } from '../helpers/article.helper'

test.describe('Article ID Validation', () => {
  // Usamos el helper para generar artículos aleatorios para cada test
  let validArticle: ReturnType<typeof ArticleHelper.generateRandomTestArticle>

  test.beforeEach(async ({ request }) => {
    // Limpiar la base de datos antes de cada prueba
    await ArticleHelper.cleanupArticles(request)

    // Generar un nuevo artículo con ID único para cada test
    validArticle = ArticleHelper.generateRandomTestArticle()
  })

  test('should create article with valid UUID v4', async ({ request }) => {
    const response = await ArticleHelper.createArticle(request, validArticle)

    expect(response.status()).toBe(201)
    expect(await response.text()).toBe('')
  })

  test('should reject invalid UUID format', async ({ request }) => {
    const invalidArticle = { ...validArticle, id: 'not-a-uuid' }
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/articles',
      {
        method: 'POST',
        data: invalidArticle,
      },
    )

    expect(response.status()).toBe(400)
    const error = await response.json()
    expect(error.type).toBe('ValidationError')
  })

  test('should reject UUID v5', async ({ request }) => {
    const invalidArticle = {
      ...validArticle,
      id: '987fcdeb-51a2-5678-9012-3456789abcde', // v5 UUID format
    }
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/articles',
      {
        method: 'POST',
        data: invalidArticle,
      },
    )

    expect(response.status()).toBe(400)
    const error = await response.json()
    expect(error.type).toBe('ValidationError')
  })

  test('should reject missing UUID', async ({ request }) => {
    const invalidArticle = { ...validArticle }
    delete (invalidArticle as any).id

    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/articles',
      {
        method: 'POST',
        data: invalidArticle,
      },
    )

    expect(response.status()).toBe(400)
    const error = await response.json()
    expect(error.type).toBe('ValidationError')
  })

  test('should reject duplicate UUID', async ({ request }) => {
    // Create first article
    await ArticleHelper.createArticle(request, validArticle)

    // Try to create another article with the same UUID
    const response = await ArticleHelper.createArticle(request, validArticle)

    expect(response.status()).toBe(409)
    const error = await response.json()
    expect(error.type).toBe('ValidationError')
  })

  test('should not return article body on successful creation', async ({
    request,
  }) => {
    const response = await ArticleHelper.createArticle(request, validArticle)

    expect(response.status()).toBe(201)
    expect(await response.text()).toBe('')
  })

  test('should accept valid UUID in update request', async ({ request }) => {
    // Create the article first
    await ArticleHelper.createArticle(request, validArticle)

    // Update the article
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/articles/${validArticle.id}`,
      {
        method: 'PUT',
        data: {
          ...validArticle,
          title: 'Updated Title',
        },
      },
    )

    expect(response.status()).toBe(204)
  })

  test('should reject invalid UUID in update request', async ({ request }) => {
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/articles/not-a-valid-uuid',
      {
        method: 'PUT',
        data: {
          ...validArticle,
          title: 'Updated Title',
        },
      },
    )

    expect(response.status()).toBe(400)
    const error = await response.json()
    expect(error.type).toBe('ValidationError')
  })
})
