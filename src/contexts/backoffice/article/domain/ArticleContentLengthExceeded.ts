import { DomainError } from '@/contexts/shared/domain/DomainError'

export class ArticleContentLengthExceeded extends DomainError {
  readonly type = 'ValidationError'

  constructor() {
    super('Article content cannot exceed 20000 characters')
  }
}
