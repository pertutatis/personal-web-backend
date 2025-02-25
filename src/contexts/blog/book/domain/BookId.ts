import { Identifier } from '@/contexts/shared/domain/Identifier';

export class BookId extends Identifier {
  static create(value: string): BookId {
    return new BookId(value);
  }
}
