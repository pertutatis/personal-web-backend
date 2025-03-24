import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { BookDescriptionEmpty } from './BookDescriptionEmpty';
import { BookDescriptionLengthExceeded } from './BookDescriptionLengthExceeded';

export class BookDescription extends StringValueObject {
  static readonly MAX_LENGTH = 1000;

  constructor(value: string) {
    const trimmedValue = value.trim();
    super(trimmedValue);
    this.ensureValidBookDescription(trimmedValue);
  }

  private ensureValidBookDescription(value: string): void {
    if (value.length === 0) {
      throw new BookDescriptionEmpty();
    }

    if (value.length > BookDescription.MAX_LENGTH) {
      throw new BookDescriptionLengthExceeded(value.length);
    }
  }

  static create(value: string): BookDescription {
    return new BookDescription(value);
  }
}
