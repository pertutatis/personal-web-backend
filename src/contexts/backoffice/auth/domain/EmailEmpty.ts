import { DomainError } from '../../../shared/domain/DomainError'

export class EmailEmpty extends DomainError {
  readonly type = 'ValidationError'

  constructor() {
    super('Email cannot be empty')
    this.name = 'EmailEmpty'
  }
}
