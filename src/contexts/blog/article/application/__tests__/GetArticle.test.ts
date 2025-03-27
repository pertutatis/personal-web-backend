import { GetArticle } from '../GetArticle';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { ArticleNotFound } from '../ArticleNotFound';
import { ArticleIdMother } from '../../domain/__tests__/mothers/ArticleIdMother';
import { ArticleBookIdsMother } from '../../domain/__tests__/mothers/ArticleBookIdsMother';
import { ArticleRelatedLinksMother } from '../../domain/__tests__/mothers/ArticleRelatedLinksMother';

describe('GetArticle', () => {
  let repository: jest.Mocked<ArticleRepository>;
  let getArticle: GetArticle;

  beforeEach(() => {
    repository = {
      search: jest.fn(),
    } as unknown as jest.Mocked<ArticleRepository>;
    getArticle = new GetArticle(repository);
  });

  it('should throw ArticleNotFound when article does not exist', async () => {
    repository.search = jest.fn().mockResolvedValue(null);
    const id = ArticleIdMother.sequence(1);

    await expect(getArticle.run(id.value))
      .rejects
      .toThrow(ArticleNotFound);
  });

  it('should return the article when it exists', async () => {
    const article = Article.create({
      id: ArticleIdMother.sequence(1),
      title: new ArticleTitle('Test Article'),
      excerpt: new ArticleExcerpt('Test Excerpt'),
      content: new ArticleContent('Test Content'),
      bookIds: ArticleBookIdsMother.create(['book-1']),
      relatedLinks: ArticleRelatedLinksMother.empty(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    repository.search = jest.fn().mockResolvedValue(article);

    const result = await getArticle.run(article.id.value);

    expect(result).toBe(article);
    expect(repository.search).toHaveBeenCalledWith(article.id);
  });
});
