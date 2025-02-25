import { DomainError } from '../../../shared/domain/DomainError';

export class InvalidPaginationParams extends DomainError {
  readonly type: string = 'book.invalid_pagination_params';
  readonly message: string;

  constructor(page: number, limit: number) {
    super();
    this.message = `Invalid pagination parameters: page ${page}, limit ${limit}. Both must be greater than 0.`;
    Object.setPrototypeOf(this, InvalidPaginationParams.prototype);
  }
}
