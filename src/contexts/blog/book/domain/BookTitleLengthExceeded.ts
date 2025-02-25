import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookTitleLengthExceeded extends DomainError {
  constructor() {
    super('Book title cannot exceed 150 characters');
  }

  get type(): string {
    return 'BookTitleLengthExceeded';
  }
}
