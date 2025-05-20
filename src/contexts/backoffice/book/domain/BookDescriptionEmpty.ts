import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookDescriptionEmpty extends DomainError {
  constructor() {
    super('Book description cannot be empty');
    this.name = 'BookDescriptionEmpty';
  }

  readonly type = 'ValidationError';
}
