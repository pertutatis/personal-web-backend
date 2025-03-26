import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinkUrlLengthExceeded extends ValidationError {
  constructor() {
    super('La URL del enlace relacionado no puede exceder los 2000 caracteres');
  }
}
