import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleBookIdsEmpty extends DomainError {
  constructor() {
    super('Article must have at least one related book');
  }

  get type(): string {
    return 'ArticleBookIdsEmpty';
  }
}
