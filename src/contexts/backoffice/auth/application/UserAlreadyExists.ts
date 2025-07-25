import { DomainError } from '@/contexts/shared/domain/DomainError'

export class UserAlreadyExists extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`)
  }

  readonly type = 'UserAlreadyExists'
}
