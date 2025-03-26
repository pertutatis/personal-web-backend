# Article Rules

## Use Cases

### 1. Create Article
- **Primary Flow**:
  1. Receive title, content, excerpt, book IDs, and optional related links
  2. Generate slug from title
  3. Validate all inputs
  4. Create new article
  5. Return success

- **Edge Cases**:
  - Title is empty → Return error
  - Title exceeds 150 characters → Return error
  - Content is empty → Return error
  - Content exceeds 10000 characters → Return error
  - Excerpt is empty → Return error
  - Excerpt exceeds 300 characters → Return error
  - Book IDs array is empty → Return error
  - Any book ID doesn't exist → Return error
  - Invalid UUID format → Return error
  - Related link text empty → Return error
  - Related link text exceeds 100 characters → Return error
  - Related link URL invalid → Return error
  - Related link URL exceeds 2000 characters → Return error
  - Related links exceed maximum (10) → Return error
  - Duplicate URLs in related links → Return error
  - Generated slug exceeds 100 characters → Return error with suggestion to shorten title

### 2. Get Article by ID
- **Primary Flow**:
  1. Receive article ID
  2. Find article
  3. Return article with complete book information, related links, and slug

- **Edge Cases**:
  - Article not found → Return 404
  - Invalid UUID format → Return error
  - Referenced books no longer exist → Return partial data with warning

### 3. List Articles
- **Primary Flow**:
  1. Receive optional pagination params
  2. Return articles with complete book information (including excerpts, related links, and slugs)
  3. Sort by creation date (newest first)

- **Edge Cases**:
  - Negative page number → Return error
  - Zero or negative limit → Return error
  - Page exceeds available data → Return empty list
  - Referenced books no longer exist → Return partial data with warning

### 4. Update Article
- **Primary Flow**:
  1. Receive article ID and updated data
  2. If title changes, generate new slug
  3. Validate all inputs
  4. Update article
  5. Return success

- **Edge Cases**:
  - Article not found → Return 404
  - Invalid UUID format → Return error
  - Title is empty → Return error
  - Title exceeds 150 characters → Return error
  - Content is empty → Return error
  - Content exceeds 10000 characters → Return error
  - Excerpt is empty → Return error
  - Excerpt exceeds 300 characters → Return error
  - Book IDs array is empty → Return error
  - Any book ID doesn't exist → Return error
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
   - ArticleId format validation
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
   - POST /api/blog/articles (with related links)
   - GET /api/blog/articles (verify related links and slug in list)
   - GET /api/blog/articles/:id (verify related links and slug in detail)
   - PUT /api/blog/articles/:id (update related links)
   - Verify article accessible via slug URL

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

3. Article Excerpt:
   - Required
   - Min length: 1 character
   - Max length: 300 characters
   - Plain text only (no HTML)
   - Trimmed before validation
   - No special formatting characters allowed

4. Book References:
   - At least one book required
   - All referenced books must exist
   - No duplicate books allowed
   - Books must be retrieved and included in article responses

5. Related Links:
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

6. Slug:
   - Auto-generated from title
   - Required
   - Min length: 1 character
   - Max length: 100 characters
   - Only lowercase letters, numbers, and hyphens
   - No consecutive hyphens
   - No leading/trailing hyphens
   - Must be unique for active articles
