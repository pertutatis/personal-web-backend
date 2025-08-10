import { SeriesTitle } from '../SeriesTitle'
import { InvalidArgumentError } from '@/contexts/shared/domain/InvalidArgumentError'

describe('SeriesTitle', () => {
  it('should create a valid SeriesTitle', () => {
    const validTitle = 'Test Series'
    const title = new SeriesTitle(validTitle)
    expect(title.value).toBe(validTitle)
  })

  it('should throw InvalidArgumentError when title is empty', () => {
    expect(() => new SeriesTitle('')).toThrow(InvalidArgumentError)
    expect(() => new SeriesTitle('   ')).toThrow(InvalidArgumentError)
  })

  it('should throw InvalidArgumentError when title exceeds max length', () => {
    const longTitle = 'a'.repeat(101)
    expect(() => new SeriesTitle(longTitle)).toThrow(InvalidArgumentError)
  })

  it('should trim title spaces', () => {
    const titleWithSpaces = '  Test Series  '
    const title = new SeriesTitle(titleWithSpaces)
    expect(title.value).toBe('Test Series')
  })

  it('should correctly compare two equal titles', () => {
    const title1 = new SeriesTitle('Test Series')
    const title2 = new SeriesTitle('Test Series')
    expect(title1.equals(title2)).toBe(true)
  })

  it('should correctly compare two different titles', () => {
    const title1 = new SeriesTitle('Test Series 1')
    const title2 = new SeriesTitle('Test Series 2')
    expect(title1.equals(title2)).toBe(false)
  })

  it('should consider titles with different casing as different', () => {
    const title1 = new SeriesTitle('Test Series')
    const title2 = new SeriesTitle('test series')
    expect(title1.equals(title2)).toBe(false)
  })
})
