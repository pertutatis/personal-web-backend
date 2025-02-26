import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { BookTitleEmpty } from './BookTitleEmpty';
import { BookTitleLengthExceeded } from './BookTitleLengthExceeded';

export class BookTitle extends StringValueObject {
  constructor(value: string) {
    const trimmed = value.trim();
    
    if (trimmed.length === 0) {
      throw new BookTitleEmpty();
    }
    
    if (trimmed.length > 255) {
      throw new BookTitleLengthExceeded();
    }
    
    super(trimmed);
  }

  static create(value: string): BookTitle {
    return new BookTitle(value);
  }

  toString(): string {
    return this.value;
  }
}
