import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { BookTitleEmpty } from './BookTitleEmpty';
import { BookTitleLengthExceeded } from './BookTitleLengthExceeded';

export class BookTitle extends StringValueObject {
  static create(value: string): BookTitle {
    const trimmedValue = value.trim();
    
    if (trimmedValue.length === 0) {
      throw new BookTitleEmpty();
    }

    if (trimmedValue.length > 150) {
      throw new BookTitleLengthExceeded();
    }

    return new BookTitle(trimmedValue);
  }
}
