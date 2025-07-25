import { DomainError } from '@/contexts/shared/domain/DomainError'

export class InvalidBookReferenceError extends DomainError {
  readonly type = 'ValidationError'

  constructor(bookId: string) {
    super(`Invalid book reference: Book with id ${bookId} does not exist`)
    this.name = 'InvalidBookReferenceError'
  }
}
