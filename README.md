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
docker-compose up -d
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

Run all tests:
```bash
npm test
```

The project includes:
- Unit tests for domain objects
- Integration tests for repositories
- E2E tests for API endpoints

### Test Database Setup

Integration tests use separate test databases that are automatically created and cleaned up during test runs.

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

1. Coding Standards:
   - TypeScript for type safety
   - ESLint for code quality
   - Prettier for code formatting

2. Git Workflow:
   - Feature branches
   - Pull request reviews
   - Automated testing on CI

3. Database Management:
   - PostgreSQL for persistence
   - Separate databases for articles and books
   - Automatic schema initialization

## Documentation

- [Architecture Decision Records](./docs/adr)
- [Operation Behavior Rules](./docs/obr)
- [Setup Documentation](./docs/setup)

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
