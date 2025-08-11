import { test, expect } from '@playwright/test'
import { SeriesHelper, TestSeries } from '../../helpers/series.helper'

test.describe('Series API', () => {
  let validSeries: TestSeries

  test.beforeEach(async ({ request }) => {
    await SeriesHelper.cleanupSeries(request)
    validSeries = SeriesHelper.generateRandomTestSeries()
  })

  test('should handle complete series lifecycle', async ({ request }) => {
    // Create series
    const createResponse = await SeriesHelper.createSeries(request, validSeries)
    expect(createResponse.ok()).toBeTruthy()
    const createData = await createResponse.json()
    expect(createData).toEqual({
      message: 'Series created successfully',
    })

    // Get created series
    const getResponse = await SeriesHelper.getSeries(request, validSeries.id)
    expect(getResponse.ok()).toBeTruthy()
    const getData = await getResponse.json()
    const [normalizedData] = SeriesHelper.normalizeResponse(getData.data)
    expect(normalizedData).toEqual({
      id: validSeries.id,
      title: validSeries.title,
      description: validSeries.description,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    // Update series
    const updateResponse = await SeriesHelper.updateSeries(
      request,
      validSeries.id,
      {
        title: 'Updated Series',
        description: 'Updated Description',
      },
    )
    expect(updateResponse.ok()).toBeTruthy()
    const updateData = await updateResponse.json()
    expect(updateData).toEqual({
      message: 'Series updated successfully',
    })

    // Get updated series
    const getUpdatedResponse = await SeriesHelper.getSeries(
      request,
      validSeries.id,
    )
    expect(getUpdatedResponse.ok()).toBeTruthy()
    const updatedData = await getUpdatedResponse.json()
    const [normalizedUpdatedData] = SeriesHelper.normalizeResponse(
      updatedData.data,
    )
    expect(normalizedUpdatedData).toEqual({
      id: validSeries.id,
      title: 'Updated Series',
      description: 'Updated Description',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    // Delete series
    const deleteResponse = await SeriesHelper.deleteSeries(
      request,
      validSeries.id,
    )
    expect(deleteResponse.ok()).toBeTruthy()
    const deleteData = await deleteResponse.json()
    expect(deleteData).toEqual({
      message: 'Series deleted successfully',
    })

    // Verify deletion
    const getDeletedResponse = await SeriesHelper.getSeries(
      request,
      validSeries.id,
    )
    expect(getDeletedResponse.status()).toBe(404)
    const errorData = await getDeletedResponse.json()
    expect(errorData).toEqual({
      type: 'NotFoundError',
      message: expect.stringContaining(validSeries.id),
    })
  })

  test('should handle validation errors', async ({ request }) => {
    // Invalid UUID
    const invalidSeries = {
      ...validSeries,
      id: 'not-a-uuid',
    }

    const invalidUuidResponse = await SeriesHelper.createSeries(
      request,
      invalidSeries,
    )
    expect(invalidUuidResponse.status()).toBe(400)
    const invalidUuidError = await invalidUuidResponse.json()
    expect(invalidUuidError).toEqual({
      type: 'ValidationError',
      message: 'id must be a valid UUID v4',
      details: {
        errorCode: 'API_VALIDATION_ERROR',
      },
    })

    // Empty title
    const emptyTitleSeries = {
      ...validSeries,
      title: '',
    }

    const emptyTitleResponse = await SeriesHelper.createSeries(
      request,
      emptyTitleSeries,
    )
    expect(emptyTitleResponse.status()).toBe(400)
    const emptyTitleError = await emptyTitleResponse.json()
    expect(emptyTitleError).toEqual({
      type: 'ValidationError',
      message: expect.stringContaining('title cannot be empty'),
      details: {
        errorCode: 'API_VALIDATION_ERROR',
      },
    })

    // Create a series for duplicate title test
    await SeriesHelper.createSeries(request, validSeries)
    const duplicateSeries = {
      ...SeriesHelper.generateRandomTestSeries(),
      title: validSeries.title,
    }

    const duplicateResponse = await SeriesHelper.createSeries(
      request,
      duplicateSeries,
    )
    expect(duplicateResponse.status()).toBe(409)
    const duplicateError = await duplicateResponse.json()
    expect(duplicateError).toEqual({
      type: 'ValidationError',
      message: expect.stringContaining('already exists'),
      details: {
        errorCode: 'API_VALIDATION_ERROR',
      },
    })
  })

  test('should handle list with pagination', async ({ request }) => {
    // Create test series
    const seriesList = []
    for (let i = 0; i < 3; i++) {
      const series = SeriesHelper.generateRandomTestSeries()
      seriesList.push(series)
      await SeriesHelper.createSeries(request, series)
    }

    // Get first page
    const firstPageResponse = await SeriesHelper.listSeries(request, {
      limit: 2,
      offset: 0,
    })
    expect(firstPageResponse.ok()).toBeTruthy()
    const firstPageData = await firstPageResponse.json()
    const normalizedFirstPage = SeriesHelper.normalizeResponse(
      firstPageData.data,
    )
    expect(normalizedFirstPage.length).toBe(2)
    expect(normalizedFirstPage[0]).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    // Get second page
    const secondPageResponse = await SeriesHelper.listSeries(request, {
      limit: 2,
      offset: 2,
    })
    expect(secondPageResponse.ok()).toBeTruthy()
    const secondPageData = await secondPageResponse.json()
    const normalizedSecondPage = SeriesHelper.normalizeResponse(
      secondPageData.data,
    )
    expect(normalizedSecondPage.length).toBe(1)
    expect(normalizedSecondPage[0]).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    // Get all series
    const allSeriesResponse = await SeriesHelper.listSeries(request)
    expect(allSeriesResponse.ok()).toBeTruthy()
    const allSeriesData = await allSeriesResponse.json()
    const normalizedAllSeries = SeriesHelper.normalizeResponse(
      allSeriesData.data,
    )
    expect(normalizedAllSeries.length).toBe(3)
  })
})
