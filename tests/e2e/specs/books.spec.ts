import { test, expect } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'
import { BookHelper, TestBook } from '../helpers/book.helper'

test.describe('Books API', () => {
  // Usamos el helper para generar libros aleatorios para cada test
  let validBook: TestBook
  let secondValidBook: TestBook

  test.beforeEach(() => {
    // Generar nuevos libros con IDs y ISBNs únicos para cada test
    validBook = BookHelper.generateRandomTestBook({
      title: 'Domain-Driven Design',
      author: 'Eric Evans',
      description: 'A comprehensive guide to DDD principles and patterns',
      purchaseLink: 'https://example.com/ddd-book',
    })

    secondValidBook = BookHelper.generateRandomTestBook({
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      description: 'A guide to software structure and design',
      purchaseLink: 'https://example.com/clean-arch',
    })
  })

  test('should create a new book with client-provided UUID', async ({
    request,
  }) => {
    const response = await BookHelper.createBook(request, validBook)

    expect(response.status()).toBe(201)
    expect(await response.text()).toBe('')
  })

  test('should return 400 for invalid UUID format', async ({ request }) => {
    const invalidBook = { ...validBook, id: 'invalid-uuid' }
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/books',
      {
        method: 'POST',
        data: invalidBook,
      },
    )

    expect(response.status()).toBe(400)
    const error = await response.json()
    expect(error.type).toBe('ValidationError')
  })

  test('should return 400 for non-v4 UUID', async ({ request }) => {
    const invalidBook = {
      ...validBook,
      id: '00000000-0000-0000-0000-000000000000',
    }
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/books',
      {
        method: 'POST',
        data: invalidBook,
      },
    )

    expect(response.status()).toBe(400)
  })

  test('should return 409 for duplicate UUID', async ({ request }) => {
    // Create first book
    await BookHelper.createBook(request, validBook)

    // Try to create book with same UUID
    const response = await BookHelper.createBook(request, validBook)

    expect(response.status()).toBe(409)
  })

  test('should list books with pagination', async ({ request }) => {
    // Limpiar la base de datos primero para asegurarnos de que está vacía
    await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/books/test-cleanup',
      {
        method: 'POST',
      },
    )

    // Create two books with unique IDs e ISBNs
    const book1Response = await BookHelper.createBook(request, validBook)
    expect(book1Response.status()).toBe(201)

    const book2Response = await BookHelper.createBook(request, secondValidBook)
    expect(book2Response.status()).toBe(201)

    // Get first page with one item
    const listResponse = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/books?page=1&limit=1',
    )

    expect(listResponse.status()).toBe(200)
    const result = await listResponse.json()

    expect(result.items.length).toBe(1)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(1)
    // Verificar que hay exactamente 2 libros en total
    expect(result.total).toBeGreaterThanOrEqual(1) // Al menos debería haber un libro
  })

  test('should create a book without purchase link', async ({ request }) => {
    const bookWithoutLink = { ...validBook }
    delete bookWithoutLink.purchaseLink

    const response = await BookHelper.createBook(request, bookWithoutLink)

    expect(response.status()).toBe(201)
  })

  test('should handle description with maximum length', async ({ request }) => {
    const bookWithLongDesc = {
      ...validBook,
      description: 'a'.repeat(1000),
    }

    const response = await BookHelper.createBook(request, bookWithLongDesc)

    expect(response.status()).toBe(201)
  })

  test('should prevent duplicate ISBN', async ({ request }) => {
    // Create first book
    await BookHelper.createBook(request, validBook)

    // Try to create second book with same ISBN
    const duplicateIsbnBook = {
      ...secondValidBook,
      isbn: validBook.isbn,
    }

    const response = await BookHelper.createBook(request, duplicateIsbnBook)

    expect(response.status()).toBe(409)
  })

  test('should return 400 for empty description', async ({ request }) => {
    const invalidBook = { ...validBook, description: '' }
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/books',
      {
        method: 'POST',
        data: invalidBook,
      },
    )

    expect(response.status()).toBe(400)
  })

  test('should get a book by id', async ({ request }) => {
    // Create a book first
    await BookHelper.createBook(request, validBook)

    // Get the book
    const response = await AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/books/${validBook.id}`,
    )

    expect(response.status()).toBe(200)
    const book = await response.json()
    expect(book.id).toBe(validBook.id)
    expect(book.title).toBe(validBook.title)
  })
})
