# Personal Web Backend - Documentación

Este repositorio contiene el backend para mi web personal, implementado con Next.js, TypeScript y PostgreSQL, siguiendo los principios de Arquitectura Hexagonal y Domain-Driven Design.

## Documentación de la API

La API está completamente documentada utilizando OpenAPI/Swagger. Puedes encontrar la documentación en:

- [Especificación OpenAPI](api/openapi.json)
- [Guía de Uso y Ejemplos](api/examples.md)

## Arquitectura

El proyecto sigue una arquitectura hexagonal (ports & adapters) con:

- [ADR-001: Arquitectura Hexagonal](adr/001-arquitectura-hexagonal.md)
- [ADR-002: Persistencia de Datos](adr/002-persistencia-datos.md)
- [ADR-003: API REST](adr/003-api-rest.md)
- [ADR-004: Object Mother Pattern](adr/004-object-mother-pattern.md)
- [ADR-005: Testing](adr/005-testing.md)
- [ADR-006: Testing E2E](adr/006-testing-e2e.md)

## Estructura del Proyecto

```
src/
├── app/                    # Rutas de Next.js (API endpoints)
├── contexts/              # Bounded contexts
│   ├── blog/             # Contexto del blog
│   │   ├── article/      # Módulo de artículos
│   │   └── book/         # Módulo de libros
│   └── shared/           # Código compartido
└── types/                # Tipos globales
```

## Desarrollo

1. Configuración del entorno:
   ```bash
   cp .env.example .env
   npm install
   ```

2. Iniciar base de datos:
   ```bash
   docker-compose up -d
   ```

3. Ejecutar migraciones:
   ```bash
   psql -h localhost -U postgres -d blog < databases/articles.sql
   psql -h localhost -U postgres -d blog < databases/books.sql
   ```

4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Testing

El proyecto incluye varios tipos de tests:

- Tests unitarios:
  ```bash
  npm run test:unit
  ```

- Tests de integración:
  ```bash
  npm run test:integration
  ```

- Tests end-to-end:
  ```bash
  npm run test:e2e
  ```

## Características Principales

- **API RESTful** para gestión de artículos y libros
- **Arquitectura Hexagonal** para una clara separación de responsabilidades
- **Domain-Driven Design** para modelar el dominio de la aplicación
- **Tests Completos** incluyendo unitarios, integración y e2e
- **Base de Datos PostgreSQL** para persistencia de datos
- **TypeScript** para tipado estático
- **Validaciones Robustas** de datos de entrada
