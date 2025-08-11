import { APIRequestContext } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'

export class SeriesAPI {
  constructor(private request: APIRequestContext) {}

  private async getAuthHeaders() {
    const token = await AuthHelper.generateToken()
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  async create(data: { id: string; title: string; description: string }) {
    return this.request.post('/api/backoffice/series', {
      data,
      headers: await this.getAuthHeaders(),
    })
  }

  async getById(id: string) {
    return this.request.get(`/api/backoffice/series/${id}`, {
      headers: await this.getAuthHeaders(),
    })
  }

  async list(params?: { limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.offset) searchParams.set('offset', String(params.offset))

    const url = `/api/backoffice/series${
      searchParams.toString() ? '?' + searchParams.toString() : ''
    }`
    return this.request.get(url, {
      headers: await this.getAuthHeaders(),
    })
  }

  async update(id: string, data: { title?: string; description?: string }) {
    return this.request.put(`/api/backoffice/series/${id}`, {
      data,
      headers: await this.getAuthHeaders(),
    })
  }

  async delete(id: string) {
    return this.request.delete(`/api/backoffice/series/${id}`, {
      headers: await this.getAuthHeaders(),
    })
  }
}
