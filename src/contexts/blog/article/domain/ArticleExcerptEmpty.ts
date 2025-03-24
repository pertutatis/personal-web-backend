import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleExcerptEmpty extends DomainError {
  constructor() {
    super('Article excerpt cannot be empty');
  }

  get type(): string {
    return 'ArticleExcerptEmpty';
  }
}
