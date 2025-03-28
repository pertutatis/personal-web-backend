# Active Context

## Current Focus

### API Enhancement - Client-Side UUID Generation
- Modificación del módulo Book para aceptar UUIDs del cliente
- Eliminación de respuestas en create/update
- Implementación de validaciones UUID
- Testing del nuevo enfoque

### API Development
- Implementación de endpoints RESTful
- Validación de inputs
- Manejo de errores HTTP
- Testing E2E

### Arquitectura
- Refinamiento de la arquitectura hexagonal
- Implementación de Domain Events
- Mejora de la estructura de tests

## Recent Changes

### Implementados ✅
1. Arquitectura Hexagonal
   - Separación clara de capas
   - Interfaces de repositorio
   - Value Objects para validaciones

2. Testing
   - Unit tests con Jest
   - Object Mothers para test data
   - Tests E2E con Playwright

3. Infraestructura
   - Configuración de PostgreSQL
   - Docker para desarrollo
   - Scripts de testing

## Next Steps

### Prioridad Alta 🔥
1. Implementar client-side UUID generation
   - Crear nuevos Value Objects para validación UUID
   - Modificar endpoints para 201/204 sin respuesta
   - Actualizar tests
   - Documentar cambios en API

2. Implementar sistema de eventos de dominio
   - Dispatcher de eventos
   - Subscribers
   - Testing de eventos

3. Mejorar documentación API
   - OpenAPI/Swagger
   - Ejemplos de uso
   - Guías de desarrollo

### Prioridad Media 🔸
1. Implementar caché
   - Estrategia de caché
   - Invalidación
   - Testing

2. Añadir rate limiting
   - Configuración por endpoint
   - Headers de rate limit
   - Testing

### Prioridad Baja ⏳
1. Implementar métricas
   - Tiempos de respuesta
   - Errores
   - Dashboard

## Active Decisions & Considerations

### Decisiones Técnicas
1. **Client-Side UUID Generation**
   - UUIDs generados por el cliente
   - Validación de formato y unicidad en servidor
   - Respuestas sin cuerpo para create/update
   - Comenzar por módulo Book como piloto

2. **Persistencia**
   - PostgreSQL como base de datos principal
   - Connection pooling para eficiencia
   - Migraciones SQL manuales por ahora

3. **Testing**
   - Jest para unit/integration
   - Playwright para E2E
   - Object Mothers para datos de test

4. **Arquitectura**
   - Hexagonal con DDD
   - Value Objects para validaciones
   - Events para comunicación entre agregados

### Consideraciones de Mejora
1. **Performance**
   - Implementar caché
   - Optimizar queries
   - Añadir índices

2. **Seguridad**
   - Rate limiting
   - Validación de inputs
   - Sanitización de datos

3. **Mantenibilidad**
   - Mejorar documentación
   - Aumentar cobertura de tests
   - Refactorizar código duplicado
