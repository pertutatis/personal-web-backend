export const testBooks = {
  valid: {
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    isbn: '978-0-32-112521-7',
  },
  validSecond: {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0-13-235088-4',
  },
  invalid: {
    title: '',
    author: 'A'.repeat(256), // Excede el límite de longitud
    isbn: '123-invalid',
  },
  invalidIsbn: {
    title: 'Test Book',
    author: 'Test Author',
    isbn: 'invalid-isbn',
  },
  invalidTitle: {
    title: '',
    author: 'Valid Author',
    isbn: '978-0-13-235088-4',
  },
  invalidAuthor: {
    title: 'Valid Title',
    author: '',
    isbn: '978-0-32-112521-7',
  },
  maxLengthTitle: {
    title: 'A'.repeat(255), // Máxima longitud permitida
    author: 'Test Author',
    isbn: '978-1-44-933181-8',
  },
  maxLengthAuthor: {
    title: 'Test Title',
    author: 'A'.repeat(255), // Máxima longitud permitida
    isbn: '978-0-12-345678-9',
  },
};

export const testArticles = {
  valid: {
    title: 'Understanding Domain-Driven Design',
    content: 'This is a comprehensive guide about DDD...',
    bookIds: []
  },
  validWithBooks: {
    title: 'Clean Code Principles',
    content: 'In this article we will explore clean code principles...',
    bookIds: []
  },
  invalid: {
    title: '',
    content: 'A'.repeat(10001), // Excede el límite
    bookIds: ['invalid-id']
  },
  invalidBookIds: {
    title: 'Test Article',
    content: 'Test content',
    bookIds: ['non-existent-id']
  },
  maxLengthTitle: {
    title: 'A'.repeat(255),
    content: 'Valid content',
    bookIds: []
  },
  maxLengthContent: {
    title: 'Test Title',
    content: 'A'.repeat(10000),
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
}

export interface TestArticle {
  title: string;
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
