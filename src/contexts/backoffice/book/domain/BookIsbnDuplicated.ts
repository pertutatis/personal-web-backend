import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookIsbnDuplicated extends DomainError {
  readonly type = 'ValidationError';

  constructor(isbn: string) {
    super(`Book with ISBN ${isbn} already exists`);
  }
}
