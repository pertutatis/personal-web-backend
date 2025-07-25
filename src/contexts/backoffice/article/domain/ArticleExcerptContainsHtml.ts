import { DomainError } from '@/contexts/shared/domain/DomainError'

export class ArticleExcerptContainsHtml extends DomainError {
  constructor() {
    super('Article excerpt cannot contain HTML')
  }

  get type(): string {
    return 'ArticleExcerptContainsHtml'
  }
}
