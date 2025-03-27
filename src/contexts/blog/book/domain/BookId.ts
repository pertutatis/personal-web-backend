import { Identifier } from '@/contexts/shared/domain/Identifier';

export class BookId extends Identifier {
  constructor(value: string) {
    super(value);
  }
}
