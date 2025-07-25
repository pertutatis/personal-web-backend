import { ValidationError } from '@/contexts/shared/domain/ValidationError'

export class ArticleSlugInvalid extends ValidationError {
  constructor() {
    super('El slug solo puede contener letras minúsculas, números y guiones')
  }
}
