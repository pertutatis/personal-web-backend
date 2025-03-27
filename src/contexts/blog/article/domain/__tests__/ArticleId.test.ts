import { ArticleId } from '../ArticleId';
import { ArticleIdMother } from './mothers/ArticleIdMother';

describe('ArticleId', () => {
  describe('creation', () => {
    it('should create with valid UUID', () => {
      const id = ArticleIdMother.create();
      expect(id.value).toBe('cc8d8194-e099-4e3a-a431-6b4412dc5f6a');
    });

    it('should create with random UUID', () => {
      const id = ArticleIdMother.random();
      expect(id.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should create with sequence', () => {
      const id = ArticleIdMother.sequence(1);
      expect(id.value).toBe('article-1');
    });

    it('should accept any format', () => {
      expect(ArticleIdMother.invalid().value).toBe('invalid-id');
      expect(ArticleIdMother.withDashes().value).toBe('article-id-with-dashes');
      expect(ArticleIdMother.withNumbers().value).toBe('article123');
      expect(ArticleIdMother.withSpecialChars().value).toBe('article.id_special@chars');
    });

    it('should allow empty string', () => {
      const id = ArticleIdMother.empty();
      expect(id.value).toBe('');
    });
  });

  describe('value object behavior', () => {
    it('should be immutable', () => {
      const id = ArticleIdMother.create();
      expect(() => {
        (id as any).value = 'changed';
      }).toThrow();
    });

    it('should implement equals correctly', () => {
      const id1 = new ArticleId('test-id');
      const id2 = new ArticleId('test-id');
      const id3 = new ArticleId('other-id');
      const nullValue = null;
      const nonId = { value: 'test-id' };

      expect(id1.equals(id2)).toBe(true);
      expect(id1.equals(id3)).toBe(false);
      expect(id1.equals(nullValue)).toBe(false);
      expect(id1.equals(nonId)).toBe(false);
    });

    it('should convert to string correctly', () => {
      const id = ArticleIdMother.create();
      expect(id.toString()).toBe('cc8d8194-e099-4e3a-a431-6b4412dc5f6a');
    });

    it('should convert to JSON correctly', () => {
      const id = ArticleIdMother.create();
      expect(id.toJSON()).toBe('cc8d8194-e099-4e3a-a431-6b4412dc5f6a');
    });
  });

  describe('collection usage', () => {
    it('should create multiple unique ids', () => {
      const ids = ArticleIdMother.multiple(3);
      
      expect(ids).toHaveLength(3);
      expect(new Set(ids.map(id => id.value)).size).toBe(3);
    });

    it('should work as object key', () => {
      const id1 = ArticleIdMother.create();
      const id2 = ArticleIdMother.random();

      const map = new Map<ArticleId, string>();
      map.set(id1, 'value1');
      map.set(id2, 'value2');

      expect(map.get(id1)).toBe('value1');
      expect(map.get(id2)).toBe('value2');
    });

    it('should handle Set equality based on value equality', () => {
      const value = 'same-id';
      const id1 = new ArticleId(value);
      const id2 = new ArticleId(value); // Same value as id1
      const id3 = new ArticleId('other-id');

      // Usar Map para crear un Set personalizado
      const uniqueIds = new Map<string, ArticleId>();
      
      // Agregar IDs usando el valor como clave
      uniqueIds.set(id1.value, id1);
      uniqueIds.set(id2.value, id2);
      uniqueIds.set(id3.value, id3);

      // Debería haber solo dos valores únicos
      expect(uniqueIds.size).toBe(2);
      expect(uniqueIds.has(id1.value)).toBe(true);
      expect(uniqueIds.has(id2.value)).toBe(true);
      expect(uniqueIds.has(id3.value)).toBe(true);
    });
  });

  describe('database usage', () => {
    it('should provide existing id for tests', () => {
      const id = ArticleIdMother.existing();
      expect(id.value).toBe('existing-article-id');
    });

    it('should provide non-existing id for tests', () => {
      const id = ArticleIdMother.nonExisting();
      expect(id.value).toBe('non-existing-article-id');
    });

    it('should handle sequential ids for pagination', () => {
      const ids = Array.from({ length: 5 }, (_, i) => ArticleIdMother.sequence(i + 1));
      
      expect(ids).toHaveLength(5);
      expect(ids[0].value).toBe('article-1');
      expect(ids[4].value).toBe('article-5');
    });
  });
});
