import { NotFoundError } from '@/contexts/shared/domain/NotFoundError'

export class ArticleNotFoundError extends NotFoundError {
  constructor() {
    super('Article not found')
  }
}
