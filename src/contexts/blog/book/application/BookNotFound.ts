import { NotFoundError } from '@/contexts/shared/domain/NotFoundError';
import { BookId } from '../domain/BookId';

export class BookNotFound extends NotFoundError {
  constructor(bookId: BookId) {
    super(`Book with id ${bookId.value} not found`);
    this.name = 'BookNotFound';
  }
}
