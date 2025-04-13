import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleTitleLengthExceeded extends DomainError {
  constructor() {
    super('Article title cannot exceed 150 characters');
  }

  get type(): string {
    return 'ArticleTitleLengthExceeded';
  }
}
