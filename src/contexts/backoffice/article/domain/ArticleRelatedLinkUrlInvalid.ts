import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinkUrlInvalid extends ValidationError {
  constructor(url: string = '') {
    super(
      'ArticleRelatedLinkUrlInvalid',
      `Invalid URL format: ${url}`
    );
  }
}
