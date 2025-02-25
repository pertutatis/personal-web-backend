import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { BookAuthorEmpty } from './BookAuthorEmpty';
import { BookAuthorLengthExceeded } from './BookAuthorLengthExceeded';

export class BookAuthor extends StringValueObject {
  static create(value: string): BookAuthor {
    const trimmedValue = value.trim();
    
    if (trimmedValue.length === 0) {
      throw new BookAuthorEmpty();
    }

    if (trimmedValue.length > 100) {
      throw new BookAuthorLengthExceeded();
    }

    return new BookAuthor(trimmedValue);
  }
}
