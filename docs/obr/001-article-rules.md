# Article Rules

## Use Cases
### 1. Create Article
- **Primary Flow**:
  1. Receive UUID v4, title, content, excerpt, book IDs, and optional related links
  2. Validate UUID v4 format and uniqueness
  3. Generate slug from title
  4. Validate all inputs
  5. Create new article
  6. Return 201 without response body

- **Edge Cases**:
  - Title is empty → Return error
  - Title exceeds 150 characters → Return error
  - Content is empty → Return error
  - Content exceeds 10000 characters → Return error
  - Excerpt is empty → Return error
  - Excerpt exceeds 160 characters → Return error
  - Invalid UUID format (not v4) → Return 400 error
  - Duplicate UUID → Return 409 error
  - Missing UUID → Return 400 error
  - Related link text empty → Return error
  - Related link text exceeds 100 characters → Return error
  - Related link URL invalid → Return error
  - Related link URL exceeds 2000 characters → Return error
  - Related links exceed maximum (10) → Return error
  - Duplicate URLs in related links → Return error
  - Generated slug exceeds 100 characters → Return error with suggestion to shorten title
  - Non-existent book ID referenced → Return 400 error

### 2. Get Article by ID
- **Primary Flow**:
  1. Receive article ID (UUID v4)
  2. Find article
  3. Return article with complete book information, related links, and slug

- **Edge Cases**:
  - Article not found → Return 404
  - Invalid UUID format (not v4) → Return 400 error
  - Referenced books no longer exist → Return partial data with warning

### 3. List Articles
- **Primary Flow**:
  1. Receive optional pagination params (page, limit)
  2. Return articles with complete book information (including excerpts, related links, and slugs)
  3. Sort by creation date (newest first)

- **Edge Cases**:
  - Negative page number → Return error
  - Zero or negative limit → Return error
  - Limit exceeds 100 → Return 400 error
  - Page exceeds available data → Return empty list
  - Referenced books no longer exist → Return partial data with warning

### 4. Update Article
- **Primary Flow**:
  1. Receive article ID (UUID v4) and updated data
  2. If title changes, generate new slug
  3. Validate all inputs
  4. Update article
  5. Return 204 without response body

- **Edge Cases**:
  - Article not found → Return 404
  - Invalid UUID format (not v4) → Return 400 error
  - Title is empty → Return error
  - Title exceeds 150 characters → Return error
  - Content is empty → Return error
  - Content exceeds 10000 characters → Return error
  - Excerpt is empty → Return error
  - Excerpt exceeds 160 characters → Return error
  - Non-existent book ID referenced → Return 400 error
  - Related link text empty → Return error
  - Related link text exceeds 100 characters → Return error
  - Related link URL invalid → Return error
  - Related link URL exceeds 2000 characters → Return error
  - Related links exceed maximum (10) → Return error
  - Duplicate URLs in related links → Return error
  - Generated slug exceeds 100 characters → Return error with suggestion to shorten title

## Test Scenarios

### Unit Tests
1. Article Domain Model:
   - Creating valid article
   - Creating article with invalid UUID v4
   - Creating article with invalid title
   - Creating article with invalid content
   - Creating article with invalid excerpt
   - Creating article with invalid book IDs
   - Creating article with invalid related links
   - Verifying slug generation
   - Updating article properties
   - Converting to primitives

2. Value Objects:
   - ArticleTitle validation
   - ArticleContent validation
   - ArticleExcerpt validation
   - ArticleBookIds validation
   - ArticleId UUID v4 format validation
   - ArticleRelatedLink validation
   - ArticleRelatedLinks collection validation
   - ArticleSlug validation and generation

### Integration Tests
1. PostgresArticleRepository:
   - Saving new article with related links
   - Finding article by ID with book data and related links
   - Listing articles with pagination
   - Updating existing article and related links
   - Handling non-existent articles
   - Handling database connection errors
   - Verifying book data joins
   - Verifying excerpt is saved and retrieved correctly
   - Verifying related links are saved and retrieved correctly
   - Verifying slug is saved and retrieved correctly

### E2E Tests
1. API Endpoints:
   - POST /api/blog/articles → Verify 201 without body
   - GET /api/blog/articles → Verify list with pagination
   - GET /api/blog/articles/:id → Verify complete article data
   - PUT /api/blog/articles/:id → Verify 204 without body
   - Verify article accessible via slug URL
   - Verify UUID v4 validation
   - Verify related links validation
   - Verify book references validation

## Validation Rules

1. Article ID:
   - Required
   - Must be valid UUID v4 format
   - Must be unique
   - Must use lowercase hexadecimal

2. Article Title:
   - Required
   - Min length: 1 character
   - Max length: 150 characters
   - Trimmed before validation

3. Article Content:
   - Required
   - Min length: 1 character
   - Max length: 10000 characters
   - Trimmed before validation

4. Article Excerpt:
   - Required
   - Min length: 1 character
   - Max length: 160 characters
   - Plain text only (no HTML)
   - Trimmed before validation
   - No special formatting characters allowed

5. Book References:
   - Optional (empty array allowed)
   - All referenced books must exist
   - No duplicate books allowed
   - Books must be retrieved and included in article responses
   - Each book ID must be valid UUID v4

6. Related Links:
   - Optional
   - Maximum 10 links
   - No duplicate URLs allowed
   - Link text:
     - Required when link provided
     - Min length: 1 character
     - Max length: 100 characters
     - Trimmed before validation
   - Link URL:
     - Required when link provided
     - Must be valid URL format
     - Max length: 2000 characters
     - Trimmed before validation

7. Slug:
   - Auto-generated from title
   - Required
   - Min length: 1 character
   - Max length: 100 characters
   - Only lowercase letters, numbers, and hyphens
   - No consecutive hyphens
   - No leading/trailing hyphens
   - Must be unique for active articles
