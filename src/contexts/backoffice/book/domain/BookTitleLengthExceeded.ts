import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookTitleLengthExceeded extends DomainError {
  readonly type = 'BookTitleLengthExceeded';

  constructor() {
    super('Book title cannot exceed 255 characters');
  }
}
