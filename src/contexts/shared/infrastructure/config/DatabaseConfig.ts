export type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

export const getArticlesConfig = (): DatabaseConfig => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.ARTICLES_DB_PORT || '5432'),
  database: process.env.ARTICLES_DB_NAME || 'test_articles',
  user: process.env.ARTICLES_DB_USER || 'postgres',
  password: process.env.ARTICLES_DB_PASSWORD || 'postgres'
});

// Todas las operaciones de libros deben usar la misma configuración que artículos
// Elimina la función getBooksConfig para evitar confusión y duplicidad

export const getTestConfig = (database: string): DatabaseConfig => {
  if (database.includes('articles')) {
    return {
      host: 'localhost',
      port: 5432,
      database,
      user: 'postgres',
      password: 'postgres'
    };
  }
  
  return {
    host: 'localhost',
    port: 5432,
    database,
    user: 'postgres',
    password: 'postgres'
  };
};
