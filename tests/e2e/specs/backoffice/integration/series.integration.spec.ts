import { test, expect } from '@playwright/test'
import { randomUUID } from 'crypto'
import { SeriesAPI } from '../../../apis/series.api'
import { PostgresSeriesRepository } from '@/contexts/backoffice/series/infrastructure/persistence/PostgresSeriesRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig'

test.describe('Series Integration Tests', () => {
  let seriesApi: SeriesAPI
  let connection: PostgresConnection
  let repository: PostgresSeriesRepository

  test.beforeAll(async ({ request }) => {
    seriesApi = new SeriesAPI(request)
    connection = await PostgresConnection.create(getBlogConfig()) as PostgresConnection
    repository = new PostgresSeriesRepository(connection)
  })

  test.afterAll(async () => {
    await connection.close()
  })

  test('should handle complete series lifecycle', async () => {
    // Create
    const seriesId = randomUUID()
    const createResponse = await seriesApi.create({
      id: seriesId,
      title: 'Test Integration Series',
      description: 'Test Description'
    })
    expect(createResponse.status()).toBe(201)
    expect(await createResponse.json()).toEqual({
      message: 'Series created successfully'
    })

    // Get by ID and verify
    const getResponse = await seriesApi.getById(seriesId)
    expect(getResponse.status()).toBe(200)
    const seriesData = await getResponse.json()
    expect(seriesData.data).toEqual({
      id: seriesId,
      title: 'Test Integration Series',
      description: 'Test Description',
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })

    // Update
    const updateResponse = await seriesApi.update(seriesId, {
      title: 'Updated Series Title'
    })
    expect(updateResponse.status()).toBe(200)

    // Verify update
    const updatedResponse = await seriesApi.getById(seriesId)
    expect(updatedResponse.status()).toBe(200)
    const updatedData = await updatedResponse.json()
    expect(updatedData.data).toEqual({
      id: seriesId,
      title: 'Updated Series Title',
      description: 'Test Description',
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })

    // List and verify
    const listResponse = await seriesApi.list()
    expect(listResponse.status()).toBe(200)
    const listData = await listResponse.json()
    expect(listData.data).toContainEqual(expect.objectContaining({
      id: seriesId,
      title: 'Updated Series Title'
    }))

    // Delete
    const deleteResponse = await seriesApi.delete(seriesId)
    expect(deleteResponse.status()).toBe(200)

    // Verify deletion
    const getDeletedResponse = await seriesApi.getById(seriesId)
    expect(getDeletedResponse.status()).toBe(404)
  })

  test('should handle validation errors correctly', async () => {
    // Invalid UUID
    const invalidResponse = await seriesApi.create({
      id: 'not-a-uuid',
      title: 'Invalid Series',
      description: 'Test'
    })
    expect(invalidResponse.status()).toBe(400)

    // Duplicate title
    const seriesId1 = randomUUID()
    await seriesApi.create({
      id: seriesId1,
      title: 'Duplicate Title',
      description: 'First Series'
    })

    const duplicateResponse = await seriesApi.create({
      id: randomUUID(),
      title: 'Duplicate Title',
      description: 'Second Series'
    })
    expect(duplicateResponse.status()).toBe(409)

    // Clean up
    await seriesApi.delete(seriesId1)
  })

  test('should handle pagination correctly', async () => {
    // Create multiple series
    const seriesIds = []
    for (let i = 0; i < 3; i++) {
      const id = randomUUID()
      seriesIds.push(id)
      await seriesApi.create({
        id,
        title: `Series ${i + 1}`,
        description: `Description ${i + 1}`
      })
    }

    // Test pagination
    const firstPageResponse = await seriesApi.list({ limit: 2, offset: 0 })
    expect(firstPageResponse.status()).toBe(200)
    const firstPageData = await firstPageResponse.json()
    expect(firstPageData.data).toHaveLength(2)

    const secondPageResponse = await seriesApi.list({ limit: 2, offset: 2 })
    expect(secondPageResponse.status()).toBe(200)
    const secondPageData = await secondPageResponse.json()
    expect(secondPageData.data).toHaveLength(1)

    // Clean up
    for (const id of seriesIds) {
      await seriesApi.delete(id)
    }
  })
})
