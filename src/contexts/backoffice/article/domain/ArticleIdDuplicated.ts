import { DomainError } from '@/contexts/shared/domain/DomainError'

export class ArticleIdDuplicated extends DomainError {
  constructor(id: string) {
    super(`Article ID ${id} already exists`)
    this.name = 'ArticleIdDuplicated'
  }

  readonly type = 'Conflict'
}
