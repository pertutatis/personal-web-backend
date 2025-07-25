import { BookDescription } from '../../BookDescription'

export class BookDescriptionMother {
  static create(value: string = 'A test book description'): BookDescription {
    return new BookDescription(value)
  }

  static random(): BookDescription {
    const randomText = `Book description ${Math.random().toString(36).substring(7)}`
    return new BookDescription(randomText)
  }

  static tooLong(): BookDescription {
    return new BookDescription('a'.repeat(1001))
  }

  static empty(): BookDescription {
    return new BookDescription('')
  }

  static withMultipleLines(): BookDescription {
    return new BookDescription('Line 1\nLine 2\nLine 3')
  }

  static atMaxLength(): BookDescription {
    return new BookDescription('a'.repeat(1000))
  }

  static withWhitespace(): BookDescription {
    return new BookDescription('  Description with spaces  ')
  }
}
