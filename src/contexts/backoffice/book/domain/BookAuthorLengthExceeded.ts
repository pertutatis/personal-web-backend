import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookAuthorLengthExceeded extends DomainError {
  constructor() {
    super('Book author cannot exceed 100 characters');
  }

  readonly type = 'ValidationError';
}
