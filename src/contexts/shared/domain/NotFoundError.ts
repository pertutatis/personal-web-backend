import { DomainError } from './DomainError'

export class NotFoundError extends DomainError {
  readonly type = 'NotFoundError'

  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}
