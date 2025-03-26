import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinkTextLengthExceeded extends ValidationError {
  constructor() {
    super('El texto del enlace relacionado no puede exceder los 100 caracteres');
  }
}
