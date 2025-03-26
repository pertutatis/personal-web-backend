import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinkUrlInvalid extends ValidationError {
  constructor() {
    super('La URL del enlace relacionado no es válida');
  }
}
