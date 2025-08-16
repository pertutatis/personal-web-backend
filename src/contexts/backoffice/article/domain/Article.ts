import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot'
import { ArticleId } from './ArticleId'
import { ArticleTitle } from './ArticleTitle'
import { ArticleContent } from './ArticleContent'
import { ArticleExcerpt } from './ArticleExcerpt'
import { ArticleBookIds } from './ArticleBookIds'
import { ArticleSlug } from './ArticleSlug'
import { ArticleRelatedLinks } from './ArticleRelatedLinks'
import { ArticleStatus } from './ArticleStatus'
import { ArticleStatusInvalid } from './ArticleStatusInvalid'
import { ArticleCreatedDomainEvent } from './event/ArticleCreatedDomainEvent'
import { ArticleUpdatedDomainEvent } from './event/ArticleUpdatedDomainEvent'
import { ArticleSeriesId } from './ArticleSeriesId'

type PrimitiveArticle = {
  id: string
  title: string
  excerpt: string
  content: string
  bookIds: string[]
  relatedLinks: Array<{ text: string; url: string }>
  slug: string
  status: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  seriesId?: string
}

type CreateArticleParams = {
  id: ArticleId
  title: ArticleTitle
  excerpt: ArticleExcerpt
  content: ArticleContent
  bookIds: ArticleBookIds
  relatedLinks?: ArticleRelatedLinks
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  slug?: ArticleSlug
  status?: ArticleStatus
  seriesId?: ArticleSeriesId
}

type UpdateArticleParams = Partial<{
  title: ArticleTitle
  excerpt: ArticleExcerpt
  content: ArticleContent
  bookIds: ArticleBookIds
  relatedLinks: ArticleRelatedLinks
  seriesId: ArticleSeriesId | undefined
}>

export class Article extends AggregateRoot {
  readonly id: ArticleId
  title: ArticleTitle
  excerpt: ArticleExcerpt
  content: ArticleContent
  bookIds: ArticleBookIds
  relatedLinks: ArticleRelatedLinks
  slug: ArticleSlug
  status: ArticleStatus
  readonly createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  seriesId?: ArticleSeriesId

  constructor(params: CreateArticleParams) {
    super()
    this.id = params.id
    this.title = params.title
    this.excerpt = params.excerpt
    this.content = params.content
    this.bookIds = params.bookIds
    this.relatedLinks = params.relatedLinks ?? ArticleRelatedLinks.create([])
    this.slug = params.slug ?? ArticleSlug.fromTitle(params.title.value)
    this.status = params.status ?? ArticleStatus.createDraft()
    this.createdAt = params.createdAt
    this.updatedAt = params.updatedAt
    this.publishedAt = params.publishedAt ?? undefined
    this.seriesId = params.seriesId
  }

  static create(params: CreateArticleParams): Article {
    const article = new Article(params)
    article.record(
      new ArticleCreatedDomainEvent({
        aggregateId: params.id.value,
        title: params.title.value,
        excerpt: params.excerpt.value,
        content: params.content.value,
        bookIds: params.bookIds.getValue(),
        relatedLinks: params.relatedLinks?.toPrimitives() ?? [],
        slug: article.slug.value,
        status: article.status.value,
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
        occurredOn: new Date(),
      }),
    )
    return article
  }

  update(params: UpdateArticleParams): Article {
    if (Object.keys(params).length === 0) {
      return this
    }

    const now = new Date()

    if (params.title) {
      this.title = params.title
      this.slug = ArticleSlug.fromTitle(params.title.value)
    }

    if (params.excerpt) {
      this.excerpt = params.excerpt
    }

    if (params.content) {
      this.content = params.content
    }

    if (params.bookIds) {
      this.bookIds = params.bookIds
    }

    if (params.relatedLinks) {
      this.relatedLinks = params.relatedLinks
    }

    if ('seriesId' in params) {
      this.seriesId = params.seriesId
    }

    this.updatedAt = now

    this.record(
      new ArticleUpdatedDomainEvent({
        aggregateId: this.id.value,
        title: this.title.value,
        excerpt: this.excerpt.value,
        content: this.content.value,
        bookIds: this.bookIds.getValue(),
        relatedLinks: this.relatedLinks.toPrimitives(),
        slug: this.slug.value,
        status: this.status.value,
        updatedAt: now,
        occurredOn: now,
      }),
    )

    return this
  }

  toPrimitives(): PrimitiveArticle {
    return {
      id: this.id.value,
      title: this.title.value,
      excerpt: this.excerpt.value,
      content: this.content.value,
      bookIds: this.bookIds.getValue(),
      relatedLinks: this.relatedLinks.toPrimitives(),
      slug: this.slug.value,
      status: this.status.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      publishedAt: this.publishedAt
        ? this.publishedAt.toISOString()
        : undefined,
      seriesId: this.seriesId ? this.seriesId.value : undefined,
    }
  }

  // Status-related methods
  publish(): Article {
    if (this.status.isPublished()) {
      return this
    }

    const publishedStatus = this.status.publish()
    const now = new Date()

    this.status = publishedStatus
    this.updatedAt = now
    this.publishedAt = now

    this.record(
      new ArticleUpdatedDomainEvent({
        aggregateId: this.id.value,
        title: this.title.value,
        excerpt: this.excerpt.value,
        content: this.content.value,
        bookIds: this.bookIds.getValue(),
        relatedLinks: this.relatedLinks.toPrimitives(),
        slug: this.slug.value,
        status: this.status.value,
        updatedAt: now,
        occurredOn: now,
      }),
    )

    return this
  }

  unpublish(): Article {
    this.status.toDraft() // This will throw if transition is not allowed
    return this
  }

  isDraft(): boolean {
    return this.status.isDraft()
  }

  isPublished(): boolean {
    return this.status.isPublished()
  }

  canBePublished(): boolean {
    return this.status.isDraft()
  }
}
