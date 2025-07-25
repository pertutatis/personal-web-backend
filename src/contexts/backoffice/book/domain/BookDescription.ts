import { StringValueObject } from '@/contexts/shared/domain/StringValueObject'
import { BookDescriptionEmpty } from './BookDescriptionEmpty'
import { BookDescriptionLengthExceeded } from './BookDescriptionLengthExceeded'

export class BookDescription extends StringValueObject {
  static readonly MAX_LENGTH = 1000

  constructor(value: string) {
    const trimmedValue = value.trim()
    BookDescription.validateEmpty(trimmedValue)
    BookDescription.validateLength(trimmedValue)
    super(trimmedValue)
  }

  private static validateEmpty(value: string): void {
    if (value.length === 0) {
      throw new BookDescriptionEmpty()
    }
  }

  private static validateLength(value: string): void {
    if (value.length > BookDescription.MAX_LENGTH) {
      throw new BookDescriptionLengthExceeded(value.length)
    }
  }
}
