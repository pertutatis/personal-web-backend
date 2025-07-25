import { ArticleRelatedLink } from '../../ArticleRelatedLink'

export class ArticleRelatedLinkMother {
  static create(): ArticleRelatedLink {
    return ArticleRelatedLink.create('Example Link', 'https://example.com')
  }

  static withEmptyText(): string {
    return ''
  }

  static withEmptyUrl(): string {
    return ''
  }

  static withTooLongText(): string {
    return 'a'.repeat(ArticleRelatedLink.TEXT_MAX_LENGTH + 1)
  }

  static withTooLongUrl(): string {
    return `https://example.com/${'a'.repeat(ArticleRelatedLink.URL_MAX_LENGTH)}`
  }

  static withInvalidUrl(): string {
    return 'invalid-url'
  }

  static withWhitespaceOnly(): { text: string; url: string } {
    return {
      text: '   ',
      url: '   ',
    }
  }

  static withFragment(): ArticleRelatedLink {
    return ArticleRelatedLink.create(
      'Example Link',
      'https://example.com/path#section',
    )
  }

  static withPort(): ArticleRelatedLink {
    return ArticleRelatedLink.create('Example Link', 'http://localhost:3000')
  }

  static withSubdomain(): ArticleRelatedLink {
    return ArticleRelatedLink.create('Example Link', 'https://api.example.com')
  }

  static withQueryParams(): ArticleRelatedLink {
    return ArticleRelatedLink.create(
      'Example Link',
      'https://example.com?param=value',
    )
  }

  static httpOnly(): ArticleRelatedLink {
    return ArticleRelatedLink.create('Example Link', 'http://example.com')
  }

  static httpsOnly(): ArticleRelatedLink {
    return ArticleRelatedLink.create('Example Link', 'https://example.com')
  }

  static withAllParams(): ArticleRelatedLink {
    return ArticleRelatedLink.create(
      'Example Link',
      'https://api.example.com:8080/path?param=value#section',
    )
  }

  static random(): ArticleRelatedLink {
    const id = Math.random().toString(36).substring(7)
    return ArticleRelatedLink.create(
      `Random Link ${id}`,
      `https://example.com/${id}`,
    )
  }
}
