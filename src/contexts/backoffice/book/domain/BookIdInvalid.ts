import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookIdInvalid extends DomainError {
  readonly type = 'ValidationError';

  constructor() {
    super('Book ID must be a valid UUID v4');
  }
}
