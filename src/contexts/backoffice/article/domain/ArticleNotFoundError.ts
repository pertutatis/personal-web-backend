import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleNotFoundError extends DomainError {
  readonly type = 'ArticleNotFoundError';

  constructor() {
    super('Article not found');
  }
}
