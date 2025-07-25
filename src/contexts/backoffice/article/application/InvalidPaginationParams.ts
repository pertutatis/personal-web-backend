import { DomainError } from '@/contexts/shared/domain/DomainError'

export class InvalidPaginationParams extends DomainError {
  readonly type = 'InvalidPaginationParams'

  constructor() {
    super(
      'Invalid pagination parameters: page and limit must be positive numbers',
    )
  }
}
