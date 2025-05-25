import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add CORS headers
  response.headers.set("access-control-allow-origin", "http://localhost:5173")
  response.headers.set("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("access-control-allow-headers", "Content-Type, Authorization")

  return response
}

export const config = {
  matcher: "/api/:path*"
}
