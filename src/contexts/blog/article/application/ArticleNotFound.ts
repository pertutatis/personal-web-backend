import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleNotFound extends DomainError {
  constructor(id: string) {
    super(`Article with id ${id} not found`);
  }

  get type(): string {
    return 'ArticleNotFound';
  }
}
