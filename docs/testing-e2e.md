# E2E Testing Documentation

## Overview
The e2e tests verify the complete integration of the API endpoints, ensuring that all components work together correctly.

## Test Structure
- `tests/e2e/apis/`: API client wrappers
- `tests/e2e/fixtures/`: Test data and helpers
- `tests/e2e/specs/`: Test specifications

## Running Tests
```bash
# Run all e2e tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug
```

## Test Environment Setup
1. Test databases are created and initialized
2. Next.js application is built
3. Server is started
4. Tests are executed
5. Environment is cleaned up

## Test Coverage

### Books API
- Creation
  - Create valid book
  - Handle invalid ISBN
  - Prevent duplicate ISBN
  - Validate title and author constraints
  - Handle maximum length fields
- Retrieval
  - Get book by ID
  - Handle non-existent books
  - List books with pagination
- Updates
  - Full book update
  - Partial updates (title only, author only)
  - Handle invalid updates
- Deletion
  - Delete existing book
  - Handle non-existent book deletion
- Pagination
  - Handle valid pagination parameters
  - Handle invalid pagination parameters
- Concurrency
  - Handle concurrent book creation

### Articles API
- Creation
  - Create article without books
  - Create article with book references
  - Handle invalid book references
  - Validate content length constraints
- Retrieval
  - Get article by ID
  - Handle non-existent articles
  - List articles with pagination
- Updates
  - Update article content
  - Update book references
  - Handle invalid updates
- Deletion
  - Delete existing article
  - Handle non-existent article deletion
- Pagination
  - Handle valid pagination parameters
  - Handle invalid pagination parameters
- Concurrency
  - Handle concurrent article creation
- Integration
  - Maintain book references after book updates

## Test Data
Test data is organized in fixtures providing:
- Valid test cases
- Invalid test cases
- Edge cases (maximum lengths, etc.)
- Different combinations of data

## Helper Functions
- API clients for books and articles
- Test data setup and cleanup
- Response validation helpers
- Common test patterns

## Best Practices
1. Clean up test data after each test
2. Use typed responses and requests
3. Test both success and error cases
4. Verify side effects (e.g., book references in articles)
5. Test concurrency scenarios
6. Validate response formats and status codes
7. Use meaningful test descriptions

## Adding New Tests
1. Add test data in `fixtures/test-data.ts`
2. Add API client methods if needed
3. Write test cases following existing patterns
4. Ensure proper cleanup in afterEach hooks
5. Verify both success and error scenarios
