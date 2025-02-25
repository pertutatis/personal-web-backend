import { NextResponse } from 'next/server';
import { DomainError } from '../../domain/DomainError';
import { HttpNextResponse } from './HttpNextResponse';

export async function executeWithErrorHandling(action: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await action();
  } catch (error) {
    console.error('Error executing action:', error);

    if (error instanceof DomainError) {
      return HttpNextResponse.badRequest(error.message);
    }

    // Handle unexpected errors
    return HttpNextResponse.internalServerError();
  }
}
