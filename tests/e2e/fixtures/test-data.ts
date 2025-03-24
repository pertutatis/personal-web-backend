export const testBooks = {
  valid: {
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    isbn: '978-0-32-112521-7',
    description: 'A comprehensive guide to DDD principles and patterns',
    purchaseLink: 'https://example.com/ddd-book'
  },
  validSecond: {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0-13-235088-4',
    description: 'A handbook of agile software craftsmanship',
    purchaseLink: 'https://example.com/clean-code'
  },
  validWithoutPurchaseLink: {
    title: 'Test Book Without Link',
    author: 'Test Author',
    isbn: '978-0-32-112521-8',
    description: 'A test book without purchase link',
    purchaseLink: null
  },
  invalid: {
    title: '',
    author: 'A'.repeat(256), // Excede el límite de longitud
    isbn: '123-invalid',
    description: '',
    purchaseLink: 'invalid-url'
  },
  invalidIsbn: {
    title: 'Test Book',
    author: 'Test Author',
    isbn: 'invalid-isbn',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book'
  },
  invalidTitle: {
    title: '',
    author: 'Valid Author',
    isbn: '978-0-13-235088-4',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book'
  },
  invalidAuthor: {
    title: 'Valid Title',
    author: '',
    isbn: '978-0-32-112521-7',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book'
  },
  invalidDescription: {
    title: 'Valid Title',
    author: 'Valid Author',
    isbn: '978-0-32-112521-7',
    description: '',
    purchaseLink: 'https://example.com/book'
  },
  invalidPurchaseLink: {
    title: 'Valid Title',
    author: 'Valid Author',
    isbn: '978-0-32-112521-7',
    description: 'Valid description',
    purchaseLink: 'not-a-valid-url'
  },
  maxLengthTitle: {
    title: 'A'.repeat(255),
    author: 'Test Author',
    isbn: '978-1-44-933181-8',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book'
  },
  maxLengthAuthor: {
    title: 'Test Title',
    author: 'A'.repeat(255),
    isbn: '978-0-12-345678-9',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book'
  },
  maxLengthDescription: {
    title: 'Test Title',
    author: 'Test Author',
    isbn: '978-0-12-345678-9',
    description: 'A'.repeat(1000),
    purchaseLink: 'https://example.com/book'
  },
  maxLengthPurchaseLink: {
    title: 'Test Title',
    author: 'Test Author',
    isbn: '978-0-12-345678-9',
    description: 'Valid description',
    purchaseLink: `https://example.com/${'a'.repeat(1987)}`
  }
};

export const testArticles = {
  valid: {
    title: 'Understanding Domain-Driven Design',
    excerpt: 'A comprehensive guide to DDD concepts and patterns',
    content: 'This is a comprehensive guide about DDD...',
    bookIds: []
  },
  validWithBooks: {
    title: 'Clean Code Principles',
    excerpt: 'Exploring the fundamentals of clean code',
    content: 'In this article we will explore clean code principles...',
    bookIds: []
  },
  invalid: {
    title: '',
    excerpt: '',
    content: 'A'.repeat(10001), // Excede el límite
    bookIds: ['invalid-id']
  },
  invalidBookIds: {
    title: 'Test Article',
    excerpt: 'Test excerpt',
    content: 'Test content',
    bookIds: ['non-existent-id']
  },
  maxLengthTitle: {
    title: 'A'.repeat(255),
    excerpt: 'Valid excerpt',
    content: 'Valid content',
    bookIds: []
  },
  maxLengthContent: {
    title: 'Test Title',
    excerpt: 'Test excerpt',
    content: 'A'.repeat(10000),
    bookIds: []
  },
  maxLengthExcerpt: {
    title: 'Test Title',
    excerpt: 'A'.repeat(160),
    content: 'Test content',
    bookIds: []
  },
  invalidExcerpt: {
    title: 'Test Title',
    excerpt: 'A'.repeat(161),
    content: 'Test content',
    bookIds: []
  }
};

export const testPagination = {
  defaultPage: 1,
  defaultLimit: 10,
  customPage: 2,
  customLimit: 5,
  invalidPage: -1,
  invalidLimit: 0,
  exceedingLimit: 1000
};

export interface TestBook {
  title: string;
  author: string;
  isbn: string;
  description: string;
  purchaseLink?: string | null;
}

export interface TestArticle {
  title: string;
  excerpt: string;
  content: string;
  bookIds: string[];
}

export const generateValidIsbn = (index: number): string => {
  const baseIsbn = [
    '978-0-32-112521-7',
    '978-0-13-235088-4',
    '0-7475-3269-9',
    '978-0-74-753269-9',
  ];
  return baseIsbn[index % baseIsbn.length];
};
