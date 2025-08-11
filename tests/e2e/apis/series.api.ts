import { APIRequestContext } from '@playwright/test'

export class SeriesAPI {
  constructor(private readonly request: APIRequestContext) {}

  async create(params: {
    id: string
    title: string
    description: string
  }): Promise<any> {
    return this.request.post('/api/backoffice/series', {
      data: params
    })
  }

  async getById(id: string): Promise<any> {
    return this.request.get(`/api/backoffice/series/${id}`)
  }

  async list(params?: {
    limit?: number
    offset?: number
  }): Promise<any> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    const url = `/api/backoffice/series${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`

    return this.request.get(url)
  }

  async update(id: string, params: {
    title?: string
    description?: string
  }): Promise<any> {
    return this.request.put(`/api/backoffice/series/${id}`, {
      data: params
    })
  }

  async delete(id: string): Promise<any> {
    return this.request.delete(`/api/backoffice/series/${id}`)
  }
}
