import { SeriesId } from '../SeriesId'
import { InvalidArgumentError } from '@/contexts/shared/domain/InvalidArgumentError'

describe('SeriesId', () => {
  it('should create a valid SeriesId with UUID format', () => {
    const validUuid = '1b4a4e4d-a2f2-4e4b-b8b3-3d3c4d5e6f7a'
    const id = new SeriesId(validUuid)
    expect(id.value).toBe(validUuid)
  })

  it('should throw InvalidArgumentError when creating with invalid UUID', () => {
    const invalidUuid = 'invalid-uuid'
    expect(() => new SeriesId(invalidUuid)).toThrow(InvalidArgumentError)
  })

  it('should create a valid random SeriesId', () => {
    const id = SeriesId.random()
    expect(id).toBeInstanceOf(SeriesId)
    // UUID v4 format regex
    expect(id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
  })

  it('should correctly compare two equal SeriesIds', () => {
    const uuid = '1b4a4e4d-a2f2-4e4b-b8b3-3d3c4d5e6f7a'
    const id1 = new SeriesId(uuid)
    const id2 = new SeriesId(uuid)
    expect(id1.equals(id2)).toBe(true)
  })

  it('should correctly compare two different SeriesIds', () => {
    const id1 = SeriesId.random()
    const id2 = SeriesId.random()
    expect(id1.equals(id2)).toBe(false)
  })
})
