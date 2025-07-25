import { DomainError } from '@/contexts/shared/domain/DomainError'

export class ArticleExcerptEmpty extends DomainError {
  readonly type = 'ValidationError'

  constructor() {
    super('Article excerpt cannot be empty')
  }
}
