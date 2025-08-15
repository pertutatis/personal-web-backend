import { SeriesDescription } from '../SeriesDescription'
import { InvalidArgumentError } from '@/contexts/shared/domain/InvalidArgumentError'

describe('SeriesDescription', () => {
  it('should create a valid SeriesDescription', () => {
    const validDescription = 'This is a test description'
    const description = new SeriesDescription(validDescription)
    expect(description.value).toBe(validDescription)
  })

  it('should throw InvalidArgumentError when description is empty', () => {
    expect(() => new SeriesDescription('')).toThrow(InvalidArgumentError)
    expect(() => new SeriesDescription('   ')).toThrow(InvalidArgumentError)
  })

  it('should throw InvalidArgumentError when description exceeds max length', () => {
    const longDescription = 'a'.repeat(1001)
    expect(() => new SeriesDescription(longDescription)).toThrow(
      InvalidArgumentError,
    )
  })

  it('should trim description spaces', () => {
    const descriptionWithSpaces = '  Test Description  '
    const description = new SeriesDescription(descriptionWithSpaces)
    expect(description.value).toBe('Test Description')
  })

  it('should correctly compare two equal descriptions', () => {
    const description1 = new SeriesDescription('Test Description')
    const description2 = new SeriesDescription('Test Description')
    expect(description1.equals(description2)).toBe(true)
  })

  it('should correctly compare two different descriptions', () => {
    const description1 = new SeriesDescription('Test Description 1')
    const description2 = new SeriesDescription('Test Description 2')
    expect(description1.equals(description2)).toBe(false)
  })

  it('should preserve newlines in description', () => {
    const multilineDescription = 'Line 1\nLine 2\nLine 3'
    const description = new SeriesDescription(multilineDescription)
    expect(description.value).toBe(multilineDescription)
  })

  it('should allow special characters in description', () => {
    const specialCharsDescription =
      '¡Special characters & symbols are allowed! (✓)'
    const description = new SeriesDescription(specialCharsDescription)
    expect(description.value).toBe(specialCharsDescription)
  })
})
