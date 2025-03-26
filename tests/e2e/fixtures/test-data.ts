export const testBooks = {
  valid: {
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    isbn: '978-0-32-112521-7',
    description: 'A comprehensive guide to DDD principles and patterns',
    purchaseLink: 'https://example.com/ddd-book',
  },
  validSecond: {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0-13-235088-4',
    description: 'A handbook of agile software craftsmanship',
    purchaseLink: 'https://example.com/clean-code',
  },
  validWithoutPurchaseLink: {
    title: 'Test Book Without Link',
    author: 'Test Author',
    isbn: '978-0-13-235088-4',
    description: 'A test book without purchase link',
    purchaseLink: null,
  },
  invalid: {
    title: '',
    author: 'A'.repeat(256), // Excede el límite de longitud
    isbn: '123-invalid',
    description: '',
    purchaseLink: 'invalid-url',
  },
  invalidIsbn: {
    title: 'Test Book',
    author: 'Test Author',
    isbn: 'invalid-isbn',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book',
  },
  invalidTitle: {
    title: '',
    author: 'Valid Author',
    isbn: '978-0-13-235088-4',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book',
  },
  invalidAuthor: {
    title: 'Valid Title',
    author: '',
    isbn: '978-0-32-112521-7',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book',
  },
  invalidDescription: {
    title: 'Valid Title',
    author: 'Valid Author',
    isbn: '978-0-32-112521-7',
    description: '',
    purchaseLink: 'https://example.com/book',
  },
  invalidPurchaseLink: {
    title: 'Valid Title',
    author: 'Valid Author',
    isbn: '978-0-32-112521-7',
    description: 'Valid description',
    purchaseLink: 'not-a-valid-url',
  },
  maxLengthTitle: {
    title: 'A'.repeat(255),
    author: 'Test Author',
    isbn: '978-1-44-933181-8',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book',
  },
  maxLengthAuthor: {
    title: 'Test Title',
    author: 'A'.repeat(255),
    isbn: '978-1-44-933181-8',
    description: 'Valid description',
    purchaseLink: 'https://example.com/book',
  },
  maxLengthDescription: {
    title: 'Test Title',
    author: 'Test Author',
    isbn: '978-1-44-933181-8',
    description: 'A'.repeat(1000),
    purchaseLink: 'https://example.com/book',
  },
  maxLengthPurchaseLink: {
    title: 'Test Title',
    author: 'Test Author',
    isbn: '978-1-44-933181-8',
    description: 'Valid description',
    purchaseLink: `https://example.com/${'a'.repeat(1980)}`,
  },

  // ... (keep other book test data unchanged)
};

export const testArticles = {
  valid: {
    title: 'Understanding Domain-Driven Design',
    excerpt: 'A comprehensive guide to DDD concepts and patterns',
    content: 'This is a comprehensive guide about DDD...',
    bookIds: [],
    relatedLinks: [
      {
        text: 'Learn DDD',
        url: 'https://example.com/learn-ddd'
      }
    ]
  },
  validWithBooks: {
    title: 'Clean Code Principles',
    excerpt: 'Exploring the fundamentals of clean code',
    content: 'In this article we will explore clean code principles...',
    bookIds: [],
    relatedLinks: []
  },
  validWithMaxLinks: {
    title: 'Article with Maximum Links',
    excerpt: 'Testing maximum number of related links',
    content: 'Test content...',
    bookIds: [],
    relatedLinks: Array.from({ length: 10 }, (_, i) => ({
      text: `Link ${i + 1}`,
      url: `https://example.com/link-${i + 1}`
    }))
  },
  invalidLinks: {
    title: 'Article with Invalid Links',
    excerpt: 'Test excerpt',
    content: 'Test content',
    bookIds: [],
    relatedLinks: [
      {
        text: 'A'.repeat(101), // Exceeds max length
        url: 'https://example.com'
      }
    ]
  },
  invalidLinkUrl: {
    title: 'Article with Invalid Link URL',
    excerpt: 'Test excerpt',
    content: 'Test content',
    bookIds: [],
    relatedLinks: [
      {
        text: 'Invalid URL',
        url: 'not-a-valid-url'
      }
    ]
  },
  duplicateLinks: {
    title: 'Article with Duplicate Links',
    excerpt: 'Test excerpt',
    content: 'Test content',
    bookIds: [],
    relatedLinks: [
      {
        text: 'Link 1',
        url: 'https://example.com/duplicate'
      },
      {
        text: 'Link 2',
        url: 'https://example.com/duplicate'
      }
    ]
  },
  tooManyLinks: {
    title: 'Article with Too Many Links',
    excerpt: 'Test excerpt',
    content: 'Test content',
    bookIds: [],
    relatedLinks: Array.from({ length: 11 }, (_, i) => ({
      text: `Link ${i + 1}`,
      url: `https://example.com/link-${i + 1}`
    }))
  },
  specialCharactersTitle: {
    title: '¿Cómo Implementar DDD en TypeScript?',
    excerpt: 'Una guía práctica de Domain-Driven Design',
    content: 'Test content...',
    bookIds: [],
    relatedLinks: []
  },
  invalid: {
    title: '',
    excerpt: '',
    content: 'A'.repeat(10001),
    bookIds: ['invalid-id'],
    relatedLinks: []
  },
  invalidBookIds: {
    title: 'Test Article',
    excerpt: 'Test excerpt',
    content: 'Test content',
    bookIds: ['non-existent-id'],
    relatedLinks: []
  },
  maxLengthTitle: {
    title: 'A'.repeat(255),
    excerpt: 'Valid excerpt',
    content: 'Valid content',
    bookIds: [],
    relatedLinks: []
  },
  maxLengthContent: {
    title: 'Test Title',
    excerpt: 'Test excerpt',
    content: 'A'.repeat(10000),
    bookIds: [],
    relatedLinks: []
  },
  maxLengthExcerpt: {
    title: 'Test Title',
    excerpt: 'A'.repeat(160),
    content: 'Test content',
    bookIds: [],
    relatedLinks: []
  },
  invalidExcerpt: {
    title: 'Test Title',
    excerpt: 'A'.repeat(161),
    content: 'Test content',
    bookIds: [],
    relatedLinks: []
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

export interface RelatedLink {
  text: string;
  url: string;
}

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
  relatedLinks: RelatedLink[];
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
