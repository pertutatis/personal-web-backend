# ADR-017: Draft Mode for Articles

**Status:** Accepted  
**Date:** 2024-12-19  
**Context:** Add draft mode functionality

## Context

We need to implement a draft mode functionality for articles that allows content creators to save work-in-progress articles before publishing them to the public blog. This will improve the content creation workflow and prevent accidental publication of incomplete articles.

## Decision

### Article Status States

We will implement two distinct states for articles:

1. **DRAFT** - Article is work-in-progress, not visible to public
2. **PUBLISHED** - Article is finalized and visible to public

### State Transitions

The following state transitions are allowed:

- **DRAFT → PUBLISHED**: Articles can be published when ready
- **PUBLISHED → DRAFT**: **NOT ALLOWED** - Once published, articles cannot be reverted to draft

This unidirectional flow ensures content integrity and prevents accidental unpublishing.

### Status Persistence Rules

1. **Multiple Draft Saves**: Articles in DRAFT status can be saved multiple times
2. **Default Status**: New articles default to DRAFT status
3. **Explicit Publishing**: Transition to PUBLISHED requires explicit action

### Visibility Rules

1. **Blog Context**: Only PUBLISHED articles are visible in public blog endpoints
2. **Backoffice Context**: Both DRAFT and PUBLISHED articles are visible for management
3. **Status Filtering**: Blog repositories automatically filter by PUBLISHED status

### Implementation Approach

#### Domain Layer
- Create `ArticleStatus` value object with enum values (DRAFT, PUBLISHED)
- Add `status` property to `Article` aggregate root
- Implement business rules for status transitions
- Add domain events for status changes

#### Infrastructure Layer
- Add `status` column to articles table with default 'DRAFT'
- Update repository implementations to handle status filtering
- Maintain backward compatibility during migration

#### Application Layer
- Update use cases to handle status transitions
- Add validation for invalid transitions (PUBLISHED → DRAFT)
- Ensure blog services only return published articles

#### API Layer
- Update backoffice endpoints to support status management
- Maintain blog endpoint behavior (only published)
- Add status field to API responses and requests

## Consequences

### Positive
- Improved content creation workflow
- Prevention of accidental publication
- Clear separation between work-in-progress and published content
- Backward compatibility maintained

### Negative
- Additional complexity in domain model
- Database migration required
- Additional validation logic needed

### Risks
- Breaking changes if not properly implemented
- Data consistency during migration
- API backward compatibility concerns

## Implementation Notes

1. **Database Migration Strategy**:
   - Add status column with default 'DRAFT'
   - Existing articles will be set to 'PUBLISHED' to maintain current behavior
   - Add database constraints to ensure valid status values

2. **Testing Strategy**:
   - Comprehensive unit tests for status transitions
   - Integration tests for repository filtering
   - E2E tests for complete workflow scenarios

3. **API Compatibility**:
   - Blog endpoints maintain existing behavior
   - Backoffice endpoints extended with status support
   - OpenAPI documentation updated

## References

- [OBR-006: Draft Mode Business Rules](../obr/006-draft-mode-rules.md)
- [Memory Bank: Progress](../memory-bank/progress.md)
- [API Documentation: Article Endpoints](../api/examples.md) 
