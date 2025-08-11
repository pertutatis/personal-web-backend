import { DomainError } from '@/contexts/shared/domain/DomainError'

export class InvalidPaginationParams extends DomainError {
  readonly type = 'ValidationError'

  constructor(message: string) {
    super(message)
    this.name = 'InvalidPaginationParams'
  }
}
