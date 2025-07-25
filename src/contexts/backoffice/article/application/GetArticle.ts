import { Article } from '../domain/Article'
import { ArticleRepository } from '../domain/ArticleRepository'
import { ArticleId } from '../domain/ArticleId'
import { ArticleNotFound } from './ArticleNotFound'

export class GetArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(id: string): Promise<Article> {
    const articleId = new ArticleId(id)
    const article = await this.repository.search(articleId)

    if (!article) {
      throw new ArticleNotFound(articleId)
    }

    return article
  }
}
