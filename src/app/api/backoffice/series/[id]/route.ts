import { NextRequest, NextResponse } from 'next/server'
import { container } from '../../shared.container'
import { GET_SERIES_CONTROLLER } from '../controllers/get-series.controller'
import { UPDATE_SERIES_CONTROLLER } from '../controllers/update-series.controller'
import { DELETE_SERIES_CONTROLLER } from '../controllers/delete-series.controller'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return GET_SERIES_CONTROLLER.run({
    req: request,
    res: NextResponse,
    container,
    params,
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json()

  return UPDATE_SERIES_CONTROLLER.run({
    req: request,
    res: NextResponse,
    container,
    params,
    body,
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return DELETE_SERIES_CONTROLLER.run({
    req: request,
    res: NextResponse,
    container,
    params,
  })
}
