import { test, expect } from '@playwright/test'
import { SeriesAPI } from '../../apis/series.api'
import { randomUUID } from 'node:crypto'

test.describe('Series endpoints', () => {
  let seriesApi: SeriesAPI

  test.beforeAll(async ({ request }) => {
    seriesApi = new SeriesAPI(request)
  })

  test('should manage series lifecycle', async () => {
    // Create a series
    const seriesId = randomUUID()
    const createResponse = await seriesApi.create({
      id: seriesId,
      title: 'Test Series',
      description: 'Test Description'
    })

    expect(createResponse.status()).toBe(201)
    expect(await createResponse.json()).toEqual({
      message: 'Series created successfully'
    })

    // Get created series
    const getResponse = await seriesApi.getById(seriesId)
    expect(getResponse.status()).toBe(200)
    expect(await getResponse.json()).toEqual({
      data: {
        id: seriesId,
        title: 'Test Series',
        description: 'Test Description',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    })

    // List series
    const listResponse = await seriesApi.list()
    expect(listResponse.status()).toBe(200)
    const listData = await listResponse.json()
    expect(listData.data).toHaveLength(1)
    expect(listData.data[0]).toEqual({
      id: seriesId,
      title: 'Test Series',
      description: 'Test Description',
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })

    // Update series
    const updateResponse = await seriesApi.update(seriesId, {
      title: 'Updated Series',
      description: 'Updated Description'
    })
    expect(updateResponse.status()).toBe(200)
    expect(await updateResponse.json()).toEqual({
      message: 'Series updated successfully'
    })

    // Verify update
    const getUpdatedResponse = await seriesApi.getById(seriesId)
    expect(getUpdatedResponse.status()).toBe(200)
    expect(await getUpdatedResponse.json()).toEqual({
      data: {
        id: seriesId,
        title: 'Updated Series',
        description: 'Updated Description',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    })

    // Delete series
    const deleteResponse = await seriesApi.delete(seriesId)
    expect(deleteResponse.status()).toBe(200)
    expect(await deleteResponse.json()).toEqual({
      message: 'Series deleted successfully'
    })

    // Verify deletion
    const getDeletedResponse = await seriesApi.getById(seriesId)
    expect(getDeletedResponse.status()).toBe(404)
  })

  test('should handle validation errors', async () => {
    // Try to create series with invalid UUID
    const invalidCreateResponse = await seriesApi.create({
      id: 'invalid-uuid',
      title: 'Test Series',
      description: 'Test Description'
    })
    expect(invalidCreateResponse.status()).toBe(400)

    // Try to create series with duplicate title
    const seriesId1 = randomUUID()
    await seriesApi.create({
      id: seriesId1,
      title: 'Duplicate Title',
      description: 'First Series'
    })

    const seriesId2 = randomUUID()
    const duplicateResponse = await seriesApi.create({
      id: seriesId2,
      title: 'Duplicate Title',
      description: 'Second Series'
    })
    expect(duplicateResponse.status()).toBe(409)

    // Try to update non-existent series
    const updateResponse = await seriesApi.update(randomUUID(), {
      title: 'Updated Series',
      description: 'Updated Description'
    })
    expect(updateResponse.status()).toBe(404)

    // Try to delete non-existent series
    const deleteResponse = await seriesApi.delete(randomUUID())
    expect(deleteResponse.status()).toBe(404)
  })

  test('should handle pagination', async () => {
    // Create multiple series
    const seriesIds = Array.from({ length: 3 }, () => randomUUID())
    for (let i = 0; i < seriesIds.length; i++) {
      await seriesApi.create({
        id: seriesIds[i],
        title: `Series ${i + 1}`,
        description: `Description ${i + 1}`
      })
    }

    // Get first page
    const firstPageResponse = await seriesApi.list({ limit: 2, offset: 0 })
    expect(firstPageResponse.status()).toBe(200)
    const firstPageData = await firstPageResponse.json()
    expect(firstPageData.data).toHaveLength(2)

    // Get second page
    const secondPageResponse = await seriesApi.list({ limit: 2, offset: 2 })
    expect(secondPageResponse.status()).toBe(200)
    const secondPageData = await secondPageResponse.json()
    expect(secondPageData.data).toHaveLength(1)
  })
})
