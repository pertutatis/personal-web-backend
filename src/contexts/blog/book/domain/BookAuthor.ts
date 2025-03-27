import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { BookAuthorEmpty } from './BookAuthorEmpty';
import { BookAuthorLengthExceeded } from './BookAuthorLengthExceeded';

export class BookAuthor extends StringValueObject {
  static readonly MAX_LENGTH = 100;

  constructor(value: string) {
    const trimmedValue = value.trim();
    BookAuthor.validateEmpty(trimmedValue);
    BookAuthor.validateLength(trimmedValue);
    super(trimmedValue);
  }

  private static validateEmpty(value: string): void {
    if (value.length === 0) {
      throw new BookAuthorEmpty();
    }
  }

  private static validateLength(value: string): void {
    if (value.length > BookAuthor.MAX_LENGTH) {
      throw new BookAuthorLengthExceeded();
    }
  }
}
