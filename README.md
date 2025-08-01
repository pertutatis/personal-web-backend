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
└── lib/                  # Shared libraries and configuration
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20.x)
- Docker and Docker Compose
- PostgreSQL client (optional, for direct database access)

## Setup

### 1. Initial Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-web-backend
```

2. Install dependencies:
```bash
npm install
```

### 2. Environment Configuration

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Update the following variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `API_KEY`: Your API key for protected routes

### 3. Database Setup

1. Start the development environment:
```bash
docker compose up -d
```

2. Database schemas will be automatically applied:
- Articles database schema: `databases/blog.sql`

### 4. Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

### Common Setup Issues

#### Database Connection Issues
- Ensure Docker is running
- Check if PostgreSQL port (5432) is not in use
- Verify database credentials in .env file

#### Test Database Issues
- Run `npm run test:setup` to recreate test database
- Check test database credentials in .env.test

## API Documentation

The API documentation is available in two formats:

1. **Swagger UI**: Available at `/api-docs` when running the server
2. **OpenAPI Specification**: Available at `/docs/api/openapi.json`

### Response Codes

- `200`: Success with response body
- `201`: Resource created successfully (no body)
- `204`: Success without response body
- `400`: Validation error
- `404`: Resource not found
- `409`: Conflict (e.g., duplicate ID)

### Articles

- **GET /api/blog/articles**
  - List all articles
  - Query params:
    - page: number (optional, default: 1)
    - limit: number (optional, default: 10, max: 100)
  - Response includes complete book information for referenced books

- **GET /api/blog/articles/:id**
  - Get article by ID (UUID v4)
  - Response includes complete book information

- **POST /api/blog/articles**
  - Create new article (returns 201)
  - Body:
    ```json
    {
      "id": "uuid-v4",
      "title": "string",
      "excerpt": "string (max 160 chars)",
      "content": "string (max 10000 chars)",
      "bookIds": "string[] (UUID v4)",
      "relatedLinks": [
        {
          "text": "string (max 100 chars)",
          "url": "string (valid URL)"
        }
      ]
    }
    ```

- **PUT /api/blog/articles/:id**
  - Update article (returns 204)
  - Body (all fields optional):
    ```json
    {
      "title": "string",
      "excerpt": "string",
      "content": "string",
      "bookIds": "string[]",
      "relatedLinks": [
        {
          "text": "string",
          "url": "string"
        }
      ]
    }
    ```

### Books

- **GET /api/blog/books**
  - List all books
  - Query params:
    - page: number (optional, default: 1)
    - limit: number (optional, default: 10, max: 100)

- **GET /api/blog/books/:id**
  - Get book by ID (UUID v4)

- **POST /api/blog/books**
  - Create new book (returns 201)
  - Body:
    ```json
    {
      "id": "uuid-v4",
      "title": "string",
      "author": "string",
      "isbn": "string (valid ISBN)",
      "description": "string",
      "purchaseLink": "string (valid URL)"
    }
    ```

- **PUT /api/blog/books/:id**
  - Update book (returns 204)
  - Body (all fields optional):
    ```json
    {
      "title": "string",
      "author": "string",
      "isbn": "string",
      "description": "string",
      "purchaseLink": "string"
    }
    ```

## Error Handling

The API provides detailed error responses:

```json
{
  "type": "ErrorType",
  "message": "Detailed error message"
}
```

Common error types:
- `ValidationError`: Invalid input data
- `ResourceNotFound`: Resource does not exist
- `ResourceConflict`: Resource already exists
- `ArticleIdInvalid`: Invalid article UUID format
- `BookIdInvalid`: Invalid book UUID format
- `InvalidBookReference`: Referenced book does not exist

## Testing

The project includes comprehensive test coverage:

### Test Setup

1. Create test database:
```bash
npm run test:setup
```

2. Verify test environment:
```bash
npm run test:verify
```

### Running Tests

```bash
# Run all tests
npm test

# Run E2E tests with fresh environment
npm run test:e2e:fresh

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Types
- Unit tests for domain objects and value objects
- Integration tests for repositories
- Application tests for use cases
- E2E tests for API endpoints

## Development Workflow

### 1. Environment Setup

#### VSCode Configuration
- Install recommended extensions for TypeScript and Jest
- Use provided debugging configurations for easier development

### 2. Coding Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Pre-commit hooks

### 3. Git Workflow
- Feature branches
- Conventional commits
- Pull request workflow
- CI/CD integration

## Documentation

The project includes comprehensive documentation:

### Technical Documentation
- [Architecture Decision Records](./docs/adr)
- [Operation Behavior Rules](./docs/obr)
- [Implementation Plans](./docs/implementation-plans)
- [Testing Guide](./docs/testing)

### API Documentation
- Swagger UI at `/api-docs`
- OpenAPI Specification at `/docs/api/openapi.json`
- [Postman Collection](./docs/postman)

## License

MIT
