# System Patterns

## System Architecture

### API Controllers Structure (Next.js)
```mermaid
flowchart TD
    subgraph API[API Layer]
        R[route.ts] --> G[GET Handler]
        R --> P[POST Handler]
        R --> U[PUT Handler]
        R --> D[DELETE Handler]
    end
    
    subgraph Application[Application Layer]
        UC[Use Cases]
    end
    
    G --> UC
    P --> UC
    U --> UC
    D --> UC
```

Los controladores API se mantienen en un único archivo route.ts por:
- Mejor cohesión de endpoints relacionados
- Facilita compartir configuración (ej: conexiones DB)
- Controladores delgados que solo orquestan casos de uso
- Sigue el principio "Common Closure Principle"


### Arquitectura Hexagonal (Ports & Adapters)
```mermaid
flowchart TB
    subgraph Domain
        D[Domain Models]
        R[Repository Interfaces]
    end
    
    subgraph Application
        UC[Use Cases]
    end
    
    subgraph Infrastructure
        API[API Routes]
        DB[Postgres Repository]
    end
    
    API --> UC
    UC --> D
    UC --> R
    DB --> R
```

1. **Domain Layer**
   - Modelos de dominio (Article, Book)
   - Interfaces de repositorio
   - Value Objects
   - Domain Events
   - Reglas de negocio

2. **Application Layer**
   - Casos de uso (Create, Update, Delete, List)
   - Orquestación de entidades
   - Validaciones de aplicación

3. **Infrastructure Layer**
   - Implementaciones de repositorio
   - Controladores API
   - Configuración de base de datos

## Key Technical Decisions

### 1. Value Objects
- Encapsulación de reglas de validación
- Inmutabilidad
- Auto-validación
Ejemplos: ArticleTitle, BookIsbn, ArticleContent

### 2. Repository Pattern
- Abstracción de persistencia
- Interfaces en dominio
- Implementaciones en infraestructura
- Soporte para testing

### 3. Object Mother Pattern
- Creación de objetos para testing
- Generadores de datos válidos/inválidos
- Reutilización en tests

### 4. Domain Events
- Eventos para cambios importantes
- ArticleCreatedDomainEvent
- BookUpdatedDomainEvent

## Design Patterns in Use

### Creational Patterns
- Factory Method (en Value Objects)
- Object Mother (testing)

### Structural Patterns
- Adapter (en repositorios)
- Composite (en Value Objects)

### Behavioral Patterns
- Observer (Domain Events)
- Command (Use Cases)

## Component Relationships

### Articles Context
```mermaid
flowchart LR
    subgraph Backoffice
        A[Article] --> AVO[Value Objects]
        A --> B[Book References]
        AR[ArticleRepository] --> A
        UC[Use Cases] --> AR
    end

    subgraph Blog
        BA[BlogArticle] --> BB[BlogBook]
        BAR[BlogArticleRepository] --> BA
        BUC[Blog Use Cases] --> BAR
    end

    A --> BA
```

### Books Context
```mermaid
flowchart LR
    B[Book] --> BVO[Value Objects]
    BR[BookRepository] --> B
    UC[Use Cases] --> BR
```

### Shared Context
```mermaid
flowchart TB
    VO[Value Objects]
    DE[Domain Events]
    AR[Aggregate Root]
    
    Article --> AR
    Book --> AR
    Article --> DE
    Book --> DE
```

## Testing Strategy

1. **Unit Tests**
   - Domain Models
   - Value Objects
   - Use Cases

2. **Integration Tests**
   - Repositories
   - Database Operations

3. **E2E Tests**
   - API Endpoints
   - Full Flow Testing
