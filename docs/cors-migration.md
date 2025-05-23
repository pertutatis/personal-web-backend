# Migración de CORS y Estandarización de Endpoints

## Problema
Los endpoints de la API no tienen una implementación consistente de CORS y manejo de errores. Algunos usan respuestas nativas de Next.js mientras que otros usan HttpNextResponse.

## Solución
Estandarizar todos los endpoints para que:
1. Usen HttpNextResponse para las respuestas
2. Implementen el manejador OPTIONS para CORS
3. Usen executeWithErrorHandling con soporte CORS

## Endpoints que necesitan actualización

### Auth
- [ ] `/api/auth/login/route.ts`
- [ ] `/api/auth/register/route.ts`

### Backoffice
- [x] `/api/backoffice/articles/route.ts` (completado)
- [ ] `/api/backoffice/articles/[id]/route.ts`
- [ ] `/api/backoffice/articles/by-slug/[slug]/route.ts`
- [ ] `/api/backoffice/books/route.ts`
- [ ] `/api/backoffice/books/[id]/route.ts`

### Blog
- [ ] `/api/blog/articles/route.ts`
- [ ] `/api/blog/articles/by-slug/[slug]/route.ts`

## Ejemplo de migración (login endpoint)

```typescript
import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
// ... otros imports

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(
    async () => {
      const body = await request.json()
      const { email, password } = body

      if (!email || !password) {
        return HttpNextResponse.badRequest('Email and password are required')
      }

      // ... resto de la lógica

      return HttpNextResponse.ok({ token })
    },
    request
  )
}

export async function OPTIONS(request: NextRequest) {
  const response = await corsMiddleware(request)
  return response
}
```

## Pasos para cada endpoint

1. Importar las dependencias necesarias:
   ```typescript
   import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
   import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
   import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
   ```

2. Reemplazar las respuestas nativas por HttpNextResponse:
   - `new Response()` → `HttpNextResponse.ok()`
   - `{ status: 400 }` → `HttpNextResponse.badRequest()`
   - `{ status: 500 }` → `HttpNextResponse.internalServerError()`

3. Envolver la lógica del endpoint en executeWithErrorHandling:
   ```typescript
   return executeWithErrorHandling(async () => {
     // lógica del endpoint
   }, request)
   ```

4. Añadir el manejador OPTIONS:
   ```typescript
   export async function OPTIONS(request: NextRequest) {
     const response = await corsMiddleware(request)
     return response
   }
   ```

## Beneficios
- Manejo consistente de CORS en toda la API
- Manejo de errores estandarizado
- Respuestas HTTP consistentes
- Soporte para preflight requests en todos los endpoints
