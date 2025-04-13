import { Article } from '../domain/Article';
import { ArticleRepository } from '../domain/ArticleRepository';
import { Collection } from '@/contexts/shared/domain/Collection';
import { InvalidPaginationParams } from './InvalidPaginationParams';

type PaginationParams = {
  page: number;
  limit: number;
};

export class ListArticles {
  constructor(private readonly repository: ArticleRepository) {}

  async run({ page, limit }: PaginationParams): Promise<Collection<Article>> {
    if (page <= 0 || limit <= 0) {
      throw new InvalidPaginationParams();
    }

    return this.repository.searchByPage(page, limit);
  }
}
