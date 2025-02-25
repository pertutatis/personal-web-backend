import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';
import { InvalidPaginationParams } from './InvalidPaginationParams';

export type BooksResponse = {
  books: Book[];
  total: number;
  page: number;
  limit: number;
};

export class ListBooks {
  constructor(private readonly repository: BookRepository) {}

  async run(params: { page?: number; limit?: number }): Promise<BooksResponse> {
    const page = params.page || 1;
    const limit = params.limit || 10;

    if (page < 1 || limit < 1) {
      throw new InvalidPaginationParams(page, limit);
    }

    const offset = (page - 1) * limit;
    const { books, total } = await this.repository.findAllPaginated(offset, limit);

    return {
      books,
      total,
      page,
      limit
    };
  }
}
