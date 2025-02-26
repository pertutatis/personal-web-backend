import { Collection } from '@/contexts/shared/domain/Collection';
import { ArticleRepository } from '../domain/ArticleRepository';
import { InvalidPaginationParams } from './InvalidPaginationParams';
import { Article } from '../domain/Article';

export class ListArticles {
  constructor(private readonly repository: ArticleRepository) {}

  async run(page: number, limit: number): Promise<Collection<Article>> {
    this.ensureValidPagination(page, limit);
    return this.repository.searchByPage(page, limit);
  }

  private ensureValidPagination(page: number, limit: number): void {
    if (page <= 0 || limit <= 0) {
      throw new InvalidPaginationParams();
    }
  }
}
