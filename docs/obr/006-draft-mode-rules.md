# OBR-006: Draft Mode Business Rules

**Status:** Defined  
**Date:** 2024-12-19  
**Context:** Task 15 - Draft mode functionality for articles

## Business Rules

### BR-001: Article Status States
- Articles can have exactly two states: DRAFT or PUBLISHED
- New articles are created in DRAFT status by default
- Status is a required field and cannot be null or empty

### BR-002: Status Transition Rules
- DRAFT → PUBLISHED: **ALLOWED** - Articles can be published
- PUBLISHED → DRAFT: **FORBIDDEN** - Published articles cannot be reverted
- DRAFT → DRAFT: **ALLOWED** - Articles can be saved multiple times in draft
- PUBLISHED → PUBLISHED: **ALLOWED** - Published articles can be updated

### BR-003: Visibility Rules
- Blog public endpoints only show PUBLISHED articles
- Backoffice endpoints show both DRAFT and PUBLISHED articles
- DRAFT articles are completely hidden from public consumption

### BR-004: Content Modification Rules
- DRAFT articles can be modified unlimited times
- PUBLISHED articles can be modified but remain PUBLISHED
- Publishing requires all mandatory fields to be valid

## Use Cases

### UC-001: Create New Article
**Primary Flow:**
1. User creates new article
2. Article is created with DRAFT status
3. Article can be saved multiple times
4. User can publish when ready

**Business Rules Applied:** BR-001, BR-002

### UC-002: Save Draft Article
**Primary Flow:**
1. User modifies article in DRAFT status
2. System validates content
3. Article is saved with DRAFT status maintained
4. User can continue editing

**Business Rules Applied:** BR-002, BR-004

### UC-003: Publish Article
**Primary Flow:**
1. User requests to publish DRAFT article
2. System validates all required fields
3. Article status changes to PUBLISHED
4. Article becomes visible in blog endpoints

**Alternative Flow:**
1. Validation fails
2. Article remains in DRAFT
3. User must fix validation errors

**Business Rules Applied:** BR-002, BR-003, BR-004

### UC-004: Update Published Article
**Primary Flow:**
1. User modifies PUBLISHED article
2. System validates content
3. Article is saved maintaining PUBLISHED status
4. Changes are immediately visible in blog

**Business Rules Applied:** BR-002, BR-004

### UC-005: Attempt to Unpublish Article
**Primary Flow:**
1. User attempts to change PUBLISHED article to DRAFT
2. System rejects the operation
3. Error is returned to user
4. Article remains PUBLISHED

**Business Rules Applied:** BR-002

## Edge Cases

### EC-001: Publishing Invalid Article
**Scenario:** User tries to publish article with missing required fields
**Expected:** Publishing fails, article remains DRAFT, validation errors returned

### EC-002: Concurrent Status Changes
**Scenario:** Two users try to modify same article simultaneously
**Expected:** Last write wins, optimistic locking may be considered

### EC-003: Blog Endpoint with Draft Filter
**Scenario:** Public blog endpoint called when only draft articles exist
**Expected:** Empty result set returned, no drafts leaked

### EC-004: Direct Database Status Manipulation
**Scenario:** Status changed directly in database bypassing application
**Expected:** Application should handle gracefully, validation on read

### EC-005: Migration of Existing Articles
**Scenario:** Existing articles need status assignment during migration
**Expected:** All existing articles set to PUBLISHED to maintain current behavior

## Test Scenarios

### TS-001: Status Validation Tests
```typescript
describe('ArticleStatus', () => {
  it('should create valid DRAFT status')
  it('should create valid PUBLISHED status')
  it('should reject invalid status values')
  it('should enforce status immutability')
})
```

### TS-002: Transition Rules Tests
```typescript
describe('Article Status Transitions', () => {
  it('should allow DRAFT to PUBLISHED transition')
  it('should forbid PUBLISHED to DRAFT transition')
  it('should allow DRAFT to DRAFT (save)')
  it('should allow PUBLISHED to PUBLISHED (update)')
  it('should throw error on invalid transition')
})
```

### TS-003: Repository Filtering Tests
```typescript
describe('Article Repository Filtering', () => {
  it('should return only published articles for blog context')
  it('should return all articles for backoffice context')
  it('should handle empty result sets gracefully')
  it('should apply status filter with other criteria')
})
```

### TS-004: API Endpoint Tests
```typescript
describe('API Status Handling', () => {
  it('should create article in DRAFT by default')
  it('should publish article with explicit action')
  it('should reject invalid status transitions')
  it('should filter blog results by published status')
  it('should include status in API responses')
})
```

### TS-005: Integration Tests
```typescript
describe('End-to-End Status Workflow', () => {
  it('should complete full draft-to-publish workflow')
  it('should handle multiple draft saves')
  it('should prevent unpublishing published articles')
  it('should maintain blog visibility rules')
})
```

### TS-006: Migration Tests
```typescript
describe('Database Migration', () => {
  it('should add status column with default DRAFT')
  it('should migrate existing articles to PUBLISHED')
  it('should maintain data integrity during migration')
  it('should add proper database constraints')
})
```

## Validation Rules

### VR-001: Status Field Validation
- Status must be one of: 'DRAFT', 'PUBLISHED'
- Status is required and cannot be empty
- Status changes must follow transition rules

### VR-002: Publishing Prerequisites
- Article must have valid title (non-empty, max length)
- Article must have valid content (non-empty)
- Article must have valid excerpt (non-empty)
- All related book IDs must exist in system

### VR-003: API Request Validation
- Status field in requests must be valid enum value
- Transition requests must respect business rules
- Invalid transitions return 400 Bad Request

## Error Handling

### EH-001: Invalid Status Transition
- Error Code: `INVALID_STATUS_TRANSITION`
- HTTP Status: 400 Bad Request
- Message: "Cannot change status from PUBLISHED to DRAFT"

### EH-002: Invalid Status Value
- Error Code: `INVALID_STATUS_VALUE`
- HTTP Status: 400 Bad Request
- Message: "Status must be either DRAFT or PUBLISHED"

### EH-003: Publishing Validation Failed
- Error Code: `PUBLISHING_VALIDATION_FAILED`
- HTTP Status: 400 Bad Request
- Message: "Article cannot be published: [validation details]"

## Performance Considerations

### PC-001: Database Indexing
- Add index on status column for efficient filtering
- Consider composite indexes for status + created_at queries

### PC-002: Caching Strategy
- Blog endpoints can cache published articles longer
- Draft articles should not be cached
- Status changes should invalidate relevant caches

## Security Considerations

### SC-001: Authorization
- Only authenticated users can manage article status
- Role-based access may be needed for publishing rights
- Draft articles must not leak through any public endpoint

### SC-002: Input Validation
- All status inputs must be sanitized
- Prevent SQL injection in status queries
- Validate status transitions server-side 