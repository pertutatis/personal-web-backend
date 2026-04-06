# Architecture Review — Full Codebase

**Date:** 2026-04-05
**Scope:** Full codebase (backend + minimal frontend)

## Score: 7.5/10 (B+)

A well-structured DDD + Hexagonal Architecture backend for a personal blog. Strong domain modeling and clear layer separation, with pragmatic trade-offs for Next.js. The codebase punches above its weight for a personal project — the patterns are real, not cosmetic.

---

## Scorecard

| Dimension                             | Grade | Notes                                                                                                                                                                             |
| ------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------ | --- | ----------------- |
| **Layering & Separation**             | A-    | Clean 3-layer split per bounded context (domain → application → infrastructure). Each context is self-contained. Minor bleed: route handlers instantiate infra directly.          |
| **Dependency Direction**              | B+    | Dependencies flow inward. Domain layer has zero infra imports. Interfaces define contracts. However, routes bypass DI container and wire dependencies manually.                   |
| **Domain Modeling**                   | A     | Strong use of aggregates (Article, Book, User, Series), value objects with constructor validation, domain events, and state machines (ArticleStatus). Not anemic.                 |
| **Pattern Usage**                     | A-    | Hexagonal + DDD applied consistently across all contexts. Repository pattern, aggregate root, domain events, object mothers for tests. Patterns are real, not decorative.         |
| **Error Handling**                    | B+    | Hierarchical DomainError tree mapped to HTTP codes via `executeWithErrorHandling`. Consistent across all routes. Missing: error codes aren't standardized as an enum.             |
| **Type Safety**                       | B     | Generally good TypeScript usage. Weak spots: `Collection.toPrimitives()` uses `any`, some `as unknown as` casts in tests, raw SQL queries lack type safety.                       |
| **Code Duplication**                  | B     | Similar value objects across contexts (ArticleTitle, BookTitle, SeriesTitle) — acceptable for DDD bounded context isolation. Route-level validation logic is somewhat repetitive. |
| **Testing**                           | B+    | Good layered strategy: unit (domain/app with mocks), integration (real DB), E2E (Playwright). Object Mother pattern. Missing: no route-level tests, no contract tests.            |
| **Security**                          | B     | JWT auth, bcrypt password hashing, CORS whitelist, input validation at route + domain layers. Concerns: `JWT_SECRET` defaults to `'secret'`, logging is disabled (blind in prod). |
| **API Design**                        | B+    | RESTful conventions, consistent response format, pagination via Collection, Swagger/OpenAPI docs. Body parsing has a quirky `rawBody.data                                         |     | rawBody.body |     | rawBody` pattern. |
| **State Management** (frontend)       | N/A   | Single Swagger UI page with basic useState — not applicable.                                                                                                                      |
| **Component Architecture** (frontend) | N/A   | Backend-only project. The 3 TSX files serve API docs only.                                                                                                                        |

---

## Patterns Detected

**Present:**

- Hexagonal Architecture / Ports & Adapters
- Domain-Driven Design (Aggregates, Value Objects, Domain Events, Repositories)
- Layered Architecture (domain → application → infrastructure)
- Repository Pattern
- Adapter Pattern (PostgresArticleRepository, JwtTokenGenerator)
- Dependency Injection (TypeDI, token-based)
- Object Mother (test data factories)
- State Machine (ArticleStatus: DRAFT → PUBLISHED)
- Collection/Pagination Pattern

**Absent:**

- CQRS (reads and writes use same models)
- Event Sourcing (events are recorded but not persisted/replayed)
- Cache-Aside / Read-Through
- Specification Pattern (validation is procedural)
- Observer/Pub-Sub (EventBus exists but is in-memory no-op)
- Saga Pattern (no cross-aggregate transactions)

---

## Top Issues

### 1. Service Locator in API Routes

