import { ArticleExcerpt } from '../../ArticleExcerpt'

export class ArticleExcerptMother {
  static create(
    value: string = 'This is a valid article excerpt',
  ): ArticleExcerpt {
    return new ArticleExcerpt(value)
  }

  static random(): ArticleExcerpt {
    return new ArticleExcerpt('Random excerpt ' + Math.random())
  }

  static withMaxLength(): ArticleExcerpt {
    return new ArticleExcerpt('a'.repeat(300))
  }

  static withHtml(): ArticleExcerpt {
    return new ArticleExcerpt('<p>Invalid excerpt with HTML</p>')
  }

  static empty(): ArticleExcerpt {
    return new ArticleExcerpt('')
  }

  static withSpacesOnly(): ArticleExcerpt {
    return new ArticleExcerpt('   ')
  }

  static tooLong(): ArticleExcerpt {
    return new ArticleExcerpt('a'.repeat(301))
  }

  static valid(): ArticleExcerpt {
    return this.create()
  }

  static fromValue(value: string): ArticleExcerpt {
    return new ArticleExcerpt(value)
  }
}
