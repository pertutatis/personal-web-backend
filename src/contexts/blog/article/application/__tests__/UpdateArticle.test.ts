import { UpdateArticle } from '../UpdateArticle';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { ArticleIdMother } from '../../domain/__tests__/mothers/ArticleIdMother';
import { ArticleTitleMother } from '../../domain/__tests__/mothers/ArticleTitleMother';
import { ArticleBookIdsMother } from '../../domain/__tests__/mothers/ArticleBookIdsMother';
import { ArticleRelatedLinksMother } from '../../domain/__tests__/mothers/ArticleRelatedLinksMother';
import { ArticleSlug } from '../../domain/ArticleSlug';
import { ArticleNotFound } from '../ArticleNotFound';

describe('UpdateArticle', () => {
  let repository: jest.Mocked<ArticleRepository>;
  let updateArticle: UpdateArticle;

  beforeEach(() => {
    repository = {
      search: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ArticleRepository>;

    updateArticle = new UpdateArticle(repository);
  });

  const articleId = ArticleIdMother.create('cc8d8194-e099-4e3a-a431-6b4412dc5f6a');
  const bookId = 'dd7d8194-e099-4e3a-a431-6b4412dc5f6b';

  it('should update only provided fields', async () => {
    const originalTitle = 'Original Title';
    const originalArticle = Article.create({
      id: articleId,
      title: new ArticleTitle(originalTitle),
      excerpt: new ArticleExcerpt('Original Excerpt'),
      content: new ArticleContent('Original Content'),
      slug: ArticleSlug.fromTitle(originalTitle),
      bookIds: ArticleBookIdsMother.create([bookId]),
      relatedLinks: ArticleRelatedLinksMother.empty(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    repository.search.mockResolvedValue(originalArticle);

    await updateArticle.run({
      id: originalArticle.id.value,
      title: 'Updated Title'
    });

    expect(repository.update).toHaveBeenCalled();
    const updatedArticle = (repository.update as jest.Mock).mock.calls[0][0];
    
    expect(updatedArticle.title.value).toBe('Updated Title');
    expect(updatedArticle.excerpt.value).toBe('Original Excerpt');
    expect(updatedArticle.content.value).toBe('Original Content');
  });

  it('should update multiple fields', async () => {
    const originalTitle = 'Original Title';
    const originalArticle = Article.create({
      id: articleId,
      title: new ArticleTitle(originalTitle),
      excerpt: new ArticleExcerpt('Original Excerpt'),
      content: new ArticleContent('Original Content'),
      slug: ArticleSlug.fromTitle(originalTitle),
      bookIds: ArticleBookIdsMother.create([bookId]),
      relatedLinks: ArticleRelatedLinksMother.empty(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    repository.search.mockResolvedValue(originalArticle);

    const newBookId1 = 'ee7d8194-e099-4e3a-a431-6b4412dc5f6c';
    const newBookId2 = 'ff7d8194-e099-4e3a-a431-6b4412dc5f6d';

    await updateArticle.run({
      id: originalArticle.id.value,
      title: 'Updated Title',
      excerpt: 'Updated Excerpt',
      bookIds: [newBookId1, newBookId2]
    });

    const updatedArticle = (repository.update as jest.Mock).mock.calls[0][0];
    expect(updatedArticle.title.value).toBe('Updated Title');
    expect(updatedArticle.excerpt.value).toBe('Updated Excerpt');
    expect(updatedArticle.bookIds.getValue()).toEqual([newBookId1, newBookId2]);
  });

  it('should update slug when title is updated', async () => {
    const originalTitle = 'Original Title';
    const originalArticle = Article.create({
      id: articleId,
      title: new ArticleTitle(originalTitle),
      excerpt: new ArticleExcerpt('Original Excerpt'),
      content: new ArticleContent('Original Content'),
      slug: ArticleSlug.fromTitle(originalTitle),
      bookIds: ArticleBookIdsMother.create([bookId]),
      relatedLinks: ArticleRelatedLinksMother.empty(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    repository.search.mockResolvedValue(originalArticle);

    await updateArticle.run({
      id: originalArticle.id.value,
      title: 'Updated Title'
    });

    const updatedArticle = (repository.update as jest.Mock).mock.calls[0][0];
    expect(updatedArticle.slug.value).toBe('updated-title');
  });

  it('should throw error when article is not found', async () => {
    repository.search.mockResolvedValue(null);
    const nonExistentId = ArticleIdMother.nonExisting();

    await expect(updateArticle.run({
      id: nonExistentId.value,
      title: 'Updated Title'
    }))
    .rejects
    .toThrow(ArticleNotFound);
  });
});
