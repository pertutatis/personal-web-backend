import { BookId } from '../BookId';
import { BookIdMother } from './mothers/BookIdMother';

describe('BookId', () => {
  describe('creation', () => {
    it('should create with valid UUID', () => {
      const id = BookIdMother.create();
      expect(id.value).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should create with random UUID', () => {
      const id = BookIdMother.random();
      expect(id.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should create with sequence', () => {
      const id = BookIdMother.sequence(1);
      expect(id.value).toBe('book-1');
    });

    it('should accept any format', () => {
      expect(BookIdMother.invalid().value).toBe('invalid-id');
      expect(BookIdMother.withDashes().value).toBe('book-id-with-dashes');
      expect(BookIdMother.withNumbers().value).toBe('book123');
      expect(BookIdMother.withSpecialChars().value).toBe('book.id_special@chars');
    });

    it('should allow empty string', () => {
      const id = BookIdMother.empty();
      expect(id.value).toBe('');
    });
  });

  describe('value object behavior', () => {
    it('should be immutable', () => {
      const id = BookIdMother.create();
      expect(() => {
        (id as any).value = 'changed';
      }).toThrow();
    });

    it('should implement equals correctly', () => {
      const id1 = new BookId('test-id');
      const id2 = new BookId('test-id');
      const id3 = new BookId('other-id');

      expect(id1.equals(id2)).toBe(true);
      expect(id1.equals(id3)).toBe(false);
      expect(id1.equals(null as any)).toBe(false);
      expect(id1.equals({} as any)).toBe(false);
    });

    it('should convert to string correctly', () => {
      const id = BookIdMother.create();
      expect(id.toString()).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should convert to JSON correctly', () => {
      const id = BookIdMother.create();
      expect(id.toJSON()).toBe('550e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('comparison', () => {
    it('should be case sensitive', () => {
      const id1 = new BookId('Book-123');
      const id2 = new BookId('book-123');
      expect(id1.equals(id2)).toBe(false);
    });

    it('should handle leading/trailing spaces', () => {
      const id1 = new BookId('book-123');
      const id2 = new BookId('book-123 ');
      expect(id1.equals(id2)).toBe(false);
    });

    it('should compare different instances with same value', () => {
      const value = 'same-id';
      const id1 = new BookId(value);
      const id2 = new BookId(value);
      
      expect(id1 === id2).toBe(false);
      expect(id1.equals(id2)).toBe(true);
    });
  });

  describe('usage as key', () => {
    it('should work as object key', () => {
      const id1 = BookIdMother.create();
      const id2 = BookIdMother.random();

      const map = new Map<BookId, string>();
      map.set(id1, 'value1');
      map.set(id2, 'value2');

      expect(map.get(id1)).toBe('value1');
      expect(map.get(id2)).toBe('value2');
    });

    it('should work in arrays', () => {
      const ids = [
        BookIdMother.create(),
        BookIdMother.random(),
        BookIdMother.sequence(1)
      ];

      expect(ids).toHaveLength(3);
      expect(ids.map(id => id.value)).toContain('550e8400-e29b-41d4-a716-446655440000');
    });
  });
});
