import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinkUrlEmpty extends ValidationError {
  constructor() {
    super('Link URL cannot be empty');
  }
}
