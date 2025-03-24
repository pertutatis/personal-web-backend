import { GetArticle } from '../GetArticle';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleNotFound } from '../ArticleNotFound';

describe('GetArticle', () => {
  let repository: ArticleRepository;
  let getArticle: GetArticle;
  const now = new Date();

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      searchByBookId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    getArticle = new GetArticle(repository);
  });

  it('should throw ArticleNotFound when article does not exist', async () => {
    repository.search = jest.fn().mockResolvedValue(null);
    const id = ArticleId.create('non-existent-id');
    await expect(getArticle.run(id.value))
      .rejects
      .toThrow(ArticleNotFound);
  });

  it('should return the article when it exists', async () => {
    const articleId = ArticleId.create('test-id');
    const article = Article.create({
      id: articleId,
      title: ArticleTitle.create('Test Article'),
      excerpt: ArticleExcerpt.create('Test Excerpt'),
      content: ArticleContent.create('Test Content'),
      bookIds: ArticleBookIds.create(['book-1']),
      createdAt: now,
      updatedAt: now
    });

    repository.search = jest.fn().mockResolvedValue(article);
    const result = await getArticle.run(articleId.value);

    expect(result).toBe(article);
    expect(repository.search).toHaveBeenCalledWith(expect.objectContaining({
      value: 'test-id'
    }));
  });
});
