import { test, expect } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'
import { ArticleHelper, TestArticle } from '../helpers/article.helper'

test.describe('Articles API', () => {
  // Usamos el helper para generar artículos aleatorios para cada test
  let validArticle: TestArticle;
  
  test.beforeEach(async ({ request }) => {
    // Limpiar la base de datos antes de cada prueba
    await ArticleHelper.cleanupArticles(request);
    
    // Generar un nuevo artículo con ID único para cada test
    validArticle = ArticleHelper.generateRandomTestArticle();
  })

  test('should return 400 for article with non-existent book ids', async ({ request }) => {
    const articleWithNonExistentBook = {
      ...validArticle,
      bookIds: ['123e4567-e89b-12d3-a456-999999999999']
    }

    const response = await AuthHelper.makeAuthenticatedRequest(request, '/api/backoffice/articles', {
      method: 'POST',
      data: articleWithNonExistentBook
    })

    expect(response.status()).toBe(400)
    const error = await response.json()
    expect(error.type).toBe('ValidationError')
  })

  test('should create article with valid data', async ({ request }) => {
    const response = await ArticleHelper.createArticle(request, validArticle)

    expect(response.status()).toBe(201)
    expect(await response.text()).toBe('')
  })

  test('should list articles with pagination', async ({ request }) => {
    // Create an article first
    await ArticleHelper.createArticle(request, validArticle)

    // Get first page
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/articles?page=1&limit=10'
    )

    expect(response.status()).toBe(200)
    const result = await response.json()
    
    expect(result.items.length).toBeGreaterThan(0)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(10)
    expect(result.total).toBeGreaterThan(0)

    const article = result.items[0]
    expect(article.id).toBeDefined()
    expect(article.title).toBeDefined()
    expect(article.content).toBeDefined()
    expect(article.excerpt).toBeDefined()
    expect(Array.isArray(article.bookIds)).toBe(true)
    expect(Array.isArray(article.relatedLinks)).toBe(true)
  })

  test('should return 400 for invalid article data', async ({ request }) => {
    const invalidArticle = {
      ...validArticle,
      title: '' // Title cannot be empty
    }

    const response = await AuthHelper.makeAuthenticatedRequest(request, '/api/backoffice/articles', {
      method: 'POST',
      data: invalidArticle
    })

    expect(response.status()).toBe(400)
    const error = await response.json()
    expect(error.type).toBe('ValidationError')
  })

  test('should get article by id', async ({ request }) => {
    // Create an article first
    await ArticleHelper.createArticle(request, validArticle)

    // Get the article
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/articles/${validArticle.id}`
    )

    expect(response.status()).toBe(200)
    const article = await response.json()
    expect(article.id).toBe(validArticle.id)
    expect(article.title).toBe(validArticle.title)
  })

  test('should return 404 for non-existent article', async ({ request }) => {
    // Usando un UUID v4 real que no debería existir en la base de datos
    const nonExistentId = '123e4567-e89b-4000-a000-111111111111'; // UUIDv4 formato válido
    
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/articles/${nonExistentId}`
    )
    
    expect(response.status()).toBe(404)
    const error = await response.json()
    expect(error.type).toBe('NotFoundError')
  })

  test('should update article', async ({ request }) => {
    // Create an article first
    await ArticleHelper.createArticle(request, validArticle)

    // Update the article
    const updatedData = {
      ...validArticle,
      title: 'Updated Title'
    }

    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/articles/${validArticle.id}`,
      {
        method: 'PUT',
        data: updatedData
      }
    )

    expect(response.status()).toBe(204)

    // Verify the update
    const getResponse = await AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/articles/${validArticle.id}`
    )
    const article = await getResponse.json()
    expect(article.title).toBe('Updated Title')
  })
})
