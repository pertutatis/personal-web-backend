import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookAuthorEmpty extends DomainError {
  constructor() {
    super('Book author cannot be empty');
  }

  get type(): string {
    return 'BookAuthorEmpty';
  }
}
