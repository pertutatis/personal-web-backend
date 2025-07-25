import { BlogBookMother } from './mothers/BlogBookMother'
import { BlogBook } from '../BlogBook'

describe('BlogBook', () => {
  it('should create a BlogBook with all properties', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000'
    const title = 'Clean Code'
    const author = 'Robert C. Martin'
    const isbn = '9780132350884'
    const description = 'A book about writing clean code'
    const purchaseLink = 'https://example.com/clean-code'
    const createdAt = new Date('2024-01-01')
    const updatedAt = new Date('2024-01-02')

    const book = new BlogBook(
      id,
      title,
      author,
      isbn,
      description,
      purchaseLink,
      createdAt,
      updatedAt,
    )

    expect(book.id).toBe(id)
    expect(book.title).toBe(title)
    expect(book.author).toBe(author)
    expect(book.isbn).toBe(isbn)
    expect(book.description).toBe(description)
    expect(book.purchaseLink).toBe(purchaseLink)
    expect(book.createdAt).toBe(createdAt)
    expect(book.updatedAt).toBe(updatedAt)
  })

  it('should create a BlogBook with null purchaseLink', () => {
    const book = BlogBookMother.withNullPurchaseLink()

    expect(book.purchaseLink).toBeNull()
  })

  it('should be immutable', () => {
    const original = BlogBookMother.create()
    const clone = original.clone()

    expect(original).not.toBe(clone) // Different instances
    expect(original.equals(clone)).toBe(true) // Same content
    expect(original).toEqual(clone) // Deep equality
  })

  it('should compare books by ID', () => {
    const book1 = BlogBookMother.create('book-1')
    const book2 = BlogBookMother.create('book-1')
    const book3 = BlogBookMother.create('book-2')

    expect(book1.equals(book2)).toBe(true)
    expect(book1.equals(book3)).toBe(false)
  })

  it('should create multiple unique books', () => {
    const books = BlogBookMother.createMultiple(3)

    expect(books).toHaveLength(3)
    expect(books[0].id).not.toBe(books[1].id)
    expect(books[1].id).not.toBe(books[2].id)
    expect(books[0].title).toBe('Book 1')
    expect(books[1].title).toBe('Book 2')
    expect(books[2].title).toBe('Book 3')
  })
})
