type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

export const articlesDbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.ARTICLES_DB_NAME || 'articles',
  user: process.env.ARTICLES_DB_USER || 'postgres',
  password: process.env.ARTICLES_DB_PASSWORD || 'postgres'
};

export const booksDbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.BOOKS_DB_NAME || 'books',
  user: process.env.BOOKS_DB_USER || 'postgres',
  password: process.env.BOOKS_DB_PASSWORD || 'postgres'
};

export const getTestConfig = (database: string): DatabaseConfig => ({
  host: 'localhost',
  port: 5432,
  database,
  user: 'postgres',
  password: 'postgres'
});
