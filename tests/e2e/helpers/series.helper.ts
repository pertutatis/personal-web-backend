import { APIRequestContext, APIResponse } from '@playwright/test'
import { randomUUID } from 'crypto'
import { AuthHelper } from './auth.helper'

export interface TestSeries {
  id: string
  title: string
  description: string
}

export interface NormalizedSeries extends TestSeries {
  createdAt: string
  updatedAt: string
}

export class SeriesHelper {
  static generateRandomTestSeries(): TestSeries {
    return {
      id: randomUUID(),
      title: `Test Series ${randomUUID().slice(0, 8)}`,
      description: 'Test Description',
    }
  }

  static async cleanupSeries(request: APIRequestContext): Promise<void> {
    try {
      const response = await AuthHelper.makeAuthenticatedRequest(
        request,
        '/api/backoffice/series',
      )

      if (response.ok()) {
        const { data } = await response.json()
        const deletePromises = data.map((series: any) =>
          this.deleteSeries(request, series.id.value || series.id),
        )
        await Promise.all(deletePromises)
      }
    } catch (error) {
      console.error('Error cleaning up series:', error)
    }
  }

  static async createSeries(
    request: APIRequestContext,
    series: TestSeries,
  ): Promise<APIResponse> {
    return AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/series',
      {
        method: 'POST',
        data: series,
      },
    )
  }

  static async updateSeries(
    request: APIRequestContext,
    id: string,
    data: Partial<Omit<TestSeries, 'id'>>,
  ): Promise<APIResponse> {
    return AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/series/${id}`,
      {
        method: 'PUT',
        data,
      },
    )
  }

  static async getSeries(
    request: APIRequestContext,
    id: string,
  ): Promise<APIResponse> {
    return AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/series/${id}`,
    )
  }

  static async deleteSeries(
    request: APIRequestContext,
    id: string,
  ): Promise<APIResponse> {
    return AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/series/${id}`,
      { method: 'DELETE' },
    )
  }

  static async listSeries(
    request: APIRequestContext,
    params?: { limit?: number; offset?: number },
  ): Promise<APIResponse> {
    const queryString = new URLSearchParams()
    if (params?.limit !== undefined) {
      queryString.append('limit', params.limit.toString())
    }
    if (params?.offset !== undefined) {
      queryString.append('offset', params.offset.toString())
    }

    const url = `/api/backoffice/series${
      queryString.toString() ? `?${queryString.toString()}` : ''
    }`

    return AuthHelper.makeAuthenticatedRequest(request, url)
  }

  static normalizeResponse(data: any): NormalizedSeries[] {
    if (Array.isArray(data)) {
      return data.map((item) => this.normalizeItem(item))
    }
    return [this.normalizeItem(data)]
  }

  private static normalizeItem(item: any): NormalizedSeries {
    return {
      id: item.id.value || item.id,
      title: item.title.value || item.title,
      description: item.description.value || item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  }
}
