# Active Context

## Current Focus
Implementación de sistema de autenticación JWT para proteger las rutas de la API del backoffice.

## Recent Changes
1. Creación de ADR para autenticación JWT
2. Definición de reglas de negocio para autenticación (OBR)
3. Planificación de nuevo contexto acotado para Auth

## Next Steps
1. Implementar el nuevo contexto de Auth siguiendo la arquitectura hexagonal:
   - Crear dominio (User, Token, AuthRepository)
   - Implementar casos de uso (Login, Register, ValidateToken)
   - Desarrollar infraestructura (JWTService, PostgresAuthRepository)

2. Implementar middleware de autenticación:
   - Validación de tokens
   - Inyección de contexto de usuario
   - Manejo de errores

3. Implementar endpoints de autenticación:
   - /api/backoffice/auth/login
   - /api/backoffice/auth/register
   - /api/backoffice/auth/refresh-token

4. Actualizar documentación swagger

## Active Decisions
1. Uso de JWT para autenticación stateless
2. Creación de nuevo contexto acotado para Auth
3. Implementación de roles básicos (admin, editor)

## Key Considerations
1. **Seguridad**:
   - Validación robusta de tokens
   - Hashing seguro de passwords
   - Protección contra ataques comunes

2. **Rendimiento**:
   - Optimización de validación de tokens
   - Caché de usuarios autenticados
   - Manejo eficiente de refresh tokens

3. **Mantenibilidad**:
   - Separación clara de responsabilidades
   - Tests exhaustivos
   - Documentación actualizada

4. **Integración**:
   - Frontend Vue.js
   - API Next.js
   - Base de datos PostgreSQL

## Current Challenges
1. Gestión eficiente de refresh tokens
2. Implementación de roles y permisos
3. Integración con el frontend existente

## Testing Strategy
1. Unit tests para lógica de dominio
2. Integration tests para persistencia
3. E2E tests para flujos de autenticación
4. Tests de seguridad
