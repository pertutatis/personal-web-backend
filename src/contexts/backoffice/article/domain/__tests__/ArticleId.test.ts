import { ArticleId } from '../ArticleId'
import { ArticleIdMother } from './mothers/ArticleIdMother'

describe('ArticleId', () => {
  describe('creation', () => {
    it('should create with valid UUID v4', () => {
      const validUUID = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a'
      const id = new ArticleId(validUUID)
      expect(id.value).toBe(validUUID)
    })

    it('should throw error on invalid UUID format', () => {
      const invalidUUIDs = [
        'invalid-uuid',
        '123e4567-e89b-12d3-a456-426614174000', // UUID v1
        'invalid-uuid-format',
        '',
        '123456789',
        'cc8d8194-e099-5e3a-a431-6b4412dc5f6a', // UUID v5
      ]

      invalidUUIDs.forEach((invalidUUID) => {
        expect(() => new ArticleId(invalidUUID)).toThrow(
          'Invalid UUID v4 format',
        )
      })
    })

    it('should throw error on empty UUID', () => {
      expect(() => new ArticleId('')).toThrow('Invalid UUID v4 format')
    })
  })

  describe('value object behavior', () => {
    it('should be immutable', () => {
      const id = new ArticleId('cc8d8194-e099-4e3a-a431-6b4412dc5f6a')
      expect(() => {
        ;(id as any).value = 'changed'
      }).toThrow()
    })

    it('should implement equals correctly', () => {
      const uuid1 = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a'
      const uuid2 = 'dd7d8194-e099-4e3a-a431-6b4412dc5f6b'

      const id1 = new ArticleId(uuid1)
      const id2 = new ArticleId(uuid1)
      const id3 = new ArticleId(uuid2)
      const nullValue = null
      const nonId = { value: uuid1 }

      expect(id1.equals(id2)).toBe(true)
      expect(id1.equals(id3)).toBe(false)
      expect(id1.equals(nullValue)).toBe(false)
      expect(id1.equals(nonId)).toBe(false)
    })

    it('should convert to string correctly', () => {
      const uuid = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a'
      const id = new ArticleId(uuid)
      expect(id.toString()).toBe(uuid)
    })

    it('should convert to JSON correctly', () => {
      const uuid = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a'
      const id = new ArticleId(uuid)
      expect(id.toJSON()).toBe(uuid)
    })
  })

  describe('collection usage', () => {
    it('should work as object key', () => {
      const uuid1 = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a'
      const uuid2 = 'dd7d8194-e099-4e3a-a431-6b4412dc5f6b'
      const id1 = new ArticleId(uuid1)
      const id2 = new ArticleId(uuid2)

      const map = new Map<ArticleId, string>()
      map.set(id1, 'value1')
      map.set(id2, 'value2')

      expect(map.get(id1)).toBe('value1')
      expect(map.get(id2)).toBe('value2')
    })

    it('should handle Set equality based on value equality', () => {
      const uuid = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a'
      const id1 = new ArticleId(uuid)
      const id2 = new ArticleId(uuid)
      const id3 = new ArticleId('dd7d8194-e099-4e3a-a431-6b4412dc5f6b')

      const uniqueIds = new Map<string, ArticleId>()

      uniqueIds.set(id1.value, id1)
      uniqueIds.set(id2.value, id2)
      uniqueIds.set(id3.value, id3)

      expect(uniqueIds.size).toBe(2)
      expect(uniqueIds.has(id1.value)).toBe(true)
      expect(uniqueIds.has(id3.value)).toBe(true)
    })
  })
})
