import { DomainError } from '@/contexts/shared/domain/DomainError';
import { ArticleId } from '../domain/ArticleId';

export class ArticleNotFound extends DomainError {
  readonly type = 'ArticleNotFound';

  constructor(id: ArticleId) {
    super(`Article with id ${id.value} not found`);
  }
}
