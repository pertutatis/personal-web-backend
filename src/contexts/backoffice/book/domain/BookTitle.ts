import { StringValueObject } from '@/contexts/shared/domain/StringValueObject'
import { BookTitleEmpty } from './BookTitleEmpty'
import { BookTitleLengthExceeded } from './BookTitleLengthExceeded'

export class BookTitle extends StringValueObject {
  static readonly MAX_LENGTH = 255

  constructor(value: string) {
    const trimmedValue = value.trim()
    BookTitle.validateEmpty(trimmedValue)
    BookTitle.validateLength(trimmedValue)
    super(trimmedValue)
  }

  private static validateEmpty(value: string): void {
    if (value.length === 0) {
      throw new BookTitleEmpty()
    }
  }

  private static validateLength(value: string): void {
    if (value.length > BookTitle.MAX_LENGTH) {
      throw new BookTitleLengthExceeded()
    }
  }
}
