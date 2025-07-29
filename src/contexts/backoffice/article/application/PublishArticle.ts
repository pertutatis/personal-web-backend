import { ArticleRepository } from '../domain/ArticleRepository'
import { ArticleId } from '../domain/ArticleId'
import { ArticleNotFound } from './ArticleNotFound'

export type PublishArticleRequest = {
  id: string
}

export class PublishArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(request: PublishArticleRequest): Promise<void> {
    const articleId = new ArticleId(request.id)
    const article = await this.repository.search(articleId)

    if (!article) {
      throw new ArticleNotFound(articleId)
    }

    const publishedArticle = article.publish()
    await this.repository.update(publishedArticle)
  }
} 