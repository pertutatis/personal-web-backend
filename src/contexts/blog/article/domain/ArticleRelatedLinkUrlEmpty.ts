import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleRelatedLinkUrlEmpty extends ValidationError {
  constructor() {
    super('La URL del enlace relacionado no puede estar vacía');
  }
}
