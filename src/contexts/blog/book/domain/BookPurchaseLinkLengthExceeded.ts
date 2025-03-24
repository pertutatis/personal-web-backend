import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookPurchaseLinkLengthExceeded extends DomainError {
  constructor(length: number) {
    super(`Book purchase link length cannot exceed 2000 characters. Current length: ${length}`);
    this.name = 'BookPurchaseLinkLengthExceeded';
  }

  readonly type = 'BookPurchaseLinkLengthExceeded';
}
