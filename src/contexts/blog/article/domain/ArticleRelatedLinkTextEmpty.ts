import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinkTextEmpty extends ValidationError {
  constructor() {
    super('Link text cannot be empty');
  }
}
