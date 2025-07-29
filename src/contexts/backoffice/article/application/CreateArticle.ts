import { Article } from '../domain/Article'
import { ArticleId } from '../domain/ArticleId'
import { ArticleTitle } from '../domain/ArticleTitle'
import { ArticleSlug } from '../domain/ArticleSlug'
import { ArticleContent } from '../domain/ArticleContent'
import { ArticleExcerpt } from '../domain/ArticleExcerpt'
import { ArticleBookIds } from '../domain/ArticleBookIds'
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks'
import { ArticleStatus } from '../domain/ArticleStatus'
import { ArticleRepository } from '../domain/ArticleRepository'
import { ArticleIdDuplicated } from '../domain/ArticleIdDuplicated'

export type CreateArticleRequest = {
  id: string
  title: string
  excerpt: string
  content: string
  bookIds: string[]
  relatedLinks: Array<{ text: string; url: string }>
  status?: string
}

export class CreateArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(request: CreateArticleRequest): Promise<void> {
    const articleId = new ArticleId(request.id)

    // Verificar duplicados
    const existingArticle = await this.repository.search(articleId)
    if (existingArticle) {
      throw new ArticleIdDuplicated(request.id)
    }

    const now = new Date()

    const article = Article.create({
      id: articleId,
      title: new ArticleTitle(request.title),
      excerpt: new ArticleExcerpt(request.excerpt),
      content: new ArticleContent(request.content),
      bookIds: ArticleBookIds.create(request.bookIds),
      relatedLinks: ArticleRelatedLinks.create(request.relatedLinks),
      slug: ArticleSlug.fromTitle(request.title),
      status: request.status ? new ArticleStatus(request.status) : undefined,
      createdAt: now,
      updatedAt: now,
    })

    await this.repository.save(article)
  }
}
