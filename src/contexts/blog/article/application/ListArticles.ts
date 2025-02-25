import { ArticleRepository } from '../domain/ArticleRepository';
import { Collection } from '@/contexts/shared/domain/Collection';
import { Article } from '../domain/Article';
import { InvalidPaginationParams } from './InvalidPaginationParams';

export type ListArticlesRequest = {
  page?: number;
  limit?: number;
};

export class ListArticles {
  constructor(private readonly repository: ArticleRepository) {}

  async run(request: ListArticlesRequest): Promise<Collection<Article>> {
    if (this.shouldPaginate(request)) {
      this.ensureValidPaginationParams(request.page!, request.limit!);
      return this.repository.searchByPage(request.page!, request.limit!);
    }

    return this.repository.searchAll();
  }

  private shouldPaginate(request: ListArticlesRequest): boolean {
    return request.page !== undefined && request.limit !== undefined;
  }

  private ensureValidPaginationParams(page: number, limit: number): void {
    if (page < 1 || limit < 1) {
      throw new InvalidPaginationParams();
    }
  }
}
