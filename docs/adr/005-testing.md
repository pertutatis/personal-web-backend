# Testing Guide

## Setup

Before running tests, make sure you have:
1. Docker installed and running
2. Node.js >= 20.0.0 installed
3. Project dependencies installed (`npm install`)

## Test Environment Setup

The project uses PostgreSQL for both production and test databases. To set up the test environment:

```bash
npm run test:setup
```

This script will:
- Start required Docker containers
- Create test databases
- Apply database schemas
- Configure test environment

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### CI Mode
```bash
npm run test:ci
```

## Test Structure

The tests are organized following the same structure as the source code:

```
src/
├── contexts/
│   ├── blog/
│   │   ├── article/
│   │   │   ├── application/
│   │   │   │   └── __tests__/        # Application layer tests
│   │   │   ├── domain/
│   │   │   │   └── __tests__/        # Domain layer tests
│   │   │   └── infrastructure/
│   │   │       └── __tests__/        # Infrastructure layer tests
│   │   └── book/
│   │       ├── application/
│   │       │   └── __tests__/
│   │       ├── domain/
│   │       │   └── __tests__/
│   │       └── infrastructure/
│   │           └── __tests__/
│   └── shared/
│       ├── domain/
│       │   └── __tests__/
│       └── infrastructure/
│           └── __tests__/
```

## Writing Tests

### Domain Tests
- Test value objects validation
- Test entity business rules
- Test domain events

### Application Tests
- Test use case behavior
- Test error handling
- Mock repositories

### Infrastructure Tests
- Test repository implementations
- Test database operations
- Use TestHelper for database cleanup

## Test Helpers

The project provides several test helpers:

### TestHelper
```typescript
// Clean database before tests
await TestHelper.cleanDatabase('test_articles');

// Get database connection
const connection = await TestHelper.getConnection('test_articles');

// Clean all databases
await TestHelper.cleanAllDatabases();
```

### Collection Helper
```typescript
// Create paginated collection
const collection = Collection.create(items, {
  page: 1,
  limit: 10,
  total: items.length
});

// Create empty collection
const empty = Collection.empty();
```

## Best Practices

1. Clean database state before each test
2. Use descriptive test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies
5. Test error cases
6. Keep tests independent
7. Use meaningful test data
8. Test boundary conditions
