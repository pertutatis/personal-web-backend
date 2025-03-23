export const testBooks = {
  valid: {
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    isbn: '9780321125217'
  },
  validSecond: {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884'
  },
  invalid: {
    title: '',
    author: 'A'.repeat(256), // Excede el límite de longitud
    isbn: '123-invalid'
  },
  invalidIsbn: {
    title: 'Test Book',
    author: 'Test Author',
    isbn: 'invalid-isbn'
  },
  invalidTitle: {
    title: '',
    author: 'Valid Author',
    isbn: '9780132350884'
  },
  invalidAuthor: {
    title: 'Valid Title',
    author: '',
    isbn: '9780321125217'
  },
  maxLengthTitle: {
    title: 'A'.repeat(255), // Máxima longitud permitida
    author: 'Test Author',
    isbn: '9781449331818'
  },
  maxLengthAuthor: {
    title: 'Test Title',
    author: 'A'.repeat(255), // Máxima longitud permitida
    isbn: '9780123456789'
  }
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
    '9780321125217',
    '9780132350884',
    '9781449331818',
    '9781617290541',
    '9780134494166'
  ];
  return baseIsbn[index % baseIsbn.length];
};
