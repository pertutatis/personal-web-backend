# Active Context

## Current Focus
1. Implementación de sistema de autenticación JWT para proteger las rutas de la API del backoffice
2. Sistema de eventos para mejorar la comunicación entre módulos
3. Mejora de documentación y guías de desarrollo

## Recent Changes
1. Implementación completa de generación de UUIDs en cliente
2. Documentación OpenAPI/Swagger actualizada
3. Creación de ADR para autenticación JWT
4. Definición de reglas de negocio para autenticación (OBR)
5. Planificación de nuevo contexto acotado para Auth

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

4. Implementar sistema de eventos:
   - Event dispatcher
   - Event subscribers
   - Testing de eventos

5. Completar documentación:
   - Crear Postman collection
   - Desarrollar guías de contribución
   - Actualizar ejemplos de código

## Active Decisions
1. Uso de JWT para autenticación stateless
2. Creación de nuevo contexto acotado para Auth
3. Implementación de roles básicos (admin, editor)
4. Client-side UUID generation para mejorar la experiencia del cliente
5. Documentación OpenAPI como fuente única de verdad para la API

## Key Considerations
1. **Seguridad**:
   - Validación robusta de tokens
   - Hashing seguro de passwords
   - Protección contra ataques comunes
   - Validación de UUIDs del cliente

2. **Rendimiento**:
   - Optimización de validación de tokens
   - Caché de usuarios autenticados
   - Manejo eficiente de refresh tokens
   - Optimización de queries N+1

3. **Mantenibilidad**:
   - Separación clara de responsabilidades
   - Tests exhaustivos
   - Documentación actualizada
   - Sistema de eventos para desacoplamiento

4. **Integración**:
   - Frontend Vue.js
   - API Next.js
   - Base de datos PostgreSQL
   - Swagger UI para documentación interactiva

## Current Challenges
1. Gestión eficiente de refresh tokens
2. Implementación de roles y permisos
3. Integración con el frontend existente
4. Implementación del sistema de eventos
5. Optimización de queries N+1 en listado de artículos

## Testing Strategy
1. Unit tests para lógica de dominio
2. Integration tests para persistencia
3. E2E tests para flujos de autenticación
4. Tests de seguridad
5. Tests de eventos
6. Tests de contratos API
