import { NotFoundError } from '@/contexts/shared/domain/NotFoundError';
import { ArticleId } from '../domain/ArticleId';

export class ArticleNotFound extends NotFoundError {
  readonly type = 'NotFoundError';

  constructor(id: ArticleId) {
    super(`Article with id ${id.value} not found`);
  }
}
