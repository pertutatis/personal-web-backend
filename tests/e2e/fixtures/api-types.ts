export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface BookResponse {
  id: string
  title: string
  author: string
  isbn: string
  description: string
  purchaseLink: string | null
  createdAt: string
  updatedAt: string
}

export interface RelatedLinkResponse {
  text: string
  url: string
}

export interface ArticleResponse {
  id: string
  title: string
  excerpt: string
  content: string
  bookIds: string[]
  relatedLinks: RelatedLinkResponse[]
  slug: string
  createdAt: string
  updatedAt: string
}

export interface ErrorResponse {
  type: string
  message: string
  stack?: string
  details?: unknown
}
