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
        BAC[Article Application]
        BSC[Series Application]
        BAR[Article Repository]
        BSR[Series Repository]
    end

    subgraph Backoffice API
        BOC[Backoffice Controller]
        BOAC[Article Application]
        BOSC[Series Application]
        BOAR[Article Repository]
        BOSR[Series Repository]
    end

    subgraph Domain
        subgraph Articles
            A[Article]
            VOA[Article Value Objects]
        end

        subgraph Series
            S[Series]
            VOS[Series Value Objects]
        end

        EB[Event Bus]
    end

    subgraph Infrastructure
        DB[(Database)]
        Cache[(Cache)]
    end

    A --> VOA
    S --> VOS
    A -.-> S

    BC --> BAC
    BC --> BSC
    BAC --> BAR
    BSC --> BSR

    BOC --> BOAC
    BOC --> BOSC
    BOAC --> BOAR
    BOSC --> BOSR

    BAR --> DB
    BSR --> DB
    BOAR --> DB
    BOSR --> DB

    A --> EB
    S --> EB
    EB --> BAC
    EB --> BSC
    EB --> BOAC
    EB --> BOSC
```

## Domain Models

### Articles Domain

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

    class ArticleRepository {
        +findAll()
        +findById()
        +save()
        +update()
        +findBySeries()
    }
```

### Series Domain

```mermaid
classDiagram
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

    class SeriesRepository {
        +findAll()
        +findById()
        +save()
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

    ArticleSeries --> SeriesId
    ArticleSeries --> SeriesTitle
    ArticleSeries --> SeriesDescription
```

## Event Flow

```mermaid
sequenceDiagram
    participant BOC as Backoffice Controller
    participant BOSC as Series Application
    participant BOAC as Article Application
    participant DOM as Domain
    participant EVT as Event Bus
    participant REP as Repositories
    participant DB as Database

    BOC->>BOSC: Create Series
    BOSC->>DOM: Create Series Entity
    DOM->>EVT: Emit SeriesCreatedEvent
    DOM->>REP: Save Series
    REP->>DB: Persist Series
    EVT->>BOAC: Update Article References
    BOAC->>REP: Update Articles
    REP->>DB: Persist Articles
    BOAC->>BOC: Return Response
```

## Design Patterns

- Repository Pattern para cada dominio
- Factory Pattern para creación de objetos
- Command Pattern para operaciones
- Event-Driven para comunicación entre dominios
- Strategy Pattern para ordenación de artículos
- Observer Pattern para reacciones a eventos
- Decorator Pattern para enriquecer respuestas

## Testing Strategy

- Unit Tests por dominio:
  - Lógica de dominio
  - Value Objects
  - Servicios de aplicación
  - Validaciones
- Integration Tests:
  - Repositorios por dominio
  - Comunicación entre dominios
  - Eventos de dominio
- E2E Tests:
  - Endpoints API
  - Flujos completos

## API Design

- Principios REST
- Separación de endpoints por dominio
- Uso consistente de métodos HTTP
- Formatos de respuesta uniformes
- Manejo de errores por dominio
- Documentación OpenAPI/Swagger

## Database Patterns

- Tablas separadas por dominio
- Claves foráneas para referencias
- Índices optimizados por dominio
- Soft deletes donde aplique
- Timestamps para auditoría
- Constraints específicos por dominio

## Security Patterns

- Autenticación requerida para operaciones de backoffice
- Autorización basada en roles
- Validación de entrada por dominio
- Sanitización de datos
- Protección contra CSRF
- Rate Limiting por endpoints

## Performance Patterns

- Caching por dominio
- Lazy loading de relaciones
- Optimización de queries
- Paginación de resultados
- Índices específicos por dominio
