# CORS Implementation Plan

## Problem
Currently experiencing CORS errors when accessing the API from `http://localhost:5173` (Vite frontend) due to missing CORS headers in the API responses.

## Analysis
- We have a proper `CorsMiddleware.ts` with allowed origins configured
- The `applyCorsHeaders` helper function exists but is not being utilized
- `HttpNextResponse` class generates responses without CORS headers

## Solution Plan
Modify the `HttpNextResponse` class to:

1. Import required dependencies:
   ```typescript
   import { applyCorsHeaders } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware';
   ```

2. Update the response methods to include CORS headers:
   - Add an optional `origin` parameter to all methods
   - Apply CORS headers using the `applyCorsHeaders` helper
   - Maintain existing functionality while adding CORS support

3. Example implementation pattern:
   ```typescript
   static ok<T>(data: T, origin?: string): NextResponse {
     const response = NextResponse.json(data, { status: 200 });
     return applyCorsHeaders(response, origin);
   }
   ```

4. This pattern should be applied to all response methods:
   - ok()
   - created()
   - noContent()
   - badRequest()
   - forbidden()
   - notFound()
   - conflict()
   - internalServerError()

## Expected Result
- All API responses will include proper CORS headers
- Frontend requests from `http://localhost:5173` will be successful
- Existing functionality will remain unchanged
- Security will be maintained through the allowed origins list

## Next Steps
1. Switch to Code mode to implement these changes
2. Update the `HttpNextResponse` class
3. Test the changes with the frontend application
