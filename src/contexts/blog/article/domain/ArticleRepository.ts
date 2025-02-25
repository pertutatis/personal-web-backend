import { Article } from './Article';
import { ArticleId } from './ArticleId';
import { Collection } from '@/contexts/shared/domain/Collection';

export interface ArticleRepository {
  save(article: Article): Promise<void>;
  search(id: ArticleId): Promise<Article | null>;
  searchAll(): Promise<Collection<Article>>;
  searchByPage(page: number, limit: number): Promise<Collection<Article>>;
  update(article: Article): Promise<void>;
}
