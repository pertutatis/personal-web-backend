import { ValidationError } from '@/contexts/shared/domain/ValidationError'

export class ArticleSlugLengthExceeded extends ValidationError {
  constructor() {
    super('El slug del artículo no puede exceder los 100 caracteres')
  }
}
