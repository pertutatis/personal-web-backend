import { Article } from '../../Article'
import { ArticleId } from '../../ArticleId'
import { ArticleSlug } from '../../ArticleSlug'
import { ArticleTitle } from '../../ArticleTitle'
import { ArticleExcerpt } from '../../ArticleExcerpt'
import { ArticleContent } from '../../ArticleContent'
import { ArticleBookIds } from '../../ArticleBookIds'
import { ArticleRelatedLinksMother } from './ArticleRelatedLinksMother'
import { v4 as uuidv4 } from 'uuid'

export class ArticleMother {
  static create(id: string = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a'): Article {
    return Article.create({
      id: new ArticleId(id),
      slug: new ArticleSlug('test-article'),
      title: new ArticleTitle('Test Article'),
      excerpt: new ArticleExcerpt('Test excerpt'),
      content: new ArticleContent('Test content'),
      bookIds: ArticleBookIds.createEmpty(),
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static random(): Article {
    const id = uuidv4()
    return Article.create({
      id: new ArticleId(id),
      slug: new ArticleSlug(`test-article-${id}`),
      title: new ArticleTitle(`Test Article ${id}`),
      excerpt: new ArticleExcerpt(`Test excerpt ${id}`),
      content: new ArticleContent(`Test content ${id}`),
      bookIds: ArticleBookIds.createEmpty(),
      relatedLinks: ArticleRelatedLinksMother.random(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static withBookReferences(bookIds: string[]): Article {
    const id = uuidv4()
    return Article.create({
      id: new ArticleId(id),
      slug: new ArticleSlug(`test-article-${id}`),
      title: new ArticleTitle(`Test Article ${id}`),
      excerpt: new ArticleExcerpt(`Test excerpt ${id}`),
      content: new ArticleContent(`Test content ${id}`),
      bookIds: ArticleBookIds.create(bookIds),
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}
