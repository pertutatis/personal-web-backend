import { BookId } from '../../BookId';
import { v4 as uuidv4 } from 'uuid';

export class BookIdMother {
  static create(value: string = '550e8400-e29b-41d4-a716-446655440000'): BookId {
    return new BookId(value);
  }

  static random(): BookId {
    return new BookId(uuidv4());
  }

  static sequence(index: number): BookId {
    return new BookId(`book-${index}`);
  }

  static invalid(): BookId {
    return new BookId('invalid-id');
  }

  static empty(): BookId {
    return new BookId('');
  }

  static withDashes(): BookId {
    return new BookId('book-id-with-dashes');
  }

  static withNumbers(): BookId {
    return new BookId('book123');
  }

  static withSpecialChars(): BookId {
    return new BookId('book.id_special@chars');
  }
}
