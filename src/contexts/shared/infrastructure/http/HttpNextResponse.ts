import { NextResponse } from 'next/server';

export class HttpNextResponse {
  static ok(data?: any): NextResponse {
    return NextResponse.json(data, { status: 200 });
  }

  static created(data?: any): NextResponse {
    return NextResponse.json(data, { status: 201 });
  }

  static badRequest(message: string): NextResponse {
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }

  static notFound(message: string): NextResponse {
    return NextResponse.json(
      { error: message },
      { status: 404 }
    );
  }

  static internalServerError(message: string = 'Internal Server Error'): NextResponse {
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
