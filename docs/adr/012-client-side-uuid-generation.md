# ADR 012: Client-Side UUID Generation

## Status
Proposed

## Context
Currently, the system generates UUIDs for new entities on the server side. This approach requires sending the created entity back to the client after creation to inform them of the assigned ID. This creates an additional roundtrip of data and couples the client to the server's ID generation strategy.

## Decision
We will move the responsibility of UUID generation to the client side. Clients will generate and provide UUIDs when creating new entities. This change will:

1. Allow clients to know the entity's ID before making the creation request
2. Eliminate the need to return the entire entity after creation
3. Enable better offline-first capabilities in the future
4. Reduce server response payload size

### Implementation Details
1. The client will generate a UUID v4 for new entities before sending the creation request
2. The server will validate the provided UUID format but trust its uniqueness
3. Creation endpoints will return a 201 status code without a response body
4. Update endpoints will also avoid returning the updated entity

### Validation Rules
- UUIDs must be valid v4 format
- UUIDs must not be empty or null
- Duplicate UUIDs will be rejected with a 409 Conflict status

## Consequences

### Positive
- Reduced server response payload size
- Simpler client-side state management (ID known upfront)
- Potential for offline-first features
- Reduced server load (no ID generation)
- Cleaner REST API design (201 responses without body)

### Negative
- Slight increase in client-side complexity
- Need to ensure client UUID generation is reliable
- Potential for UUID collisions (though extremely unlikely with UUID v4)
- Need to update existing client implementations

### Risks
1. Poor client implementations might generate invalid or duplicate UUIDs
2. Some clients might not have access to reliable UUID generation libraries

## Implementation Plan
1. Start with the Book module as a pilot
2. Update API documentation to reflect new requirements
3. Add server-side UUID validation
4. Update tests to include UUID validation cases
5. Update client documentation and examples

## Notes
- This change aligns with Domain-Driven Design principles by making entities identifiable from creation
- The probability of UUID v4 collisions is negligible (2^122 unique values)
- This pattern is commonly used in distributed systems and offline-first applications
