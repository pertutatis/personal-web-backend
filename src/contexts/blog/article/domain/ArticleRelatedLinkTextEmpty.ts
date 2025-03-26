import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinkTextEmpty extends ValidationError {
  constructor() {
    super('El texto del enlace relacionado no puede estar vacío');
  }
}
