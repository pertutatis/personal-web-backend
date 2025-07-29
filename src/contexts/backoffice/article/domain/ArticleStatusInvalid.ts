import { DomainError } from '@/contexts/shared/domain/DomainError'

export class ArticleStatusInvalid extends DomainError {
  constructor(value?: string) {
    const message = value 
      ? `Invalid article status: '${value}'. Must be either 'DRAFT' or 'PUBLISHED'`
      : 'Invalid article status. Must be either \'DRAFT\' or \'PUBLISHED\''
    super(message)
  }

  readonly type = 'ValidationError'
} 