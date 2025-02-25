import { DomainError } from '@/contexts/shared/domain/DomainError';

export class InvalidPaginationParams extends DomainError {
  constructor() {
    super('Page and limit must be greater than 0');
  }

  get type(): string {
    return 'InvalidPaginationParams';
  }
}
