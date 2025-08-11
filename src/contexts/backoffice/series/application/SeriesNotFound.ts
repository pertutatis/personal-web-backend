import { DomainError } from '@/contexts/shared/domain/DomainError'

export class SeriesNotFound extends DomainError {
  readonly type = 'NotFoundError'

  constructor(id: string) {
    super(`Series with id '${id}' not found`)
    this.name = 'SeriesNotFound'
  }
}
