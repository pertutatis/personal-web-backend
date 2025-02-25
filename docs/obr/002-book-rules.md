# Book Rules

## Use Cases

### 1. Create Book
- **Primary Flow**:
  1. Receive title, author, and ISBN
  2. Validate all inputs
  3. Create new book
  4. Return success

- **Edge Cases**:
  - Title is empty → Return error
  - Title exceeds 150 characters → Return error
  - Author is empty → Return error
  - Author exceeds 100 characters → Return error
  - ISBN is invalid format → Return error
  - ISBN already exists → Return error
  - Invalid UUID format → Return error

### 2. Get Book by ID
- **Primary Flow**:
  1. Receive book ID
  2. Find book
  3. Return book data

- **Edge Cases**:
  - Book not found → Return 404
  - Invalid UUID format → Return error

### 3. List Books
- **Primary Flow**:
  1. Receive optional pagination params
  2. Return books list
  3. Sort by creation date (newest first)

- **Edge Cases**:
  - Negative page number → Return error
  - Zero or negative limit → Return error
  - Page exceeds available data → Return empty list

### 4. Update Book
- **Primary Flow**:
  1. Receive book ID and updated data
  2. Validate all inputs
  3. Update book
  4. Return success

- **Edge Cases**:
  - Book not found → Return 404
  - Invalid UUID format → Return error
  - Title is empty → Return error
  - Title exceeds 150 characters → Return error
  - Author is empty → Return error
  - Author exceeds 100 characters → Return error
  - ISBN is invalid format → Return error
  - New ISBN already exists → Return error

## Test Scenarios

### Unit Tests
1. Book Domain Model:
   - Creating valid book
   - Creating book with invalid title
   - Creating book with invalid author
   - Creating book with invalid ISBN
   - Updating book properties
   - Converting to primitives

2. Value Objects:
   - BookTitle validation
   - BookAuthor validation
   - BookIsbn validation
   - BookId format validation

### Integration Tests
1. PostgresBookRepository:
   - Saving new book
   - Finding book by ID
   - Listing books with pagination
   - Updating existing book
   - Handling non-existent books
   - Handling database connection errors
   - Verifying unique ISBN constraint

### E2E Tests
1. API Endpoints:
   - POST /api/blog/books
   - GET /api/blog/books
   - GET /api/blog/books/:id
   - PUT /api/blog/books/:id

## Validation Rules

1. Book Title:
   - Required
   - Min length: 1 character
   - Max length: 150 characters
   - Trimmed before validation

2. Book Author:
   - Required
   - Min length: 1 character
   - Max length: 100 characters
   - Trimmed before validation

3. ISBN:
   - Required
   - Must be a valid ISBN-10 or ISBN-13 format
   - Must be unique in the system
   - Case insensitive comparison
   - Hyphens and spaces are removed before validation

## Database Considerations

1. Indexes:
   - Primary key on id (UUID)
   - Unique index on ISBN
   - Index on creation date for sorting

2. Constraints:
   - NOT NULL on all required fields
   - UNIQUE on ISBN column
   - Check constraints on string lengths
