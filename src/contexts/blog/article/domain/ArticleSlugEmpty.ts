import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleSlugEmpty extends ValidationError {
  constructor() {
    super('El slug del artículo no puede estar vacío');
  }
}
