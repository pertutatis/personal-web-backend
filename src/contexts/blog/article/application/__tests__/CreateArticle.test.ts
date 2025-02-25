import { CreateArticle } from '../CreateArticle';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator';

describe('CreateArticle', () => {
  const mockRepository: jest.Mocked<ArticleRepository> = {
    save: jest.fn(),
    search: jest.fn(),
    searchAll: jest.fn(),
    searchByPage: jest.fn(),
    update: jest.fn()
  };
  
  const mockUuidGenerator: jest.Mocked<OfficialUuidGenerator> = {
    generate: jest.fn().mockReturnValue('generated-uuid')
  };

  const createArticle = new CreateArticle(mockRepository, mockUuidGenerator);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new article', async () => {
    const request = {
      title: 'Test Article',
      content: 'Test Content',
      bookIds: ['book-1', 'book-2']
    };

    await createArticle.run(request);

    expect(mockUuidGenerator.generate).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(ArticleId),
        title: expect.any(ArticleTitle),
        content: expect.any(ArticleContent),
        bookIds: expect.any(ArticleBookIds),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    );
  });
});
