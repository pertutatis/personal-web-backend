import { corsMiddleware, applyCorsHeaders } from '../CorsMiddleware';
import { NextRequest, NextResponse } from 'next/server';

describe('CorsMiddleware', () => {
  const mockRequest = (origin: string | null = null): NextRequest => {
    const headers = new Headers();
    if (origin) {
      headers.set('origin', origin);
    }

    return new NextRequest('https://example.com', {
      method: 'GET',
      headers
    });
  };

  describe('corsMiddleware', () => {
    it('should allow requests from diegopertusa.com', () => {
      const request = mockRequest('https://diegopertusa.com');
      const response = corsMiddleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe('https://diegopertusa.com');
    });

    it('should allow requests from netlify app', () => {
      const request = mockRequest('https://diegopertusa.netlify.app');
      const response = corsMiddleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe('https://diegopertusa.netlify.app');
    });

    it('should allow requests from localhost', () => {
      const request = mockRequest('http://localhost:3000');
      const response = corsMiddleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
    });

    it('should block requests from non-allowed origins', () => {
      const request = mockRequest('https://malicious-site.com');
      const response = corsMiddleware(request);

      expect(response.status).toBe(403);
      expect(response.headers.get('access-control-allow-origin')).toBeNull();
    });

    it('should block requests without origin header', () => {
      const request = mockRequest();
      const response = corsMiddleware(request);

      expect(response.status).toBe(403);
      expect(response.headers.get('access-control-allow-origin')).toBeNull();
    });
  });

  describe('applyCorsHeaders', () => {
    it('should apply CORS headers for allowed origins', () => {
      const origin = 'https://diegopertusa.com';
      const response = applyCorsHeaders(
        new NextResponse(null, { status: 200 }),
        origin
      );

      expect(response.headers.get('access-control-allow-origin')).toBe(origin);
      expect(response.headers.get('access-control-allow-methods')).toBe('GET, OPTIONS');
      expect(response.headers.get('access-control-allow-headers')).toBe('Content-Type, Authorization');
    });

    it('should not apply CORS headers for non-allowed origins', () => {
      const origin = 'https://malicious-site.com';
      const response = applyCorsHeaders(
        new NextResponse(null, { status: 200 }),
        origin
      );

      expect(response.headers.get('access-control-allow-origin')).toBeNull();
      expect(response.headers.get('access-control-allow-methods')).toBeNull();
      expect(response.headers.get('access-control-allow-headers')).toBeNull();
    });

    it('should handle preflight requests correctly', () => {
      const request = new NextRequest('https://example.com', {
        method: 'OPTIONS',
        headers: new Headers({
          'origin': 'https://diegopertusa.com',
          'access-control-request-method': 'GET'
        })
      });

      const response = corsMiddleware(request);

      expect(response.status).toBe(204);
      expect(response.headers.get('access-control-allow-origin')).toBe('https://diegopertusa.com');
      expect(response.headers.get('access-control-allow-methods')).toBe('GET, OPTIONS');
      expect(response.headers.get('access-control-max-age')).toBe('3600');
    });

    it('should handle preflight requests from non-allowed origins', () => {
      const request = new NextRequest('https://example.com', {
        method: 'OPTIONS',
        headers: new Headers({
          'origin': 'https://malicious-site.com',
          'access-control-request-method': 'GET'
        })
      });

      const response = corsMiddleware(request);

      expect(response.status).toBe(403);
      expect(response.headers.get('access-control-allow-origin')).toBeNull();
    });
  });
});
