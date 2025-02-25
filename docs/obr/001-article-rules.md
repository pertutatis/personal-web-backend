# Article Rules

## Use Cases

### 1. Create Article
- **Primary Flow**:
  1. Receive title, content, and book IDs
  2. Validate all inputs
  3. Create new article
  4. Return success

- **Edge Cases**:
  - Title is empty → Return error
  - Title exceeds 150 characters → Return error
  - Content is empty → Return error
  - Content exceeds 10000 characters → Return error
  - Book IDs array is empty → Return error
  - Any book ID doesn't exist → Return error
  - Invalid UUID format → Return error

### 2. Get Article by ID
- **Primary Flow**:
  1. Receive article ID
  2. Find article
  3. Return article with complete book information

- **Edge Cases**:
  - Article not found → Return 404
  - Invalid UUID format → Return error
  - Referenced books no longer exist → Return partial data with warning

### 3. List Articles
- **Primary Flow**:
  1. Receive optional pagination params
  2. Return articles with complete book information
  3. Sort by creation date (newest first)

- **Edge Cases**:
  - Negative page number → Return error
  - Zero or negative limit → Return error
  - Page exceeds available data → Return empty list
  - Referenced books no longer exist → Return partial data with warning

### 4. Update Article
- **Primary Flow**:
  1. Receive article ID and updated data
  2. Validate all inputs
  3. Update article
  4. Return success

- **Edge Cases**:
  - Article not found → Return 404
  - Invalid UUID format → Return error
  - Title is empty → Return error
  - Title exceeds 150 characters → Return error
  - Content is empty → Return error
  - Content exceeds 10000 characters → Return error
  - Book IDs array is empty → Return error
  - Any book ID doesn't exist → Return error

## Test Scenarios

### Unit Tests
1. Article Domain Model:
   - Creating valid article
   - Creating article with invalid title
   - Creating article with invalid content
   - Creating article with invalid book IDs
   - Updating article properties
   - Converting to primitives

2. Value Objects:
   - ArticleTitle validation
   - ArticleContent validation
   - ArticleBookIds validation
   - ArticleId format validation

### Integration Tests
1. PostgresArticleRepository:
   - Saving new article
   - Finding article by ID with book data
   - Listing articles with pagination
   - Updating existing article
   - Handling non-existent articles
   - Handling database connection errors
   - Verifying book data joins

### E2E Tests
1. API Endpoints:
   - POST /api/blog/articles
   - GET /api/blog/articles
   - GET /api/blog/articles/:id
   - PUT /api/blog/articles/:id

## Validation Rules

1. Article Title:
   - Required
   - Min length: 1 character
   - Max length: 150 characters
   - Trimmed before validation

2. Article Content:
   - Required
   - Min length: 1 character
   - Max length: 10000 characters
   - Trimmed before validation

3. Book References:
   - At least one book required
   - All referenced books must exist
   - No duplicate books allowed
   - Books must be retrieved and included in article responses
