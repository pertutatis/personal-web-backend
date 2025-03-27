import { Identifier } from '../Identifier';

class TestIdentifier extends Identifier {
  constructor(value: string) {
    super(value);
  }
}

describe('Identifier', () => {
  describe('creation', () => {
    it('should create with valid value', () => {
      const id = new TestIdentifier('test-id');
      expect(id.value).toBe('test-id');
    });

    it('should allow empty string', () => {
      const id = new TestIdentifier('');
      expect(id.value).toBe('');
    });

    it('should accept any string format', () => {
      const formats = [
        'simple',
        'with-dashes',
        'with_underscores',
        'with.dots',
        '123456',
        'mixed-123_456.789'
      ];

      formats.forEach(format => {
        const id = new TestIdentifier(format);
        expect(id.value).toBe(format);
      });
    });
  });

  describe('value object behavior', () => {
    it('should be immutable', () => {
      const id = new TestIdentifier('test-id');
      expect(() => {
        (id as any).value = 'changed';
      }).toThrow();
    });

    it('should implement equals correctly', () => {
      const id1 = new TestIdentifier('test-id');
      const id2 = new TestIdentifier('test-id');
      const id3 = new TestIdentifier('other-id');

      expect(id1.equals(id2)).toBe(true);
      expect(id1.equals(id3)).toBe(false);
      expect(id1.equals(null as any)).toBe(false);
      expect(id1.equals({} as any)).toBe(false);
    });

    it('should convert to string correctly', () => {
      const id = new TestIdentifier('test-id');
      expect(id.toString()).toBe('test-id');
    });
  });

  describe('comparison', () => {
    it('should handle case sensitivity', () => {
      const id1 = new TestIdentifier('Test-ID');
      const id2 = new TestIdentifier('test-id');
      expect(id1.equals(id2)).toBe(false);
    });

    it('should handle whitespace', () => {
      const id1 = new TestIdentifier('test-id');
      const id2 = new TestIdentifier('test-id ');
      expect(id1.equals(id2)).toBe(false);
    });

    it('should compare only value', () => {
      const id1 = new TestIdentifier('same');
      const id2 = new TestIdentifier('same');
      
      // Diferentes instancias pero mismo valor
      expect(id1 === id2).toBe(false);
      expect(id1.equals(id2)).toBe(true);
    });
  });

  describe('with UUID format', () => {
    it('should accept UUID format', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const id = new TestIdentifier(uuid);
      expect(id.value).toBe(uuid);
    });

    it('should handle UUID case variations', () => {
      const lowerUuid = '550e8400-e29b-41d4-a716-446655440000';
      const upperUuid = '550E8400-E29B-41D4-A716-446655440000';
      
      const id1 = new TestIdentifier(lowerUuid);
      const id2 = new TestIdentifier(upperUuid);
      
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
