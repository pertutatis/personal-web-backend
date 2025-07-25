export class PostgresConfig {
  static getDefaultConfig() {
    return {
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'postgres'
    };
  }

  static getArticlesDbConfig() {
    return {
      ...this.getDefaultConfig(),
      database: 'test_blog'
    };
  }
}
