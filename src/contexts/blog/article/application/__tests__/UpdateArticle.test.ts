import { UpdateArticle } from '../UpdateArticle';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { ArticleIdMother } from '../../domain/__tests__/mothers/ArticleIdMother';
import { ArticleTitleMother } from '../../domain/__tests__/mothers/ArticleTitleMother';
import { ArticleBookIdsMother } from '../../domain/__tests__/mothers/ArticleBookIdsMother';
import { ArticleRelatedLinksMother } from '../../domain/__tests__/mothers/ArticleRelatedLinksMother';

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

  it('should update only provided fields', async () => {
    const originalArticle = Article.create({
      id: ArticleIdMother.sequence(1),
      title: new ArticleTitle('Original Title'),
      excerpt: new ArticleExcerpt('Original Excerpt'),
      content: new ArticleContent('Original Content'),
      bookIds: ArticleBookIdsMother.create(['book-1']),
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
    const originalArticle = Article.create({
      id: ArticleIdMother.sequence(1),
      title: new ArticleTitle('Original Title'),
      excerpt: new ArticleExcerpt('Original Excerpt'),
      content: new ArticleContent('Original Content'),
      bookIds: ArticleBookIdsMother.create(['book-1']),
      relatedLinks: ArticleRelatedLinksMother.empty(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    repository.search.mockResolvedValue(originalArticle);

    await updateArticle.run({
      id: originalArticle.id.value,
      title: 'Updated Title',
      excerpt: 'Updated Excerpt',
      bookIds: ['book-2', 'book-3']
    });

    const updatedArticle = (repository.update as jest.Mock).mock.calls[0][0];
    expect(updatedArticle.title.value).toBe('Updated Title');
    expect(updatedArticle.excerpt.value).toBe('Updated Excerpt');
    expect(updatedArticle.bookIds.getValue()).toEqual(['book-2', 'book-3']);
  });

  it('should update slug when title is updated', async () => {
    const originalArticle = Article.create({
      id: ArticleIdMother.sequence(1),
      title: new ArticleTitle('Original Title'),
      excerpt: new ArticleExcerpt('Original Excerpt'),
      content: new ArticleContent('Original Content'),
      bookIds: ArticleBookIdsMother.create(['book-1']),
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

    await expect(updateArticle.run({
      id: 'non-existent-id',
      title: 'Updated Title'
    }))
    .rejects
    .toThrow('Article not found');
  });
});
