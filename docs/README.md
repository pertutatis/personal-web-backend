# Personal Web Backend - Documentación

Este repositorio contiene el backend para mi web personal, implementado con Next.js, TypeScript y PostgreSQL, siguiendo los principios de Arquitectura Hexagonal y Domain-Driven Design.

## Estructura de la Documentación

### 1. API
- [Especificación OpenAPI](api/openapi.json)
- [Guía de Uso y Ejemplos](api/examples.md)
- [Plan de Documentación](api/documentation-plan.md)

### 2. Arquitectura y Decisiones
- [ADR-001: Arquitectura Hexagonal](adr/001-arquitectura-hexagonal.md)
- [ADR-002: Persistencia de Datos](adr/002-persistencia-datos.md)
- [ADR-003: API REST](adr/003-api-rest.md)
- [ADR-004: Object Mother Pattern](adr/004-object-mother-pattern.md)
- [ADR-005: Testing](adr/005-testing.md)
- [ADR-006: Testing E2E](adr/006-testing-e2e.md)
- [ADR-013: Autenticación JWT](adr/013-autenticacion-jwt.md)

### 3. Reglas de Negocio
- [OBR-001: Reglas de Artículos](obr/001-article-rules.md)
- [OBR-002: Reglas de Libros](obr/002-book-rules.md)
- [OBR-003: Reglas de Autenticación](obr/003-auth-rules.md)

### 4. Planes de Implementación
- [Artículos: UUID en Cliente](implementation-plans/article-client-uuid.md)
- [Artículos: Extractos](implementation-plans/article-excerpt.md)
- [Artículos: Enlaces Relacionados](implementation-plans/article-related-links-and-slug.md)
- [Autenticación](implementation-plans/auth-implementation.md)
- [Middleware de Auth](implementation-plans/auth-middleware.md)
- [Libros: Descripción y Enlaces](implementation-plans/book-description-and-link.md)

### 5. Memory Bank
- [Contexto del Producto](memory-bank/productContext.md)
- [Brief del Proyecto](memory-bank/projectbrief.md)
- [Contexto Técnico](memory-bank/techContext.md)
- [Patrones del Sistema](memory-bank/systemPatterns.md)
- [Progreso](memory-bank/progress.md)
- [Contexto Activo](memory-bank/activeContext.md)

## Características Principales

- **API RESTful** para gestión de artículos y libros
- **Arquitectura Hexagonal** con clara separación de responsabilidades
- **Domain-Driven Design** con agregados, value objects y eventos de dominio
- **Autenticación JWT** con middleware de protección de rutas
- **Tests Completos** (unitarios, integración y e2e)
- **PostgreSQL** con repositorios siguiendo interfaces del dominio
- **TypeScript** con tipos estrictos y validaciones robustas
- **Docker** para desarrollo y testing consistente
- **Documentación Exhaustiva** incluyendo OpenAPI, ADRs y reglas de negocio

## Guías Rápidas

### Documentación Técnica
- Ver [README.md](../README.md) en la raíz para instrucciones de setup
- Ver [progress.md](memory-bank/progress.md) para estado actual y próximos pasos
- Ver [systemPatterns.md](memory-bank/systemPatterns.md) para patrones arquitectónicos

### Testing
- Ver [ADR-005](adr/005-testing.md) para estrategia de testing
- Ver [ADR-006](adr/006-testing-e2e.md) para tests E2E
- Scripts disponibles en `/scripts` para setup de tests

### API
- Swagger UI disponible en `/api-docs` en desarrollo
- Ejemplos de uso en `/docs/api/examples.md`
- Postman collection en desarrollo
