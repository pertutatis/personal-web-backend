import { DomainError } from '@/contexts/shared/domain/DomainError'

export class SeriesTitleAlreadyExists extends DomainError {
  readonly type = 'ValidationError'

  constructor(title: string) {
    super(`Series with title '${title}' already exists`)
    this.name = 'SeriesTitleAlreadyExists'
  }
}