**Severity:** P2 (tech debt)
**Files:** `src/app/api/backoffice/articles/route.ts`, all route files
**Problem:** Routes manually instantiate repositories and use cases instead of resolving from the DI container. The TypeDI containers defined in `infrastructure/DependencyInjection/container.ts` are only partially used (auth context uses them, article/book/series don't).
**Risk:** Inconsistent wiring, harder to test routes in isolation, easy to forget a dependency when adding new use cases.

### 2. Logging Completely Disabled

**Severity:** P1 (operational risk)
**Files:** `src/contexts/shared/infrastructure/Logger.ts`
**Problem:** All Logger methods have their console calls commented out. The system is effectively silent in production.
**Risk:** Zero observability. If something breaks in production (Supabase connection issues, auth failures), there's no way to diagnose without re-deploying with logging enabled.

### 3. JWT Secret Defaults to `'secret'`

**Severity:** P1 (security risk)
**Files:** Auth DI container, `JwtTokenGenerator` constructor
**Problem:** `process.env.JWT_SECRET || 'secret'` means if the env var is missing, the app silently runs with a trivially guessable secret.
**Risk:** Token forgery. Anyone can mint valid JWT tokens if the env var isn't set.

### 4. No Transaction Support

**Severity:** P2 (architecture gap)
**Files:** All repository implementations
**Problem:** No transaction boundaries around multi-step operations. For example, article creation validates book references and saves in separate queries with no rollback mechanism.
**Risk:** Partial writes on failure. Data inconsistency if the process crashes between validation and save.

### 5. Domain Events Are Recorded but Never Published

**Severity:** P2 (architecture gap)
**Files:** `AggregateRoot`, `InMemoryEventBus`
**Problem:** Aggregates record domain events (ArticleCreatedDomainEvent, etc.), but no use case or infrastructure code publishes them. The EventBus exists but isn't wired into the save flow.
**Risk:** The event infrastructure is dead code. If you add subscribers expecting events, they'll never fire.

### 6. Quirky Request Body Parsing

**Severity:** P2 (bug risk)
**Files:** Route handlers (POST/PUT)
**Problem:** `const data = rawBody && (rawBody.data || rawBody.body || rawBody) || {}` — this triple-fallback suggests uncertainty about the request format. It could silently accept malformed payloads.
**Risk:** Clients sending `{ data: { title: "..." } }` and `{ title: "..." }` are both accepted, leading to inconsistent API contracts.

### 7. `Collection.toPrimitives()` Uses `any`

**Severity:** P3 (type safety)
**Files:** `src/contexts/shared/domain/Collection.ts`
**Problem:** `this.items.map((item: any) => item.toPrimitives?.() ?? item)` bypasses TypeScript's type system.
**Risk:** If an item doesn't have `toPrimitives()`, it silently passes through raw. Could leak internal objects to API responses.

### 8. Hardcoded Validation Constants

**Severity:** P3 (tech debt)
**Files:** Route handlers, value objects
**Problem:** Magic numbers scattered across routes: `excerpt.length > 300`, `content.length > 20000`, `relatedLinks.length > 10`, `text.length > 100`.
**Risk:** Values drift between route validation and domain validation. Single source of truth is missing.

### 9. No Rate Limiting or Request Throttling

**Severity:** P2 (security risk)
**Files:** `src/middleware.ts`
**Problem:** No rate limiting on auth endpoints (login, register) or any other route.
**Risk:** Brute-force attacks on login, credential stuffing, API abuse.

### 10. PostgreSQL Connection Pool Hardcoded to 2

**Severity:** P3 (operational)
**Files:** `PostgresConnection.ts`
**Problem:** Production pool max is hardcoded to 2 (`poolConfig['max'] = 2`), likely for Supabase free tier limits.
**Risk:** Under any meaningful load, requests will queue waiting for connections. Fine for personal blog scale, but should be configurable.

---

## Improvement Roadmap

| #   | Change                                                                                     | Effort | Priority | Impact                        |
| --- | ------------------------------------------------------------------------------------------ | ------ | -------- | ----------------------------- |
| 1   | Fail fast if `JWT_SECRET` env var is missing (throw on startup, don't default)             | S      | P1       | Eliminates token forgery risk |
| 2   | Enable structured logging (replace no-op Logger with pino/winston, use log levels)         | S      | P1       | Production observability      |
| 3   | Add rate limiting middleware on auth endpoints (e.g., `next-rate-limit` or custom)         | S      | P2       | Prevents brute-force attacks  |
| 4   | Standardize request body contract — pick one shape and validate it                         | S      | P2       | Consistent API behavior       |
| 5   | Wire domain events into repository save flow (publish after successful save)               | M      | P2       | Activates event architecture  |
| 6   | Add transaction support to PostgresConnection (begin/commit/rollback)                      | M      | P2       | Data consistency guarantees   |
| 7   | Unify DI approach — use container consistently across all contexts, not just auth          | M      | P2       | Consistent dependency wiring  |
| 8   | Extract validation constants to shared config per aggregate                                | S      | P3       | Single source of truth        |
| 9   | Add generic constraint to Collection (`Collection<T extends { toPrimitives(): unknown }>`) | S      | P3       | Type safety                   |
| 10  | Make connection pool size configurable via env var                                         | S      | P3       | Production flexibility        |

---

## Summary

This is a **genuinely well-architected** backend for its scale. The DDD patterns (aggregates, value objects, domain events, repository interfaces) are applied correctly and consistently — not just for show. The hexagonal layering is clean, with the domain layer truly independent of infrastructure. The bounded context split between backoffice and blog is a good design choice.

**Immediate priorities:** Fix the JWT secret default (P1 security) and enable logging (P1 operations). These are quick wins with outsized impact. After that, wiring up domain events and adding transaction support would complete the architecture's promise — the foundations are already in place, they just need to be connected.
