import { GetArticle } from '../GetArticle';
import { ArticleNotFound } from '../ArticleNotFound';
import { Article } from '../../domain/Article';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';

describe('GetArticle', () => {
  let repository: ArticleRepository;
  let getArticle: GetArticle;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      update: jest.fn()
    };
    getArticle = new GetArticle(repository);
  });

  it('should throw ArticleNotFound when article does not exist', async () => {
    repository.search = jest.fn().mockResolvedValue(null);
    
    await expect(getArticle.run('non-existent-id'))
      .rejects
      .toThrow(ArticleNotFound);
  });

  it('should return the article when it exists', async () => {
    const now = new Date();
    const existingArticle = Article.create({
      id: ArticleId.create('existing-id'),
      title: ArticleTitle.create('Test Article'),
      content: ArticleContent.create('Test Content'),
      bookIds: ArticleBookIds.create([]),
      createdAt: now,
      updatedAt: now
    });

    repository.search = jest.fn().mockResolvedValue(existingArticle);
    
    const result = await getArticle.run('existing-id');
    
    expect(result).toEqual(existingArticle);
    expect(repository.search).toHaveBeenCalledWith(expect.any(ArticleId));
  });
});
