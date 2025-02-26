import { Collection } from '@/contexts/shared/domain/Collection';
import { BookRepository } from '../domain/BookRepository';
import { InvalidPaginationParams } from './InvalidPaginationParams';
import { Book } from '../domain/Book';

export class ListBooks {
  constructor(private readonly repository: BookRepository) {}

  async run(page: number, limit: number): Promise<Collection<Book>> {
    this.ensureValidPagination(page, limit);
    return this.repository.searchByPage(page, limit);
  }

  private ensureValidPagination(page: number, limit: number): void {
    if (page <= 0 || limit <= 0) {
      throw new InvalidPaginationParams();
    }
  }
}
