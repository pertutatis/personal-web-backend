import { NextRequest, NextResponse } from 'next/server'
import { DomainError } from '../../domain/DomainError'
import { HttpNextResponse } from './HttpNextResponse'
import { NotFoundError } from '../../domain/NotFoundError'
import { ValidationError } from '../../domain/ValidationError'

interface ErrorInfo {
  type: string
  message: string
  stack?: string
  details?: unknown
}

export async function executeWithErrorHandling(
  action: () => Promise<NextResponse>,
  request?: NextRequest,
): Promise<NextResponse> {
  const origin = request?.headers.get('origin') ?? null
  try {
    return await action()
  } catch (error: unknown) {
    const errorInfo: ErrorInfo = {
      type: error instanceof Error ? error.constructor.name : 'UnknownError',
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined,
      details: error instanceof DomainError ? error.toJSON() : undefined,
    }

    if (error instanceof NotFoundError) {
      return HttpNextResponse.notFound(
        {
          type: error.type,
          message: error.message,
        },
        origin,
      )
    }

    if (error instanceof ValidationError) {
      return HttpNextResponse.badRequest(
        {
          type: 'ValidationError',
          message: error.message,
          details: { errorCode: error.code },
        },
        origin,
      )
    }

    if (error instanceof DomainError) {
      return HttpNextResponse.badRequest(
        {
          type: error.type,
          message: error.message,
        },
        origin,
      )
    }

    // Handle database errors
    if (error instanceof Error) {
      // Handle unique constraint violations
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        return HttpNextResponse.badRequest(
          {
            type: 'ValidationError',
            message: 'A record with this unique identifier already exists',
          },
          origin,
        )
      }

      // Handle other database errors
      if (
        error.message.includes('connection') ||
        error.message.includes('database')
      ) {
        console.error('Database error:', errorInfo)
        return HttpNextResponse.internalServerError(
          {
            type: 'DatabaseError',
            message: 'Database connection error',
          },
          origin,
        )
      }
    }

    // Handle unexpected errors
    console.error('Unexpected error:', errorInfo)

    if (process.env.NODE_ENV === 'development') {
      return HttpNextResponse.internalServerError(
        {
          type: 'InternalServerError',
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          stack: error instanceof Error ? error.stack : undefined,
        },
        origin,
      )
    }

    return HttpNextResponse.internalServerError(
      {
        type: 'InternalServerError',
        message: 'An unexpected error occurred',
      },
      origin,
    )
  }
}
