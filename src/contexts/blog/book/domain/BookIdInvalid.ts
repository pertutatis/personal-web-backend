import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookIdInvalid extends DomainError {
  readonly type = 'BookIdInvalid';

  constructor() {
    super('Book ID must be a valid UUID v4');
  }
}
