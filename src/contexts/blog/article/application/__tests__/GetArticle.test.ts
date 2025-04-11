import { GetArticle } from '../GetArticle';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { ArticleNotFound } from '../ArticleNotFound';
import { ArticleIdMother } from '../../domain/__tests__/mothers/ArticleIdMother';
import { ArticleBookIdsMother } from '../../domain/__tests__/mothers/ArticleBookIdsMother';
import { ArticleRelatedLinksMother } from '../../domain/__tests__/mothers/ArticleRelatedLinksMother';
import { ArticleSlug } from '../../domain/ArticleSlug';

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
    const id = ArticleIdMother.nonExisting();

    await expect(getArticle.run(id.value))
      .rejects
      .toThrow(ArticleNotFound);
  });

  it('should return the article when it exists', async () => {
    const id = ArticleIdMother.create('cc8d8194-e099-4e3a-a431-6b4412dc5f6a');
    const title = new ArticleTitle('Test Article');

    const article = Article.create({
      id,
      title,
      excerpt: new ArticleExcerpt('Test Excerpt'),
      content: new ArticleContent('Test Content'),
      slug: ArticleSlug.fromTitle('Test Article'),
      bookIds: ArticleBookIdsMother.create(['cc8d8194-e099-4e3a-a431-6b4412dc5f6b']),
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
