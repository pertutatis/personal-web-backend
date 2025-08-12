import { Article } from '../domain/Article'
import { ArticleId } from '../domain/ArticleId'
import { ArticleTitle } from '../domain/ArticleTitle'
import { ArticleSlug } from '../domain/ArticleSlug'
import { ArticleContent } from '../domain/ArticleContent'
import { ArticleExcerpt } from '../domain/ArticleExcerpt'
import { ArticleRepository } from '../domain/ArticleRepository'
import { ArticleBookIds } from '../domain/ArticleBookIds'
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks'
import { ArticleStatus } from '../domain/ArticleStatus'
import { ArticleNotFound } from './ArticleNotFound'
import { ArticleSeriesId } from '../domain/ArticleSeriesId'

export type UpdateArticleRequest = {
  id: string
  title?: string
  excerpt?: string
  content?: string
  bookIds?: string[]
  relatedLinks?: Array<{ text: string; url: string }>
  status?: string
  seriesId?: string // UUID de la serie asociada (opcional)
}

export class UpdateArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(request: UpdateArticleRequest): Promise<void> {
    const articleId = new ArticleId(request.id)
    const article = await this.repository.search(articleId)

    if (!article) {
      throw new ArticleNotFound(articleId)
    }

    // Handle status update first (may throw validation errors)
    const statusUpdatedArticle = this.updateStatus(article, request.status)

    // Then handle other field updates
    const updateParams = this.buildUpdateParams(request, statusUpdatedArticle)
    const updatedArticle = statusUpdatedArticle.update(updateParams)
    await this.repository.update(updatedArticle)
  }

  private buildUpdateParams(
    request: UpdateArticleRequest,
    currentArticle: Article,
  ): Partial<{
    title: ArticleTitle
    excerpt: ArticleExcerpt
    content: ArticleContent
    bookIds: ArticleBookIds
    relatedLinks: ArticleRelatedLinks
    slug: ArticleSlug
    seriesId: ArticleSeriesId
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

    if (request.seriesId !== undefined) {
      params.seriesId = request.seriesId
        ? new ArticleSeriesId(request.seriesId)
        : undefined
    }

    return params
  }

  private updateStatus(article: Article, newStatus?: string): Article {
    if (newStatus === undefined) {
      return article
    }

    const requestedStatus = new ArticleStatus(newStatus)

    if (requestedStatus.isPublished()) {
      return article.publish()
    }

    // If requesting DRAFT status, validate the transition
    if (requestedStatus.isDraft() && article.status.isPublished()) {
      // This will throw ArticleStatusInvalid
      article.status.toDraft()
    }

    return article
  }
}
