import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinksDuplicated extends ValidationError {
  constructor(duplicatedUrl: string) {
    super(`Ya existe un enlace con la URL: ${duplicatedUrl}`);
  }
}
