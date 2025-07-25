import { ArticleContentEmpty } from '../ArticleContentEmpty'
import { ArticleContentLengthExceeded } from '../ArticleContentLengthExceeded'
import { ArticleContentMother } from './mothers/ArticleContentMother'

describe('ArticleContent', () => {
  it('should create a valid article content', () => {
    const content = ArticleContentMother.create()
    expect(content.value).toContain(
      'Clean code is not just about making the code work',
    )
  })

  it('should throw error when content is empty', () => {
    expect(() => {
      ArticleContentMother.empty()
    }).toThrow(ArticleContentEmpty)

    expect(() => {
      ArticleContentMother.withSpacesOnly()
    }).toThrow(ArticleContentEmpty)
  })

  it('should throw error when content exceeds maximum length', () => {
    expect(() => {
      ArticleContentMother.tooLong()
    }).toThrow(ArticleContentLengthExceeded)
  })

  it('should accept content with exactly maximum length', () => {
    const content = ArticleContentMother.maxLength()
    expect(content.value.length).toBe(10000)
  })

  it('should trim content', () => {
    const content = ArticleContentMother.withWhitespace()
    expect(content.value).toBe('Content with spaces')
  })
})
