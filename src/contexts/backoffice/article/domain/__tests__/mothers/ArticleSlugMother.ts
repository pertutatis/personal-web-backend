import { ArticleSlug } from '../../ArticleSlug'

export class ArticleSlugMother {
  static create(
    title: string = '10 Clean Code Principles Every Developer Should Follow',
  ): ArticleSlug {
    return ArticleSlug.fromTitle(title)
  }

  static fromValidSlug(
    slug: string = '10-clean-code-principles-every-developer-should-follow',
  ): ArticleSlug {
    return new ArticleSlug(slug)
  }

  static fromSpanishTitle(): ArticleSlug {
    return ArticleSlug.fromTitle(
      'Cómo Implementar Patrones de Diseño en JavaScript',
    )
  }

  static withSpecialCharacters(): ArticleSlug {
    return ArticleSlug.fromTitle('Node.js & TypeScript: Una Guía Práctica!')
  }

  static withMultipleSpaces(): ArticleSlug {
    return ArticleSlug.fromTitle('   Clean   Code:   Principios   Básicos   ')
  }

  static tooLong(): ArticleSlug {
    return ArticleSlug.fromTitle('a'.repeat(101))
  }

  static maxLength(): ArticleSlug {
    return new ArticleSlug('a'.repeat(100))
  }

  static empty(): ArticleSlug {
    return ArticleSlug.fromTitle('')
  }

  static withSpacesOnly(): ArticleSlug {
    return ArticleSlug.fromTitle('   ')
  }

  static withInvalidCharacters(): ArticleSlug {
    return ArticleSlug.fromTitle('@#$%^&*()')
  }

  static withConsecutiveDashes(): ArticleSlug {
    return ArticleSlug.fromTitle('Clean---Code---Principles')
  }

  static withInvalidFormat(): ArticleSlug {
    return new ArticleSlug('Invalid Slug Format')
  }

  static withInvalidDashes(): ArticleSlug {
    return new ArticleSlug('-invalid-dashes-')
  }

  static random(): ArticleSlug {
    return ArticleSlug.fromTitle(
      `Random Article Title ${Math.random().toString(36).substring(7)}`,
    )
  }
}
