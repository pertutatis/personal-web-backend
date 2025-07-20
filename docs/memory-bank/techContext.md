# Technical Context

## Core Technologies

### Backend Framework
- **Next.js 14+**
  - API Routes
  - TypeScript support
  - File-based routing
  - Built-in performance optimizations

### Database
- **PostgreSQL (Desarrollo/Test)**
  - Relational database
  - ACID compliance
  - JSON support
  - Robust indexing
- **Supabase (Producción)**
  - PostgreSQL as a service
  - Built-in connection pooling
  - Automatic backups
  - Escalabilidad automática

### Language
- **TypeScript**
  - Static typing
  - Enhanced IDE support
  - Better maintainability
  - Decorators support

## Development Setup

### Environment Requirements
```bash
Node.js >= 18
PostgreSQL >= 14
Docker (opcional)
```

### Project Structure
```
src/
├── app/              # Next.js app directory
│   └── api/          # API routes
├── contexts/         # Bounded contexts
│   ├── blog/         # Blog context
│   │   ├── article/  # Article aggregate
│   │   └── book/     # Book aggregate
│   └── shared/       # Shared kernel
│       └── infrastructure/
│           ├── persistence/
│           │   ├── PostgresRepository.ts
│           │   └── SupabaseRepository.ts
└── types/           # TypeScript definitions
```

### Development Tools
1. **Testing**
   - Jest for unit/integration tests
   - Playwright for E2E testing
   - Object Mothers for test data

2. **Code Quality**
   - ESLint
   - TypeScript strict mode
   - Editor Config

3. **Docker**
   - Development environment
   - PostgreSQL container
   - Test environment

## Technical Constraints

### Database Configuration
```bash
# Producción (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://puawbpuoeqhgprxadrxd.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_Iejo04gqjj897USZg_7VyQ_9Rbxf7Xe

# Desarrollo/Test (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Performance Requirements
- Response time < 200ms
- Efficient pagination
- Optimized database queries
- Consistent performance across environments

### Security Constraints
- Input validation
- SQL injection prevention
- Rate limiting (pendiente)
- Environment-specific security configs

### Scalability Requirements
- Stateless API design
- Connection pooling
- Caching (pendiente)
- Environment-specific optimizations

## Dependencies

### Production Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "pg": "^8.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "typescript": "^5.0.0"
}
```

### Development Dependencies
```json
{
  "jest": "^29.0.0",
  "playwright": "^1.0.0",
  "@types/node": "^18.0.0",
  "@types/react": "^18.0.0",
  "@typescript-eslint/eslint-plugin": "^5.0.0",
  "eslint": "^8.0.0"
}
```

## Configuration Files

### TypeScript
```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Jest
```javascript
{
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}
```

## Database Schema

### Articles Table
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  book_ids UUID[] NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### Books Table
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  isbn VARCHAR(13) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

## Environment Management
- Producción: Supabase
- Desarrollo: PostgreSQL local
- Testing: PostgreSQL local en contenedor
- CI/CD: PostgreSQL en pipeline
