import { DomainError } from '../../../shared/domain/DomainError'

export class EmailEmpty extends DomainError {
  constructor() {
    super('Email cannot be empty')
    this.name = 'EmailEmpty'
  }

  get type(): string {
    return 'EMAIL_EMPTY'
  }
}
