import { DomainError } from '@/contexts/shared/domain/DomainError';

export class InvalidBookIsbn extends DomainError {
  constructor() {
    super('Book ISBN must be a valid ISBN-10 or ISBN-13');
  }

  get type(): string {
    return 'InvalidBookIsbn';
  }
}
