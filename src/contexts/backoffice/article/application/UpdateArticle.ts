import { Article } from '../domain/Article'
import { ArticleId } from '../domain/ArticleId'
import { ArticleTitle } from '../domain/ArticleTitle'
import { ArticleSlug } from '../domain/ArticleSlug'
import { ArticleContent } from '../domain/ArticleContent'
import { ArticleExcerpt } from '../domain/ArticleExcerpt'
import { ArticleRepository } from '../domain/ArticleRepository'
import { ArticleBookIds } from '../domain/ArticleBookIds'
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks'
import { ArticleNotFound } from './ArticleNotFound'

export type UpdateArticleRequest = {
  id: string
  title?: string
  excerpt?: string
  content?: string
  bookIds?: string[]
  relatedLinks?: Array<{ text: string; url: string }>
}

export class UpdateArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(request: UpdateArticleRequest): Promise<void> {
    const articleId = new ArticleId(request.id)
    const article = await this.repository.search(articleId)

    if (!article) {
      throw new ArticleNotFound(articleId)
    }

    const updateParams = this.buildUpdateParams(request)
    const updatedArticle = article.update(updateParams)
    await this.repository.update(updatedArticle)
  }

  private buildUpdateParams(request: UpdateArticleRequest): Partial<{
    title: ArticleTitle
    excerpt: ArticleExcerpt
    content: ArticleContent
    bookIds: ArticleBookIds
    relatedLinks: ArticleRelatedLinks
    slug: ArticleSlug
  }> {
    const params: ReturnType<UpdateArticle['buildUpdateParams']> = {}

    if (request.title !== undefined) {
      params.title = new ArticleTitle(request.title)
      params.slug = ArticleSlug.fromTitle(request.title)
    }

    if (request.excerpt !== undefined) {
      params.excerpt = new ArticleExcerpt(request.excerpt)
    }

    if (request.content !== undefined) {
      params.content = new ArticleContent(request.content)
    }

    if (request.bookIds !== undefined) {
      params.bookIds = ArticleBookIds.create(request.bookIds)
    }

    if (request.relatedLinks !== undefined) {
      params.relatedLinks = ArticleRelatedLinks.create(request.relatedLinks)
    }

    return params
  }
}
