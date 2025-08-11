import { NextRequest, NextResponse } from 'next/server'
import { container } from '../shared.container'
import { LIST_SERIES_CONTROLLER } from './controllers/list-series.controller'
import { CREATE_SERIES_CONTROLLER } from './controllers/create-series.controller'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')

  return LIST_SERIES_CONTROLLER.run({
    req: request,
    res: NextResponse,
    container,
    params: {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  return CREATE_SERIES_CONTROLLER.run({
    req: request,
    res: NextResponse,
    container,
    body,
  })
}
