import { getApiDocs } from '@/lib/swagger'
import { NextResponse } from 'next/server'

export function GET() {
  const spec = getApiDocs()
  return NextResponse.json(spec)
}
