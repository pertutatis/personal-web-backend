import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { BookAuthorEmpty } from './BookAuthorEmpty';
import { BookAuthorLengthExceeded } from './BookAuthorLengthExceeded';

export class BookAuthor extends StringValueObject {
  static readonly MAX_LENGTH = 100;

  constructor(value: string) {
    super(value);
    this.ensureIsNotEmpty(value);
    this.ensureLengthIsNotExceeded(value);
  }

  private ensureIsNotEmpty(value: string): void {
    if (!value.trim()) {
      throw new BookAuthorEmpty();
    }
  }

  private ensureLengthIsNotExceeded(value: string): void {
    if (value.length > BookAuthor.MAX_LENGTH) {
      throw new BookAuthorLengthExceeded();
    }
  }

  static create(value: string): BookAuthor {
    return new BookAuthor(value.trim());
  }
}
