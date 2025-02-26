import { InvalidPaginationParams as ArticleInvalidPaginationParams } from '@/contexts/blog/article/application/InvalidPaginationParams';
import { InvalidPaginationParams as BookInvalidPaginationParams } from '@/contexts/blog/book/application/InvalidPaginationParams';
import { DomainError } from '@/contexts/shared/domain/DomainError';

describe('Error Handling', () => {
  describe('InvalidPaginationParams', () => {
    it('should create article pagination error correctly', () => {
      const error = new ArticleInvalidPaginationParams();

      expect(error).toBeInstanceOf(DomainError);
      expect(error.type).toBe('InvalidPaginationParams');
      expect(error.message).toBe('Invalid pagination parameters: page and limit must be positive numbers');
    });

    it('should create book pagination error correctly', () => {
      const error = new BookInvalidPaginationParams();

      expect(error).toBeInstanceOf(DomainError);
      expect(error.type).toBe('InvalidPaginationParams');
      expect(error.message).toBe('Invalid pagination parameters: page and limit must be positive numbers');
    });

    it('should serialize article pagination error to JSON', () => {
      const error = new ArticleInvalidPaginationParams();
      const json = error.toJSON();

      expect(json).toEqual({
        type: 'InvalidPaginationParams',
        message: 'Invalid pagination parameters: page and limit must be positive numbers'
      });
    });

    it('should serialize book pagination error to JSON', () => {
      const error = new BookInvalidPaginationParams();
      const json = error.toJSON();

      expect(json).toEqual({
        type: 'InvalidPaginationParams',
        message: 'Invalid pagination parameters: page and limit must be positive numbers'
      });
    });
  });
});
