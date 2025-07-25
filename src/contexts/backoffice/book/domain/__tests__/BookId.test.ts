import { BookId } from '../BookId'
import { BookIdInvalid } from '../BookIdInvalid'

describe('BookId', () => {
  // Valid UUID v4 format with version bits correctly set
  const validUuidV4 = '123e4567-e89b-4456-a456-426614174000'
  const invalidUuidFormat = 'not-a-uuid'
  const uuidV1Format = '123e4567-e89b-12d3-a456-426614174000' // Version 1 UUID

  test('should create a valid BookId with UUID v4', () => {
    const bookId = new BookId(validUuidV4)
    expect(bookId.value).toBe(validUuidV4)
  })

  test('should fail with invalid UUID format', () => {
    expect(() => new BookId(invalidUuidFormat)).toThrow(BookIdInvalid)
  })

  test('should fail with non-v4 UUID format', () => {
    expect(() => new BookId(uuidV1Format)).toThrow(BookIdInvalid)
  })

  test('should fail with empty UUID', () => {
    expect(() => new BookId('')).toThrow(BookIdInvalid)
  })

  test('should compare two BookIds correctly', () => {
    const id1 = new BookId(validUuidV4)
    const id2 = new BookId(validUuidV4)
    const id3 = BookId.random()

    expect(id1.equals(id2)).toBe(true)
    expect(id1.equals(id3)).toBe(false)
  })

  test('should create random UUID v4', () => {
    const id = BookId.random()
    expect(() => new BookId(id.value)).not.toThrow() // Verifies it's a valid UUID v4
  })

  test('should convert to string correctly', () => {
    const id = new BookId(validUuidV4)
    expect(id.toString()).toBe(validUuidV4)
  })

  test('should generate multiple unique random IDs', () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      const id = BookId.random()
      expect(ids.has(id.value)).toBe(false)
      ids.add(id.value)
    }
  })
})
