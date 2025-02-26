# Personal Web Backend

Backend service for managing blog articles and books using Domain-Driven Design and Hexagonal Architecture.

## Project Structure

```
src/
├── app/                    # Next.js API routes
├── contexts/              # Bounded contexts
│   ├── blog/             # Blog context
│   │   ├── article/      # Article aggregate
│   │   └── book/         # Book aggregate
│   └── shared/           # Shared kernel
└── databases/            # Database schemas
```

## Requirements

- Node.js 20.x
- Docker and Docker Compose
- PostgreSQL (handled by Docker)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-web-backend
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
npm install
```

4. Start the development environment:
```bash
docker compose up -d
```

5. Run database migrations (executed automatically by Docker):
- Articles database schema: `databases/articles.sql`
- Books database schema: `databases/books.sql`

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Articles

- **GET /api/blog/articles**
  - List all articles
  - Query params:
    - page: number (optional)
    - limit: number (optional)
  - Response includes complete book information for referenced books

- **GET /api/blog/articles/:id**
  - Get article by ID
  - Response includes complete book information

- **POST /api/blog/articles**
  - Create new article
  - Body:
    ```json
    {
      "title": "string",
      "content": "string",
      "bookIds": "string[]"
    }
    ```

- **PUT /api/blog/articles/:id**
  - Update article
  - Body:
    ```json
    {
      "title": "string",
      "content": "string",
      "bookIds": "string[]"
    }
    ```

### Books

- **GET /api/blog/books**
  - List all books
  - Query params:
    - page: number (optional)
    - limit: number (optional)

- **GET /api/blog/books/:id**
  - Get book by ID

- **POST /api/blog/books**
  - Create new book
  - Body:
    ```json
    {
      "title": "string",
      "author": "string",
      "isbn": "string"
    }
    ```

- **PUT /api/blog/books/:id**
  - Update book
  - Body:
    ```json
    {
      "title": "string",
      "author": "string",
      "isbn": "string"
    }
    ```

## Testing

The project includes comprehensive test coverage:

### Test Types
- Unit tests for domain objects and value objects
- Integration tests for repositories and database operations
- Application tests for use cases and business logic
- E2E tests for API endpoints

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Environment Setup

1. Set up test environment (required once):
```bash
npm run test:setup
```
This will:
- Start required Docker containers
- Create test databases
- Apply database schemas
- Configure test environment

2. Test databases:
- Separate databases for tests
- Automatic cleanup between test runs
- Isolated from development databases

### Test Structure

Tests follow the project's structure:
```
src/
├── contexts/
    ├── blog/
    │   ├── article/
    │   │   ├── application/__tests__/    # Use case tests
    │   │   ├── domain/__tests__/         # Domain object tests
    │   │   └── infrastructure/__tests__/  # Repository tests
    │   └── book/
    │       ├── application/__tests__/
    │       ├── domain/__tests__/
    │       └── infrastructure/__tests__/
```

## Architecture

This project follows:
- Hexagonal Architecture (Ports and Adapters)
- Domain-Driven Design principles
- SOLID principles
- Clean Architecture patterns

### Key Patterns Used

1. **Aggregates**:
   - Article (root)
   - Book (root)

2. **Value Objects**:
   - ArticleTitle, ArticleContent, ArticleBookIds
   - BookTitle, BookAuthor, BookIsbn

3. **Domain Events**:
   - ArticleCreated, ArticleUpdated
   - BookCreated, BookUpdated

4. **Repositories**:
   - ArticleRepository
   - BookRepository

## Development

### Available Commands

```bash
# Start development server
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm run start
```

### Development Workflow

1. Coding Standards:
   - TypeScript for type safety
   - ESLint for code quality (`npm run lint`)
   - Prettier for code formatting (`npm run format`)
   - Pre-commit hooks for code quality

2. Git Workflow:
   - Create feature branch: `git checkout -b feature/nombre-feature`
   - Commit using conventional commits: `type(scope): message`
   - Push changes: `git push origin feature/nombre-feature`
   - Create pull request
   - Automated CI checks
   - Code review process
   - Merge after approval

3. Database Management:
   - PostgreSQL for persistence
   - Separate databases for articles and books
   - Schema files in `databases/` directory
   - Automatic schema initialization on Docker startup
   - Test databases managed separately

## Documentation

The project includes comprehensive documentation:

### Architecture Documentation
- [Architecture Decision Records](./docs/adr)
  - `001-arquitectura-hexagonal.md`: Decisiones sobre arquitectura hexagonal
  - `002-persistencia-datos.md`: Estrategia de persistencia de datos
  - `003-api-rest.md`: Diseño de la API REST

### Business Rules
- [Operation Behavior Rules](./docs/obr)
  - `001-article-rules.md`: Reglas de negocio para artículos
  - `002-book-rules.md`: Reglas de negocio para libros

### Technical Setup
- [Setup Documentation](./docs/setup)
  - `path-aliases.md`: Configuración de alias de rutas
  - `path-aliases-implementation.md`: Implementación técnica de los alias

### Additional Resources
- [Testing Guide](./docs/testing.md): Guía detallada de pruebas
- [Prompts](./docs/prompts): Documentación de tareas y prompts

## Error Handling

The application implements comprehensive error handling:
- Domain-specific errors
- HTTP-specific responses
- Validation errors
- Database errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT
