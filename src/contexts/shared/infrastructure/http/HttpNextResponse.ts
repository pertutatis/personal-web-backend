import { NextResponse } from 'next/server';

type ErrorResponse = {
  type: string;
  message: string;
  stack?: string;
  details?: unknown;
};

export class HttpNextResponse {
  static ok<T>(data: T): NextResponse {
    return NextResponse.json(data, { status: 200 });
  }

  static created<T>(data?: T): NextResponse {
    return NextResponse.json(data || {}, { status: 201 });
  }

  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }

  static badRequest(error: string | ErrorResponse): NextResponse {
    const response = typeof error === 'string' ? { type: 'BadRequest', message: error } : error;
    return NextResponse.json(response, { status: 400 });
  }

  static notFound(error: string | ErrorResponse): NextResponse {
    const response = typeof error === 'string' ? { type: 'NotFound', message: error } : error;
    return NextResponse.json(response, { status: 404 });
  }

  static conflict(error: string | ErrorResponse): NextResponse {
    const response = typeof error === 'string' ? { type: 'Conflict', message: error } : error;
    return NextResponse.json(response, { status: 409 });
  }

  static internalServerError(error: string | ErrorResponse): NextResponse {
    const response = typeof error === 'string' 
      ? { type: 'InternalServerError', message: error } 
      : error;

    if (process.env.NODE_ENV !== 'production') {
      // En desarrollo, incluimos más detalles del error
      return NextResponse.json(response, { status: 500 });
    }

    // En producción, solo enviamos el tipo y mensaje
    const { type, message } = response;
    return NextResponse.json({ type, message }, { status: 500 });
  }
}
