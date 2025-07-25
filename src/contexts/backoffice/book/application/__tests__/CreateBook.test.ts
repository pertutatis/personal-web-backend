import { CreateBook } from '../CreateBook'
import { BookRepository } from '../../domain/BookRepository'
import { Book } from '../../domain/Book'
import { BookId } from '../../domain/BookId'
import { BookIdDuplicated } from '../../domain/BookIdDuplicated'
import { BookIdInvalid } from '../../domain/BookIdInvalid'

describe('CreateBook', () => {
  let repository: jest.Mocked<BookRepository>
  let createBook: CreateBook
  const validUuidV4 = '123e4567-e89b-4456-a456-426614174000'

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      exists: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      searchByIds: jest.fn(),
      searchByIsbn: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    createBook = new CreateBook(repository)
  })

  it('should create a book with client-provided UUID', async () => {
    const request = {
      id: validUuidV4,
      title: 'Test Book',
      author: 'Test Author',
      isbn: '9780141036144',
      description: 'Test Description',
      purchaseLink: 'https://example.com/book',
    }

    await createBook.run(request)

    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(BookId),
        title: expect.objectContaining({ value: request.title }),
        author: expect.objectContaining({ value: request.author }),
        isbn: expect.objectContaining({ value: request.isbn }),
        description: expect.objectContaining({ value: request.description }),
        purchaseLink: expect.objectContaining({ value: request.purchaseLink }),
      }),
    )
  })

  it('should create a book without optional fields', async () => {
    const request = {
      id: validUuidV4,
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
    }

    await createBook.run(request)

    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(BookId),
        title: expect.objectContaining({ value: request.title }),
        author: expect.objectContaining({ value: request.author }),
        isbn: expect.objectContaining({ value: '0000000000000' }),
        description: expect.objectContaining({ value: request.description }),
        purchaseLink: expect.objectContaining({ value: null }),
      }),
    )
  })

  it('should fail when trying to create a book with invalid UUID format', async () => {
    const request = {
      id: 'invalid-uuid',
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
    }

    await expect(createBook.run(request)).rejects.toThrow(BookIdInvalid)
    expect(repository.save).not.toHaveBeenCalled()
  })

  it('should fail when trying to create a book with non-v4 UUID', async () => {
    const request = {
      id: '123e4567-e89b-12d3-a456-426614174000', // v1 UUID
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
    }

    await expect(createBook.run(request)).rejects.toThrow(BookIdInvalid)
    expect(repository.save).not.toHaveBeenCalled()
  })

  it('should fail when trying to create a book with duplicate ID', async () => {
    const request = {
      id: validUuidV4,
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
    }

    repository.save.mockRejectedValueOnce(new BookIdDuplicated(request.id))

    await expect(createBook.run(request)).rejects.toThrow(BookIdDuplicated)
  })

  it('should allow null purchase link', async () => {
    const request = {
      id: validUuidV4,
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      purchaseLink: null,
    }

    await createBook.run(request)

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        purchaseLink: expect.objectContaining({ value: null }),
      }),
    )
  })
})
