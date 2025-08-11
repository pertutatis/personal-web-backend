import { Pool } from 'pg'
import { Series } from '../../domain/Series'
import { SeriesId } from '../../domain/SeriesId'
import { SeriesTitle } from '../../domain/SeriesTitle'
import { SeriesDescription } from '../../domain/SeriesDescription'
import { SeriesRepository } from '../../domain/SeriesRepository'

export class PostgresSeriesRepository implements SeriesRepository {
  constructor(private readonly pool: Pool) {}

  async save(series: Series): Promise<void> {
    const { id, title, description, createdAt, updatedAt } =
      series.toPrimitives()

    await this.pool.query(
      `INSERT INTO article_series (id, title, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE
       SET title = $2, description = $3, updated_at = $5`,
      [id, title, description, createdAt, updatedAt],
    )
  }

  async findById(id: SeriesId): Promise<Series | null> {
    const result = await this.pool.query(
      'SELECT * FROM article_series WHERE id = $1',
      [id.value],
    )

    if (result.rows.length === 0) {
      return null
    }

    return this.mapToSeries(result.rows[0])
  }

  async findByTitle(title: SeriesTitle): Promise<Series | null> {
    const result = await this.pool.query(
      'SELECT * FROM article_series WHERE title = $1',
      [title.value],
    )

    if (result.rows.length === 0) {
      return null
    }

    return this.mapToSeries(result.rows[0])
  }

  async findAll(limit?: number, offset?: number): Promise<Series[]> {
    const query = `
      SELECT * FROM article_series 
      ORDER BY created_at DESC
      ${limit ? 'LIMIT $1' : ''}
      ${offset ? 'OFFSET $2' : ''}
    `
    const params = [limit, offset].filter((param) => param !== undefined)

    const result = await this.pool.query(query, params)
    return result.rows.map((row) => this.mapToSeries(row))
  }

  async delete(id: SeriesId): Promise<void> {
    await this.pool.query('DELETE FROM article_series WHERE id = $1', [
      id.value,
    ])
  }

  async existsByTitle(title: SeriesTitle): Promise<boolean> {
    const result = await this.pool.query(
      'SELECT EXISTS(SELECT 1 FROM article_series WHERE title = $1)',
      [title.value],
    )
    return result.rows[0].exists
  }

  private mapToSeries(row: any): Series {
    return new Series({
      id: new SeriesId(row.id),
      title: new SeriesTitle(row.title),
      description: new SeriesDescription(row.description),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    })
  }
}
