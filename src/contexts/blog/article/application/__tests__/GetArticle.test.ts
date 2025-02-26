import { GetArticle } from '../GetArticle';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
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
      update: jest.fn()
    };
    getArticle = new GetArticle(repository);
  });

  it('should throw ArticleNotFound when article does not exist', async () => {
    repository.search = jest.fn().mockResolvedValue(null);
    const id = ArticleId.create('non-existent-id');

    await expect(getArticle.run(id))
      .rejects
      .toThrow(ArticleNotFound);
  });

  it('should return the article when it exists', async () => {
    const article = Article.create({
      id: ArticleId.create('test-id'),
      title: ArticleTitle.create('Test Article'),
      content: ArticleContent.create('Test Content'),
      bookIds: ArticleBookIds.create(['book-1']), // Add at least one book ID
      createdAt: now,
      updatedAt: now
    });

    repository.search = jest.fn().mockResolvedValue(article);
    const id = ArticleId.create('test-id');

    const result = await getArticle.run(id);

    expect(result).toBe(article);
    expect(repository.search).toHaveBeenCalledWith(id);
  });
});
