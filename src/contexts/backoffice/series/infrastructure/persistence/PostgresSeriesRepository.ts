import { Pool } from 'pg'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'
import { Series } from '../../domain/Series'
import { SeriesRepository } from '../../domain/SeriesRepository'
import { SeriesId } from '../../domain/SeriesId'
import { SeriesTitle } from '../../domain/SeriesTitle'
import { SeriesDescription } from '../../domain/SeriesDescription'

export class PostgresSeriesRepository implements SeriesRepository {
  constructor(private readonly db: DatabaseConnection) {}

  async save(series: Series): Promise<void> {
    const query = 'INSERT INTO series (id, title, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET title = $2, description = $3, updated_at = $5'
    await this.db.execute(query, [
      series.id.value,
      series.title.value,
      series.description.value,
      series.createdAt.toISOString(),
      series.updatedAt.toISOString(),
    ])
  }

  async findById(id: SeriesId): Promise<Series | null> {
    const query = 'SELECT * FROM series WHERE id = $1'
    const result = await this.db.execute(query, [id.value])

    if (result.rows.length === 0) {
      return null
    }

    return this.mapRowToSeries(result.rows[0])
  }

  async findByTitle(title: SeriesTitle): Promise<Series | null> {
    const query = 'SELECT * FROM series WHERE title = $1'
    const result = await this.db.execute(query, [title.value])

    if (result.rows.length === 0) {
      return null
    }

    return this.mapRowToSeries(result.rows[0])
  }

  async findAll(limit?: number, offset?: number): Promise<Series[]> {
    let query = 'SELECT * FROM series ORDER BY created_at DESC'
    const values: any[] = []

    if (limit !== undefined && offset !== undefined) {
      query += ' LIMIT $1 OFFSET $2'
      values.push(limit, offset)
    }

    const result = await this.db.execute(query, values)
    return result.rows.map(row => this.mapRowToSeries(row))
  }

  async delete(id: SeriesId): Promise<void> {
    const query = 'DELETE FROM series WHERE id = $1'
    await this.db.execute(query, [id.value])
  }

  async existsByTitle(title: SeriesTitle): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM series WHERE title = $1)'
    const result = await this.db.execute(query, [title.value])
    return result.rows[0].exists
  }

  private mapRowToSeries(row: any): Series {
    return new Series({
      id: new SeriesId(row.id),
      title: new SeriesTitle(row.title),
      description: new SeriesDescription(row.description),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    })
  }
}
