import { Article } from './Article';
import { ArticleId } from './ArticleId';
import { Collection } from '@/contexts/shared/domain/Collection';
import { BookId } from '../../book/domain/BookId';
import { ArticleSlug } from './ArticleSlug';

export interface ArticleRepository {
  save(article: Article): Promise<void>;
  search(id: ArticleId): Promise<Article | null>;
  searchBySlug(slug: string): Promise<Article | null>;
  searchAll(): Promise<Article[]>;
  searchByPage(page: number, limit: number): Promise<Collection<Article>>;
  searchByBookId(bookId: BookId): Promise<Article[]>;
  update(article: Article): Promise<void>;
  delete(id: ArticleId): Promise<void>;
  removeBookReference(bookId: BookId): Promise<void>;
}
