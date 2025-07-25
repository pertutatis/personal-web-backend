import { ValidationError } from '@/contexts/shared/domain/ValidationError'

export class ArticleRelatedLinksMaxExceeded extends ValidationError {
  constructor() {
    super('No se pueden agregar más de 10 enlaces relacionados')
  }
}
