# System Patterns

## Architecture

- Hexagonal Architecture
- DDD (Domain-Driven Design)
- CQRS pattern for queries and commands
- Event-Driven Architecture

```mermaid
graph TD
    subgraph Blog API
        BC[Blog Controller]
        BA[Blog Application]
        BR[Blog Repository]
    end

    subgraph Backoffice API
        BOC[Backoffice Controller]
        BOA[Backoffice Application]
        BOR[Backoffice Repository]
    end

    subgraph Domain
        A[Article]
        S[Series]
        VOS[Series Value Objects]
        VOA[Article Value Objects]
    end

    subgraph Infrastructure
        DB[(Database)]
        Cache[(Cache)]
    end

    BC --> BA
    BA --> BR
    BR --> DB

    BOC --> BOA
    BOA --> BOR
    BOR --> DB

    A --> VOA
    S --> VOS
    A --> S

    BR --> Cache
    BOR --> Cache
```

## Domain Models

```mermaid
classDiagram
    class Article {
        +ArticleId id
        +ArticleTitle title
        +ArticleContent content
        +ArticleExcerpt excerpt
        +ArticleSlug slug
        +ArticleBookIds bookIds
        +ArticleRelatedLinks relatedLinks
        +ArticleStatus status
        +SeriesId seriesId
        +Date createdAt
        +Date updatedAt
        +publish()
        +update()
        +assignToSeries()
        +removeFromSeries()
    }

    class ArticleSeries {
        +SeriesId id
        +SeriesTitle title
        +SeriesDescription description
        +Date createdAt
        +Date updatedAt
        +create()
        +update()
        +delete()
    }

    class SeriesId {
        +String value
        +validate()
    }

    class SeriesTitle {
        +String value
        +validate()
    }

    class SeriesDescription {
        +String value
        +validate()
    }

    Article "0..*" --> "0..1" ArticleSeries : belongs to
    ArticleSeries --> SeriesId
    ArticleSeries --> SeriesTitle
    ArticleSeries --> SeriesDescription
```

## Event Flow

```mermaid
sequenceDiagram
    participant BOC as Backoffice Controller
    participant BOA as Backoffice Application
    participant DOM as Domain
    participant EVT as Event Bus
    participant REP as Repository
    participant DB as Database

    BOC->>BOA: Create Series
    BOA->>DOM: Create Series Entity
    DOM->>EVT: Emit SeriesCreatedEvent
    DOM->>REP: Save Series
    REP->>DB: Persist
    EVT->>BOA: Handle Event
    BOA->>BOC: Return Response
```

## Design Patterns

- Repository Pattern para acceso a datos
- Factory Pattern para creación de objetos
- Command Pattern para operaciones
- Event-Driven para eventos de dominio
- Strategy Pattern para ordenación de artículos en series
- Observer Pattern para reaccionar a cambios en series
- Decorator Pattern para enriquecer artículos con info de series

## Testing Strategy

- Unit Tests:
  - Lógica de dominio de Series
  - Value Objects de Series
  - Servicios de aplicación
  - Validaciones de negocio
- Integration Tests:
  - Repositorios
  - Eventos de dominio
  - Flujos completos de operaciones
- E2E Tests:
  - Endpoints API
  - Flujos de usuario completos
- Enfoque TDD para todas las nuevas características

## API Design

- Principios REST
- URLs basadas en recursos
- Uso consistente de métodos HTTP
- Formatos de respuesta uniformes
- Manejo adecuado de errores
- Versionado de API cuando sea necesario
- Documentación OpenAPI/Swagger
- Rate Limiting según necesidad

## Database Patterns

- Uso de claves foráneas para integridad referencial
- Índices para optimización de consultas
- Soft deletes para preservar historial
- Timestamps para auditoría
- Constraints de unicidad
- Índices compuestos según patrones de consulta
- Optimización de queries N+1

## Validations

- Validación a nivel de dominio
- Validación de unicidad en base de datos
- Validación de integridad referencial
- Manejo de errores consistente
- Validaciones específicas de series:
  - Unicidad de título
  - Longitud máxima de descripción
  - Referencias válidas de artículos
  - Reglas de negocio de series

## Security Patterns

- Autenticación requerida para operaciones de backoffice
- Autorización basada en roles
- Validación de entrada
- Sanitización de datos
- Protección contra CSRF
- Rate Limiting
- Logging de operaciones sensibles

## Performance Patterns

- Caching de series y artículos
- Lazy loading de relaciones
- Optimización de queries
- Paginación de resultados
- Índices específicos para búsquedas comunes
