import { PostgresConnection } from '../PostgresConnection';
import { getTestConfig } from '../config/DatabaseConfig';

export class TestDatabase {
  private static connections: Record<string, PostgresConnection> = {};

  static async getArticlesConnection(): Promise<PostgresConnection> {
    if (!this.connections.articles) {
      this.connections.articles = await PostgresConnection.create(
        getTestConfig('test_articles')
      );
    }
    return this.connections.articles;
  }

  static async getBooksConnection(): Promise<PostgresConnection> {
    if (!this.connections.books) {
      this.connections.books = await PostgresConnection.create(
        getTestConfig('test_books')
      );
    }
    return this.connections.books;
  }

  static async closeAll(): Promise<void> {
    await Promise.all(
      Object.values(this.connections).map(conn => conn.close())
    );
    this.connections = {};
  }

  static async cleanArticles(): Promise<void> {
    const conn = await this.getArticlesConnection();
    await conn.execute('DELETE FROM articles');
  }

  static async cleanBooks(): Promise<void> {
    const conn = await this.getBooksConnection();
    await conn.execute('DELETE FROM books');
  }

  static async cleanAll(): Promise<void> {
    await this.cleanArticles();
    await this.cleanBooks();
  }
}
