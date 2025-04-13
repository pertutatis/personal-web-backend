import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookIdDuplicated extends DomainError {
  readonly type = 'BookIdDuplicated';

  constructor(id: string) {
    super(`Book ID ${id} already exists`);
  }
}
