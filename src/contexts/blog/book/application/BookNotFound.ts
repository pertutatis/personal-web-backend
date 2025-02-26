import { DomainError } from '@/contexts/shared/domain/DomainError';
import { BookId } from '../domain/BookId';

export class BookNotFound extends DomainError {
  readonly type = 'BookNotFound';

  constructor(id: BookId) {
    super(`Book with id ${id.value} not found`);
  }
}
