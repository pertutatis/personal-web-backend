import { DomainError } from '@/contexts/shared/domain/DomainError';

export class InvalidBookIsbn extends DomainError {
  readonly type = 'InvalidBookIsbn';

  constructor() {
    super('Book ISBN must be a valid ISBN-10 or ISBN-13');
  }
}
