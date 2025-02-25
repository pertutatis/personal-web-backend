import { DomainError } from '../../../shared/domain/DomainError';

export class BookNotFound extends DomainError {
  readonly type: string = 'book.not_found';
  readonly message: string;

  constructor(id: string) {
    super();
    this.message = `Book with id <${id}> not found`;
    Object.setPrototypeOf(this, BookNotFound.prototype);
  }
}
