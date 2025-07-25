import { DomainError } from '@/contexts/shared/domain/DomainError'

export class ArticleTitleLengthExceeded extends DomainError {
  readonly type = 'ValidationError'

  constructor() {
    super('Article title cannot exceed 150 characters')
  }
}
