import { NextResponse } from 'next/server';
import { applyCorsHeaders } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware';

type ErrorResponse = {
  type: string;
  message: string;
  stack?: string;
  details?: unknown;
};

export class HttpNextResponse {
  static ok<T>(data: T, origin: string | null = null): NextResponse {
    const response = NextResponse.json(data, { status: 200 });
    return applyCorsHeaders(response, origin);
  }

  static created<T>(data?: T, origin: string | null = null): NextResponse {
    const response = data ? NextResponse.json(data, { status: 201 }) : new NextResponse(null, { status: 201 });
    return applyCorsHeaders(response, origin);
  }

  static noContent(origin: string | null = null): NextResponse {
    const response = new NextResponse(null, { status: 204 });
    return applyCorsHeaders(response, origin);
  }

  static badRequest(error: string | ErrorResponse, origin: string | null = null): NextResponse {
    const response = typeof error === 'string' ? { type: 'BadRequest', message: error } : error;
    const nextResponse = NextResponse.json(response, { status: 400 });
    return applyCorsHeaders(nextResponse, origin);
  }

  static forbidden(error: string | ErrorResponse, origin: string | null = null): NextResponse {
    const response = typeof error === 'string' ? { type: 'Forbidden', message: error } : error;
    const nextResponse = NextResponse.json(response, { status: 403 });
    return applyCorsHeaders(nextResponse, origin);
  }

  static unauthorized(error: string | ErrorResponse, origin: string | null = null): NextResponse {
    const response = typeof error === 'string' ? { type: 'Unauthorized', message: error } : error;
    const nextResponse = NextResponse.json(response, { status: 401 });
    return applyCorsHeaders(nextResponse, origin);
  }

  static notFound(error: string | ErrorResponse, origin: string | null = null): NextResponse {
    const response = typeof error === 'string' ? { type: 'NotFound', message: error } : error;
    const nextResponse = NextResponse.json(response, { status: 404 });
    return applyCorsHeaders(nextResponse, origin);
  }

  static conflict(error: string | ErrorResponse, origin: string | null = null): NextResponse {
    const response = typeof error === 'string' ? { type: 'Conflict', message: error } : error;
    const nextResponse = NextResponse.json(response, { status: 409 });
    return applyCorsHeaders(nextResponse, origin);
  }

  static internalServerError(error: string | ErrorResponse, origin: string | null = null): NextResponse {
    const response = typeof error === 'string'
      ? { type: 'InternalServerError', message: error }
      : error;

    let nextResponse;
    if (process.env.NODE_ENV !== 'production') {
      // En desarrollo, incluimos más detalles del error
      nextResponse = NextResponse.json(response, { status: 500 });
    } else {
      // En producción, solo enviamos el tipo y mensaje
      const { type, message } = response;
      nextResponse = NextResponse.json({ type, message }, { status: 500 });
    }

    return applyCorsHeaders(nextResponse, origin);
  }
}
