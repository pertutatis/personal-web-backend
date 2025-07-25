import { DomainError } from '@/contexts/shared/domain/DomainError'

export class ArticleIdInvalid extends DomainError {
  readonly type = 'ValidationError'

  constructor() {
    super('Article ID must be a valid UUID v4')
  }
}
