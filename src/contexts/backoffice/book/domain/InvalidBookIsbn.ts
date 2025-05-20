import { DomainError } from '@/contexts/shared/domain/DomainError';

export class InvalidBookIsbn extends DomainError {
  readonly type = 'ValidationError';

  constructor() {
    super('Book ISBN must be a valid ISBN-10 or ISBN-13');
  }
}
