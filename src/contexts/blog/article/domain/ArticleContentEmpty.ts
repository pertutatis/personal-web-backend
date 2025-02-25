import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleContentEmpty extends DomainError {
  constructor() {
    super('Article content cannot be empty');
  }

  get type(): string {
    return 'ArticleContentEmpty';
  }
}
