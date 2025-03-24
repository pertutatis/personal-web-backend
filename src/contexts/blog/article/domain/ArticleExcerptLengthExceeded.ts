import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleExcerptLengthExceeded extends DomainError {
  constructor() {
    super('Article excerpt cannot exceed 300 characters');
  }

  get type(): string {
    return 'ArticleExcerptLengthExceeded';
  }
}
