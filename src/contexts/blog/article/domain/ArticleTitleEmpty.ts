import { DomainError } from '@/contexts/shared/domain/DomainError';

export class ArticleTitleEmpty extends DomainError {
  constructor() {
    super('Article title cannot be empty');
  }

  get type(): string {
    return 'ArticleTitleEmpty';
  }
}
