import { PostgresSeriesRepository } from '../PostgresSeriesRepository'
import { Series } from '../../../domain/Series'
import { SeriesId } from '../../../domain/SeriesId'
import { SeriesTitle } from '../../../domain/SeriesTitle'
import { SeriesDescription } from '../../../domain/SeriesDescription'

const mockPool = {
  query: jest.fn(),
  end: jest.fn(),
}

describe('PostgresSeriesRepository', () => {
  let repository: PostgresSeriesRepository

  beforeEach(() => {
    jest.clearAllMocks()
    repository = new PostgresSeriesRepository(mockPool as any)
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

      mockPool.query.mockResolvedValueOnce({ rows: [] })

      await repository.save(series)

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO article_series'),
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

  describe('findById', () => {
    it('should return null when series does not exist', async () => {
      const id = SeriesId.random()
      mockPool.query.mockResolvedValueOnce({ rows: [] })

      const result = await repository.findById(id)

      expect(result).toBeNull()
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM article_series WHERE id = $1'),
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

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: series.id.value,
            title: series.title.value,
            description: series.description.value,
            created_at: series.createdAt.toISOString(),
            updated_at: series.updatedAt.toISOString(),
          },
        ],
      })

      const result = await repository.findById(series.id)

      expect(result?.toPrimitives()).toEqual(series.toPrimitives())
    })
  })

  describe('findByTitle', () => {
    it('should return null when series does not exist', async () => {
      const title = new SeriesTitle('Nonexistent Series')
      mockPool.query.mockResolvedValueOnce({ rows: [] })

      const result = await repository.findByTitle(title)

      expect(result).toBeNull()
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining(
          'SELECT * FROM article_series WHERE title = $1',
        ),
        [title.value],
      )
    })
  })

  describe('delete', () => {
    it('should delete an existing series', async () => {
      const id = SeriesId.random()
      mockPool.query.mockResolvedValueOnce({ rows: [] })

      await repository.delete(id)

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM article_series WHERE id = $1'),
        [id.value],
      )
    })
  })

  describe('existsByTitle', () => {
    it('should return true when title exists', async () => {
      const title = new SeriesTitle('Existing Series')
      mockPool.query.mockResolvedValueOnce({ rows: [{ exists: true }] })

      const result = await repository.existsByTitle(title)

      expect(result).toBe(true)
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT EXISTS'),
        [title.value],
      )
    })

    it('should return false when title does not exist', async () => {
      const title = new SeriesTitle('Nonexistent Series')
      mockPool.query.mockResolvedValueOnce({ rows: [{ exists: false }] })

      const result = await repository.existsByTitle(title)

      expect(result).toBe(false)
    })
  })
})
