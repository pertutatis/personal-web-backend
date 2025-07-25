import { DomainError } from '@/contexts/shared/domain/DomainError'

export class BookTitleEmpty extends DomainError {
  constructor() {
    super('Book title cannot be empty')
  }

  readonly type = 'ValidationError'
}
