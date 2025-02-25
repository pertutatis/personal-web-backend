import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleContentLengthExceeded extends DomainError {
  constructor() {
    super('Article content cannot exceed 10000 characters');
  }

  get type(): string {
    return 'ArticleContentLengthExceeded';
  }
}
