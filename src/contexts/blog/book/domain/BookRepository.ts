import { Book } from './Book';
import { BookId } from './BookId';
import { Collection } from '@/contexts/shared/domain/Collection';

export interface BookRepository {
  save(book: Book): Promise<void>;
  search(id: BookId): Promise<Book | null>;
  searchAll(): Promise<Collection<Book>>;
  searchByPage(page: number, limit: number): Promise<Collection<Book>>;
  update(book: Book): Promise<void>;
  searchByIds(ids: string[]): Promise<Collection<Book>>;
}
