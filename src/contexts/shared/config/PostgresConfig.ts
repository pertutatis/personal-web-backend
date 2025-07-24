export class PostgresConfig {
  static getDefaultConfig() {
    return {
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      database: 'postgres'
    };
  }

  static getArticlesDbConfig() {
    return {
      ...this.getDefaultConfig(),
      database: 'test_blog'
    };
  }
}
