import { Article } from '../../Article';
import { ArticleId } from '../../ArticleId';
import { ArticleSlug } from '../../ArticleSlug';
import { ArticleTitle } from '../../ArticleTitle';
import { ArticleExcerpt } from '../../ArticleExcerpt';
import { ArticleContent } from '../../ArticleContent';
import { ArticleBookIds } from '../../ArticleBookIds';
import { ArticleRelatedLinksMother } from './ArticleRelatedLinksMother';

export class ArticleMother {
  static create(id: string = 'article-1'): Article {
    return Article.create({
      id: new ArticleId(id),
      slug: new ArticleSlug('test-article'),
      title: new ArticleTitle('Test Article'),
      excerpt: new ArticleExcerpt('Test excerpt'),
      content: new ArticleContent('Test content'),
      bookIds: ArticleBookIds.createEmpty(),
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static random(): Article {
    const id = Math.random().toString(36).substring(7);
    return Article.create({
      id: new ArticleId(id),
      slug: new ArticleSlug(`test-article-${id}`),
      title: new ArticleTitle(`Test Article ${id}`),
      excerpt: new ArticleExcerpt(`Test excerpt ${id}`),
      content: new ArticleContent(`Test content ${id}`),
      bookIds: ArticleBookIds.createEmpty(),
      relatedLinks: ArticleRelatedLinksMother.random(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
