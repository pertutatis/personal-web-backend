import { DomainError } from '@/contexts/shared/domain/DomainError';

export class InvalidBookReferenceError extends DomainError {
  readonly type = 'ValidationError';

  constructor() {
    super('One or more referenced books do not exist');
  }
}
