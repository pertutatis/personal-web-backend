import { PostgresSeriesRepository } from '../PostgresSeriesRepository'
import { Series } from '../../../domain/Series'
import { SeriesId } from '../../../domain/SeriesId'
import { SeriesTitle } from '../../../domain/SeriesTitle'
import { SeriesDescription } from '../../../domain/SeriesDescription'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'

describe('PostgresSeriesRepository', () => {
  let repository: PostgresSeriesRepository
  let mockDb: jest.Mocked<DatabaseConnection>

  beforeEach(() => {
    mockDb = {
      execute: jest.fn(),
      close: jest.fn(),
      getDatabase: jest.fn(),
    }
    repository = new PostgresSeriesRepository(mockDb)
  })

  describe('save', () => {
    it('should save a new series', async () => {
      const now = new Date('2025-08-10T21:00:00Z')
      const series = new Series({
        id: SeriesId.random(),
        title: new SeriesTitle('Test Series'),
        description: new SeriesDescription('Test Description'),
        createdAt: now,
        updatedAt: now,
      })

      mockDb.execute.mockResolvedValueOnce({ rows: [] } as any)

      await repository.save(series)

      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO series'),
        [
          series.id.value,
          series.title.value,
          series.description.value,
          series.createdAt.toISOString(),
          series.updatedAt.toISOString(),
        ],
      )
    })
  })

  describe('findAll', () => {
    it('should return all series without pagination', async () => {
      const now = new Date('2025-08-10T21:00:00Z')
      const series = [
        new Series({
          id: SeriesId.random(),
          title: new SeriesTitle('Series 1'),
          description: new SeriesDescription('Description 1'),
          createdAt: now,
          updatedAt: now,
        })
      ]

      mockDb.execute.mockResolvedValueOnce({
        rows: series.map(s => ({
          id: s.id.value,
          title: s.title.value,
          description: s.description.value,
          created_at: s.createdAt.toISOString(),
          updated_at: s.updatedAt.toISOString(),
        }))
      } as any)

      const result = await repository.findAll()

      expect(result.map(s => s.toPrimitives())).toEqual(
        series.map(s => s.toPrimitives())
      )
      expect(mockDb.execute).toHaveBeenCalledWith(
        'SELECT * FROM series ORDER BY created_at DESC',
        []
      )
    })

    it('should return paginated series', async () => {
      const now = new Date('2025-08-10T21:00:00Z')
      const series = [
        new Series({
          id: SeriesId.random(),
          title: new SeriesTitle('Series 1'),
          description: new SeriesDescription('Description 1'),
          createdAt: now,
          updatedAt: now,
        })
      ]

      mockDb.execute.mockResolvedValueOnce({
        rows: series.map(s => ({
          id: s.id.value,
          title: s.title.value,
          description: s.description.value,
          created_at: s.createdAt.toISOString(),
          updated_at: s.updatedAt.toISOString(),
        }))
      } as any)

      const result = await repository.findAll(1, 0)

      expect(result.map(s => s.toPrimitives())).toEqual(
        series.map(s => s.toPrimitives())
      )
      expect(mockDb.execute).toHaveBeenCalledWith(
        'SELECT * FROM series ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [1, 0]
      )
    })
  })

  describe('findById', () => {
    it('should return null when series does not exist', async () => {
      const id = SeriesId.random()
      mockDb.execute.mockResolvedValueOnce({ rows: [] } as any)

      const result = await repository.findById(id)

      expect(result).toBeNull()
      expect(mockDb.execute).toHaveBeenCalledWith(
        'SELECT * FROM series WHERE id = $1',
        [id.value],
      )
    })

    it('should return an existing series', async () => {
      const now = new Date('2025-08-10T21:00:00Z')
      const series = new Series({
        id: SeriesId.random(),
        title: new SeriesTitle('Test Series'),
        description: new SeriesDescription('Test Description'),
        createdAt: now,
        updatedAt: now,
      })

      mockDb.execute.mockResolvedValueOnce({
        rows: [
          {
            id: series.id.value,
            title: series.title.value,
            description: series.description.value,
            created_at: series.createdAt.toISOString(),
            updated_at: series.updatedAt.toISOString(),
          },
        ],
      } as any)

      const result = await repository.findById(series.id)

      expect(result?.toPrimitives()).toEqual(series.toPrimitives())
    })
  })

  describe('findByTitle', () => {
    it('should return null when series does not exist', async () => {
      const title = new SeriesTitle('Nonexistent Series')
      mockDb.execute.mockResolvedValueOnce({ rows: [] } as any)

      const result = await repository.findByTitle(title)

      expect(result).toBeNull()
      expect(mockDb.execute).toHaveBeenCalledWith(
        'SELECT * FROM series WHERE title = $1',
        [title.value],
      )
    })
  })

  describe('delete', () => {
    it('should delete an existing series', async () => {
      const id = SeriesId.random()
      mockDb.execute.mockResolvedValueOnce({ rows: [] } as any)

      await repository.delete(id)

      expect(mockDb.execute).toHaveBeenCalledWith(
        'DELETE FROM series WHERE id = $1',
        [id.value],
      )
    })
  })

  describe('existsByTitle', () => {
    it('should return true when title exists', async () => {
      const title = new SeriesTitle('Existing Series')
      mockDb.execute.mockResolvedValueOnce({ rows: [{ exists: true }] } as any)

      const result = await repository.existsByTitle(title)

      expect(result).toBe(true)
      expect(mockDb.execute).toHaveBeenCalledWith(
        'SELECT EXISTS(SELECT 1 FROM series WHERE title = $1)',
        [title.value],
      )
    })

    it('should return false when title does not exist', async () => {
      const title = new SeriesTitle('Nonexistent Series')
      mockDb.execute.mockResolvedValueOnce({ rows: [{ exists: false }] } as any)

      const result = await repository.existsByTitle(title)

      expect(result).toBe(false)
    })
  })
})
