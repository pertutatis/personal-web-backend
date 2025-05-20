import { NextRequest, NextResponse } from 'next/server'
import { AuthMiddleware } from '../AuthMiddleware'
import { JWTGenerator } from '@/contexts/backoffice/auth/domain/JWTGenerator'
import { TokenPayload } from '@/contexts/backoffice/auth/domain/TokenPayload'

class MockRequest extends NextRequest {
  constructor(headers: Record<string, string> = {}) {
    super(new URL('http://localhost'), {
      headers: new Headers(headers)
    })
  }
}

describe('AuthMiddleware', () => {
  const mockToken = 'valid.mock.token'
  const mockPayload: TokenPayload = {
    id: 'test-id',
    email: 'test@email.com'
  }

  let jwtGenerator: jest.Mocked<JWTGenerator>
  let middleware: AuthMiddleware

  beforeEach(() => {
    jwtGenerator = {
      generate: jest.fn(),
      verify: jest.fn()
    }

    middleware = new AuthMiddleware(jwtGenerator)
  })

  it('should return 401 when no token is provided', async () => {
    const request = new MockRequest()
    const response = await middleware.execute(request)

    expect(response instanceof NextResponse).toBe(true)
    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({
      type: 'UnauthorizedError',
      message: 'No token provided'
    })
  })

  it('should return 401 when Authorization header format is invalid', async () => {
    const request = new MockRequest({
      'Authorization': 'InvalidFormat'
    })
    const response = await middleware.execute(request)

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({
      type: 'UnauthorizedError',
      message: 'Invalid token format'
    })
  })

  it('should return 401 when token verification fails', async () => {
    const request = new MockRequest({
      'Authorization': `Bearer ${mockToken}`
    })

    jwtGenerator.verify.mockRejectedValue(new Error('Invalid token'))
    const response = await middleware.execute(request)

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({
      type: 'UnauthorizedError',
      message: 'Invalid token'
    })
  })

  it('should call next() and add user info when token is valid', async () => {
    const request = new MockRequest({
      'Authorization': `Bearer ${mockToken}`
    })

    jwtGenerator.verify.mockResolvedValue(mockPayload)
    const response = await middleware.execute(request)

    expect(response instanceof NextResponse).toBe(true)
    expect(response.status).toBe(200) // NextResponse.next() returns 200
    expect(response.headers.get('x-user-info')).toBe(JSON.stringify(mockPayload))
  })
})
