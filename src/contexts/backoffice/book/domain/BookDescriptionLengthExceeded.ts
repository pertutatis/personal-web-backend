import { DomainError } from '@/contexts/shared/domain/DomainError'

export class BookDescriptionLengthExceeded extends DomainError {
  constructor(length: number) {
    super(
      `Book description length cannot exceed 1000 characters. Current length: ${length}`,
    )
    this.name = 'BookDescriptionLengthExceeded'
  }

  readonly type = 'ValidationError'
}
