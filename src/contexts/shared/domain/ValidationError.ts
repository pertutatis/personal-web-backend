import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  readonly type = 'ValidationError';

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
