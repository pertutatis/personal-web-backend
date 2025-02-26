import { Collection } from '../Collection';

describe('Collection', () => {
  const sampleItems = [1, 2, 3, 4, 5];
  const samplePagination = {
    page: 1,
    limit: 10,
    total: 5
  };

  it('should create a collection with items and pagination', () => {
    const collection = new Collection(sampleItems, samplePagination);

    expect(collection.items).toEqual(sampleItems);
    expect(collection.pagination).toEqual(samplePagination);
  });

  it('should throw error on invalid pagination parameters', () => {
    expect(() => new Collection([], { page: 0, limit: 10, total: 0 }))
      .toThrow('Invalid pagination parameters');
    
    expect(() => new Collection([], { page: 1, limit: 0, total: 0 }))
      .toThrow('Invalid pagination parameters');
  });

  it('should create empty collection', () => {
    const empty = Collection.empty();

    expect(empty.items).toEqual([]);
    expect(empty.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0
    });
  });

  it('should map items while preserving pagination', () => {
    const collection = new Collection(sampleItems, samplePagination);
    const mapped = collection.map(x => x * 2);

    expect(mapped.items).toEqual([2, 4, 6, 8, 10]);
    expect(mapped.pagination).toEqual(samplePagination);
  });

  it('should filter items and update total', () => {
    const collection = new Collection(sampleItems, samplePagination);
    const filtered = collection.filter(x => x > 3);

    expect(filtered.items).toEqual([4, 5]);
    expect(filtered.pagination.total).toBe(2);
  });

  it('should calculate hasNext correctly', () => {
    const withNext = new Collection([1, 2], {
      page: 1,
      limit: 2,
      total: 5
    });
    expect(withNext.hasNext).toBe(true);

    const withoutNext = new Collection([1, 2], {
      page: 3,
      limit: 2,
      total: 5
    });
    expect(withoutNext.hasNext).toBe(false);
  });

  it('should calculate hasPrevious correctly', () => {
    const firstPage = new Collection([], {
      page: 1,
      limit: 10,
      total: 20
    });
    expect(firstPage.hasPrevious).toBe(false);

    const secondPage = new Collection([], {
      page: 2,
      limit: 10,
      total: 20
    });
    expect(secondPage.hasPrevious).toBe(true);
  });

  it('should calculate totalPages correctly', () => {
    const cases = [
      { total: 0, limit: 10, expected: 0 },
      { total: 5, limit: 10, expected: 1 },
      { total: 15, limit: 10, expected: 2 },
      { total: 21, limit: 10, expected: 3 }
    ];

    cases.forEach(({ total, limit, expected }) => {
      const collection = new Collection([], { page: 1, limit, total });
      expect(collection.totalPages).toBe(expected);
    });
  });
});
